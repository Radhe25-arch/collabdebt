import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icons from '@/assets/icons';

// ─── DICTIONARIES ─────────────────────────────────────────
const ENGLISH_WORDS = [
  'the', 'about', 'search', 'time', 'year', 'day', 'way', 'man', 'thing', 'woman',
  'life', 'child', 'world', 'school', 'state', 'family', 'student', 'group', 'country',
  'problem', 'hand', 'part', 'place', 'case', 'week', 'company', 'system', 'program',
  'question', 'work', 'government', 'number', 'night', 'point', 'home', 'water', 'room',
  'mother', 'area', 'money', 'story', 'fact', 'month', 'lot', 'right', 'study', 'book',
  'eye', 'job', 'word', 'business', 'issue', 'side', 'kind', 'head', 'house', 'service',
  'friend', 'father', 'power', 'hour', 'game', 'line', 'end', 'member', 'law', 'car',
  'city', 'community', 'name', 'president', 'team', 'minute', 'idea', 'kid', 'body',
  'information', 'back', 'parent', 'face', 'others', 'level', 'office', 'door', 'health',
  'person', 'art', 'war', 'history', 'party', 'result', 'change', 'morning', 'reason',
  'research', 'girl', 'guy', 'moment', 'air', 'teacher', 'force', 'education'
];

const CODE_SNIPPETS = [
  { text: 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}' },
  { text: 'const sum = arr.reduce((acc, val) => acc + val, 0);\nconst avg = sum / arr.length;\nconsole.log("Average:", avg);' },
  { text: 'def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n    return -1' },
  { text: 'async function fetchData(url) {\n  try {\n    const res = await fetch(url);\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error(err);\n  }\n}' },
  { text: 'class Stack:\n    def __init__(self):\n        self.items = []\n    def push(self, item):\n        self.items.append(item)\n    def pop(self):\n        return self.items.pop()' },
  { text: 'const debounce = (fn, delay) => {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n};' },
  { text: 'SELECT users.name, COUNT(orders.id)\nFROM users\nLEFT JOIN orders\nON users.id = orders.user_id\nGROUP BY users.name\nORDER BY COUNT(orders.id) DESC;' },
  { text: 'def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + quicksort(right)' },
  { text: 'const merge = (a, b) => {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < a.length && j < b.length) {\n    result.push(a[i] < b[j] ? a[i++] : b[j++]);\n  }\n  return [...result, ...a.slice(i), ...b.slice(j)];\n};' },
];

function generateProse(wordCount) {
  let result = [];
  for (let i = 0; i < wordCount; i++) {
    result.push(ENGLISH_WORDS[Math.floor(Math.random() * ENGLISH_WORDS.length)]);
  }
  return result.join(' ');
}

// ─── COMPONENTS ───────────────────────────────────────────
function StatCard({ label, value, icon: Ic, color }) {
  return (
    <div className="bg-white/40 backdrop-blur-md border border-slate-200/50 p-6 rounded-[2rem] flex flex-col items-center justify-center transition-all hover:-translate-y-1 hover:bg-white shadow-sm">
      <div className={`p-3 rounded-2xl bg-white shadow-sm border border-slate-100 mb-4 ${color}`}>
        <Ic size={20} />
      </div>
      <div className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{value}</div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────
export default function TypingTestPage() {
  const navigate = useNavigate();
  
  // Settings
  const [contentType, setContentType] = useState('prose'); // prose, code
  const [mode, setMode]               = useState('time');  // time, words
  const [timeConfig, setTimeConfig]   = useState(30);      // 15, 30, 60, 120
  const [wordConfig, setWordConfig]   = useState(25);      // 10, 25, 50, 100

  // State
  const [text, setText]           = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft]   = useState(30);
  const [isActive, setIsActive]   = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats]         = useState({ wpm: 0, accuracy: 0, raw: 0, mistakes: 0 });
  const [startTime, setStartTime] = useState(null);
  
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const prepareTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    let nextText = '';
    if (contentType === 'code') {
      nextText = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)].text;
    } else {
      nextText = generateProse(mode === 'words' ? wordConfig : 100); 
    }
    
    setText(nextText);
    setUserInput('');
    setTimeLeft(mode === 'time' ? timeConfig : 999);
    setIsActive(false);
    setIsFinished(false);
    setStartTime(null);
    setStats({ wpm: 0, accuracy: 0, raw: 0, mistakes: 0 });
    
    inputRef.current?.focus();
  }, [contentType, mode, timeConfig, wordConfig]);

  useEffect(() => { prepareTest(); }, [prepareTest]);

  // Always keep focus on the hidden input when not finished
  useEffect(() => {
    const handleGlobalClick = () => { if (!isFinished) inputRef.current?.focus(); };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [isFinished]);

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
    if (isFinished) return;
    const val = e.target.value;
    
    if (!isActive && val.length > 0) startTest();
    setUserInput(val);
    
    if (val.length >= text.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsFinished(true);
    }
  };

  // Calculate real-time stats
  useEffect(() => {
    if (!startTime || !isActive) return;
    
    const elapsedMinutes = (Date.now() - startTime) / 60000 || 0.001;
    const correctChars = userInput.split('').filter((c, i) => c === text[i]).length;
    const wordsCalculated = correctChars / 5;
    
    const acc = userInput.length ? Math.round((correctChars / userInput.length) * 100) : 100;
    const wpm = Math.round(wordsCalculated / elapsedMinutes);
    const raw = Math.round((userInput.length / 5) / elapsedMinutes);
    
    setStats({
      wpm: wpm > 0 ? wpm : 0,
      accuracy: acc,
      raw: raw > 0 ? raw : 0,
      mistakes: userInput.length - correctChars
    });
  }, [userInput, timeLeft, isActive, startTime, text]);

  const handleRestart = (e) => {
    if (e) e.stopPropagation();
    prepareTest();
  };

  return (
    <div className="max-w-[1000px] mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-700 min-h-screen flex flex-col">
      
      {/* ─── Premium Header & Command Bar ─── */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/10">
            <Icons.Keyboard size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Speed Architect</h1>
            <p className="text-xs font-mono text-slate-400 font-bold uppercase tracking-widest mt-0.5">Terminal Velocity</p>
          </div>
        </div>

        {/* Global Configurations */}
        <div className="flex flex-wrap items-center gap-3 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 shadow-inner w-max">
           {/* Content Type Selector */}
           <div className="flex items-center gap-1 border-r border-slate-300/50 pr-3">
             <button onClick={() => setContentType('prose')} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${contentType === 'prose' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
               <Icons.MessageSquare size={13} /> Prose
             </button>
             <button onClick={() => setContentType('code')} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${contentType === 'code' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
               <Icons.Code size={13} /> Code
             </button>
           </div>
           
           {/* Mode Selector */}
           <div className="flex items-center gap-1 border-r border-slate-300/50 pr-3 pl-1">
             <button onClick={() => setMode('time')} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${mode === 'time' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
               <Icons.Clock size={13} /> Time
             </button>
             <button onClick={() => setMode('words')} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${mode === 'words' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
               <Icons.Award size={13} /> Words
             </button>
           </div>

           {/* Metrics Config */}
           <div className="flex items-center gap-1 pl-1">
              {mode === 'time' ? (
                [15, 30, 60, 120].map(t => (
                  <button key={t} onClick={() => setTimeConfig(t)} className={`px-3 py-2 rounded-xl text-[11px] font-black uppercase transition-all ${timeConfig === t ? 'bg-white text-blue-600 shadow-sm border border-blue-100' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
                ))
              ) : (
                [10, 25, 50, 100].map(w => (
                  <button key={w} onClick={() => setWordConfig(w)} className={`px-3 py-2 rounded-xl text-[11px] font-black uppercase transition-all ${wordConfig === w ? 'bg-white text-blue-600 shadow-sm border border-blue-100' : 'text-slate-400 hover:text-slate-600'}`}>{w}</button>
                ))
              )}
           </div>
        </div>
      </div>

      {/* ─── Typing Arena ─── */}
      <div className="flex-1 relative flex flex-col justify-center pb-20">
        
        {/* Active Test Info */}
        <div className={`mb-6 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
          <div className="font-mono text-3xl font-black text-blue-600">
            {mode === 'time' ? timeLeft : `${userInput.length}/${text.length}`}
          </div>
        </div>

        {/* Input & Display */}
        <input ref={inputRef} type="text" className="opacity-0 absolute top-0 -z-10" value={userInput} onChange={handleInput} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />

        <div className="relative text-[28px] md:text-[34px] leading-[1.6] font-mono select-none tracking-tight">
          <div className="flex flex-wrap break-all">
            {text.split('').map((char, i) => {
              let status = 'text-slate-300';
              if (i < userInput.length) {
                 status = userInput[i] === char ? 'text-slate-800' : 'text-red-500 bg-red-50/50 rounded-sm';
              }
              const isCurrent = i === userInput.length;
              return (
                <span key={i} className={`relative transition-colors duration-[50ms] ${status}`}>
                  {char === '\n' ? <span className="w-full block" /> : char === ' ' ? '\u00A0' : char}
                  {!isFinished && isCurrent && (
                    <span className={`absolute left-0 bottom-0 top-1 w-[3px] bg-blue-500 rounded-full transition-all duration-75 ${!isActive && 'animate-pulse'}`} style={{ transform: 'translateX(-1px)' }} />
                  )}
                </span>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-16 flex items-center justify-center">
            <button onClick={handleRestart} className="group p-4 rounded-3xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-white hover:border-slate-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <Icons.RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
        </div>
        
        <p className="mt-6 text-center text-xs font-bold font-mono uppercase tracking-[0.2em] text-slate-300">Tab + Enter to restart</p>
      </div>

      {/* ─── Results Dashboard ─── */}
      <div className={`absolute inset-0 z-40 bg-slate-50/80 backdrop-blur-xl transition-all duration-700 flex flex-col items-center justify-center p-8 ${isFinished ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`w-full max-w-4xl transition-all duration-700 delay-100 ${isFinished ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'}`}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-2">Architect Complete</h2>
            <p className="text-sm font-mono text-slate-500 font-bold uppercase tracking-widest">{contentType === 'prose' ? 'English Prose' : 'Code Mode'} • {mode === 'time' ? `${timeConfig}s` : `${wordConfig} words`}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <StatCard label="WPM" value={stats.wpm} icon={Icons.Zap} color="text-yellow-600 bg-yellow-50 border-yellow-100/50" />
            <StatCard label="Accuracy" value={`${stats.accuracy}%`} icon={Icons.Target} color="text-green-600 bg-green-50 border-green-100/50" />
            <StatCard label="Raw Speed" value={stats.raw} icon={Icons.TrendingUp} color="text-blue-600 bg-blue-50 border-blue-100/50" />
            <StatCard label="Mistakes" value={stats.mistakes} icon={Icons.HelpCircle} color="text-red-500 bg-red-50 border-red-100/50" />
          </div>

          <div className="flex items-center justify-center gap-4">
            <button onClick={handleRestart} className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-black text-sm hover:bg-slate-800 transition-all uppercase tracking-widest shadow-xl shadow-slate-900/10">
              Go Again
            </button>
            <button onClick={() => navigate('/leaderboard')} className="px-8 py-4 rounded-2xl bg-white text-slate-900 border border-slate-200 font-black text-sm hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm">
              Global Leaderboard
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
