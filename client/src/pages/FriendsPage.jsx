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

  const fetchFriends = async () => {
    try {
      const r = await api.get('/social/friends');
      setFriends(r.data.friends || []);
    } catch {
      toast.error("Failed to sync connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFriends(); }, []);

  useEffect(() => {
    if (selected) {
      const fetchMessages = () => {
        api.get(`/social/messages/${selected.id}`).then(r => {
          setMessages(r.data.messages || []);
        }).catch(() => {});
      };
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selected]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selected || sending) return;
    setSending(true);
    try {
      const r = await api.post('/social/messages', {
        receiverId: selected.id,
        content: messageInput
      });
      setMessages(prev => [...prev, r.data.message]);
      setMessageInput('');
    } catch (err) {
      toast.error("Packet transmission failed");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="flex justify-center p-32"><Spinner size={24} className="text-slate-300" /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-24 pt-10 px-6 space-y-10 h-[calc(100vh-140px)] flex flex-col">
      
      {/* ── HEADER ── */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-8 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Icons.MessageSquare size={20} className="text-blue-600" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Secure Communication</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Direct Messaging</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Encrypted peer-to-peer exchanges.</p>
        </div>
        <div className="text-right">
            <div className="text-2xl font-black text-slate-900">{friends.length}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Active Links</div>
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden min-h-0">
        
        {/* Friends Sidebar */}
        <div className="w-80 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {friends.length === 0 ? (
            <div className="p-8 sf-card border-dashed text-center">
               <p className="text-xs text-slate-400 font-medium italic">No active connections found. Seed the collective in Community.</p>
            </div>
          ) : friends.map(f => (
            <button 
              key={f.id} 
              onClick={() => setSelected(f)}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all border text-left ${
                selected?.id === f.id 
                  ? 'bg-white border-blue-400 shadow-md translate-x-1' 
                  : 'bg-white border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="relative">
                <Avatar user={f} size={40} className="rounded-full bg-slate-100" />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${f.lastActiveAt && (new Date() - new Date(f.lastActiveAt)) < 300000 ? 'bg-green-500' : 'bg-slate-300'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 text-sm truncate uppercase tracking-tight">{f.username}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-0.5">LVL {f.level} Architect</p>
              </div>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col sf-card overflow-hidden bg-slate-50/30">
          {selected ? (
            <>
              <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <Avatar user={selected} size={32} />
                   <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{selected.username}</p>
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-0.5">Protocol Linked</p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:text-slate-900 transition-colors"><Icons.HelpCircle size={14} /></button>
                </div>
              </div>
              
              <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-5 custom-scrollbar">
                 {messages.length === 0 ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-3">
                      <Icons.Terminal size={32} />
                      <p className="text-xs font-mono font-bold uppercase tracking-widest">Awaiting local handshake...</p>
                   </div>
                 ) : messages.map(m => (
                   <div 
                      key={m.id} 
                      className={`max-w-[70%] p-4 rounded-2xl text-[13px] leading-relaxed relative ${
                        m.senderId === selected.id 
                          ? 'bg-white border border-slate-100 text-slate-700 self-start shadow-sm' 
                          : 'bg-slate-900 text-white self-end shadow-lg shadow-slate-200'
                      }`}
                    >
                      {m.content}
                   </div>
                 ))}
              </div>

              <div className="p-6 bg-white border-t border-slate-100">
                 <div className="flex items-center gap-4 bg-slate-50 rounded-xl px-4 py-2 border border-slate-100 focus-within:border-blue-400 transition-colors">
                    <input 
                      type="text" 
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Input communication packet..." 
                      className="flex-1 bg-transparent border-none outline-none py-2 text-sm text-slate-900 placeholder:text-slate-400"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={sending || !messageInput.trim()}
                      className="text-blue-600 hover:text-blue-700 disabled:opacity-30 transition-colors"
                    >
                      <Icons.ArrowRight size={20} />
                    </button>
                 </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                <Icons.MessageSquare size={24} className="text-slate-300" />
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">No Active Handshake</h3>
                <p className="text-xs text-slate-400 max-w-[200px] font-medium leading-relaxed">Select a verified architect from the left segment to initialize an encrypted link.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
