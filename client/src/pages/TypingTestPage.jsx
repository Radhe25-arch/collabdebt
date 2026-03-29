import { useState, useEffect, useRef } from 'react';
import Icons from '@/assets/icons';

// ─── CODE SNIPPETS ──────────────────────────────────────────
const SNIPPETS = [
  { lang: 'JavaScript', text: 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}' },
  { lang: 'JavaScript', text: 'const sum = arr.reduce((acc, val) => acc + val, 0);\nconst avg = sum / arr.length;\nconsole.log("Average:", avg);' },
  { lang: 'Python', text: 'def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n    return -1' },
  { lang: 'JavaScript', text: 'async function fetchData(url) {\n  try {\n    const res = await fetch(url);\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error(err);\n  }\n}' },
  { lang: 'Python', text: 'class Stack:\n    def __init__(self):\n        self.items = []\n    def push(self, item):\n        self.items.append(item)\n    def pop(self):\n        return self.items.pop()' },
  { lang: 'JavaScript', text: 'const debounce = (fn, delay) => {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n};' },
  { lang: 'SQL', text: 'SELECT users.name, COUNT(orders.id)\nFROM users\nLEFT JOIN orders\nON users.id = orders.user_id\nGROUP BY users.name\nORDER BY COUNT(orders.id) DESC;' },
  { lang: 'JavaScript', text: 'class EventEmitter {\n  constructor() { this.events = {}; }\n  on(event, fn) {\n    if (!this.events[event]) this.events[event] = [];\n    this.events[event].push(fn);\n  }\n  emit(event, ...args) {\n    (this.events[event] || []).forEach(fn => fn(...args));\n  }\n}' },
  { lang: 'Python', text: 'def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + quicksort(right)' },
  { lang: 'JavaScript', text: 'const merge = (a, b) => {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < a.length && j < b.length) {\n    result.push(a[i] < b[j] ? a[i++] : b[j++]);\n  }\n  return [...result, ...a.slice(i), ...b.slice(j)];\n};' },
];

const TIMER_OPTIONS = [30, 60, 120];

// ─── TYPING ENGINE ──────────────────────────────────────────
function TypingEngine({ snippet, mode, duration, onComplete }) {
  const [started, setStarted]   = useState(false);
  const [finished, setFinished] = useState(false);
  const [typed, setTyped]       = useState('');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [startTime, setStart]   = useState(null);
  const [errors, setErrors]     = useState(0);
  const [totalTyped, setTotal]  = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const target = snippet.text;

  useEffect(() => {
    if (!started || finished || gameOver || mode !== 'timer') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(p => { if (p <= 1) { clearInterval(timerRef.current); setFinished(true); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, finished, gameOver, mode]);

  const handleInput = (e) => {
    if (finished || gameOver) return;
    const val = e.target.value;
    if (!started) { setStarted(true); setStart(Date.now()); }
    setTotal(p => p + 1);
    if (val[val.length - 1] !== target[val.length - 1]) {
      setErrors(p => p + 1);
      if (mode === 'single-mistake') { setGameOver(true); clearInterval(timerRef.current); return; }
    }
    setTyped(val);
    if (val === target) { setFinished(true); clearInterval(timerRef.current); }
  };

  const elapsed = startTime ? ((finished || gameOver ? Date.now() : Date.now()) - startTime) / 1000 : 0;
  const words = typed.trim().split(/\s+/).filter(Boolean).length;
  const wpm = elapsed > 0 ? Math.round((words / elapsed) * 60) : 0;
  const cpm = elapsed > 0 ? Math.round((typed.length / elapsed) * 60) : 0;
  const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;

  useEffect(() => {
    if ((finished || gameOver) && onComplete) onComplete({ wpm, cpm, accuracy, errors, totalChars: typed.length, time: elapsed });
  }, [finished, gameOver]);

  // Focus on click
  const focus = () => { if (!finished && !gameOver) inputRef.current?.focus(); };

  return (
    <div className="space-y-4">
      {/* Live Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div>
            <span className="text-3xl font-light text-slate-900 tabular-nums">{wpm}</span>
            <span className="text-xs text-slate-400 ml-1">wpm</span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div>
            <span className="text-lg font-light text-slate-600 tabular-nums">{accuracy}%</span>
            <span className="text-xs text-slate-400 ml-1">acc</span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div>
            <span className={`text-lg font-light tabular-nums ${errors > 0 ? 'text-red-500' : 'text-slate-600'}`}>{errors}</span>
            <span className="text-xs text-slate-400 ml-1">err</span>
          </div>
        </div>
        {mode === 'timer' && (
          <span className={`text-2xl font-light tabular-nums ${timeLeft <= 10 ? 'text-red-500' : 'text-slate-400'}`}>
            {timeLeft}s
          </span>
        )}
        {mode === 'single-mistake' && gameOver && (
          <span className="text-sm font-medium text-red-500">Game Over</span>
        )}
      </div>

      {/* Typing Area */}
      <div onClick={focus}
        className="relative bg-white rounded-xl border border-slate-200 p-6 cursor-text min-h-[180px] hover:border-slate-300 transition-colors">
        {!started && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl z-10">
            <p className="text-sm text-slate-400">Click here and start typing...</p>
          </div>
        )}
        <pre className="font-mono text-sm leading-[1.8] whitespace-pre-wrap select-none"
          style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Consolas, monospace" }}>
          {target.split('').map((char, i) => {
            let cls = 'text-slate-300';
            if (i < typed.length) cls = typed[i] === char ? 'text-slate-900' : 'text-red-500 bg-red-50';
            else if (i === typed.length) cls = 'text-slate-900 border-l-2 border-blue-500';
            return <span key={i} className={cls}>{char === '\n' ? '↵\n' : char}</span>;
          })}
        </pre>
        <textarea ref={inputRef} value={typed} onChange={handleInput}
          disabled={finished || gameOver} autoFocus
          className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none"
          spellCheck={false} />
      </div>

      {/* Progress */}
      <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-200 ${
          gameOver ? 'bg-red-400' : finished ? 'bg-green-500' : 'bg-blue-500'
        }`} style={{ width: `${Math.min((typed.length / target.length) * 100, 100)}%` }} />
      </div>
    </div>
  );
}

// ─── RESULTS ────────────────────────────────────────────────
function Results({ results, onReset }) {
  if (!results) return null;
  const label = results.wpm >= 60 ? 'Speed Demon' : results.wpm >= 40 ? 'Fast Typist' : results.wpm >= 20 ? 'Solid Effort' : 'Keep Practicing';

  return (
    <div className="max-w-sm mx-auto text-center space-y-6 py-6">
      <div>
        <p className="text-5xl font-light text-slate-900">{results.wpm}</p>
        <p className="text-sm text-slate-400 mt-1">words per minute</p>
      </div>
      <p className="text-sm font-medium text-blue-600">{label}</p>
      <div className="grid grid-cols-4 gap-3">
        {[
          { l: 'CPM', v: results.cpm },
          { l: 'Accuracy', v: `${results.accuracy}%` },
          { l: 'Errors', v: results.errors },
          { l: 'Time', v: `${results.time.toFixed(1)}s` },
        ].map(s => (
          <div key={s.l} className="py-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="text-lg font-light text-slate-800">{s.v}</div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">{s.l}</div>
          </div>
        ))}
      </div>
      <button onClick={onReset}
        className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
        Try Again
      </button>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────
export default function TypingTestPage() {
  const [mode, setMode]         = useState('timer');
  const [duration, setDuration] = useState(60);
  const [snippet, setSnippet]   = useState(null);
  const [results, setResults]   = useState(null);
  const [bestWPM, setBest]      = useState(() => {
    try { return parseInt(localStorage.getItem('typing-best-wpm') || '0'); } catch { return 0; }
  });

  const pick = () => { setSnippet(SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]); setResults(null); };
  useEffect(() => { pick(); }, []);

  const handleComplete = (r) => {
    setResults(r);
    if (r.wpm > bestWPM) { setBest(r.wpm); try { localStorage.setItem('typing-best-wpm', String(r.wpm)); } catch {} }
  };

  return (
    <div className="max-w-2xl mx-auto pb-12">
      {/* Header — minimal Google-like */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Speed Test</h1>
          <p className="text-xs text-slate-400 mt-0.5">Type real code snippets as fast as you can</p>
        </div>
        {bestWPM > 0 && (
          <div className="text-right">
            <p className="text-2xl font-light text-blue-600 tabular-nums">{bestWPM}</p>
            <p className="text-[10px] text-slate-400 font-mono uppercase">best wpm</p>
          </div>
        )}
      </div>

      {/* Mode Tabs — pill style */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit mb-5">
        {[
          { id: 'timer',          label: 'Timer' },
          { id: 'single-mistake', label: 'Zero Error' },
          { id: '1v1',            label: '1v1' },
        ].map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); pick(); }}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              mode === m.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>{m.label}</button>
        ))}
      </div>

      {/* Duration pills for timer mode */}
      {mode === 'timer' && !results && (
        <div className="flex items-center gap-2 mb-5">
          {TIMER_OPTIONS.map(t => (
            <button key={t} onClick={() => { setDuration(t); pick(); }}
              className={`px-3 py-1 rounded-md text-xs transition-all ${
                duration === t ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}>{t}s</button>
          ))}
        </div>
      )}

      {/* Content */}
      {mode === '1v1' ? (
        <div className="text-center py-16 space-y-3">
          <Icons.Users size={32} className="text-slate-300 mx-auto" />
          <p className="font-semibold text-lg text-slate-900">1v1 Typing Race</p>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">Challenge friends to a real-time typing battle. Coming soon.</p>
        </div>
      ) : results ? (
        <Results results={results} onReset={pick} />
      ) : snippet ? (
        <TypingEngine key={snippet.text + mode + duration} snippet={snippet} mode={mode} duration={duration} onComplete={handleComplete} />
      ) : null}

      {/* Footer info */}
      {mode !== '1v1' && !results && (
        <div className="mt-8 flex items-center justify-center gap-6 text-[11px] text-slate-400">
          <span>⏱ Timer — race the clock</span>
          <span>💀 Zero Error — one mistake ends it</span>
          <span>⚔️ 1v1 — coming soon</span>
        </div>
      )}
    </div>
  );
}
