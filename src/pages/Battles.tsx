import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Swords, Zap, Trophy, Clock, CheckCircle2, XCircle, 
  Code2, ChevronRight, Wifi, Sparkles, Medal, ArrowRight
} from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';

const PROBLEMS = [
  { title: 'Two Sum', difficulty: 'Easy', category: 'Arrays', xp: 150 },
  { title: 'Valid Parentheses', difficulty: 'Easy', category: 'Stack', xp: 150 },
  { title: 'Merge Intervals', difficulty: 'Medium', category: 'Arrays', xp: 300 },
  { title: 'LRU Cache', difficulty: 'Hard', category: 'Design', xp: 600 },
];

type Phase = 'lobby' | 'matchmaking' | 'duel' | 'result';

function TestCase({ id, passed, delay }: { id: number; passed: boolean; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-2 text-[10px] font-mono ${passed ? 'text-green-400' : 'text-zinc-600'}`}
        >
          {passed ? <CheckCircle2 size={10} className="text-green-500" /> : <div className="w-2.5 h-2.5 rounded-full border border-zinc-700" />}
          Test #{id}: {passed ? 'PASSED' : 'PENDING'}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DuelArena({ onWin }: { onWin: () => void }) {
  const [timeLeft, setTimeLeft] = useState(600);
  const [myProgress, setMyProgress] = useState(0);
  const [oppProgress, setOppProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(p => p > 0 ? p - 1 : 0);
      setMyProgress(p => {
        const next = Math.min(100, p + Math.random() * 4);
        if (next === 100 && p < 100) onWin();
        return next;
      });
      setOppProgress(p => Math.min(95, p + Math.random() * 3));
    }, 800);
    return () => clearInterval(t);
  }, [onWin]);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <div className={`flex items-center gap-3 px-8 py-3 rounded-2xl border font-mono text-3xl font-bold tracking-tighter ${
          timeLeft < 60 ? 'border-red-500/50 bg-red-500/10 text-red-500' : 'border-zinc-800 bg-zinc-950 text-white'
        }`}>
          <Clock size={24} className={timeLeft < 60 ? 'animate-ping' : ''} />
          {fmt(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 hidden md:flex items-center z-10">
          <div className="w-12 h-12 rounded-full bg-black border border-zinc-800 flex items-center justify-center font-display font-bold text-xs text-zinc-500 italic shadow-[0_0_20px_rgba(0,0,0,0.5)]">VS</div>
        </div>

        {/* You */}
        <div className="bg-zinc-900/50 border border-indigo-500/20 rounded-3xl p-6 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500 blur-3xl opacity-5 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-indigo-600 overflow-hidden border-2 border-indigo-500/50 shadow-lg">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="You" />
            </div>
            <div>
              <div className="font-bold text-white text-base">@developer (You)</div>
              <div className="text-[10px] text-indigo-400 font-mono font-bold tracking-widest uppercase">Verified Challenger</div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-zinc-500 mb-2 font-mono uppercase tracking-widest font-bold">
              <span>Progress</span>
              <span className="text-white">{Math.round(myProgress)}%</span>
            </div>
            <div className="h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 p-0.5">
              <motion.div className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full" animate={{ width: `${myProgress}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {[1,2,3,4,5,6,7,8].map(i => <TestCase key={i} id={i} passed={myProgress > (i * 12)} delay={i * 200} />)}
          </div>
        </div>

        {/* Opponent */}
        <div className="bg-zinc-900/50 border border-red-500/20 rounded-3xl p-6 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 blur-3xl opacity-5 transition-opacity" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden border-2 border-red-500/30">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Opponent" alt="Opponent" />
            </div>
            <div>
              <div className="font-bold text-white text-base">@speedcoder_X</div>
              <div className="text-[10px] text-red-500 font-mono font-bold tracking-widest uppercase">Master Rank</div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-zinc-500 mb-2 font-mono uppercase tracking-widest font-bold">
              <span>Progress</span>
              <span className="text-red-400">{Math.round(oppProgress)}%</span>
            </div>
            <div className="h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 p-0.5">
              <motion.div className="h-full bg-gradient-to-r from-red-600 to-pink-500 rounded-full" animate={{ width: `${oppProgress}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 opacity-60">
            {[1,2,3,4,5,6,7,8].map(i => <TestCase key={i} id={i} passed={oppProgress > (i * 12)} delay={i * 400} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Battles() {
  const { stats, addXP, updateElo } = useGameStore();
  const [phase, setPhase] = useState<Phase>('lobby');
  const [dots, setDots] = useState('');
  const [matchStatus, setMatchStatus] = useState('Initializing search...');

  useEffect(() => {
    if (phase === 'matchmaking') {
      const d = setInterval(() => setDots(p => p.length < 3 ? p + '.' : ''), 500);
      const statuses = ['Initializing search...', 'Filtering player pool...', 'Opponent found!', 'Loading Arena...'];
      let i = 0;
      const s = setInterval(() => {
        i++;
        if (i < statuses.length) setMatchStatus(statuses[i]);
        else { clearInterval(s); clearInterval(d); setTimeout(() => setPhase('duel'), 800); }
      }, 1200);
      return () => { clearInterval(d); clearInterval(s); };
    }
  }, [phase]);

  const handleVictory = () => {
    // We award XP and Elo
    addXP(300);
    updateElo(25);
    setTimeout(() => setPhase('result'), 1500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-700">
      <AnimatePresence mode="wait">
        {phase === 'lobby' && (
          <motion.div key="lobby" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold text-white tracking-tight">The Arena</h1>
                <p className="text-zinc-500 mt-2 font-mono text-sm tracking-wide uppercase">Prove your technical dominance</p>
              </div>
              <div className="flex items-center gap-3 px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <Medal size={20} className="text-indigo-400" />
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Your ELO</div>
                  <div className="text-lg font-display font-bold text-white tracking-tighter">{stats.elo}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROBLEMS.map((p, i) => (
                <div key={i} className="group flex items-center gap-5 p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-zinc-500 transition-all cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent blur-2xl" />
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:bg-indigo-600 transition-colors">
                    <Code2 size={24} className="text-zinc-500 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">{p.title}</div>
                    <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">{p.category}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={`font-mono text-[10px] uppercase tracking-widest mb-2 ${
                      p.difficulty === 'Easy' ? 'border-green-500/20 text-green-500' : 
                      p.difficulty === 'Medium' ? 'border-yellow-500/20 text-yellow-500' : 'border-red-500/20 text-red-500'
                    }`}>{p.difficulty}</Badge>
                    <div className="text-xs font-mono text-indigo-400 font-bold">+{p.xp} XP</div>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={() => setPhase('matchmaking')} className="w-full h-16 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-mono font-bold text-lg gap-4 shadow-[0_0_40px_rgba(239,68,68,0.2)] rounded-3xl transition-transform hover:scale-[1.01] active:scale-95">
              <Swords size={24} /> SEARCH FOR OPPONENT
            </Button>
          </motion.div>
        )}

        {phase === 'matchmaking' && (
          <motion.div key="matchmaking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 space-y-12">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-2 border-indigo-500/20 animate-ping absolute inset-0" />
              <div className="w-48 h-48 rounded-full border border-indigo-500/40 animate-pulse absolute inset-0" />
              <div className="w-48 h-48 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center relative shadow-[0_0_50px_rgba(79,70,229,0.2)]">
                <Wifi size={64} className="text-indigo-500 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-3xl font-display font-bold text-white tracking-widest uppercase">Searching{dots}</div>
              <div className="text-sm font-mono text-zinc-500 font-bold uppercase tracking-widest pulse">{matchStatus}</div>
            </div>
            <div className="flex items-center gap-3 px-6 py-2.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              2,842 PLAYERS SEARCHING GLOBALLY
            </div>
          </motion.div>
        )}

        {phase === 'duel' && (
          <motion.div key="duel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <h1 className="text-2xl font-display font-bold text-white tracking-widest uppercase italic border-l-4 border-red-600 pl-4">LIVE BATTLE</h1>
              <Badge className="bg-red-600/10 text-red-500 border-red-600/20 animate-pulse font-mono ml-auto">INTERACTIVE</Badge>
              <button onClick={() => setPhase('lobby')} className="text-zinc-600 hover:text-white transition-colors uppercase font-mono text-xs font-bold tracking-widest underline decoration-dashed">Forfeit</button>
            </div>
            <DuelArena onWin={handleVictory} />
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 space-y-10 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 blur-[100px] opacity-20 animate-pulse" />
              <div className="w-32 h-32 rounded-3xl bg-yellow-500 flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.5)] rotate-12 relative z-10">
                <Trophy size={64} className="text-black" />
              </div>
            </div>
            <div className="space-y-2 relative z-10">
              <h1 className="text-6xl font-display font-bold text-white tracking-tighter">VICTORY</h1>
              <p className="text-lg font-mono text-yellow-500 font-bold uppercase tracking-widest">Master of the Code</p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl text-center">
                <div className="text-3xl font-display font-bold text-indigo-400">+300</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold mt-1">XP Earned</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl text-center">
                <div className="text-3xl font-display font-bold text-green-400">+25</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold mt-1">ELO Gain</div>
              </div>
            </div>
            <Button onClick={() => setPhase('lobby')} className="px-12 h-14 bg-white text-black hover:bg-zinc-200 font-mono font-bold rounded-2xl gap-2 text-base">
              BACK TO LOBBY <ArrowRight size={20} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
