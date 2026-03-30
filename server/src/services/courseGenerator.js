const axios = require('axios');
const { prisma } = require('../config/db');

const GROQ_KEYS = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
].filter(Boolean);

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

async function generateLessonContent(lessonId, courseTitle, lessonTitle) {
  if (GROQ_KEYS.length === 0) {
    throw new Error('AI Course Generation requires GROQ_API_KEY_1');
  }

  // Pick a random key to distribute load
  const apiKey = GROQ_KEYS[Math.floor(Math.random() * GROQ_KEYS.length)];

  const systemPrompt = `You are a world-class Technical Author and Principal Engineer writing expert-level curriculum for "SkillForge".
Your task is to write a single lesson for the course "${courseTitle}".
The specific topic for this lesson is: "${lessonTitle}".

You MUST return a raw JSON object EXACTLY matching this schema (do NOT wrap it in markdown block quotes like \`\`\`json, just pure JSON output):

{
  "content": "Deep, expertly written markdown content explaining the core mechanics. Use bolding, 'code blocks', and > [!TIP] alerts.",
  "codeStarter": "A completely functional, expertly crafted code snippet demonstrating the concept (e.g. Python, JS, C++) that the user can execute and tweak. DO NOT include markdown \`\`\` around this string, just pure code.",
  "quiz": {
    "questions": [
      {
        "question": "A highly technical question testing understanding",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 1,
        "explanation": "Why this is correct theoretically."
      }
    ]
  }
}

Guidelines:
- Emphasize deep "Why" mechanics (memory, runtime, architecture), not superficial "How-to".
- Provide at least 2 distinct quiz questions.
- Output MUST be valid, parseable JSON text.
`;

  try {
    const response = await axios.post(
      GROQ_ENDPOINT,
      {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }],
        temperature: 0.4,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000 // 20 seconds
      }
    );

    const generatedText = response.data.choices[0].message.content;
    const parsedData = JSON.parse(generatedText);

    // Save to database
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        content: parsedData.content,
        codeStarter: parsedData.codeStarter,
      }
    });

    // Generate Quizzes if applicable
    if (parsedData.quiz && parsedData.quiz.questions) {
      const dbQuiz = await prisma.quiz.create({
        data: { lessonId: lessonId }
      });

      for (let i = 0; i < parsedData.quiz.questions.length; i++) {
        const q = parsedData.quiz.questions[i];
        await prisma.quizQuestion.create({
          data: {
            quizId: dbQuiz.id,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            order: i
          }
        });
      }
    }

    return true;
  } catch (error) {
    console.error('JIT Generation Error:', error.response?.data || error.message);
    throw new Error('Failed to dynamically generate lesson content.');
  }
}

module.exports = { generateLessonContent };
