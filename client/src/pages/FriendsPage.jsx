import { useState, useEffect } from 'react';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { Avatar, Spinner } from '@/components/ui';

import { toast } from 'react-hot-toast';

export default function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get('/social/friends').then(r => {
      setFriends(r.data.friends || []);
    }).catch(() => {
      toast.error("Failed to load friends");
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selected) {
      fetchMessages(selected.id);
      const interval = setInterval(() => fetchMessages(selected.id), 5000);
      return () => clearInterval(interval);
    }
  }, [selected]);

  const fetchMessages = (friendId) => {
    api.get(`/social/messages/${friendId}`).then(r => {
      setMessages(r.data.messages || []);
    }).catch(() => {
      console.error("Failed to fetch messages");
    });
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selected || sending) return;
    setSending(true);
    try {
      const r = await api.post('/social/messages', {
        receiverId: selected.id,
        content: messageInput
      });
      setMessages([...messages, r.data.message]);
      setMessageInput('');
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const isOnline = (friend) => {
    if (!friend.lastActiveAt) return false;
    const lastSeen = new Date(friend.lastActiveAt);
    const now = new Date();
    return (now - lastSeen) < 5 * 60 * 1000; // 5 minutes window
  };

  if (loading) return <div className="flex justify-center p-20"><Spinner /></div>;

  return (
    <div className="flex h-[calc(100vh-160px)] gap-6 animate-fade-in">
      {/* Friends List */}
      <div className="w-80 bg-white border border-slate-200 rounded-3xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-display font-bold text-slate-900">Friends</h2>
          <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{friends.length} Total</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {friends.map(f => (
            <button 
              key={f.id} 
              onClick={() => setSelected(f)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                selected?.id === f.id ? 'bg-blue-50 border-blue-100' : 'hover:bg-slate-50'
              }`}
            >
              <div className="relative">
                <Avatar user={f} size={40} />
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isOnline(f) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate leading-tight">{f.username}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{f.xp.toLocaleString()} XP</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col items-center justify-center text-center p-20">
        {selected ? (
          <div className="w-full h-full flex flex-col">
             <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                <Avatar user={selected} size={40} />
                <div className="text-left">
                  <h3 className="font-bold text-slate-900">{selected.username}</h3>
                  <p className="text-xs text-slate-500">{selected.online ? 'Active now' : 'Away'}</p>
                </div>
             </div>
             <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-4">
                {messages.length === 0 ? (
                  <p className="text-slate-400 italic text-sm text-center">No previous messages with {selected.username}. Say hi!</p>
                ) : (
                  messages.map(m => (
                    <div 
                      key={m.id} 
                      className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        m.senderId === selected.id 
                          ? 'bg-slate-100 text-slate-700 self-start rounded-bl-sm' 
                          : 'bg-blue-600 text-white self-end rounded-br-sm'
                      }`}
                    >
                      {m.content}
                    </div>
                  ))
                )}
             </div>
             <div className="p-6 border-t border-slate-100 flex items-center gap-4">
                <input 
                  type="text" 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..." 
                  className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 outline-none border border-transparent focus:border-blue-300 transition-all text-sm"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={sending || !messageInput.trim()}
                  className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Icons.Zap size={18} />
                </button>
             </div>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
              <Icons.MessageSquare size={32} className="text-slate-300" />
            </div>
            <h2 className="font-display font-bold text-xl text-slate-900 mb-2">Select a Friend</h2>
            <p className="text-slate-500 max-w-xs mx-auto">Click on a friend from the list to start a private conversation.</p>
          </>
        )}
      </div>
    </div>
  );
}
