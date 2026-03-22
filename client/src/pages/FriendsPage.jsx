import { useState, useEffect } from 'react';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { Avatar, Spinner } from '@/components/ui';
import { toast } from 'react-hot-toast';

export default function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [accepting, setAccepting] = useState({});

  const fetchAll = async () => {
    try {
      const [fRes, rRes] = await Promise.all([
        api.get('/social/friends'),
        api.get('/social/friend-requests'),
      ]);
      setFriends(fRes.data.friends || []);
      setRequests(rRes.data.requests || []);
    } catch {
      toast.error('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const isOnline = (f) => {
    if (!f.lastActiveAt) return false;
    return (new Date() - new Date(f.lastActiveAt)) < 5 * 60 * 1000;
  };

  const handleAccept = async (req) => {
    try {
      setAccepting(prev => ({ ...prev, [req.id]: true }));
      await api.post(`/social/friend-accept/${req.id}`);
      toast.success(`You and ${req.sender?.username || 'this user'} are now friends!`);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept');
    } finally {
      setAccepting(prev => ({ ...prev, [req.id]: false }));
    }
  };

  const handleDecline = async (req) => {
    try {
      await api.delete(`/social/friend-request/${req.id}`).catch(() => {});
      setRequests(prev => prev.filter(r => r.id !== req.id));
      toast.success('Request declined');
    } catch {
      setRequests(prev => prev.filter(r => r.id !== req.id));
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Spinner /></div>;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">

      {/* ── PENDING REQUESTS banner ── */}
      {requests.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Icons.UserPlus size={16} className="text-blue-600" />
            <h3 className="font-semibold text-slate-900 text-sm">
              Pending Requests <span className="ml-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{requests.length}</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {requests.map(req => {
              const sender = req.sender || {};
              return (
                <div key={req.id} className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                  <Avatar user={sender} size={40} className="rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">
                      {sender.username || 'Someone'}
                    </p>
                    <p className="text-xs text-slate-400">{(sender.xp || 0).toLocaleString()} XP</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleAccept(req)}
                      disabled={!!accepting[req.id]}
                      className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      {accepting[req.id] ? <Spinner size={10} /> : <Icons.Check size={14} />}
                    </button>
                    <button
                      onClick={() => handleDecline(req)}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                    >
                      <Icons.X size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MAIN FRIENDS LAYOUT ── */}
      <div className="flex gap-5" style={{ height: 'calc(100vh - 280px)', minHeight: 400 }}>

        {/* Friends List */}
        <div className="w-72 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm flex-shrink-0">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-display font-bold text-slate-900 text-base">Friends</h2>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {friends.length} Total
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {friends.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8 px-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <Icons.Users size={20} className="text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-500">No friends yet</p>
                <p className="text-xs text-slate-400 mt-1">Go to Community to find people</p>
              </div>
            ) : friends.map(f => (
              <button
                key={f.id}
                onClick={() => setSelected(f)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  selected?.id === f.id
                    ? 'bg-blue-50 border border-blue-100'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar user={f} size={38} className="rounded-xl" />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isOnline(f) ? 'bg-green-500' : 'bg-slate-300'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{f.username}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {isOnline(f) ? (
                      <span className="text-green-500">● Active now</span>
                    ) : (
                      `${(f.xp || 0).toLocaleString()} XP`
                    )}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat / Empty state */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm">
          {selected ? (
            <>
              {/* Chat header */}
              <div className="p-5 border-b border-slate-100 flex items-center gap-3 flex-shrink-0">
                <div className="relative">
                  <Avatar user={selected} size={40} className="rounded-xl" />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isOnline(selected) ? 'bg-green-500' : 'bg-slate-300'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{selected.username}</h3>
                  <p className="text-xs text-slate-400">{isOnline(selected) ? 'Active now' : 'Offline'}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Icons.MessageSquare size={22} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">No messages yet</p>
                  <p className="text-xs text-slate-400">Say hi to {selected.username}!</p>
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-100 flex items-center gap-3 flex-shrink-0">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={`Message ${selected.username}...`}
                  className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
                  onKeyDown={e => { if (e.key === 'Enter' && message.trim()) { toast('Messaging coming soon!'); setMessage(''); } }}
                />
                <button
                  onClick={() => { if (message.trim()) { toast('Messaging coming soon!'); setMessage(''); } }}
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Icons.ArrowRight size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Icons.MessageSquare size={28} className="text-slate-300" />
              </div>
              <h2 className="font-display font-bold text-lg text-slate-900 mb-2">Select a Friend</h2>
              <p className="text-slate-400 text-sm max-w-xs">Click on a friend from the list to start a private conversation.</p>
              {friends.length === 0 && (
                <a href="/community" className="mt-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                  Find Friends in Community
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
