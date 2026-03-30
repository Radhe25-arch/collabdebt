import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';

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

const TIMER_OPTIONS = [15, 30, 60, 120];

// ─── COMPONENTS ───────────────────────────────────────────
function StatCard({ label, value, icon: Ic, color }) {
  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-3xl flex flex-col items-center justify-center transition-all hover:scale-105 hover:bg-white/60">
      <div className={`p-2.5 rounded-xl bg-white shadow-sm border border-slate-100 mb-3 ${color}`}>
        <Ic size={18} />
      </div>
      <div className="text-2xl font-black text-slate-900 tracking-tighter">{value}</div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────
export default function TypingTestPage() {
  const navigate = useNavigate();
  const [text, setText]           = useState('');
  const [userInput, setUserInput] = useState('');
  const [mode, setMode]           = useState('time'); // time, words, endless
  const [timeLimit, setTimeLimit] = useState(30);
  const [language, setLanguage]   = useState('JavaScript');
  
  const [timeLeft, setTimeLeft]   = useState(30);
  const [isActive, setIsActive]   = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats]         = useState({ wpm: 0, accuracy: 0, raw: 0, mistakes: 0 });
  const [startTime, setStartTime] = useState(null);
  
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const fetchText = useCallback(() => {
    const randomSnippet = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
    setText(randomSnippet.text);
    setUserInput('');
    setTimeLeft(timeLimit);
    setIsActive(false);
    setIsFinished(false);
    setStartTime(null);
    setStats({ wpm: 0, accuracy: 0, raw: 0, mistakes: 0 });
  }, [timeLimit]);

  useEffect(() => { fetchText(); }, [fetchText]);

  const startTest = () => {
    setIsActive(true);
    setIsFinished(false);
    setStartTime(Date.now());
    if (mode === 'time') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(timerRef.current); setIsFinished(true); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleInput = (e) => {
    const val = e.target.value;
    if (isFinished) return;
    if (!isActive && val.length > 0) startTest();
    setUserInput(val);
    
    if (val.length >= text.length && mode !== 'time') {
      setIsFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Calculate real-time stats
  useEffect(() => {
    if (!startTime || !isActive) return;
    
    const elapsedMinutes = (Date.now() - startTime) / 60000 || 0.001;
    const correctChars = userInput.split('').filter((c, i) => c === text[i]).length;
    const words = correctChars / 5;
    
    const acc = userInput.length ? Math.round((correctChars / userInput.length) * 100) : 100;
    const wpm = Math.round(words / elapsedMinutes);
    const raw = Math.round((userInput.length / 5) / elapsedMinutes);
    
    setStats({
      wpm: wpm > 0 ? wpm : 0,
      accuracy: acc,
      raw: raw > 0 ? raw : 0,
      mistakes: userInput.length - correctChars
    });
  }, [userInput, timeLeft, isActive, startTime, text]);

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    fetchText();
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-16 animate-in fade-in duration-700">
      
      {/* Header & Configuration */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-200">
            <Icons.Terminal size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-910 tracking-tight uppercase">Speed Architect</h1>
            <p className="text-xs font-mono text-slate-400 font-bold uppercase tracking-widest">Type fast. Code faster.</p>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
           {[
             { id: 'time',    icon: Icons.Clock,  label: 'Timed' },
             { id: 'words',   icon: Icons.Award,  label: 'Words' },
             { id: 'endless', icon: Icons.Zap,    label: 'Endless' }
           ].map(m => (
             <button key={m.id} onClick={() => { setMode(m.id); reset(); }}
               className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                 mode === m.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
               }`}>
               <m.icon size={13} /> {m.label}
             </button>
           ))}
        </div>
      </div>

      {/* Main Testing Area */}
      <div className="relative group" onClick={() => inputRef.current?.focus()}>
        {!isActive && !isFinished && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-in fade-in duration-500">
            <div className="bg-slate-900/5 backdrop-blur-sm px-6 py-3 rounded-2xl border border-slate-900/10 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em]">Begin typing to start mission</span>
            </div>
          </div>
        )}

        <input ref={inputRef} type="text" className="opacity-0 absolute" value={userInput} onChange={handleInput} autoComplete="off" />

        <div className={`p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 transition-all duration-500 ${!isActive && 'blur-[2px] opacity-40 scale-[0.98]'}`}>
          <div className="flex flex-wrap gap-x-2 gap-y-3 font-mono text-2xl leading-relaxed select-none tracking-tight">
            {text.split('').map((char, i) => {
              let status = 'text-slate-200';
              if (i < userInput.length) {
                status = userInput[i] === char ? 'text-slate-900' : 'text-red-500 bg-red-50 rounded-sm';
              }
              const isCurrent = i === userInput.length;
              return (
                <span key={i} className={`relative transition-colors duration-150 ${status}`}>
                  {char === '\n' ? <br /> : char === ' ' ? '\u00A0' : char}
                  {isCurrent && isActive && (
                    <span className="absolute left-0 bottom-0 w-full h-[3px] bg-blue-600 shadow-[0_0_8px_#2563eb] animate-pulse" />
                  )}
                </span>
              );
            })}
          </div>
        </div>

        {/* Global Controls Bar */}
        <div className="mt-8 flex items-center justify-center gap-6">
           <div className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm font-mono text-xs font-bold text-slate-500">
             <span className="text-blue-600 uppercase tracking-widest">{language}</span>
             <span className="opacity-20">|</span>
             <span className="text-slate-900">
               {mode === 'time' ? `${timeLeft}s left` : mode === 'words' ? `${userInput.length}/${text.length}` : 'Endless Run'}
             </span>
           </div>
           
           <button onClick={reset} className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:rotate-180 transition-all duration-500">
             <Icons.Refresh size={18} />
           </button>
        </div>
      </div>

      {/* Systematic Results / Stats */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 ${isActive || isFinished ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <StatCard label="WPM" value={stats.wpm} icon={Icons.Zap} color="text-yellow-500" />
        <StatCard label="Accuracy" value={`${stats.accuracy}%`} icon={Icons.Target} color="text-green-500" />
        <StatCard label="Raw Speed" value={stats.raw} icon={Icons.TrendingUp} color="text-blue-500" />
        <StatCard label="Mistakes" value={stats.mistakes} icon={Icons.AlertCircle} color="text-red-400" />
      </div>

      {isFinished && (
        <div className="p-1 w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] shadow-xl shadow-blue-100 animate-in zoom-in-95 fade-in duration-500">
           <div className="bg-white rounded-[1.8rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase">Mission Accomplished</h3>
                <p className="text-sm text-slate-500 mt-1">Excellent performance. Your coding velocity is increasing.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={reset} className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all">Try Again</button>
                <button onClick={() => navigate('/leaderboard')} className="px-6 py-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 font-bold text-sm hover:bg-blue-100 transition-all">View Leaderboard</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
