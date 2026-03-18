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
  if (!stats) return <div className="flex justify-center py-12"><Spinner size={22} className="text-arena-purple2" /></div>;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Users"    value={stats.users.total.toLocaleString()}           icon={<Icons.Users size={14} className="text-arena-teal" />} />
        <StatCard label="Active Today"   value={stats.users.activeToday.toLocaleString()}     icon={<Icons.Zap size={14} className="text-arena-purple2" />} />
        <StatCard label="New This Week"  value={stats.users.newThisWeek.toLocaleString()}     icon={<Icons.TrendingUp size={14} className="text-arena-muted" />} />
        <StatCard label="New This Month" value={stats.users.newThisMonth.toLocaleString()}    icon={<Icons.Calendar size={14} className="text-arena-muted" />} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Published Courses"   value={stats.courses.published}           icon={<Icons.Book size={14} className="text-arena-teal" />} />
        <StatCard label="Total Enrollments"   value={stats.courses.enrollments.toLocaleString()} icon={<Icons.Users size={14} className="text-arena-purple2" />} />
        <StatCard label="Completions"         value={stats.courses.completions.toLocaleString()} icon={<Icons.Check size={14} className="text-arena-teal" />} />
        <StatCard label="Lessons Completed"   value={stats.learning.lessonsCompleted.toLocaleString()} icon={<Icons.Play size={14} className="text-arena-muted" />} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Active Tournaments" value={stats.tournaments.active}           icon={<Icons.Trophy size={14} className="text-yellow-400" />} />
        <StatCard label="Total Battles"      value={stats.battles.total}                icon={<Icons.Zap size={14} className="text-arena-purple2" />} />
        <StatCard label="Quiz Attempts"      value={stats.learning.quizAttempts.toLocaleString()} icon={<Icons.Target size={14} className="text-arena-teal" />} />
        <StatCard label="Completed Battles"  value={stats.battles.completed}            icon={<Icons.Award size={14} className="text-arena-muted" />} />
      </div>

      <div className="arena-card overflow-hidden">
        <div className="px-5 py-3 border-b border-arena-border">
          <span className="font-mono text-xs text-arena-dim uppercase tracking-widest">Top 10 Users by XP</span>
        </div>
        <div className="divide-y divide-arena-border/40">
          {(stats.topUsers || []).map((u, i) => (
            <div key={u.id} className="flex items-center gap-4 px-5 py-3">
              <span className={`font-mono text-xs font-bold w-5 text-center ${i < 3 ? ['text-yellow-400','text-slate-400','text-amber-600'][i] : 'text-arena-dim'}`}>{i+1}</span>
              <Avatar user={u} size={28} />
              <div className="flex-1">
                <span className="font-mono text-xs text-arena-text">{u.username}</span>
              </div>
              <div className="flex items-center gap-1 text-arena-purple2">
                <Icons.Zap size={10} />
                <span className="font-mono text-xs font-bold">{u.xp.toLocaleString()}</span>
              </div>
              <span className="font-mono text-xs text-arena-dim w-20 text-right">{u.coursesCompleted} courses</span>
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
    } catch (_) { toast.error('Failed'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Icons.Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-arena-dim" />
          <input className="arena-input pl-9 text-sm" placeholder="Search users..." value={search}
            onChange={(e) => { setSearch(e.target.value); load(e.target.value); }} />
        </div>
        <span className="font-mono text-xs text-arena-dim">{total.toLocaleString()} users</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner size={22} className="text-arena-purple2" /></div>
      ) : (
        <div className="arena-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-arena-border">
                {['User','Email','Role','XP','Streak','Status',''].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-mono text-xs text-arena-dim uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-arena-border/40">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-arena-bg3/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar user={u} size={28} />
                      <span className="font-mono text-xs text-arena-text">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-arena-dim">{u.email}</td>
                  <td className="px-4 py-3">
                    <BadgeTag variant={u.role === 'ADMIN' ? 'gold' : 'gray'}>{u.role}</BadgeTag>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-arena-purple2">{u.xp.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-xs text-arena-dim">{u.streak}d</td>
                  <td className="px-4 py-3">
                    <BadgeTag variant={u.isActive ? 'teal' : 'red'}>{u.isActive ? 'Active' : 'Suspended'}</BadgeTag>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(u.id)}
                      className={`font-mono text-xs transition-colors ${u.isActive ? 'text-red-400 hover:text-red-300' : 'text-arena-teal hover:text-arena-teal2'}`}>
                      {u.isActive ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    } catch (_) { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-8"><Spinner size={22} className="text-arena-purple2" /></div>;

  return (
    <div className="arena-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-arena-border">
            {['Title','Category','Difficulty','Lessons','Enrolled','Status',''].map(h => (
              <th key={h} className="px-4 py-3 text-left font-mono text-xs text-arena-dim uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-arena-border/40">
          {courses.map(c => (
            <tr key={c.id} className="hover:bg-arena-bg3/40 transition-colors">
              <td className="px-4 py-3 font-body text-sm text-arena-text max-w-xs truncate">{c.title}</td>
              <td className="px-4 py-3 font-mono text-xs text-arena-dim">{c.category?.name}</td>
              <td className="px-4 py-3">
                <BadgeTag variant={c.difficulty === 'BEGINNER' ? 'teal' : c.difficulty === 'INTERMEDIATE' ? 'purple' : 'red'}>
                  {c.difficulty}
                </BadgeTag>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-arena-dim">{c._count?.lessons}</td>
              <td className="px-4 py-3 font-mono text-xs text-arena-dim">{c._count?.enrollments}</td>
              <td className="px-4 py-3">
                <BadgeTag variant={c.isPublished ? 'teal' : 'gray'}>{c.isPublished ? 'Published' : 'Draft'}</BadgeTag>
              </td>
              <td className="px-4 py-3">
                <button onClick={() => toggle(c.id)}
                  className="font-mono text-xs text-arena-dim hover:text-arena-text transition-colors">
                  {c.isPublished ? 'Unpublish' : 'Publish'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
      toast.success('Tournament created');
      setForm({ title: '', type: 'CODING_CHALLENGE', startsAt: '', endsAt: '', xpBonus: 500, description: '' });
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    setSaving(false);
  };

  return (
    <div className="arena-card p-6 max-w-xl space-y-4">
      <span className="font-mono text-xs text-arena-dim uppercase tracking-widest block">Create Tournament</span>
      <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Week #50 Quiz Battle" />
      <div>
        <label className="arena-label">Type</label>
        <select className="arena-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="CODING_CHALLENGE">Coding Challenge</option>
          <option value="QUIZ_BATTLE">Quiz Battle</option>
          <option value="SPEED_COURSE">Speed Course</option>
        </select>
      </div>
      <Input label="Starts At" type="datetime-local" value={form.startsAt} onChange={e => setForm({ ...form, startsAt: e.target.value })} />
      <Input label="Ends At"   type="datetime-local" value={form.endsAt}   onChange={e => setForm({ ...form, endsAt: e.target.value })} />
      <Input label="XP Bonus"  type="number" value={form.xpBonus} onChange={e => setForm({ ...form, xpBonus: Number(e.target.value) })} />
      <div>
        <label className="arena-label">Description</label>
        <textarea className="arena-input resize-none" rows={3} value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>
      <Button onClick={handleCreate} variant="primary" loading={saving} className="w-full">
        <Icons.Trophy size={14} /> Create Tournament
      </Button>
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

  const rankColors = ['text-yellow-400', 'text-slate-400', 'text-amber-600'];

  if (loading) return <div className="flex justify-center py-8"><Spinner size={22} className="text-arena-purple2" /></div>;

  return (
    <div className="arena-card overflow-hidden">
      <div className="px-5 py-3 border-b border-arena-border">
        <span className="font-mono text-xs text-arena-dim uppercase tracking-widest">Hall of Fame — All Time Top Players</span>
      </div>
      <div className="divide-y divide-arena-border/40">
        {entries.map(e => (
          <div key={e.id} className="flex items-center gap-4 px-5 py-3.5">
            <Icons.Trophy size={14} className={rankColors[e.rank - 1] || 'text-arena-dim'} />
            <div className="font-mono text-xs text-arena-text">{e.username}</div>
            <div className="flex-1" />
            <div className="font-mono text-xs text-arena-dim">Week {e.weekNumber}, {e.year}</div>
            <div className="flex items-center gap-1 text-arena-purple2">
              <Icons.Zap size={10} />
              <span className="font-mono text-xs">{e.xp.toLocaleString()}</span>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="px-5 py-8 text-center font-mono text-xs text-arena-dim">No hall of fame entries yet — first weekly reset creates them.</p>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl mb-1">Admin Panel</h1>
          <p className="font-mono text-xs text-arena-dim">// full platform control</p>
        </div>
        <BadgeTag variant="gold">ADMIN</BadgeTag>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-arena-bg2 border border-arena-border rounded-xl p-1 flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 min-w-fit py-2 px-3 rounded-lg font-mono text-xs transition-all whitespace-nowrap ${
              tab === t ? 'bg-arena-purple text-white' : 'text-arena-muted hover:text-arena-text'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview'    && <Overview stats={stats} />}
      {tab === 'Users'       && <UsersTab />}
      {tab === 'Courses'     && <CoursesTab />}
      {tab === 'Tournaments' && <TournamentsTab />}
      {tab === 'Hall of Fame'&& <HallOfFameTab />}
    </div>
  );
}
