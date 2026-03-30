import { useState, useEffect, useRef, useMemo } from 'react';
import Icons from '@/assets/icons';
import { motion, AnimatePresence } from 'framer-motion';

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
  { lang: 'Go', text: 'func main() {\n\tresp, err := http.Get("https://api.github.com")\n\tif err != nil {\n\t\tlog.Fatal(err)\n\t}\n\tdefer resp.Body.Close()\n}' },
  { lang: 'Rust', text: 'fn main() {\n    let s1 = String::from("hello");\n    let len = calculate_length(&s1);\n    println!("The length of \'{}\' is {}.", s1, len);\n}\nfn calculate_length(s: &String) -> usize {\n    s.len()\n}' },
  { lang: 'TypeScript', text: 'interface User {\n  id: number;\n  name: string;\n  email?: string;\n}\nfunction greet(user: User) {\n  return `Hello, ${user.name}!`;\n}' },
  { lang: 'C++', text: 'int main() {\n    std::vector<int> v = {1, 2, 3, 4, 5};\n    for (int x : v) {\n        std::cout << x << " ";\n    }\n    return 0;\n}' },
  { lang: 'Java', text: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
  { lang: 'PHP', text: '<?php\nfunction factorial($n) {\n    if ($n <= 1) return 1;\n    return $n * factorial($n - 1);\n}\necho factorial(5);\n?>' },
  { lang: 'Ruby', text: 'def hello_world\n  puts "Hello, World!"\nend\nhello_world' },
  { lang: 'Swift', text: 'struct Point {\n    var x = 0.0, y = 0.0\n}\nlet origin = Point()\nprint("Origin is at \\(origin.x), \\(origin.y)")' },
  { lang: 'Kotlin', text: 'fun main() {\n    val items = listOf("apple", "banana", "kiwifruit")\n    for (item in items) {\n        println(item)\n    }\n}' },
  { lang: 'C#', text: 'using System;\npublic class Program {\n    public static void Main() {\n        Console.WriteLine("Hello World");\n    }\n}' },
  { lang: 'React', text: 'function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n}' },
  { lang: 'CSS', text: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}' },
  { lang: 'HTML', text: '<div class="card">\n  <img src="avatar.png" alt="Avatar">\n  <h2>John Doe</h2>\n  <p>Software Engineer</p>\n</div>' },
  { lang: 'JSON', text: '{\n  "name": "SkillForge",\n  "version": "1.0.0",\n  "description": "Gamified coding platform",\n  "author": "Antigravity"\n}' },
  { lang: 'Bash', text: '#!/bin/bash\nfor i in {1..5}\ndo\n   echo "Welcome $i times"\ndone' },
  { lang: 'Docker', text: 'FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nCMD ["npm", "start"]' },
  { lang: 'Markdown', text: '# Introduction\nSkillForge is a **gamified** coding platform designed for *rapid* skill development.' },
  { lang: 'YAML', text: 'services:\n  web:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - NODE_ENV=production' },
  { lang: 'Rust', text: 'match result {\n    Ok(val) => println!("Success: {}", val),\n    Err(e) => eprintln!("Error: {}", e),\n}' },
  { lang: 'Go', text: 'type Rectangle struct {\n    Width, Height float64\n}\nfunc (r Rectangle) Area() float64 {\n    return r.Width * r.Height\n}' },
  { lang: 'TypeScript', text: 'type Partial<T> = {\n    [P in keyof T]?: T[P];\n};\nconst user: Partial<User> = { name: "Alice" };' },
  { lang: 'JavaScript', text: 'const observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => console.log(entry.isIntersecting));\n});' },
  { lang: 'Python', text: 'import matplotlib.pyplot as plt\nplt.plot([1, 2, 3, 4])\nplt.ylabel(\'some numbers\')\nplt.show()' },
];

const TIMER_OPTIONS = [30, 60, 120];

// ─── TYPING ENGINE ──────────────────────────────────────────
function TypingEngine({ snippet, mode, duration, onComplete, onNext }) {
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
    
    // Calculate errors
    if (val.length > typed.length) {
      setTotal(p => p + 1);
      if (val[val.length - 1] !== target[val.length - 1]) {
        setErrors(p => p + 1);
        if (mode === 'single-mistake') { setGameOver(true); clearInterval(timerRef.current); return; }
      }
    }
    setTyped(val);

    if (val === target) {
      if (mode === 'endless') {
        const elapsed = (Date.now() - startTime) / 1000;
        const words = typed.trim().split(/\s+/).filter(Boolean).length;
        const wpm = Math.round((words / elapsed) * 60);
        const accuracy = Math.round(((totalTyped + 1 - (errors + (val[val.length-1] !== target[val.length-1] ? 1 : 0))) / (totalTyped + 1)) * 100);
        onNext({ wpm, accuracy, errors, time: elapsed });
        setTyped('');
        setStarted(false);
        setStart(null);
        setErrors(0);
        setTotal(0);
      } else {
        setFinished(true);
        clearInterval(timerRef.current);
      }
    }
  };

  const elapsed = startTime ? ((finished || gameOver ? Date.now() : Date.now()) - startTime) / 1000 : 0;
  const words = typed.trim().split(/\s+/).filter(Boolean).length;
  const wpm = elapsed > 0 ? Math.round((words / elapsed) * 60) : 0;
  const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;

  useEffect(() => {
    if ((finished || gameOver) && onComplete) onComplete({ wpm, accuracy, errors, totalChars: typed.length, time: elapsed });
  }, [finished, gameOver]);

  const focus = () => { if (!finished && !gameOver) inputRef.current?.focus(); };

  return (
    <div className="space-y-8">
      {/* Premium Stats Bar */}
      <div className="flex items-center gap-12 font-mono">
        <div className="group">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">WPM</p>
          <p className="text-4xl font-bold text-slate-800 tabular-nums">{wpm}</p>
        </div>
        <div className="w-px h-10 bg-slate-100" />
        <div className="group">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 group-hover:text-green-500 transition-colors">Accuracy</p>
          <p className="text-4xl font-bold text-slate-800 tabular-nums">{accuracy}<span className="text-xl text-slate-300 ml-0.5">%</span></p>
        </div>
        <div className="w-px h-10 bg-slate-100" />
        {mode === 'timer' ? (
          <div className="group">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 group-hover:text-red-500 transition-colors">Time</p>
            <p className={`text-4xl font-bold tabular-nums ${timeLeft <= 5 ? 'text-red-500' : 'text-slate-800'}`}>{timeLeft}<span className="text-xl text-slate-300 ml-0.5">s</span></p>
          </div>
        ) : (
          <div className="group">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">Mode</p>
            <p className="text-xl font-bold text-slate-800 uppercase tracking-tighter mt-2">{mode.replace('-', ' ')}</p>
          </div>
        )}
      </div>

      {/* Modern Minimal Typing Area */}
      <div onClick={focus} className="relative group cursor-text">
        <div className="absolute -inset-4 bg-gradient-to-b from-slate-50/50 to-white border border-slate-100 rounded-3xl -z-10 group-hover:shadow-xl group-hover:shadow-slate-100/50 transition-all duration-500" />
        
        <AnimatePresence mode="wait">
          {!started && !finished && !gameOver && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            >
              <p className="text-slate-300 font-mono text-sm tracking-tight flex items-center gap-2">
                <Icons.Keyboard size={16} className="animate-bounce" />
                Start typing to begin...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-2 min-h-[220px]">
          <pre className="font-mono text-lg leading-[1.8] whitespace-pre-wrap select-none transition-all duration-300"
            style={{ fontFamily: "'JetBrains Mono', 'SF Mono', Consolas, monospace" }}>
            {target.split('').map((char, i) => {
              let cls = 'text-slate-200 transition-colors duration-150';
              if (i < typed.length) {
                cls = typed[i] === char ? 'text-slate-800' : 'text-red-500 bg-red-50 rounded-sm';
              } else if (i === typed.length) {
                cls = 'text-slate-800 border-l-2 border-blue-500 bg-blue-50/30';
              }
              return <span key={i} className={cls}>{char === '\n' ? '↵\n' : char}</span>;
            })}
          </pre>
        </div>

        <textarea 
          ref={inputRef} value={typed} onChange={handleInput}
          disabled={finished || gameOver} autoFocus
          className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none"
          spellCheck={false} 
        />
      </div>

      {/* Progress Line */}
      <div className="pt-4">
        <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full rounded-full ${gameOver ? 'bg-red-400' : 'bg-blue-600'}`}
            initial={{ width: 0 }}
            animate={{ width: `${(typed.length / target.length) * 100}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 px-1">
           <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{snippet.lang} - Snippet Progress</span>
           <span className="text-[10px] font-mono text-slate-400">{Math.round((typed.length / target.length) * 100)}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── RESULTS ────────────────────────────────────────────────
function Results({ results, onReset }) {
  if (!results) return null;
  const grade = results.wpm >= 80 ? 'Grandmaster' : results.wpm >= 60 ? 'Pro' : results.wpm >= 40 ? 'Expert' : 'Novice';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto text-center space-y-8 py-10"
    >
      <div className="relative inline-block">
        <p className="text-[13px] font-bold text-blue-600 uppercase tracking-[0.3em] mb-2">{grade}</p>
        <p className="text-7xl font-light text-slate-900 tracking-tighter tabular-nums">{results.wpm}</p>
        <p className="text-xs text-slate-400 font-mono mt-1">Average WPM</p>
      </div>

      <div className="grid grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        {[
          { l: 'Accuracy', v: `${results.accuracy}%`, c: 'text-green-600' },
          { l: 'Errors', v: results.errors, c: 'text-red-500' },
          { l: 'Time', v: `${results.time.toFixed(1)}s`, c: 'text-slate-700' },
          { l: 'Total Keys', v: results.totalChars, c: 'text-slate-700' },
        ].map(s => (
          <div key={s.l} className="bg-white py-5 group transition-colors hover:bg-slate-50/50">
            <p className={`text-xl font-bold font-mono ${s.c}`}>{s.v}</p>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-1 group-hover:text-slate-600 transition-colors">{s.l}</p>
          </div>
        ))}
      </div>

      <button onClick={onReset}
        className="group relative w-full py-4 rounded-2xl bg-slate-900 text-white font-semibold transition-all hover:bg-slate-800 active:scale-[0.98] overflow-hidden shadow-lg shadow-slate-200">
        <span className="relative z-10 flex items-center justify-center gap-2">
          <Icons.RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          Start New Attempt
        </span>
      </button>
    </motion.div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────
export default function TypingTestPage() {
  const [mode, setMode]         = useState('timer');
  const [duration, setDuration] = useState(60);
  const [snippet, setSnippet]   = useState(null);
  const [results, setResults]   = useState(null);
  const [sessionHistory, setHistory] = useState([]);
  const [bestWPM, setBest]      = useState(() => {
    try { return parseInt(localStorage.getItem('typing-best-wpm') || '0'); } catch { return 0; }
  });

  const seenSnippets = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('typing-seen-ids') || '[]'); } catch { return []; }
  }, []);

  const pick = () => { 
    // Filter out seen unless all are seen
    let pool = SNIPPETS.filter((_, i) => !seenSnippets.includes(i));
    if (pool.length === 0) {
      pool = SNIPPETS;
      localStorage.setItem('typing-seen-ids', '[]');
    }
    const idx = Math.floor(Math.random() * pool.length);
    const originalIdx = SNIPPETS.indexOf(pool[idx]);
    
    setSnippet(pool[idx]); 
    setResults(null); 
    setHistory([]);

    // Update seen
    const newSeen = [...seenSnippets, originalIdx].slice(-20); // Keep last 20
    localStorage.setItem('typing-seen-ids', JSON.stringify(newSeen));
  };

  useEffect(() => { pick(); }, []);

  const handleComplete = (r) => {
    if (mode === 'endless') return;
    setResults(r);
    if (r.wpm > bestWPM) { 
      setBest(r.wpm); 
      try { localStorage.setItem('typing-best-wpm', String(r.wpm)); } catch {} 
    }
  };

  const handleNext = (r) => {
    setHistory(prev => [...prev, r]);
    // Pick next snippet
    let pool = SNIPPETS.filter((s) => s.text !== snippet.text);
    setSnippet(pool[Math.floor(Math.random() * pool.length)]);
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 pt-8">
      {/* Header — ultra-minimal */}
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            Speed Test
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">LEGACY</span>
          </h1>
          <p className="text-sm text-slate-400 font-medium">Professional grade coding rhythm & precision training.</p>
        </div>
        {bestWPM > 0 && (
          <div className="bg-white border border-slate-100 p-2 px-4 rounded-2xl shadow-sm">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-0.5">Hall of Fame</p>
            <p className="text-xl font-bold text-blue-600 tabular-nums">
              {bestWPM} <span className="text-[10px] text-slate-300 ml-0.5 font-medium uppercase font-mono tracking-tight">WPM</span>
            </p>
          </div>
        )}
      </div>

      {/* Config Bar */}
      <div className="flex flex-wrap items-center gap-6 mb-12 py-3 border-y border-slate-100 px-1">
        <div className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-100 rounded-2xl">
          {[
            { id: 'timer',          label: 'Timer', icon: Icons.Clock },
            { id: 'single-mistake', label: 'Zero Error', icon: Icons.Target },
            { id: 'endless',        label: 'Endless', icon: Icons.Infinity },
          ].map(m => (
            <button key={m.id} onClick={() => { setMode(m.id); pick(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                mode === m.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
              }`}>
              <m.icon size={13} />
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'timer' && !results && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-100 rounded-2xl">
            {TIMER_OPTIONS.map(t => (
              <button key={t} onClick={() => { setDuration(t); pick(); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  duration === t ? 'bg-blue-600 text-white shadow-sm shadow-blue-100' : 'text-slate-400 hover:text-slate-600'
                }`}>{t}s</button>
            ))}
          </div>
        )}

        <div className="flex-1" />

        <button onClick={pick} className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-all active:scale-95" title="New Snippet">
          <Icons.RefreshCw size={16} />
        </button>
      </div>

      {/* Content Area */}
      <div className="relative min-h-[300px]">
        {results ? (
          <Results results={results} onReset={pick} />
        ) : snippet ? (
          <TypingEngine 
            key={snippet.text + mode + duration} 
            snippet={snippet} 
            mode={mode} 
            duration={duration} 
            onComplete={handleComplete}
            onNext={handleNext}
          />
        ) : null}
      </div>

      {/* Tooltips/Info Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { t: 'Focus Mode',  d: 'Click the typing area to automatically lock focus.', i: Icons.Target },
          { t: 'Punctuation', d: 'Code snippets include characters which increase difficulty.', i: Icons.Code },
          { t: 'Reset Anytime',d: 'Press the refresh icon to swap snippets if you get stuck.', i: Icons.RefreshCw },
        ].map(item => (
          <div key={item.t} className="flex gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400 border border-slate-100"><item.i size={14} /></div>
            <div>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">{item.t}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{item.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
