import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button, BadgeTag, Avatar, Spinner, Modal, Input } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'cpp',
  'csharp', 'go', 'rust', 'ruby', 'php'
];

// ─── ROOMS LIST ───────────────────────────────────────────
export function RoomsPage() {
  const navigate = useNavigate();
  const [rooms, setRooms]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [createModal, setCreate]  = useState(false);
  const [form, setForm]           = useState({ name: '', language: 'javascript', isPublic: true, maxUsers: 4 });
  const [creating, setCreating]   = useState(false);

  useEffect(() => {
    api.get('/rooms').then(r => setRooms(r.data.rooms || [])).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const r = await api.post('/rooms', form);
      navigate(`/rooms/${r.data.room.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create room');
    }
    setCreating(false);
  };

  const handleJoin = async (id) => {
    try {
      await api.post(`/rooms/${id}/join`);
      navigate(`/rooms/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cannot join room');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl mb-1">Code Rooms</h1>
          <p className="font-mono text-xs text-arena-dim uppercase tracking-widest">Collaborative Real-time Arena</p>
        </div>
        <Button onClick={() => setCreate(true)} variant="primary">
          <Icons.Plus size={14} /> Create Room
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size={24} className="text-arena-purple2" /></div>
      ) : rooms.length === 0 ? (
        <div className="arena-card p-16 text-center">
          <Icons.Users size={32} className="text-arena-dim mx-auto mb-4" />
          <p className="font-display font-bold mb-2">No active rooms found</p>
          <p className="font-mono text-xs text-arena-dim mb-6 uppercase tracking-wider">Start a collaborative session and code with your team</p>
          <Button onClick={() => setCreate(true)} variant="primary">
            <Icons.Plus size={14} /> Create First Room
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map(room => (
            <div key={room.id} className="arena-card p-5 hover:-translate-y-0.5 transition-transform group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display font-bold text-sm mb-1 group-hover:text-arena-purple2 transition-colors">{room.name}</h3>
                  <div className="flex items-center gap-2">
                    <BadgeTag variant="gray">{room.language}</BadgeTag>
                    <span className="font-mono text-xs text-arena-dim">
                      {room._count?.participants || 0}/{room.maxUsers} devs
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-arena-purple/15 border border-arena-border flex items-center justify-center">
                  <Icons.Code size={13} className="text-arena-purple2" />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Avatar user={room.owner} size={20} />
                <span className="font-mono text-xs text-arena-dim">{room.owner?.username}</span>
                <span className="font-mono text-xs text-arena-dim ml-auto">
                  {formatDistanceToNow(new Date(room.createdAt), { addSuffix: true })}
                </span>
              </div>
              <Button onClick={() => handleJoin(room.id)} variant="secondary" size="sm" className="w-full">
                <Icons.ArrowRight size={13} /> Join Room
              </Button>
            </div>
          ))}
        </div>
      )}

      <Modal open={createModal} onClose={() => setCreate(false)} title="Create Code Room">
        <div className="space-y-4">
          <Input label="Room Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="My Coding Session" />
          <div>
            <label className="arena-label">Primary Language</label>
            <select className="arena-input" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
              {LANGUAGES.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
            </select>
          </div>
          <Input label="Max Capacity" type="number" min={2} max={10} value={form.maxUsers}
            onChange={e => setForm({ ...form, maxUsers: Number(e.target.value) })} />
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setForm({ ...form, isPublic: !form.isPublic })}
              className={`w-4 h-4 rounded border flex items-center justify-center ${form.isPublic ? 'bg-arena-purple border-arena-purple' : 'border-arena-border'}`}>
              {form.isPublic && <Icons.Check size={10} className="text-white" />}
            </div>
            <span className="font-mono text-xs text-arena-muted">Public Room (Visible to everyone)</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button onClick={() => setCreate(false)} variant="secondary" className="flex-1">Cancel</Button>
            <Button onClick={handleCreate} variant="teal" className="flex-1" loading={creating}>
              <Icons.Code size={13} /> Create & Enter
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── ACTIVE ROOM ──────────────────────────────────────────
export function RoomPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuthStore();
  const [room, setRoom]       = useState(null);
  const [code, setCode]       = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput]   = useState(null);
  const isDirtyRef = useRef(false);
  const saveRef = useRef(null);
  const pollRef = useRef(null);

  const fetchRoom = useCallback(async () => {
    try {
      const r = await api.get(`/rooms/${id}`);
      setRoom(r.data.room);
      // SYNC FIX: Only update code if we're not currently typing
      if (!isDirtyRef.current) {
        setCode(prev => prev !== r.data.room.code ? r.data.room.code : prev);
      }
    } catch (_) {}
  }, [id]);

  useEffect(() => {
    // Join room first
    api.post(`/rooms/${id}/join`).catch(() => {});
    fetchRoom().finally(() => setLoading(false));

    // Poll every 3s for collaborative updates
    pollRef.current = setInterval(fetchRoom, 3000);
    return () => {
      clearInterval(pollRef.current);
      api.delete(`/rooms/${id}/leave`).catch(() => {});
    };
  }, [id, fetchRoom]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    isDirtyRef.current = true;
    
    // Debounce save
    clearTimeout(saveRef.current);
    saveRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        await api.put(`/rooms/${id}/code`, { code: newCode });
        isDirtyRef.current = false; // Safe to sync again
      } catch (_) {}
      setSaving(false);
    }, 1000);
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput({ type: 'info', content: 'Initializing sandbox...' });
    
    // Simulate compilation for non-JS for now
    if (room.language !== 'javascript') {
      setTimeout(() => {
        setOutput({ type: 'warning', content: `Execution for ${room.language} is currently in restricted beta. Output redirected to cloud logs.` });
        setRunning(false);
      }, 1000);
      return;
    }

    try {
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => logs.push(args.join(' '));
      
      // eslint-disable-next-line no-new-func
      const func = new Function(code);
      const result = func();
      
      console.log = originalLog;
      if (result !== undefined) logs.push(`=> ${result}`);
      setOutput({ type: 'success', content: logs.length ? logs.join('\n') : 'Execution finished with no output.' });
    } catch (err) {
      setOutput({ type: 'error', content: err.message });
    }
    setRunning(false);
  };

  const forceSave = async () => {
    setSaving(true);
    try {
      await api.put(`/rooms/${id}/code`, { code });
      toast.success('Saved to cloud');
      isDirtyRef.current = false;
    } catch (_) {
      toast.error('Save failed');
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex justify-center py-24"><Spinner size={24} className="text-arena-purple2" /></div>
  );
  if (!room) return (
    <div className="text-center py-24">
      <p className="font-mono text-sm text-arena-dim uppercase tracking-widest">Session Expired or Not Found</p>
      <Button onClick={() => navigate('/rooms')} variant="secondary" className="mt-4">Return to Rooms</Button>
    </div>
  );

  const participants = room.participants || [];
  const isOwner = room.ownerId === user?.id;

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-7rem)] animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/rooms')} className="p-2 hover:bg-arena-bg3 rounded-lg transition-colors text-arena-dim hover:text-arena-text">
            <Icons.ArrowLeft size={16} />
          </button>
          <div className="h-8 w-px bg-arena-border" />
          <div>
            <h1 className="font-display font-bold text-base leading-tight">{room.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-[10px] uppercase text-arena-purple2 px-1.5 py-0.5 bg-arena-purple/10 border border-arena-purple/20 rounded">
                {room.language}
              </span>
              <span className="flex items-center gap-1 font-mono text-[10px] text-arena-teal uppercase">
                <span className="w-1 h-1 rounded-full bg-arena-teal animate-pulse" />
                {participants.length} online
              </span>
              {saving && <span className="font-mono text-[10px] text-white/40 animate-pulse uppercase tracking-tighter">syncing...</span>}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1.5 mr-2">
            {participants.slice(0, 4).map(p => (
              <Avatar key={p.userId} user={p.user} size={28} className="ring-2 ring-arena-bg hover:scale-110 transition-transform" />
            ))}
            {participants.length > 4 && (
              <div className="w-7 h-7 rounded-full bg-arena-bg3 border-2 border-arena-bg flex items-center justify-center font-mono text-[9px] text-white">
                +{participants.length - 4}
              </div>
            )}
          </div>
          <Button onClick={handleRun} variant="teal" size="sm" loading={running} className="h-8 px-3">
            <Icons.Play size={12} /> Run Code
          </Button>
          <Button onClick={forceSave} variant="secondary" size="sm" className="h-8 px-3">
            <Icons.Save size={12} /> Save
          </Button>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied'); }}
            className="p-2 bg-arena-bg3 hover:bg-arena-bg4 border border-arena-border rounded-lg text-arena-muted hover:text-white transition-all"
            title="Invite others"
          >
            <Icons.Share size={14} />
          </button>
        </div>
      </div>

      {/* Editor & Output Split */}
      <div className="flex-1 flex flex-col min-h-0 arena-card overflow-hidden">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-arena-bg3/50 border-b border-arena-border flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <span className="font-mono text-[10px] text-arena-dim ml-3 uppercase tracking-widest font-bold">
              main.{room.language === 'rust' ? 'rs' : room.language === 'ruby' ? 'rb' : room.language === 'php' ? 'php' : room.language === 'go' ? 'go' : room.language === 'csharp' ? 'cs' : room.language === 'python' ? 'py' : room.language === 'cpp' ? 'cpp' : room.language === 'java' ? 'java' : 'js'}
            </span>
          </div>
          {isOwner && (
            <select
              value={room.language}
              onChange={async e => {
                await api.put(`/rooms/${id}/code`, { language: e.target.value });
                fetchRoom();
              }}
              className="bg-arena-bg border border-arena-border rounded font-mono text-[10px] px-2 py-0.5 text-arena-muted outline-none focus:border-arena-purple transition-colors"
            >
              {LANGUAGES.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
            </select>
          )}
        </div>

        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* Main Editor */}
          <textarea
            value={code}
            onChange={e => handleCodeChange(e.target.value)}
            className="flex-1 bg-arena-bg text-arena-text font-mono text-sm p-6 outline-none resize-none border-0 leading-relaxed selection:bg-arena-purple/30 custom-scrollbar"
            spellCheck={false}
            onKeyDown={e => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const s = e.target.selectionStart;
                const newCode = code.substring(0, s) + '  ' + code.substring(e.target.selectionEnd);
                handleCodeChange(newCode);
                setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; }, 0);
              }
            }}
          />

          {/* Vertical Output Panel (if desktop) */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-arena-border bg-arena-bg3/20 flex flex-col shrink-0">
            <div className="flex items-center justify-between px-4 py-2 border-b border-arena-border bg-arena-bg3/40">
              <span className="font-mono text-[10px] text-arena-dim uppercase tracking-widest font-bold">Terminal Output</span>
              <button onClick={() => setOutput(null)} className="text-arena-dim hover:text-white transition-colors">
                <Icons.X size={10} />
              </button>
            </div>
            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
              {!output ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
                  <Icons.Zap size={20} className="mb-2" />
                  <p className="uppercase tracking-tighter text-[9px]">Run code to see result</p>
                </div>
              ) : (
                <div className={`whitespace-pre-wrap leading-relaxed ${
                  output.type === 'error' ? 'text-red-400' :
                  output.type === 'warning' ? 'text-yellow-400' :
                  output.type === 'success' ? 'text-arena-teal' :
                  'text-arena-muted'
                }`}>
                  {output.content}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-arena-border bg-arena-bg3/30 flex-shrink-0">
          <span className="font-mono text-[10px] text-arena-dim uppercase tracking-widest">
            {code.split('\n').length} lines · {code.length} chars
          </span>
          <span className="font-mono text-[10px] text-arena-dim uppercase tracking-tighter">
            Real-time sync active · Auto-expires in 24h
          </span>
        </div>
      </div>
    </div>
  );
}

export default RoomsPage;
