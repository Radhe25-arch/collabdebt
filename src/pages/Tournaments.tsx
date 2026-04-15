import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trophy, Clock, Zap, Users, Calendar, ChevronRight, Lock, Play } from 'lucide-react';

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, targetDate.getTime() - Date.now());
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  return timeLeft;
}

const LIVE_TOURNAMENTS = [
  {
    id: 1, title: 'Weekly Algorithm Championship', sponsor: 'Google', xp: 5000,
    players: 512, maxPlayers: 512, status: 'live',
    color: 'from-red-600/20 to-pink-600/5', accent: 'text-red-400', border: 'border-red-500/30',
    tags: ['Algorithms', 'DP', 'Graphs'],
  },
  {
    id: 2, title: 'Systems Programming Gauntlet', sponsor: 'AWS', xp: 3500,
    players: 248, maxPlayers: 256, status: 'live',
    color: 'from-orange-600/20 to-yellow-600/5', accent: 'text-orange-400', border: 'border-orange-500/30',
    tags: ['Rust', 'C++', 'OS'],
  },
];

const UPCOMING = [
  {
    id: 3, title: 'Full-Stack Build-Off', sponsor: 'Vercel', xp: 8000,
    players: 180, maxPlayers: 1024,
    startsAt: new Date(Date.now() + 3 * 3600000 + 42 * 60000),
    tags: ['React', 'Node.js', 'TypeScript'],
    color: 'from-blue-600/20 to-indigo-600/5', accent: 'text-blue-400', border: 'border-blue-500/30',
  },
  {
    id: 4, title: 'AI/ML Hackathon', sponsor: 'HuggingFace', xp: 12000,
    players: 340, maxPlayers: 2048,
    startsAt: new Date(Date.now() + 2 * 86400000 + 6 * 3600000),
    tags: ['Python', 'PyTorch', 'LLMs'],
    color: 'from-purple-600/20 to-violet-600/5', accent: 'text-purple-400', border: 'border-purple-500/30',
  },
  {
    id: 5, title: 'Database Design Sprint', sponsor: 'Neon', xp: 4000,
    players: 89, maxPlayers: 512,
    startsAt: new Date(Date.now() + 5 * 86400000),
    tags: ['PostgreSQL', 'Schema', 'Optimization'],
    color: 'from-green-600/20 to-emerald-600/5', accent: 'text-green-400', border: 'border-green-500/30',
  },
];

const ENDED = [
  { id: 6, title: 'Rust Systems Masters', winner: '@ferris_dev', xp: 6000, participants: 512, tags: ['Rust'] },
  { id: 7, title: 'Graph Algorithms Cup', winner: '@graphking', xp: 3000, participants: 256, tags: ['Algorithms'] },
  { id: 8, title: 'Cloud Architecture Duel', winner: '@cloudninja88', xp: 5000, participants: 384, tags: ['AWS', 'K8s'] },
];

function LiveCard({ t }: { key?: React.Key, t: typeof LIVE_TOURNAMENTS[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className={`relative rounded-2xl bg-gradient-to-br ${t.color} border ${t.border} p-6 overflow-hidden`}
    >
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/40">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs font-mono text-red-400 font-bold">LIVE</span>
      </div>
      <div className="mb-5">
        <div className="text-xs font-mono text-zinc-500 mb-1">Sponsored by {t.sponsor}</div>
        <h3 className="text-xl font-display font-bold text-white">{t.title}</h3>
        <div className="flex flex-wrap gap-2 mt-3">
          {t.tags.map(tag => <span key={tag} className="text-xs font-mono px-2 py-1 bg-black/30 rounded-md text-zinc-400">#{tag}</span>)}
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div>
            <div className={`text-2xl font-bold font-mono ${t.accent}`}>{t.xp.toLocaleString()}</div>
            <div className="text-xs text-zinc-500">XP Prize Pool</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">{t.players}/{t.maxPlayers}</div>
            <div className="text-xs text-zinc-500">Players</div>
          </div>
        </div>
        <Button className="bg-red-600 hover:bg-red-500 text-white font-mono gap-2">
          <Play size={14} /> Watch Live
        </Button>
      </div>
      <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
        <div className="h-full bg-red-500 rounded-full" style={{ width: `${(t.players / t.maxPlayers) * 100}%` }} />
      </div>
    </motion.div>
  );
}

function UpcomingCard({ t }: { key?: React.Key, t: typeof UPCOMING[0] }) {
  const countdown = useCountdown(t.startsAt);
  const pads = (n: number) => String(n).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className={`rounded-2xl bg-gradient-to-br ${t.color} border ${t.border} p-6`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs font-mono text-zinc-500 mb-1">Sponsored by {t.sponsor}</div>
          <h3 className="text-lg font-display font-bold text-white">{t.title}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {t.tags.map(tag => <span key={tag} className="text-xs font-mono px-2 py-1 bg-black/30 rounded-md text-zinc-400">#{tag}</span>)}
          </div>
        </div>
        <Badge className={`${t.accent} border-current/30 bg-transparent font-mono`}>Soon</Badge>
      </div>

      {/* Countdown */}
      <div className="flex items-center gap-2 mb-5">
        <Clock size={14} className="text-zinc-500" />
        <div className="flex items-center gap-1 font-mono text-sm">
          {[{ val: countdown.d, lbl: 'd' }, { val: countdown.h, lbl: 'h' }, { val: countdown.m, lbl: 'm' }, { val: countdown.s, lbl: 's' }].map((c, i) => (
            <React.Fragment key={i}>
              <span className="bg-black/30 px-2 py-0.5 rounded text-white font-bold">{pads(c.val)}</span>
              <span className="text-zinc-600 text-xs">{c.lbl}</span>
              {i < 3 && <span className="text-zinc-700">:</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Users size={13} /> {t.players} registered
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Zap size={13} className="text-yellow-500" /> {t.xp.toLocaleString()} XP
          </div>
        </div>
        <Button size="sm" variant="outline" className="font-mono border-zinc-600 hover:bg-zinc-800">
          Register <ChevronRight size={14} />
        </Button>
      </div>
    </motion.div>
  );
}

export function Tournaments() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Tournaments</h1>
          <p className="text-zinc-500 mt-1 font-mono text-sm">Massive multiplayer coding events with enormous XP prize pools.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {LIVE_TOURNAMENTS.length} Live now
        </div>
      </div>

      <Tabs defaultValue="live">
        <TabsList>
          <TabsTrigger value="live">🔴 Live ({LIVE_TOURNAMENTS.length})</TabsTrigger>
          <TabsTrigger value="upcoming">📅 Upcoming ({UPCOMING.length})</TabsTrigger>
          <TabsTrigger value="ended">🏁 Ended</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          {LIVE_TOURNAMENTS.map(t => <LiveCard key={t.id} t={t} />)}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {UPCOMING.map(t => <UpcomingCard key={t.id} t={t} />)}
        </TabsContent>

        <TabsContent value="ended">
          <div className="space-y-3">
            {ENDED.map((t, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-600">
                  <Trophy size={16} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-zinc-300 text-sm">{t.title}</div>
                  <div className="text-xs text-zinc-600 font-mono mt-0.5">Winner: {t.winner} • {t.participants} participants</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono text-zinc-500">{t.xp.toLocaleString()} XP</div>
                  <div className="flex gap-1 mt-1 justify-end">
                    {t.tags.map(tag => <span key={tag} className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-500">#{tag}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
