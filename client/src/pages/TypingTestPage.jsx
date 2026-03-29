import { useState, useEffect, useRef, useCallback } from 'react';
import Icons from '@/assets/icons';
import { BadgeTag } from '@/components/ui';

// ─── CODE SNIPPETS ──────────────────────────────────────────
const SNIPPETS = [
  { lang: 'JavaScript', text: 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}' },
  { lang: 'JavaScript', text: 'const sum = arr.reduce((acc, val) => acc + val, 0);\nconst avg = sum / arr.length;\nconsole.log("Average:", avg);' },
  { lang: 'Python', text: 'def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n    return -1' },
  { lang: 'JavaScript', text: 'async function fetchData(url) {\n  try {\n    const res = await fetch(url);\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error(err);\n  }\n}' },
  { lang: 'Python', text: 'class Stack:\n    def __init__(self):\n        self.items = []\n    def push(self, item):\n        self.items.append(item)\n    def pop(self):\n        return self.items.pop()' },
  { lang: 'JavaScript', text: 'const debounce = (fn, delay) => {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n};' },
  { lang: 'SQL', text: 'SELECT users.name, COUNT(orders.id) AS total_orders\nFROM users\nLEFT JOIN orders ON users.id = orders.user_id\nGROUP BY users.name\nORDER BY total_orders DESC;' },
  { lang: 'JavaScript', text: 'const merge = (a, b) => {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < a.length && j < b.length) {\n    result.push(a[i] < b[j] ? a[i++] : b[j++]);\n  }\n  return [...result, ...a.slice(i), ...b.slice(j)];\n};' },
  { lang: 'Python', text: 'def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)' },
  { lang: 'JavaScript', text: 'class EventEmitter {\n  constructor() { this.events = {}; }\n  on(event, fn) {\n    if (!this.events[event]) this.events[event] = [];\n    this.events[event].push(fn);\n  }\n  emit(event, ...args) {\n    (this.events[event] || []).forEach(fn => fn(...args));\n  }\n}' },
];

const TIMER_OPTIONS = [30, 60, 120];
const MODES = ['timer', 'single-mistake', '1v1'];

// ─── TYPING ENGINE COMPONENT ────────────────────────────────
function TypingArena({ snippet, mode, duration, onComplete }) {
  const [started, setStarted]       = useState(false);
  const [finished, setFinished]     = useState(false);
  const [typed, setTyped]           = useState('');
  const [timeLeft, setTimeLeft]     = useState(duration);
  const [startTime, setStartTime]   = useState(null);
  const [errors, setErrors]         = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [gameOver, setGameOver]     = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const target = snippet.text;

  useEffect(() => {
    if (!started || finished || gameOver) return;
    if (mode !== 'timer') return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [started, finished, gameOver, mode]);

  const handleStart = () => {
    setStarted(true);
    setStartTime(Date.now());
    setTimeLeft(duration);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleInput = (e) => {
    if (finished || gameOver) return;
    const val = e.target.value;

    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }

    setTotalTyped(prev => prev + 1);

    // Check for errors
    const lastChar = val[val.length - 1];
    const expectedChar = target[val.length - 1];

    if (lastChar !== expectedChar) {
      setErrors(prev => prev + 1);
      if (mode === 'single-mistake') {
        setGameOver(true);
        clearInterval(timerRef.current);
        return;
      }
    }

    setTyped(val);

    // Check completion
    if (val === target) {
      setFinished(true);
      clearInterval(timerRef.current);
    }
  };

  const elapsedSecs = startTime ? (finished || gameOver ? (Date.now() - startTime) / 1000 : (duration - timeLeft)) : 0;
  const words = typed.trim().split(/\s+/).filter(Boolean).length;
  const wpm = elapsedSecs > 0 ? Math.round((words / elapsedSecs) * 60) : 0;
  const cpm = elapsedSecs > 0 ? Math.round((typed.length / elapsedSecs) * 60) : 0;
  const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;

  useEffect(() => {
    if ((finished || gameOver) && onComplete) {
      onComplete({ wpm, cpm, accuracy, errors, totalChars: typed.length, time: elapsedSecs });
    }
  }, [finished, gameOver]);

  // Render target text with typed highlights
  const renderTarget = () => {
    return target.split('').map((char, i) => {
      let className = 'text-slate-400';
      if (i < typed.length) {
        className = typed[i] === char ? 'text-slate-900 bg-green-100' : 'text-red-500 bg-red-100';
      } else if (i === typed.length) {
        className = 'text-slate-900 border-l-2 border-blue-600 animate-pulse';
      }
      return (
        <span key={i} className={className}>
          {char === '\n' ? '↵\n' : char}
        </span>
      );
    });
  };

  if (!started && mode !== 'single-mistake') {
    return (
      <div className="arena-card p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-600/20 flex items-center justify-center mx-auto">
          <Icons.Play size={24} className="text-blue-600" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg">Ready to type?</h3>
          <p className="font-mono text-xs text-slate-500 mt-1">{snippet.lang} · {duration}s timer</p>
        </div>
        <button onClick={handleStart} className="btn-primary px-8 py-3 text-sm">
          Start Typing
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-3">
          {[
            { label: 'WPM', value: wpm, color: 'text-blue-600' },
            { label: 'CPM', value: cpm, color: 'text-indigo-600' },
            { label: 'Accuracy', value: `${accuracy}%`, color: accuracy >= 90 ? 'text-green-600' : accuracy >= 70 ? 'text-yellow-500' : 'text-red-500' },
            { label: 'Errors', value: errors, color: errors === 0 ? 'text-green-600' : 'text-red-500' },
          ].map(s => (
            <div key={s.label} className="arena-card px-3 py-2 text-center min-w-[70px]">
              <div className={`font-mono text-sm font-bold ${s.color}`}>{s.value}</div>
              <div className="font-mono text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
        {mode === 'timer' && (
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl ${
            timeLeft <= 10 ? 'bg-red-50 border border-red-200 text-red-500' : 'bg-slate-100 border border-slate-200 text-slate-600'
          }`}>
            <Icons.Clock size={14} />
            <span className="font-mono text-lg font-bold tabular-nums">{timeLeft}s</span>
          </div>
        )}
        {mode === 'single-mistake' && (
          <BadgeTag variant={gameOver ? 'red' : 'teal'}>{gameOver ? 'Game Over' : 'Perfect Mode'}</BadgeTag>
        )}
      </div>

      {/* Typing area */}
      <div className="arena-card overflow-hidden">
        <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between">
          <span className="font-mono text-xs text-slate-500">{snippet.lang}</span>
          <span className="font-mono text-xs text-slate-400">{typed.length}/{target.length} chars</span>
        </div>
        <div className="relative">
          <pre className="p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap select-none min-h-[160px]" style={{ fontFamily: "'JetBrains Mono', Consolas, monospace" }}>
            {renderTarget()}
          </pre>
          <textarea
            ref={inputRef}
            value={typed}
            onChange={handleInput}
            disabled={finished || gameOver}
            className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${gameOver ? 'bg-red-400' : finished ? 'bg-green-500' : 'bg-blue-600'}`}
          style={{ width: `${Math.min((typed.length / target.length) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}

// ─── RESULTS PANEL ──────────────────────────────────────────
function ResultsPanel({ results, onReset }) {
  if (!results) return null;

  return (
    <div className="arena-card p-6 max-w-md mx-auto text-center space-y-5">
      <div className="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-600/20 flex items-center justify-center mx-auto">
        <Icons.Trophy size={24} className="text-blue-600" />
      </div>
      <h3 className="font-display font-bold text-xl">
        {results.wpm >= 60 ? '🔥 Speed Demon!' : results.wpm >= 40 ? '⚡ Fast Typist!' : results.wpm >= 20 ? '💪 Solid Effort!' : '🌱 Keep Practicing!'}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="arena-card p-3">
          <div className="font-display font-bold text-2xl text-blue-600">{results.wpm}</div>
          <div className="font-mono text-xs text-slate-500">Words/Min</div>
        </div>
        <div className="arena-card p-3">
          <div className="font-display font-bold text-2xl text-indigo-600">{results.cpm}</div>
          <div className="font-mono text-xs text-slate-500">Chars/Min</div>
        </div>
        <div className="arena-card p-3">
          <div className={`font-display font-bold text-2xl ${results.accuracy >= 90 ? 'text-green-600' : results.accuracy >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>
            {results.accuracy}%
          </div>
          <div className="font-mono text-xs text-slate-500">Accuracy</div>
        </div>
        <div className="arena-card p-3">
          <div className="font-display font-bold text-2xl text-red-500">{results.errors}</div>
          <div className="font-mono text-xs text-slate-500">Errors</div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
        <span className="font-mono text-xs text-slate-500">Total Characters</span>
        <span className="font-mono text-sm font-bold text-slate-900">{results.totalChars}</span>
      </div>
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
        <span className="font-mono text-xs text-slate-500">Time Elapsed</span>
        <span className="font-mono text-sm font-bold text-slate-900">{results.time.toFixed(1)}s</span>
      </div>

      <button onClick={onReset} className="btn-primary w-full py-3 text-sm">
        <Icons.ArrowRight size={14} /> Try Again
      </button>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────
export default function TypingTestPage() {
  const [mode, setMode]           = useState('timer');
  const [duration, setDuration]   = useState(60);
  const [snippet, setSnippet]     = useState(null);
  const [results, setResults]     = useState(null);
  const [bestWPM, setBestWPM]     = useState(() => {
    try { return parseInt(localStorage.getItem('typing-best-wpm') || '0'); } catch { return 0; }
  });

  const pickSnippet = () => {
    const s = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
    setSnippet(s);
    setResults(null);
  };

  useEffect(() => { pickSnippet(); }, []);

  const handleComplete = (r) => {
    setResults(r);
    if (r.wpm > bestWPM) {
      setBestWPM(r.wpm);
      try { localStorage.setItem('typing-best-wpm', String(r.wpm)); } catch {}
    }
  };

  const handleReset = () => {
    pickSnippet();
    setResults(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-black text-2xl mb-1">Code Typing Speed Test</h1>
          <p className="font-mono text-xs text-slate-500">// Test your typing speed with real code snippets</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="arena-card px-3 py-2 flex items-center gap-2">
            <Icons.Trophy size={14} className="text-yellow-400" />
            <div>
              <div className="font-mono text-xs text-slate-500">Best WPM</div>
              <div className="font-display font-bold text-lg text-blue-600">{bestWPM}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode selector */}
      <div className="arena-card p-1 flex gap-1">
        {MODES.map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); handleReset(); }}
            className={`flex-1 py-2.5 rounded-lg font-mono text-xs capitalize transition-all ${
              mode === m ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {m === 'timer' ? '⏱ Timer' : m === 'single-mistake' ? '💀 Zero Error' : '⚔️ 1v1'}
          </button>
        ))}
      </div>

      {/* Timer duration selector */}
      {mode === 'timer' && !results && (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-500">Duration:</span>
          {TIMER_OPTIONS.map(t => (
            <button
              key={t}
              onClick={() => { setDuration(t); handleReset(); }}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                duration === t ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {t}s
            </button>
          ))}
        </div>
      )}

      {/* 1v1 Coming Soon */}
      {mode === '1v1' ? (
        <div className="arena-card p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/15 border border-indigo-600/20 flex items-center justify-center mx-auto">
            <Icons.Users size={28} className="text-indigo-600" />
          </div>
          <h3 className="font-display font-bold text-xl text-slate-900">1v1 Typing Battle</h3>
          <p className="font-mono text-xs text-slate-500 max-w-sm mx-auto">
            Challenge your friends to a real-time typing race. Coming soon!
          </p>
          <div className="flex items-center justify-center gap-2 text-indigo-600">
            <Icons.Zap size={14} />
            <span className="font-mono text-xs font-bold">Under Development</span>
          </div>
        </div>
      ) : results ? (
        <ResultsPanel results={results} onReset={handleReset} />
      ) : snippet ? (
        <TypingArena
          key={snippet.text + mode + duration}
          snippet={snippet}
          mode={mode}
          duration={duration}
          onComplete={handleComplete}
        />
      ) : null}

      {/* Instructions */}
      <div className="arena-card p-5">
        <h4 className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-3">How it works</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
              <Icons.Play size={13} className="text-blue-600" />
            </div>
            <div>
              <p className="font-mono text-xs text-slate-900 font-bold mb-0.5">Timer Mode</p>
              <p className="font-mono text-xs text-slate-500">Type as much code as you can before time runs out.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
              <Icons.Target size={13} className="text-red-500" />
            </div>
            <div>
              <p className="font-mono text-xs text-slate-900 font-bold mb-0.5">Zero Error Mode</p>
              <p className="font-mono text-xs text-slate-500">One mistake and the game is over. Perfect accuracy only.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
              <Icons.Users size={13} className="text-indigo-600" />
            </div>
            <div>
              <p className="font-mono text-xs text-slate-900 font-bold mb-0.5">1v1 Battle</p>
              <p className="font-mono text-xs text-slate-500">Race against a friend in real-time. Coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
