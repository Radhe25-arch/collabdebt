const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');
const axios = require('axios');

// Groq API Configuration
const GROQ_KEYS = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
  process.env.GROQ_API_KEY_4,
  process.env.GROQ_API_KEY_5,
].filter(Boolean);

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const DAILY_LIMIT = 100;

const SYSTEM_PROMPT = `You are SkillForge's Lead System Architect — a world-class engineer with deep expertise in distributed systems, clean architecture, and product engineering.

Your objective is to mentor developers by:
- Engineering high-level solutions for complex problems.
- Conducting rigorous, professional-grade code reviews.
- Explaining core CS concepts (DSA, OS, Networking) with architectural context.
- Guiding users through 'Senior Engineer' decision-making processes.

Operational Directives:
- Always prioritize scalability, maintainability, and security.
- Use precise technical terminology (e.g., 'idempotency', 'race conditions', 'separation of concerns').
- Provide 'Senior Tips' — non-obvious insights from years of experience.
- Maintain a professional, encouraging, and authoritative tone.
- Format all technical assets (code, diagrams, sequences) using clear markdown blocks.`;

// Utility to check and reset daily quota
async function checkQuota(user) {
  const now = new Date();
  
  // Calculate the most recent 12:00 UTC reset time
  const lastReset = new Date(now);
  lastReset.setUTCHours(12, 0, 0, 0);
  if (now < lastReset) {
    lastReset.setUTCDate(lastReset.getUTCDate() - 1);
  }

  // If user hasn't requested since the last reset, reset their count
  if (!user.lastMentorRequestAt || new Date(user.lastMentorRequestAt) < lastReset) {
    return { count: 0, shouldUpdate: true };
  }

  return { count: user.mentorRequests, shouldUpdate: false };
}

async function getSession(req, res, next) {
  try {
    const sessions = await prisma.mentorSession.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      select: { id: true, topic: true, updatedAt: true, messages: true },
    });
    res.json({ sessions });
  } catch (err) { next(err); }
}

async function createSession(req, res, next) {
  try {
    const { topic } = req.body;
    const session = await prisma.mentorSession.create({
      data: {
        userId: req.user.id,
        topic: topic || 'General',
        messages: [],
      },
    });
    res.status(201).json({ session });
  } catch (err) { next(err); }
}

async function sendMessage(req, res, next) {
  try {
    const { sessionId, message, code } = req.body;
    if (!message?.trim()) throw new AppError('Message required', 400);

    // 0. Check if AI is configured
    if (GROQ_KEYS.length === 0) {
      throw new AppError('AI Mentor is not configured. Please add GROQ_API_KEY environment variables.', 503);
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) throw new AppError('User not found', 404);

    // 1. Quota Check
    const { count, shouldUpdate } = await checkQuota(user);
    if (count >= DAILY_LIMIT) {
      return res.status(429).json({ 
        error: 'DAILY_LIMIT_REACHED',
        message: 'You have reached your daily limit of 100 mentor requests. Your quota will refill at 12:00 UTC.' 
      });
    }

    // 2. Load session
    const session = await prisma.mentorSession.findUnique({
      where: { id: sessionId },
    });
    if (!session || session.userId !== req.user.id) {
      throw new AppError('Session not found', 404);
    }

    const messages = Array.isArray(session.messages) ? session.messages : [];

    // 3. Build user message
    const userContent = code ? `${message}\n\n\`\`\`\n${code}\n\`\`\`` : message;
    const history = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    // 4. Groq API Call with Rotation
    let aiResponse = null;
    let lastError = null;

    for (let i = 0; i < GROQ_KEYS.length; i++) {
      try {
        const response = await axios.post(GROQ_ENDPOINT, {
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...history,
            { role: "user", content: userContent }
          ],
          temperature: 0.7,
          max_tokens: 2048,
        }, {
          headers: {
            'Authorization': `Bearer ${GROQ_KEYS[i]}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000,
        });

        aiResponse = response.data.choices[0].message.content;
        break; // Success!
      } catch (err) {
        lastError = err;
        if (err.response?.status === 429) {
          console.warn(`Groq Key ${i + 1} rate limited, rotating...`);
          continue; // Try next key
        }
        // Don't throw immediately for network errors, try next key
        console.warn(`Groq Key ${i + 1} failed:`, err.message);
        continue;
      }
    }

    if (!aiResponse) {
      const errMsg = lastError?.response?.data?.error?.message || lastError?.message || 'All AI keys exhausted';
      console.error('All Groq keys failed:', errMsg);
      throw new AppError('AI Mentor is temporarily unavailable. Please try again shortly.', 503);
    }

    // 5. Update session & User Quota
    const newMessages = [
      ...messages,
      { role: 'user', content: userContent, timestamp: new Date().toISOString() },
      { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() },
    ];

    await prisma.$transaction([
      prisma.mentorSession.update({
        where: { id: sessionId },
        data: {
          messages: newMessages,
          topic: session.topic === 'General' ? extractTopic(message) : session.topic,
        },
      }),
      prisma.user.update({
        where: { id: req.user.id },
        data: {
          mentorRequests: shouldUpdate ? 1 : count + 1,
          lastMentorRequestAt: new Date(),
        },
      })
    ]);

    res.json({ response: aiResponse, sessionId });
  } catch (err) { 
    console.error('AI Mentor Error:', err.response?.data || err.message);
    // Preserve AppError status codes instead of always returning 500
    if (err instanceof AppError) return next(err);
    next(new AppError(err.message || 'AI Mentor is temporarily unavailable', 503)); 
  }
}

async function deleteSession(req, res, next) {
  try {
    await prisma.mentorSession.deleteMany({
      where: { id: req.params.id, userId: req.user.id },
    });
    res.json({ message: 'Session deleted' });
  } catch (err) { next(err); }
}

function extractTopic(message) {
  const keywords = ['javascript', 'python', 'react', 'node', 'css', 'html', 'sql', 'dsa', 'algorithm', 'recursion', 'async', 'promise', 'closure', 'array', 'object'];
  for (const kw of keywords) {
    if (message.toLowerCase().includes(kw)) return kw.charAt(0).toUpperCase() + kw.slice(1);
  }
  return 'General';
}

module.exports = { getSession, createSession, sendMessage, deleteSession };
