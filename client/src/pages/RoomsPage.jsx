import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button, BadgeTag, Avatar, Spinner, Modal, Input } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const LANGUAGES = ['javascript', 'typescript', 'python', 'cpp', 'java'];

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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl mb-1">Code Rooms</h1>
          <p className="font-mono text-xs text-slate-500">// collaborative real-time coding · up to 4 devs · auto-expire 24h</p>
        </div>
        <Button onClick={() => setCreate(true)} variant="primary">
          <Icons.Plus size={14} /> Create Room
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size={24} className="text-blue-700" /></div>
      ) : rooms.length === 0 ? (
        <div className="sf-card p-16 text-center">
          <Icons.Users size={32} className="text-slate-500 mx-auto mb-4" />
          <p className="font-display font-bold mb-2">No public rooms</p>
          <p className="font-mono text-xs text-slate-500 mb-6">Be the first to create a collaborative code room</p>
          <Button onClick={() => setCreate(true)} variant="primary">
            <Icons.Plus size={14} /> Create First Room
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map(room => (
            <div key={room.id} className="sf-card p-5 hover:-translate-y-0.5 transition-transform">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display font-bold text-sm mb-1">{room.name}</h3>
                  <div className="flex items-center gap-2">
                    <BadgeTag variant="gray">{room.language}</BadgeTag>
                    <span className="font-mono text-xs text-slate-500">
                      {room._count?.participants || 0}/{room.maxUsers} devs
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-slate-200 flex items-center justify-center">
                  <Icons.Code size={13} className="text-blue-700" />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Avatar user={room.owner} size={20} />
                <span className="font-mono text-xs text-slate-500">{room.owner?.username}</span>
                <span className="font-mono text-xs text-slate-500 ml-auto">
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
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Language</label>
            <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-blue-500 transition-all text-sm" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <Input label="Max Participants" type="number" min={2} max={6} value={form.maxUsers}
            onChange={e => setForm({ ...form, maxUsers: Number(e.target.value) })} />
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setForm({ ...form, isPublic: !form.isPublic })}
              className={`w-4 h-4 rounded border flex items-center justify-center ${form.isPublic ? 'bg-blue-600 border-blue-600' : 'border-slate-200'}`}>
              {form.isPublic && <Icons.Check size={10} className="text-white" />}
            </div>
            <span className="font-mono text-xs text-slate-600">Public room (visible to everyone)</span>
          </label>
          <div className="flex gap-3">
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
  const saveRef = useRef(null);
  const pollRef = useRef(null);

  const fetchRoom = useCallback(async () => {
    try {
      const r = await api.get(`/rooms/${id}`);
      setRoom(r.data.room);
      // Only sync code if we're not currently typing (throttle)
      setCode(prev => prev !== r.data.room.code ? r.data.room.code : prev);
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
    // Debounce save
    clearTimeout(saveRef.current);
    saveRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        await api.put(`/rooms/${id}/code`, { code: newCode });
      } catch (_) {}
      setSaving(false);
    }, 800);
  };

  if (loading) return (
    <div className="flex justify-center py-24"><Spinner size={24} className="text-blue-700" /></div>
  );
  if (!room) return (
    <div className="text-center py-24">
      <p className="font-mono text-sm text-slate-500">Room not found or expired</p>
      <Button onClick={() => navigate('/rooms')} variant="secondary" className="mt-4">Back to Rooms</Button>
    </div>
  );

  const participants = room.participants || [];
  const isOwner = room.ownerId === user?.id;

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/rooms')} className="text-slate-500 hover:text-slate-900 transition-colors">
            <Icons.ArrowLeft size={15} />
          </button>
          <div>
            <h1 className="font-display font-bold text-base">{room.name}</h1>
            <div className="flex items-center gap-2">
              <BadgeTag variant="gray">{room.language}</BadgeTag>
              <span className="flex items-center gap-1 font-mono text-xs text-indigo-600">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                {participants.length} online
              </span>
              {saving && <span className="font-mono text-xs text-slate-500">saving...</span>}
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {participants.slice(0, 4).map(p => (
              <Avatar key={p.userId} user={p.user} size={28} className="ring-2 ring-sf-bg" />
            ))}
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Room link copied'); }}
            className="btn-secondary text-xs px-3 py-1.5"
          >
            <Icons.Copy size={12} /> Share
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 sf-card overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <span className="font-mono text-xs text-slate-500 ml-2">
              main.{room.language === 'python' ? 'py' : room.language === 'cpp' ? 'cpp' : room.language === 'java' ? 'java' : 'js'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-500">{room.language}</span>
            {isOwner && (
              <select
                value={room.language}
                onChange={async e => {
                  await api.put(`/rooms/${id}/code`, { language: e.target.value });
                  fetchRoom();
                }}
                className="bg-slate-100 border border-slate-200 rounded font-mono text-xs px-2 py-1 text-slate-600"
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            )}
          </div>
        </div>

        <textarea
          value={code}
          onChange={e => handleCodeChange(e.target.value)}
          className="flex-1 bg-slate-50 text-slate-900 font-mono text-sm p-4 outline-none resize-none border-0 leading-relaxed"
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

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 flex-shrink-0">
          <span className="font-mono text-xs text-slate-500">
            {code.split('\n').length} lines · {code.length} chars
          </span>
          <span className="font-mono text-xs text-slate-500">
            Syncs every 3s · Expires {room.expiresAt ? formatDistanceToNow(new Date(room.expiresAt), { addSuffix: true }) : 'never'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default RoomsPage;
