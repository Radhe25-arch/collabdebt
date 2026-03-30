const axios = require('axios');
const { authenticate } = require('../middleware/auth');
const AppError = require('../utils/AppError');

// Piston v2 execution mapping
const LANGUAGE_MAP = {
  javascript: { language: 'js', version: '*' },
  python:     { language: 'python', version: '*' },
  java:       { language: 'java', version: '*' },
  cpp:        { language: 'cpp', version: '*' },
  c:          { language: 'c', version: '*' },
  csharp:     { language: 'csharp', version: '*' },
  go:         { language: 'go', version: '*' },
  rust:       { language: 'rust', version: '*' },
  ruby:       { language: 'ruby', version: '*' },
  php:        { language: 'php', version: '*' },
  typescript: { language: 'typescript', version: '*' },
  bash:       { language: 'bash', version: '*' },
  sql:        { language: 'sqlite3', version: '*' },
  swift:      { language: 'swift', version: '*' },
};

const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

async function executeCode(req, res, next) {
  try {
    const { code, language = 'javascript', stdin = '' } = req.body;

    if (!code?.trim()) {
      throw new AppError('Code is required', 400);
    }

    const langConfig = LANGUAGE_MAP[language.toLowerCase()];
    if (!langConfig) throw new AppError(`Unsupported language: ${language}`, 400);

    // Free execution via Piston API
    const submitRes = await axios.post(
      PISTON_URL,
      {
        language: langConfig.language,
        version: langConfig.version,
        files: [{ content: code }],
        stdin: stdin,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      }
    );

    const result = submitRes.data || {};
    const stdout = result.run?.stdout || '';
    const stderr = result.run?.stderr || '';
    
    const output = stdout + stderr;
    const statusStr = result.run?.code === 0 ? 'Success' : 'Failed';

    res.json({
      output: output || '// No output returned',
      error: stderr || null,
      status: statusStr,
      time: 'Unknown',
      memory: 'Unknown',
      engine: 'Piston (Free)'
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    const msg = err.response?.data?.message || err.message;
    console.error('Piston API Error Details:', msg);
    next(new AppError(`Code execution failed: ${msg}`, 500));
  }
}

function getSupportedLanguages(req, res) {
  res.json({
    languages: Object.keys(LANGUAGE_MAP).map(name => ({
      name,
      id: LANGUAGE_MAP[name].language,
    })),
  });
}

module.exports = { executeCode, getSupportedLanguages };
