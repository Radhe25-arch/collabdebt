const axios = require('axios');
const { authenticate } = require('../middleware/auth');
const AppError = require('../utils/AppError');

// Judge0 language IDs
const LANGUAGE_MAP = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  csharp: 51,
  go: 60,
  rust: 73,
  ruby: 72,
  php: 68,
  typescript: 74,
  bash: 46,
  sql: 82,
  kotlin: 78,
  swift: 83,
};

const JUDGE0_URL = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_KEY = process.env.JUDGE0_KEY;

async function executeCode(req, res, next) {
  try {
    const { code, language = 'javascript', stdin = '' } = req.body;

    if (!code?.trim()) {
      throw new AppError('Code is required', 400);
    }

    const langId = LANGUAGE_MAP[language.toLowerCase()];
    if (!langId) {
      throw new AppError(`Unsupported language: ${language}`, 400);
    }

    if (!JUDGE0_KEY) {
      // Fallback: client-side JS execution for JavaScript
      if (language.toLowerCase() === 'javascript') {
        return res.json({
          output: '// Judge0 API not configured. Use client-side execution for JS.',
          status: 'error',
          fallback: true,
        });
      }
      throw new AppError('Code execution service not configured', 503);
    }

    // Submit to Judge0
    const submitRes = await axios.post(
      `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`,
      {
        source_code: Buffer.from(code).toString('base64'),
        language_id: langId,
        stdin: Buffer.from(stdin).toString('base64'),
        cpu_time_limit: 5,
        memory_limit: 128000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': JUDGE0_KEY,
          'X-RapidAPI-Host': new URL(JUDGE0_URL).host,
        },
        timeout: 15000,
      }
    );

    const result = submitRes.data;
    const stdout = result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '';
    const stderr = result.stderr ? Buffer.from(result.stderr, 'base64').toString() : '';
    const compileErr = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : '';

    res.json({
      output: stdout || compileErr || stderr || '// No output',
      error: stderr || compileErr || null,
      status: result.status?.description || 'Unknown',
      time: result.time,
      memory: result.memory,
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    console.error('Judge0 Error:', err.response?.data || err.message);
    next(new AppError('Code execution failed. Try again.', 500));
  }
}

function getSupportedLanguages(req, res) {
  res.json({
    languages: Object.keys(LANGUAGE_MAP).map(name => ({
      name,
      id: LANGUAGE_MAP[name],
    })),
  });
}

module.exports = { executeCode, getSupportedLanguages };
