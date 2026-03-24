const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// AI Mentor — server-side proxy for code mentorship

const SYSTEM_PROMPT = `You are CodeArena's Lead System Architect — a world-class engineer with deep expertise in distributed systems, clean architecture, and product engineering.

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

    // Load session
    const session = await prisma.mentorSession.findUnique({
      where: { id: sessionId },
    });
    if (!session || session.userId !== req.user.id) {
      throw new AppError('Session not found', 404);
    }

    const messages = Array.isArray(session.messages) ? session.messages : [];

    // Build user message
    const userContent = code
      ? `${message}\n\n\`\`\`\n${code}\n\`\`\``
      : message;

    const history = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        ...history,
        { role: "user", content: userContent }
      ],
    });

    const aiResponse = response.content[0].text;

    const newMessages = [
      ...messages,
      { role: 'user', content: userContent, timestamp: new Date().toISOString() },
      { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() },
    ];

    // Update session
    await prisma.mentorSession.update({
      where: { id: sessionId },
      data: {
        messages: newMessages,
        topic: session.topic === 'General' ? extractTopic(message) : session.topic,
      },
    });

    res.json({
      response: aiResponse,
      sessionId,
    });
  } catch (err) { 
    console.error('Anthropic API Error:', err);
    next(new AppError('AI Mentor is temporarily unavailable', 500)); 
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
