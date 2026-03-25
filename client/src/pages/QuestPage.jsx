import { useState, useEffect } from 'react';
import { ProgressBar, BadgeTag, Spinner } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { format } from 'date-fns';

const QUEST_ICONS = {
  LESSON_COMPLETE:   Icons.Book,
  QUIZ_PASS:         Icons.Target,
  CODE_SOLVE:        Icons.Terminal,
  STREAK_MAINTAIN:   Icons.Fire,
  COURSE_ENROLL:     Icons.Plus,
  TOURNAMENT_JOIN:   Icons.Tournament,
};

const DIFFICULTY_COLORS = {
  EASY:   'badge-teal',
  MEDIUM: 'badge-purple',
  HARD:   'badge-red',
};

function QuestCard({ quest }) {
  const prog   = quest.userProgress;
  const pct    = prog ? Math.min(Math.round((prog.progress / quest.target) * 100), 100) : 0;
  const done   = prog?.completed || false;
  const Ic     = QUEST_ICONS[quest.type] || Icons.Star;

  return (
    <div className={`arena-card p-5 transition-all ${done ? 'opacity-80' : 'hover:-translate-y-0.5'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            done ? 'bg-indigo-600/20 border border-indigo-600/30' : 'bg-blue-600/15 border border-slate-200'
          }`}>
            {done
              ? <Icons.Check size={16} className="text-indigo-600" />
              : <Ic size={16} className="text-blue-700" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm">{quest.title}</h3>
              <BadgeTag variant={DIFFICULTY_COLORS[quest.difficulty]?.replace('badge-','')||'gray'}>
                {quest.difficulty}
              </BadgeTag>
            </div>
            <p className="font-mono text-xs text-slate-600 mt-0.5">{quest.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-3">
          <Icons.Zap size={11} className="text-blue-700" />
          <span className="font-mono text-xs text-blue-700 font-bold">+{quest.xpReward} XP</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between font-mono text-xs text-slate-500">
          <span>Progress</span>
          <span className={done ? 'text-indigo-600' : ''}>
            {prog?.progress || 0} / {quest.target}
          </span>
        </div>
        <ProgressBar value={pct} max={100} color={done ? 'teal' : 'purple'} height={5} />
      </div>

      {done && (
        <div className="mt-3 flex items-center gap-2 text-indigo-600">
          <Icons.Check size={12} />
          <span className="font-mono text-xs">
            Completed · {prog.completedAt ? format(new Date(prog.completedAt), 'h:mm a') : ''}
          </span>
        </div>
      )}
    </div>
  );
}

export default function QuestPage() {
  const [quests, setQuests]   = useState([]);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/quests'),
      api.get('/quests/history'),
    ]).then(([q, h]) => {
      setQuests(q.data.quests || []);
      setHistory(h.data);
    }).finally(() => setLoading(false));
  }, []);

  const completed = quests.filter((q) => q.userProgress?.completed);
  const totalXP   = completed.reduce((s, q) => s + q.xpReward, 0);
  const allDone   = quests.length > 0 && completed.length === quests.length;

  if (loading) return (
    <div className="flex justify-center py-24"><Spinner size={24} className="text-blue-700" /></div>
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="font-display font-black text-2xl mb-1">Daily Quests</h1>
        <p className="font-mono text-xs text-slate-500">
          // {format(new Date(), 'EEEE, MMMM d')} · resets at midnight UTC
        </p>
      </div>

      {/* Header stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="arena-card p-4 text-center">
          <div className="font-display font-bold text-xl text-slate-900">{completed.length}/{quests.length}</div>
          <div className="font-mono text-xs text-slate-500 mt-1">Today's Progress</div>
        </div>
        <div className="arena-card p-4 text-center">
          <div className="font-display font-bold text-xl text-blue-700">+{totalXP}</div>
          <div className="font-mono text-xs text-slate-500 mt-1">XP Earned Today</div>
        </div>
        <div className="arena-card p-4 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Icons.Fire size={16} className="text-orange-400" />
            <div className="font-display font-bold text-xl text-orange-400">{history?.questStreak || 0}</div>
          </div>
          <div className="font-mono text-xs text-slate-500 mt-1">Quest Streak</div>
        </div>
      </div>

      {/* All-done banner */}
      {allDone && (
        <div className="arena-card p-5 flex items-center gap-4 bg-indigo-600/5 border-indigo-600/30">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center">
            <Icons.Trophy size={18} className="text-indigo-600" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-indigo-600">All quests complete!</p>
            <p className="font-mono text-xs text-slate-600">Come back tomorrow for new quests</p>
          </div>
          <div className="ml-auto">
            <BadgeTag variant="teal">+{totalXP} XP</BadgeTag>
          </div>
        </div>
      )}

      {/* Daily quests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Today's Quests</span>
          <div className="flex gap-1">
            {quests.map((q, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${q.userProgress?.completed ? 'bg-indigo-600' : 'bg-slate-100 border border-slate-200'}`} />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {quests.length === 0 ? (
            <div className="arena-card p-12 text-center">
              <Icons.Target size={28} className="text-slate-500 mx-auto mb-3" />
              <p className="font-mono text-sm text-slate-500">No quests today. Check back tomorrow.</p>
            </div>
          ) : (
            quests.map((q) => <QuestCard key={q.id} quest={q} />)
          )}
        </div>
      </div>

      {/* History */}
      {(history?.completions?.length > 0) && (
        <div className="arena-card overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Recent Completions</span>
            <span className="font-mono text-xs text-blue-700">+{history.totalXP} total XP</span>
          </div>
          <div className="divide-y divide-arena-border/40 max-h-64 overflow-y-auto">
            {history.completions.slice(0, 15).map((c) => {
              const Ic = QUEST_ICONS[c.quest.type] || Icons.Star;
              return (
                <div key={c.id} className="flex items-center gap-3 px-5 py-2.5">
                  <Ic size={12} className="text-slate-500 flex-shrink-0" />
                  <span className="font-mono text-xs text-slate-600 flex-1">{c.quest.title}</span>
                  <span className="font-mono text-xs text-slate-500">
                    {c.completedAt ? format(new Date(c.completedAt), 'MMM d') : ''}
                  </span>
                  <span className="font-mono text-xs text-blue-700">+{c.xpAwarded}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
