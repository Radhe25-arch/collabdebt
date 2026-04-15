import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Swords, Zap, Trophy, Clock, CheckCircle2, XCircle, User, Code2, ChevronRight, Wifi } from 'lucide-react';

const PROBLEMS = [
  { title: 'Two Sum', difficulty: 'Easy', category: 'Arrays', xp: 150 },
  { title: 'Valid Parentheses', difficulty: 'Easy', category: 'Stack', xp: 150 },
  { title: 'Merge Intervals', difficulty: 'Medium', category: 'Arrays', xp: 300 },
  { title: 'LRU Cache', difficulty: 'Hard', category: 'Design', xp: 600 },
];

type Phase = 'lobby' | 'matchmaking' | 'duel' | 'result';

function TestCase({ id, passed, delay }: { key?: React.Key, id: number; passed: boolean; delay: number }) {
  const [visible, setVisible] = useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-2 text-xs font-mono ${passed ? 'text-green-400' : 'text-red-400'}`}
        >
          {passed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          Test case #{id}: {passed ? 'PASS' : 'FAIL'}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DuelArena() {
  const [timeLeft, setTimeLeft] = useState(600);
  const [myProgress, setMyProgress] = useState(70);
  const [oppProgress, setOppProgress] = useState(40);

  React.useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(p => p > 0 ? p - 1 : 0);
      setMyProgress(p => Math.min(100, p + Math.random() * 0.5));
      setOppProgress(p => Math.min(100, p + Math.random() * 1.2));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Timer */}
      <div className="flex items-center justify-center">
        <div className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-mono text-2xl font-bold ${
          timeLeft < 60 ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-zinc-700 bg-zinc-900 text-white'
        }`}>
          <Clock size={20} className="animate-pulse" />
          {fmt(timeLeft)}
        </div>
      </div>

      {/* VS Panel */}
      <div className="grid grid-cols-2 gap-6 relative">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center z-10">
          <div className="w-10 h-10 rounded-full bg-black border-2 border-zinc-700 flex items-center justify-center font-display font-bold text-sm text-zinc-400">VS</div>
        </div>

        {/* You */}
        <div className="bg-zinc-900 border border-green-500/30 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 overflow-hidden border-2 border-green-500/50">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="You" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">@you</div>
              <div className="text-xs text-green-400 font-mono">Elo: 1842</div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-zinc-500 mb-1 font-mono">
              <span>{Math.round(myProgress / 10)}/10 tests passing</span>
              <span>{Math.round(myProgress)}%</span>
            </div>
            <motion.div
              className="h-2 bg-zinc-800 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                animate={{ width: `${myProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          </div>
          <div className="space-y-1">
            {[1,2,3,4,5,6,7].map(i => <TestCase key={i} id={i} passed={true} delay={i * 300} />)}
          </div>
        </div>

        {/* Opponent */}
        <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-pink-400 overflow-hidden border-2 border-red-500/50">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Opp42" alt="Opponent" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">@speedcoder99</div>
              <div className="text-xs text-red-400 font-mono">Elo: 1799</div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-zinc-500 mb-1 font-mono">
              <span>{Math.round(oppProgress / 10)}/10 tests passing</span>
              <span>{Math.round(oppProgress)}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-pink-400"
                animate={{ width: `${oppProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="space-y-1">
            {[1,2,3,4].map(i => <TestCase key={i} id={i} passed={true} delay={i * 500 + 200} />)}
          </div>
        </div>
      </div>

      {/* Current problem */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/30">Medium</Badge>
          <h3 className="font-semibold text-white">Merge Intervals</h3>
          <span className="ml-auto text-xs text-zinc-500 font-mono">+300 XP</span>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Given an array of intervals where <code className="bg-zinc-800 px-1 py-0.5 rounded text-xs text-zinc-200 font-mono">intervals[i] = [starti, endi]</code>, merge all overlapping intervals and return an array of the non-overlapping intervals.
        </p>
      </div>
    </div>
  );
}

function Lobby({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-1">The Arena</h1>
        <p className="text-zinc-500 text-sm font-mono">Challenge peers to real-time algorithmic duels.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Your Elo', val: '1,842', color: 'text-indigo-400' },
          { label: 'Win Rate', val: '68%', color: 'text-green-400' },
          { label: 'Battles Won', val: '47', color: 'text-yellow-400' },
        ].map((s, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.val}</div>
            <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Problem selection */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider font-mono mb-4">Select Difficulty</h2>
        <div className="grid grid-cols-2 gap-3">
          {PROBLEMS.map((p, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Code2 size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-white text-sm">{p.title}</div>
                <div className="text-xs text-zinc-500 font-mono">{p.category}</div>
              </div>
              <div className="text-right">
                <Badge className={`text-xs mb-1 ${
                  p.difficulty === 'Easy' ? 'bg-green-500/15 text-green-400 border-green-500/30' :
                  p.difficulty === 'Medium' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' :
                  'bg-red-500/15 text-red-400 border-red-500/30'
                }`}>{p.difficulty}</Badge>
                <div className="text-xs text-zinc-500 font-mono">+{p.xp} XP</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={onStart}
        size="lg"
        className="w-full h-14 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-mono font-bold text-base gap-3 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
      >
        <Swords size={20} /> Find Opponent
      </Button>
    </div>
  );
}

function Matchmaking({ onFound }: { onFound: () => void }) {
  const [dots, setDots] = useState('');
  const [status, setStatus] = useState('Scanning global player pool');

  React.useEffect(() => {
    const d = setInterval(() => setDots(p => p.length < 3 ? p + '.' : ''), 500);
    const statuses = ['Scanning global player pool', 'Filtering by Elo range ±200', 'Opponent found!'];
    let i = 0;
    const s = setInterval(() => {
      i++;
      if (i < statuses.length) setStatus(statuses[i]);
      else { clearInterval(s); clearInterval(d); setTimeout(onFound, 800); }
    }, 1200);
    return () => { clearInterval(d); clearInterval(s); };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-8">
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-2 border-indigo-500/30 animate-ping absolute inset-0" />
        <div className="w-32 h-32 rounded-full border border-indigo-500/50 animate-pulse absolute inset-0" />
        <div className="w-32 h-32 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center relative">
          <Wifi size={40} className="text-indigo-400 animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <div className="text-xl font-display font-bold text-white mb-2">Matchmaking{dots}</div>
        <div className="text-sm text-zinc-500 font-mono">{status}</div>
      </div>
      <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        1,247 players online
      </div>
    </div>
  );
}

export function Battles() {
  const [phase, setPhase] = useState<Phase>('lobby');

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div key={phase} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
          {phase === 'lobby' && <Lobby onStart={() => setPhase('matchmaking')} />}
          {phase === 'matchmaking' && <Matchmaking onFound={() => setPhase('duel')} />}
          {phase === 'duel' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h1 className="text-2xl font-display font-bold text-white">Live Battle</h1>
                <Badge className="bg-red-500/15 text-red-400 border-red-500/30 font-mono ml-auto">LIVE</Badge>
                <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white font-mono text-xs" onClick={() => setPhase('lobby')}>
                  Forfeit
                </Button>
              </div>
              <DuelArena />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
