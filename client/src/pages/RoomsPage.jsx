import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Avatar, BadgeTag, Modal, Spinner } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function RoomsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [rooms, setRooms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [roomName, setRoomName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api.get('/rooms').then((r) => setRooms(r.data.rooms || [])).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!roomName.trim()) return;
    setCreating(true);
    try {
      const r = await api.post('/rooms', { name: roomName });
      toast.success('Room created successfully');
      setModal(false);
      navigate(`/rooms/${r.data.room.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not create room');
    }
    setCreating(false);
  };

  const handleJoin = async (id) => {
    navigate(`/rooms/${id}`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20 font-sans animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-slate-200 pb-6 pt-4">
        <div>
          <span className="bg-indigo-100 text-indigo-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block shadow-sm">
            MULTIPLAYER
          </span>
          <h1 className="font-display font-black text-4xl text-slate-900 mb-2 tracking-tight">Code Rooms</h1>
          <p className="text-lg text-slate-600 max-w-xl">Collaborate in real-time, pair program, and solve challenges together.</p>
        </div>
        <button onClick={() => setModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2">
          <Icons.Plus size={16} /> New Room
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" /></div>
      ) : rooms.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-20 text-center">
          <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-6">
            <Icons.Monitor size={32} className="text-slate-300" />
          </div>
          <h3 className="font-display font-black text-2xl text-slate-900 mb-2">No Active Rooms</h3>
          <p className="text-slate-500 text-lg max-w-sm mx-auto mb-8">Start a collaborative session and invite your team to code together.</p>
          <button onClick={() => setModal(true)} className="bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-700 shadow-sm transition-colors">
            Create First Room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((r) => (
            <div key={r.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer flex flex-col" onClick={() => handleJoin(r.id)}>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Icons.Code size={20} />
                </div>
                <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                </span>
              </div>
              
              <h3 className="font-display font-black text-xl text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors truncate">
                {r.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-6 text-sm font-semibold text-slate-500 uppercase tracking-widest">
                <Icons.Users size={14} className="text-slate-400" /> {r._count?.members || 1} Developer{r._count?.members !== 1 ? 's' : ''}
              </div>
              
              <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar user={r.host} size={28} className="shadow-sm border border-slate-200" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Host</span>
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[100px] block">{r.host?.username}</span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Icons.ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Create Code Room">
        <div className="space-y-6">
          <p className="text-sm text-slate-600">Give your collaborative coding room a name. You can invite others via a link once it's created.</p>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Room Name</label>
            <input
              type="text"
              placeholder="e.g. React Debugging Session"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
            />
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setModal(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm">Cancel</button>
            <button onClick={handleCreate} disabled={creating} className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors text-sm flex items-center justify-center gap-2">
              <Icons.Plus size={16} /> <span>{creating ? 'Creating...' : 'Launch Room'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
