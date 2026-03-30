const axios = require('axios');
const { authenticate } = require('../middleware/auth');
const AppError = require('../utils/AppError');

// Wandbox compiler mapping
const LANGUAGE_MAP = {
  javascript: { name: 'nodejs-head' },
  python:     { name: 'cpython-head' },
  java:       { name: 'openjdk-head' },
  cpp:        { name: 'gcc-head' },
  c:          { name: 'gcc-head' },
  csharp:     { name: 'mcs-head' },
  go:         { name: 'go-head' },
  rust:       { name: 'rust-head' },
  ruby:       { name: 'ruby-head' },
  php:        { name: 'php-head' },
  typescript: { name: 'typescript-head' },
  bash:       { name: 'bash' },
  sql:        { name: 'sqlite-head' },
  swift:      { name: 'swift-head' },
};

const WANDBOX_URL = 'https://wandbox.org/api/compile.json';

async function executeCode(req, res, next) {
  try {
    const { code, language = 'javascript', stdin = '' } = req.body;

    if (!code?.trim()) {
      throw new AppError('Code is required', 400);
    }

    const langConfig = LANGUAGE_MAP[language.toLowerCase()];
    if (!langConfig) throw new AppError(`Unsupported language: ${language}`, 400);

    // Free execution via Wandbox API (No API Key Required)
    const submitRes = await axios.post(
      WANDBOX_URL,
      {
        compiler: langConfig.name,
        code: code,
        stdin: stdin,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      }
    );

    const result = submitRes.data || {};
    const stdout = result.program_message || '';
    const stderr = result.program_error || result.compiler_error || '';
    
    // Sometimes output is mixed into 'program_message' or 'compiler_message'
    const output = result.program_message || result.compiler_message || '';
    const statusStr = result.status === '0' ? 'Success' : 'Failed';

    res.json({
      output: output || stdout || stderr || '// No output returned',
      error: stderr || null,
      status: statusStr,
      time: 'Unknown',
      memory: 'Unknown',
      engine: 'Wandbox (Free)'
    });
  } catch (err) {
    if (err instanceof AppError) return next(err);
    const msg = err.response?.data?.message || err.message;
    console.error('Wandbox API Error Details:', msg);
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
