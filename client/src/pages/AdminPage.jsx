import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { StatCard, Avatar, BadgeTag, Button, Spinner, Input } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const TABS = ['Overview', 'Users', 'Courses', 'Tournaments', 'Hall of Fame'];

// ─── OVERVIEW TAB ─────────────────────────────────────────
function Overview({ stats }) {
  if (!stats) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Spinner size={24} className="text-cyber" />
      <span className="font-mono text-[10px] text-[#444] uppercase tracking-[0.2em]">SYNCHRONIZING TELEMETRY...</span>
    </div>
  );

  const StatBlock = ({ label, value, icon: Icon, color = 'cyber' }) => (
    <div className="blade p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.2em]">{label}</span>
        <div className={`text-${color} opacity-40`}>{Icon}</div>
      </div>
      <div className="font-mono font-black text-2xl text-white tracking-tight">{value}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBlock label="TOTAL OPERATIVES" value={stats.users.total.toLocaleString()}           icon={<Icons.Users size={14} />} />
        <StatBlock label="ACTIVE PULSE"    value={stats.users.activeToday.toLocaleString()}     icon={<Icons.Zap size={14} />} />
        <StatBlock label="NEW RECRUITS/W"  value={stats.users.newThisWeek.toLocaleString()}     icon={<Icons.TrendingUp size={14} />} color="emerald" />
        <StatBlock label="MONTHLY INTAKE"  value={stats.users.newThisMonth.toLocaleString()}    icon={<Icons.Calendar size={14} />} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBlock label="MODULES DEPLOYED"  value={stats.courses.published}                  icon={<Icons.Book size={14} />} color="violet" />
        <StatBlock label="TOTAL ENROLLMENTS" value={stats.courses.enrollments.toLocaleString()} icon={<Icons.Users size={14} />} />
        <StatBlock label="OPS COMPLETED"     value={stats.courses.completions.toLocaleString()} icon={<Icons.Check size={14} />} color="emerald" />
        <StatBlock label="LOGIC SOLVED"      value={stats.learning.lessonsCompleted.toLocaleString()} icon={<Icons.Play size={14} />} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBlock label="LIVE EVENTS"       value={stats.tournaments.active}                 icon={<Icons.Trophy size={14} />} color="amber" />
        <StatBlock label="TOTAL BATTLES"     value={stats.battles.total}                      icon={<Icons.Zap size={14} />} />
        <StatBlock label="QUIZ TELEMETRY"    value={stats.learning.quizAttempts.toLocaleString()} icon={<Icons.Target size={14} />} />
        <StatBlock label="ARCHIVED OPS"      value={stats.battles.completed}                  icon={<Icons.Award size={14} />} />
      </div>

      <div className="blade overflow-hidden">
        <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <span className="font-mono text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">TOP OPERATIVES BY XPEL</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {(stats.topUsers || []).map((u, i) => (
            <div key={u.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.01] transition-colors">
              <span className={`font-mono text-[10px] font-black w-5 text-center ${i < 3 ? ['text-amber-400','text-[#999]','text-amber-700'][i] : 'text-[#333]'}`}>{i+1}</span>
              <Avatar user={u} size={30} />
              <div className="flex-1">
                <span className="font-mono text-[11px] font-black text-white uppercase">{u.username}</span>
              </div>
              <div className="flex items-center gap-2 text-cyber">
                <Icons.Zap size={10} strokeWidth={2.5} />
                <span className="font-mono text-[11px] font-black">{u.xp.toLocaleString()}</span>
              </div>
              <span className="font-mono text-[10px] font-bold text-[#444] w-24 text-right uppercase tracking-wider">{u.coursesCompleted} MODULES</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── USERS TAB ────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers]     = useState([]);
  const [total, setTotal]     = useState(0);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (q = '') => {
    setLoading(true);
    try {
      const r = await api.get(`/admin/users?search=${q}&limit=25`);
      setUsers(r.data.users || []);
      setTotal(r.data.total || 0);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id) => {
    try {
      const r = await api.patch(`/admin/users/${id}/toggle`);
      toast.success(r.data.message);
      setUsers(u => u.map(x => x.id === id ? { ...x, isActive: r.data.isActive } : x));
    } catch (_) { toast.error('FAILED'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Icons.Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
          <input className="w-full bg-black border border-white/[0.1] rounded-[4px] px-4 py-3 placeholder-[#333] text-white focus:outline-none focus:border-cyber transition-all text-[11px] font-mono pl-9 uppercase tracking-wider" placeholder="SEARCH RECRUITS..." value={search}
            onChange={(e) => { setSearch(e.target.value); load(e.target.value); }} />
        </div>
        <span className="font-mono text-[10px] text-[#444] uppercase font-black tracking-widest">{total.toLocaleString()} REGISTERED</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={22} className="text-cyber" /></div>
      ) : (
        <div className="blade overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.01]">
                  {['OPERATIVE','COMS','ROLE','XPEL','HISTORY','STATUS','ACTION'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-mono text-[9px] font-black text-[#555] uppercase tracking-[0.2em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Avatar user={u} size={28} />
                        <span className="font-mono text-[11px] font-black text-white uppercase group-hover:text-cyber transition-colors">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[10px] text-[#555] lowercase">{u.email}</td>
                    <td className="px-5 py-3.5">
                       <span className={`px-2 py-0.5 rounded-[2px] font-mono text-[9px] font-black tracking-widest uppercase border ${
                         u.role === 'ADMIN' ? 'border-amber-400/30 text-amber-400 bg-amber-400/10' : 'border-white/10 text-[#666] bg-white/5'
                       }`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] font-black text-cyber">{(u.xp||0).toLocaleString()}</td>
                    <td className="px-5 py-3.5 font-mono text-[10px] text-[#555] font-black uppercase tracking-wider">{u.streak}D STREAK</td>
                    <td className="px-5 py-3.5">
                        <span className={`w-2 h-2 rounded-[1px] inline-block ${u.isActive ? 'bg-emerald animate-pulse' : 'bg-crimson'}`} />
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggle(u.id)}
                        className={`font-mono text-[9px] font-black tracking-[0.1em] uppercase transition-colors ${u.isActive ? 'text-crimson hover:text-crimson/80' : 'text-emerald hover:text-emerald/80'}`}>
                        {u.isActive ? 'DEACTIVATE' : 'INITIALIZE'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COURSES TAB ──────────────────────────────────────────
function CoursesTab() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/courses').then(r => setCourses(r.data.courses || [])).finally(() => setLoading(false));
  }, []);

  const toggle = async (id) => {
    try {
      const r = await api.patch(`/admin/courses/${id}/toggle`);
      toast.success(r.data.message);
      setCourses(c => c.map(x => x.id === id ? { ...x, isPublished: !x.isPublished } : x));
    } catch (_) { toast.error('FAILED'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={22} className="text-cyber" /></div>;

  return (
    <div className="blade overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.01]">
              {['MODULE','CLASS','TACTICAL','LOGIC','UNIT','INTEL','ACTION'].map(h => (
                <th key={h} className="px-5 py-3 text-left font-mono text-[9px] font-black text-[#555] uppercase tracking-[0.2em]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {courses.map(c => (
              <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-5 py-4 font-mono font-black text-[11px] text-white uppercase max-w-xs truncate group-hover:text-cyber transition-colors">{c.title}</td>
                <td className="px-5 py-4 font-mono text-[10px] text-[#555] uppercase tracking-wider">{c.category?.name}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded-[2px] font-mono text-[9px] font-black border ${
                    c.difficulty === 'ADVANCED' ? 'border-crimson/30 text-crimson bg-crimson/5' : 'border-cyber/30 text-cyber bg-cyber/5'
                  }`}>{c.difficulty}</span>
                </td>
                <td className="px-5 py-4 font-mono text-[11px] text-[#555]">{c._count?.lessons}</td>
                <td className="px-5 py-4 font-mono text-[11px] text-[#555] font-black">{(c._count?.enrollments||0).toLocaleString()}</td>
                <td className="px-5 py-4">
                  <span className={`font-mono text-[9px] font-black tracking-widest uppercase ${c.isPublished ? 'text-emerald' : 'text-[#444]'}`}>
                    {c.isPublished ? 'DEPLOYED' : 'PENDING'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button onClick={() => toggle(c.id)}
                    className="font-mono text-[9px] font-black text-[#555] hover:text-white uppercase tracking-wider transition-colors border border-white/[0.08] px-3 py-1.5 rounded-[2px] hover:border-white/20">
                    {c.isPublished ? 'ARCHIVE' : 'DEPLOY'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TOURNAMENT CREATE TAB ────────────────────────────────
function TournamentsTab() {
  const [form, setForm] = useState({ title: '', type: 'CODING_CHALLENGE', startsAt: '', endsAt: '', xpBonus: 500, description: '' });
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    setSaving(true);
    try {
      await api.post('/admin/tournaments', form);
      toast.success('TOURNAMENT DEPLOYED');
      setForm({ title: '', type: 'CODING_CHALLENGE', startsAt: '', endsAt: '', xpBonus: 500, description: '' });
    } catch (err) { toast.error(err.response?.data?.error || 'DEPLOYMENT FAULT'); }
    setSaving(false);
  };

  return (
    <div className="blade p-8 max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Icons.Trophy className="text-amber-400" size={16} />
        <h3 className="font-mono font-black text-[12px] text-white tracking-[0.2em] uppercase">INITIALIZE EVENT</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block font-mono text-[9px] font-bold text-[#444] uppercase tracking-[0.2em] mb-2">EVENT DESIGNATION</label>
          <input className="w-full bg-black border border-white/[0.1] rounded-[4px] px-4 py-3 text-white font-mono text-[11px] uppercase outline-none focus:border-cyber" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="WEEKLY_CRACKDOWN_01" />
        </div>

        <div>
           <label className="block font-mono text-[9px] font-bold text-[#444] uppercase tracking-[0.2em] mb-2">ENGAGEMENT CORE</label>
           <select className="w-full bg-black border border-white/[0.1] rounded-[4px] px-4 py-3 text-white font-mono text-[11px] uppercase outline-none focus:border-cyber cursor-pointer appearance-none" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="CODING_CHALLENGE">CODING_CHALLENGE</option>
            <option value="QUIZ_BATTLE">QUIZ_BATTLE</option>
            <option value="SPEED_COURSE">SPEED_COURSE</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
             <label className="block font-mono text-[9px] font-bold text-[#444] uppercase tracking-[0.2em] mb-2">T-MINUS START</label>
             <input type="datetime-local" className="w-full bg-black border border-white/[0.1] rounded-[4px] px-4 py-3 text-white font-mono text-[11px] uppercase outline-none focus:border-cyber [color-scheme:dark]" value={form.startsAt} onChange={e => setForm({ ...form, startsAt: e.target.value })} />
          </div>
          <div>
             <label className="block font-mono text-[9px] font-bold text-[#444] uppercase tracking-[0.2em] mb-2">T-MINUS END</label>
             <input type="datetime-local" className="w-full bg-black border border-white/[0.1] rounded-[4px] px-4 py-3 text-white font-mono text-[11px] uppercase outline-none focus:border-cyber [color-scheme:dark]" value={form.endsAt} onChange={e => setForm({ ...form, endsAt: e.target.value })} />
          </div>
        </div>

        <div>
           <label className="block font-mono text-[9px] font-bold text-[#444] uppercase tracking-[0.2em] mb-2">REWARD PAYLOAD (XP)</label>
           <input type="number" className="w-full bg-black border border-white/[0.1] rounded-[4px] px-4 py-3 text-white font-mono text-[11px] uppercase outline-none focus:border-cyber" value={form.xpBonus} onChange={e => setForm({ ...form, xpBonus: Number(e.target.value) })} />
        </div>

        <div>
          <label className="block font-mono text-[9px] font-bold text-[#444] uppercase tracking-[0.2em] mb-2">INTEL BRIEFING</label>
          <textarea className="w-full bg-black border border-white/[0.1] rounded-[4px] px-4 py-3 text-[#B0B0B0] font-mono text-[11px] uppercase outline-none focus:border-cyber resize-none" rows={3} value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>

        <button onClick={handleCreate} disabled={saving} className="w-full py-4 bg-cyber text-black font-black font-mono text-[11px] rounded-[4px] uppercase tracking-[0.2em] hover:bg-cyber/90 transition-all disabled:opacity-50">
          DEPLOY TO GRID
        </button>
      </div>
    </div>
  );
}

// ─── HALL OF FAME TAB ────────────────────────────────────
function HallOfFameTab() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/hall-of-fame').then(r => setEntries(r.data.entries || [])).finally(() => setLoading(false));
  }, []);

  const rankColors = ['text-amber-400', 'text-[#999]', 'text-amber-700'];

  if (loading) return <div className="flex justify-center py-20"><Spinner size={22} className="text-cyber" /></div>;

  return (
    <div className="blade overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.01]">
        <span className="font-mono text-[10px] font-black text-white uppercase tracking-[0.2em]">LEGACY ARCHIVES — ALL-TIME ELITE</span>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {entries.map(e => (
          <div key={e.id} className="flex items-center gap-4 px-6 py-5 hover:bg-white/[0.01] transition-colors">
            <Icons.Trophy size={14} className={rankColors[e.rank - 1] || 'text-[#444]'} />
            <div className="font-mono text-[12px] font-black text-white uppercase tracking-tight">{e.username}</div>
            <div className="flex-1" />
            <div className="font-mono text-[10px] text-[#555] font-black uppercase tracking-widest">WEEK {e.weekNumber}, {e.year}</div>
            <div className="flex items-center gap-2 text-cyber ml-6">
              <Icons.Zap size={11} strokeWidth={2.5} />
              <span className="font-mono text-[11px] font-black">{(e.xp||0).toLocaleString()}</span>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="px-5 py-20 text-center">
             <Icons.Trophy size={32} className="text-[#111] mx-auto mb-4" />
             <p className="font-mono text-[10px] font-black text-[#444] uppercase tracking-[0.2em]">ARCHIVES EMPTY — FIRST RESET PENDING</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN ADMIN PAGE ──────────────────────────────────────
export default function AdminPage() {
  const { user }   = useAuthStore();
  const navigate   = useNavigate();
  const [tab, setTab]     = useState('Overview');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user?.role !== 'ADMIN') { navigate('/dashboard'); return; }
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  if (user?.role !== 'ADMIN') return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 animate-fade-in">
      <header className="flex items-center justify-between border-b border-white/[0.08] pb-6">
        <div>
          <h1 className="font-mono font-black text-3xl text-white tracking-[0.1em] uppercase mb-1">COMMAND PANEL</h1>
          <p className="font-mono text-[10px] text-[#444] uppercase font-black tracking-[0.3em]">SYSTEM_ROOT / GLOBAL_OPS</p>
        </div>
        <div className="px-4 py-1.5 rounded-[2px] bg-amber-400/[0.08] border border-amber-400/30">
           <span className="font-mono text-[10px] font-black text-amber-400 uppercase tracking-widest">ADMIN PRIVILEGES</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-[#0A0A0A] border border-white/[0.04] rounded-[4px] overflow-x-auto custom-scrollbar no-scrollbar">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`min-w-fit py-2.5 px-6 rounded-[2px] font-mono text-[10px] font-black transition-all whitespace-nowrap uppercase tracking-widest ${
              tab === t ? 'bg-white/10 text-white shadow-sm' : 'text-[#555] hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="animate-fade-up">
        {tab === 'Overview'    && <Overview stats={stats} />}
        {tab === 'Users'       && <UsersTab />}
        {tab === 'Courses'     && <CoursesTab />}
        {tab === 'Tournaments' && <TournamentsTab />}
        {tab === 'Hall of Fame'&& <HallOfFameTab />}
      </div>
    </div>
  );
}
