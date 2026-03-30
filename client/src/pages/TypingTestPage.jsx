import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icons from '@/assets/icons';

// ─── CODE SNIPPETS (Prose removed) ────────────────────────
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

// ─── COMPONENTS ───────────────────────────────────────────
function StatCard({ label, value, icon: Ic, colorClass }) {
  return (
    <div className="bg-slate-50 border border-slate-200/50 p-6 flex flex-col items-center justify-center transition-all">
      <div className={`p-2 bg-white rounded-lg shadow-sm border border-slate-100 mb-3 ${colorClass}`}>
        <Ic size={18} />
      </div>
      <div className="text-2xl font-black text-slate-900 tracking-tighter mb-1">{value}</div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────
export default function TypingTestPage() {
  const navigate = useNavigate();
  
  // Settings
  const [playMode, setPlayMode]       = useState('solo');  // solo, ghost, battle
  const [limitMode, setLimitMode]     = useState('time');  // time, words
  const [timeConfig, setTimeConfig]   = useState(30);      // 15, 30, 60
  
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
    
    const nextText = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)].text;
    
    setText(nextText);
    setUserInput('');
    setTimeLeft(limitMode === 'time' ? timeConfig : 999);
    setIsActive(false);
    setIsFinished(false);
    setStartTime(null);
    setStats({ wpm: 0, accuracy: 0, raw: 0, mistakes: 0 });
    
    inputRef.current?.focus();
  }, [limitMode, timeConfig]);

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
    
    if (limitMode === 'time') {
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
    <div className="max-w-[1000px] mx-auto py-12 px-6 min-h-screen flex flex-col bg-white">
      
      {/* ─── Minimalist Header & Options ─── */}
      <div className="flex flex-col gap-6 mb-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 flex items-center justify-center rounded-lg shadow-sm">
              <Icons.Terminal size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Speed Architect</h1>
              <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">Code Execution Training</p>
            </div>
          </div>
          
          {/* Main Play Modes (Requested 1v1 and Ghost) */}
          <div className="flex p-1 bg-slate-50 border border-slate-200 rounded-lg">
             <button onClick={() => setPlayMode('solo')} className={`px-4 py-1.5 rounded-md text-[11px] font-bold uppercase transition-all ${playMode === 'solo' ? 'bg-white shadow-sm border border-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>Solo</button>
             <button onClick={() => setPlayMode('ghost')} className={`px-4 py-1.5 rounded-md text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 ${playMode === 'ghost' ? 'bg-white shadow-sm border border-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                <Icons.User size={12} /> Ghost Mode
             </button>
             <button onClick={() => setPlayMode('battle')} className={`px-4 py-1.5 rounded-md text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 ${playMode === 'battle' ? 'bg-white shadow-sm border border-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                <Icons.Zap size={12} /> 1v1 Battle
             </button>
          </div>
        </div>

        {/* Configurations Bar (Only config left is time/words for code) */}
        {playMode === 'solo' && (
          <div className="flex items-center gap-2">
            <div className="flex bg-white border border-slate-200 rounded-md overflow-hidden">
               <button onClick={() => setLimitMode('time')} className={`px-3 py-1.5 text-[10px] font-bold uppercase transition-all flex items-center gap-1 border-r border-slate-200 ${limitMode === 'time' ? 'bg-slate-50 text-slate-900' : 'text-slate-400 hover:bg-slate-50'}`}>
                 <Icons.Clock size={12} /> Time
               </button>
               <button onClick={() => setLimitMode('words')} className={`px-3 py-1.5 text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${limitMode === 'words' ? 'bg-slate-50 text-slate-900' : 'text-slate-400 hover:bg-slate-50'}`}>
                 <Icons.Code size={12} /> Snippet
               </button>
            </div>
            
            {limitMode === 'time' && (
               <div className="flex bg-white border border-slate-200 rounded-md overflow-hidden">
                 {[15, 30, 60].map(t => (
                   <button key={t} onClick={() => setTimeConfig(t)} className={`px-3 py-1.5 text-[10px] font-bold transition-all border-r last:border-0 border-slate-200 ${timeConfig === t ? 'bg-slate-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}>{t}s</button>
                 ))}
               </div>
            )}
          </div>
        )}
      </div>

      {playMode !== 'solo' ? (
         <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Icons.Infinity size={48} className="text-slate-200 mb-4" />
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-2">{playMode === 'ghost' ? 'Ghost Racing' : '1v1 Arena'} Offline</h2>
            <p className="text-sm text-slate-500 font-medium">Multiplayer matchmaking and ghost data servers are currently undergoing maintenance. Please use Solo mode.</p>
         </div>
      ) : (
        /* ─── Typing Arena ─── */
        <div className="flex-1 relative flex flex-col pt-8 pb-20">
          
          {/* Active Test Info */}
          <div className={`mb-6 flex justify-between items-end transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            <div className="font-mono text-xl font-bold text-blue-600">
              {limitMode === 'time' ? timeLeft : `${userInput.length}/${text.length}`}
            </div>
          </div>

          {/* Input & Display */}
          <input ref={inputRef} type="text" className="opacity-0 absolute top-0 -z-10" value={userInput} onChange={handleInput} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />

          <div className="relative text-[20px] md:text-[24px] leading-[1.8] font-mono select-none tracking-tight">
            <div className="flex flex-wrap break-all whitespace-pre-wrap">
              {text.split('').map((char, i) => {
                let status = 'text-slate-300';
                if (i < userInput.length) {
                   status = userInput[i] === char ? 'text-slate-900 bg-slate-100/50' : 'text-red-500 bg-red-100 shadow-[inset_0_-2px_0_0_#ef4444]';
                }
                const isCurrent = i === userInput.length;
                return (
                  <span key={i} className={`relative transition-colors duration-75 ${status}`}>
                    {char}
                    {!isFinished && isCurrent && (
                      <span className={`absolute left-0 bottom-1 top-1 w-[2px] bg-blue-500 transition-all duration-75 ${!isActive && 'animate-pulse'}`} />
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Action Controls */}
          <div className="mt-16 flex flex-col items-center justify-center gap-4">
              <button onClick={handleRestart} className="p-3 rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all">
                <Icons.RefreshCw size={18} />
              </button>
              <p className="text-[10px] font-bold font-mono uppercase tracking-[0.1em] text-slate-400">Restart Session</p>
          </div>
        </div>
      )}

      {/* ─── Results Dashboard ─── */}
      <div className={`absolute inset-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-500 flex flex-col items-center justify-center p-8 ${isFinished ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`w-full max-w-3xl transition-all duration-500 delay-100 ${isFinished ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tight mb-2">Architect Complete</h2>
            <p className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-widest">Code Mode • {limitMode === 'time' ? `${timeConfig}s` : `Snippet`} • {stats.mistakes === 0 ? 'Flawless' : `${stats.mistakes} Errors`}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-slate-200 rounded-2xl overflow-hidden mb-12 shadow-sm">
            <StatCard label="WPM" value={stats.wpm} icon={Icons.Zap} colorClass="text-yellow-600" />
            <StatCard label="Accuracy" value={`${stats.accuracy}%`} icon={Icons.Target} colorClass="text-green-600" />
            <StatCard label="Raw Speed" value={stats.raw} icon={Icons.TrendingUp} colorClass="text-blue-600" />
            <StatCard label="Mistakes" value={stats.mistakes} icon={Icons.HelpCircle} colorClass="text-red-500" />
          </div>

          <div className="flex items-center justify-center gap-4">
            <button onClick={handleRestart} className="px-6 py-3 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all uppercase tracking-widest">
              Go Again
            </button>
            <button onClick={() => navigate('/leaderboard')} className="px-6 py-3 rounded-lg bg-white text-slate-900 border border-slate-200 font-bold text-xs hover:bg-slate-50 transition-all uppercase tracking-widest">
              Leaderboard
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
