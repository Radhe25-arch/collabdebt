import { useState, useEffect } from 'react';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { Avatar, Spinner } from '@/components/ui';
import { toast } from 'react-hot-toast';
 
export default function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
 
  useEffect(() => {
    api.get('/social/friends')
      .then(r => setFriends(r.data.friends || []))
      .catch(() => toast.error('Failed to load friends'))
      .finally(() => setLoading(false));
  }, []);
 
  const isOnline = (friend) => {
    if (!friend.lastActiveAt) return false;
    return (new Date() - new Date(friend.lastActiveAt)) < 5 * 60 * 1000;
  };
 
  if (loading) return <div className="flex justify-center p-20"><Spinner /></div>;
 
  return (
    <div className="flex h-[calc(100vh-160px)] gap-5 animate-fade-in">
 
      {/* ─── Friends List ─── */}
      <div className="w-72 bg-white border border-slate-200 rounded-3xl flex flex-col overflow-hidden shrink-0">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-display font-bold text-slate-900">Friends</h2>
          <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            {friends.length}
          </span>
        </div>
 
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {friends.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
              <Icons.Users size={28} className="text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-500">No friends yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Visit the Community to connect with others.
              </p>
            </div>
          ) : (
            friends.map(f => (
              <button
                key={f.id}
                onClick={() => setSelected(f)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  selected?.id === f.id
                    ? 'bg-blue-50 border border-blue-100'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="relative shrink-0">
                  <Avatar user={f} size={40} />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    isOnline(f) ? 'bg-emerald-500' : 'bg-slate-300'
                  }`} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate text-sm leading-tight">{f.username}</p>
                  <p className="text-[10px] font-semibold mt-0.5">
                    {isOnline(f)
                      ? <span className="text-emerald-500">● Online</span>
                      : <span className="text-slate-400">{(f.xp || 0).toLocaleString()} XP</span>
                    }
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
 
      {/* ─── Chat / Coming Soon Area ─── */}
      <div className="flex-1 bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col">
        {selected ? (
          <>
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center gap-3 shrink-0">
              <div className="relative">
                <Avatar user={selected} size={40} />
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                  isOnline(selected) ? 'bg-emerald-500' : 'bg-slate-300'
                }`} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{selected.username}</h3>
                <p className="text-xs text-slate-400">{isOnline(selected) ? 'Active now' : 'Away'}</p>
              </div>
            </div>
 
            {/* Coming soon body */}
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
                <Icons.MessageSquare size={26} className="text-blue-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                Messaging Coming Soon
              </h3>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                Direct messaging with{' '}
                <strong className="text-slate-700">{selected.username}</strong>{' '}
                will be available in the next update. Stay tuned!
              </p>
              <div className="mt-6 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3">
                <Icons.Zap size={14} className="text-blue-500" />
                <span className="text-xs font-semibold text-blue-600">Feature launching soon</span>
              </div>
            </div>
 
            {/* Disabled input */}
            <div className="p-5 border-t border-slate-100 flex items-center gap-3 shrink-0">
              <input
                type="text"
                placeholder="Messaging coming soon..."
                disabled
                className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-400 border border-slate-200 cursor-not-allowed"
              />
              <button
                disabled
                className="bg-slate-100 text-slate-400 p-2.5 rounded-xl cursor-not-allowed"
              >
                <Icons.Zap size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-5">
              <Icons.MessageSquare size={30} className="text-slate-300" />
            </div>
            <h2 className="font-display font-bold text-xl text-slate-900 mb-2">
              {friends.length > 0 ? 'Select a Friend' : 'No Friends Yet'}
            </h2>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              {friends.length > 0
                ? 'Choose a friend from the list to start a conversation.'
                : 'Add friends from the Community page to connect with them here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
