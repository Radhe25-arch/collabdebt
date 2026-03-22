import { useState, useEffect, useRef, useCallback } from 'react';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { Avatar, Spinner } from '@/components/ui';
import { useAuthStore } from '@/store';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
 
// ─── Local message store (persists across sessions per user pair) ────────────
const STORAGE_KEY = 'codearena_messages_v1';
 
function loadMessages(myId, friendId) {
  try {
    const key = [myId, friendId].sort().join('_');
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return all[key] || [];
  } catch { return []; }
}
 
function saveMessages(myId, friendId, msgs) {
  try {
    const key = [myId, friendId].sort().join('_');
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    all[key] = msgs.slice(-200); // keep last 200
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {}
}
 
// ─── Chat Window ─────────────────────────────────────────────
function ChatWindow({ friend, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);
 
  // Load messages when friend changes
  useEffect(() => {
    if (!friend || !currentUser) return;
    const msgs = loadMessages(currentUser.id, friend.id);
    setMessages(msgs);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    inputRef.current?.focus();
  }, [friend?.id, currentUser?.id]);
 
  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
 
  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || !friend || !currentUser) return;
 
    const newMsg = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text,
      timestamp: new Date().toISOString(),
    };
 
    const updated = [...messages, newMsg];
    setMessages(updated);
    saveMessages(currentUser.id, friend.id, updated);
    setInput('');
 
    // Simulate a reply after a short delay (demo mode)
    const replies = [
      'Hey! That sounds great 👋',
      'Sure, let me check that out!',
      'Nice one! Let\'s code together sometime.',
      'Interesting! Tell me more.',
      'I\'m working on a new project too 🚀',
      'Let\'s battle on the arena sometime!',
      'Cool! How\'s your progress going?',
    ];
    const delay = 1500 + Math.random() * 2000;
    setTimeout(() => {
      const replyMsg = {
        id: (Date.now() + 1).toString(),
        senderId: friend.id,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toISOString(),
      };
      const withReply = [...updated, replyMsg];
      setMessages(withReply);
      saveMessages(currentUser.id, friend.id, withReply);
    }, delay);
  }, [input, messages, friend, currentUser]);
 
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
 
  const isOnline = (f) => {
    if (!f?.lastActiveAt) return false;
    return (new Date() - new Date(f.lastActiveAt)) < 5 * 60 * 1000;
  };
 
  const online = isOnline(friend);
 
  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl md:rounded-3xl border border-slate-200 overflow-hidden min-h-0">
      {/* Chat Header */}
      <div className="p-4 md:p-5 border-b border-slate-100 flex items-center gap-3 flex-shrink-0">
        <div className="relative">
          <Avatar user={friend} size={40} />
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 leading-tight">{friend.username}</h3>
          <p className={`text-xs font-medium ${online ? 'text-emerald-600' : 'text-slate-400'}`}>
            {online ? 'Active now' : 'Offline'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 font-bold">
          <Icons.Zap size={12} className="text-amber-500" />
          {friend.xp?.toLocaleString() || 0} XP
        </div>
      </div>
 
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-3 min-h-0 bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Icons.MessageSquare size={24} className="text-slate-300" />
            </div>
            <p className="font-semibold text-slate-600 mb-1">Start a conversation</p>
            <p className="text-sm text-slate-400">Say hi to <strong>{friend.username}</strong>!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && (
                  <div className="flex-shrink-0 mb-0.5">
                    <Avatar user={friend} size={28} />
                  </div>
                )}
                <div className={`max-w-[75%] md:max-w-[65%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium px-1">
                    {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
 
      {/* Input */}
      <div className="p-3 md:p-4 border-t border-slate-100 flex items-end gap-2 flex-shrink-0 bg-white">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${friend.username}...`}
          rows={1}
          className="flex-1 bg-slate-100 rounded-xl px-4 py-2.5 outline-none border border-transparent focus:border-blue-300 focus:bg-white transition-all text-sm resize-none max-h-24 overflow-y-auto"
          style={{ minHeight: '40px' }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 hover:-translate-y-0.5 active:scale-95"
        >
          <Icons.ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
 
// ─── Main FriendsPage ─────────────────────────────────────────
export default function FriendsPage() {
  const { user: currentUser } = useAuthStore();
  const [friends, setFriends]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [showList, setShowList] = useState(true); // mobile: toggle list/chat
 
  useEffect(() => {
    api.get('/social/friends')
      .then(r => setFriends(r.data.friends || []))
      .catch(() => toast.error('Failed to load friends'))
      .finally(() => setLoading(false));
  }, []);
 
  const isOnline = (f) => {
    if (!f?.lastActiveAt) return false;
    return (new Date() - new Date(f.lastActiveAt)) < 5 * 60 * 1000;
  };
 
  const onlineCount = friends.filter(isOnline).length;
 
  const handleSelectFriend = (f) => {
    setSelected(f);
    setShowList(false); // on mobile, show chat
  };
 
  if (loading) return (
    <div className="flex justify-center p-20">
      <Spinner />
    </div>
  );
 
  return (
    <div className="animate-fade-in">
      {/* Mobile header when in chat view */}
      {!showList && selected && (
        <button
          onClick={() => setShowList(true)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-4 md:hidden"
        >
          <Icons.ChevronDown size={16} className="rotate-90" /> Back to friends
        </button>
      )}
 
      <div className="flex gap-4 md:gap-6" style={{ height: 'calc(100vh - 180px)', minHeight: '500px' }}>
 
        {/* ── Friends List ─────────────────────────────── */}
        <div className={`${showList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-72 lg:w-80 flex-shrink-0`}>
          <div className="bg-white border border-slate-200 rounded-2xl md:rounded-3xl flex flex-col overflow-hidden h-full">
            {/* Header */}
            <div className="p-4 md:p-5 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-bold text-slate-900">Messages</h2>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{onlineCount} online</span>
                </div>
              </div>
              <div className="text-xs text-slate-400 font-medium">{friends.length} friends total</div>
            </div>
 
            {/* Friends list */}
            <div className="flex-1 overflow-y-auto p-3">
              {friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <Icons.Users size={22} className="text-slate-300" />
                  </div>
                  <p className="font-semibold text-slate-600 text-sm mb-1">No friends yet</p>
                  <p className="text-xs text-slate-400">Find people on the community page</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {friends.map(f => {
                    const online = isOnline(f);
                    const isActive = selected?.id === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => handleSelectFriend(f)}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${
                          isActive ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <Avatar user={f} size={42} />
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold truncate leading-tight text-sm ${isActive ? 'text-blue-700' : 'text-slate-900'}`}>
                            {f.username}
                          </p>
                          <p className={`text-[11px] font-semibold ${online ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {online ? 'Active now' : 'Offline'}
                          </p>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 flex-shrink-0">
                          Lv.{f.level || 1}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
 
        {/* ── Chat Area ─────────────────────────────────── */}
        <div className={`${!showList || selected ? 'flex' : 'hidden md:flex'} flex-1 min-w-0`}>
          {selected ? (
            <ChatWindow friend={selected} currentUser={currentUser} />
          ) : (
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center text-center p-8 md:p-16">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center mb-5">
                <Icons.MessageSquare size={32} className="text-blue-400" />
              </div>
              <h2 className="font-display font-bold text-xl text-slate-900 mb-2">Your Messages</h2>
              <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
                Select a friend from the left to start chatting. Messages are private and instant.
              </p>
              {friends.length > 0 && (
                <button
                  onClick={() => handleSelectFriend(friends[0])}
                  className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Icons.MessageSquare size={16} /> Message {friends[0].username}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
