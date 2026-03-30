const axios = require('axios');
const { authenticate } = require('../middleware/auth');
const AppError = require('../utils/AppError');

// Piston language mapping
const LANGUAGE_MAP = {
  javascript: { name: 'node' },
  python:     { name: 'python' },
  java:       { name: 'java' },
  cpp:        { name: 'c++' },
  c:          { name: 'c' },
  csharp:     { name: 'csharp' },
  go:         { name: 'go' },
  rust:       { name: 'rust' },
  ruby:       { name: 'ruby' },
  php:        { name: 'php' },
  typescript: { name: 'typescript' },
  bash:       { name: 'bash' },
  sql:        { name: 'sqlite3' },
  kotlin:     { name: 'kotlin' },
  swift:      { name: 'swift' },
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

    // Free execution via Piston API (No API Key Required)
    const submitRes = await axios.post(
      PISTON_URL,
      {
        language: langConfig.name,
        version: "*", // Use latest available on Piston server
        files: [
          {
            name: `main`,
            content: code
          }
        ],
        stdin: stdin,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      }
    );

    const result = submitRes.data.run || {};
    const stdout = result.stdout || '';
    const stderr = result.stderr || '';
    const output = result.output || '';
    
    // Status can be determined by the existence of stderr or non-zero signal/code
    const hasError = result.code !== 0 || stderr.length > 0;

    res.json({
      output: output || '// No output',
      error: stderr || null,
      status: hasError ? 'Failed' : 'Success',
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
      id: LANGUAGE_MAP[name].name,
    })),
  });
}

module.exports = { executeCode, getSupportedLanguages };
