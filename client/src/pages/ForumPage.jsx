import React, { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui';
import { MessageSquare, Clock, Check, Plus, Hash } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store';

export default function ForumPage() {
  const { user } = useAuthStore();
  const [threads, setThreads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Latest');
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/forum/threads'),
      api.get('/forum/categories')
    ])
      .then(([t, c]) => {
        setThreads(t.data.threads || []);
        setCategories(c.data.categories || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredThreads = threads.filter(t =>
    !activeCategory || t.category?.id === activeCategory
  );

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={20} className="text-cyber" />
        <span className="font-mono text-[10px] text-[#444] uppercase tracking-[0.2em]">LOADING THREADS...</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-6 pb-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-[4px] border border-cyber/30 flex items-center justify-center">
              <MessageSquare size={13} strokeWidth={1.5} className="text-cyber" />
            </div>
            <span className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.25em]">COMMUNITY</span>
          </div>
          <h1 className="font-black text-2xl text-white tracking-tight uppercase">KNOWLEDGE HUB</h1>
          <p className="font-mono text-[11px] text-[#555] mt-1">// STRUCTURED DISCUSSIONS FOR THE TECHNICAL COMMUNITY</p>
        </div>
        <button className="btn-primary text-[10px] whitespace-nowrap">
          <Plus size={13} strokeWidth={1.5} /> NEW DISCUSSION
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="blade overflow-hidden">
            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="font-mono text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">CATEGORIES</h3>
            </div>
            <div className="p-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[4px] transition-all duration-150 group mb-1 ${
                  !activeCategory
                    ? 'bg-cyber/[0.08] border border-cyber/20'
                    : 'hover:bg-white/[0.02] border border-transparent'
                }`}
              >
                <span className={`font-mono text-[11px] font-bold ${!activeCategory ? 'text-cyber' : 'text-[#666] group-hover:text-white'} uppercase tracking-wider`}>
                  ALL CHANNELS
                </span>
                <span className="font-mono text-[9px] font-bold text-[#444]">{threads.length}</span>
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[4px] transition-all duration-150 group mb-1 ${
                    activeCategory === c.id
                      ? 'bg-cyber/[0.08] border border-cyber/20'
                      : 'hover:bg-white/[0.02] border border-transparent'
                  }`}
                >
                  <span className={`font-mono text-[11px] font-bold flex items-center gap-2 ${activeCategory === c.id ? 'text-cyber' : 'text-[#666] group-hover:text-white'} uppercase tracking-wider`}>
                    <Hash size={10} strokeWidth={1.5} className="flex-shrink-0" />
                    {c.name}
                  </span>
                  <span className="font-mono text-[9px] font-bold text-[#444]">{c._count?.threads || 0}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Thread List */}
        <div className="lg:col-span-3">
          {/* Tab Bar */}
          <div
            className="flex items-center gap-0 mb-5 border-b border-white/[0.06]"
          >
            {['Latest', 'Most Answered', 'Solved'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-mono text-[10px] font-black uppercase tracking-[0.1em] px-4 py-2.5 transition-all duration-150 border-b-2 ${
                  activeTab === tab
                    ? 'text-cyber border-cyber'
                    : 'text-[#555] border-transparent hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredThreads.length === 0 ? (
              <div
                className="text-center py-20 rounded-[4px] border border-dashed border-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.01)' }}
              >
                <MessageSquare size={24} strokeWidth={1} className="text-[#222] mx-auto mb-3" />
                <p className="font-mono text-[11px] text-[#444] uppercase tracking-[0.15em]">NO DISCUSSIONS YET</p>
              </div>
            ) : filteredThreads.map((thread, idx) => (
              <div
                key={thread.id}
                className="blade p-5 hover:border-white/20 transition-all duration-150 cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`font-mono text-[9px] font-black px-2 py-0.5 rounded-[2px] uppercase tracking-wider border ${
                        thread.isSolved
                          ? 'text-emerald border-emerald/20 bg-emerald/[0.06]'
                          : 'text-[#555] border-white/[0.06] bg-white/[0.02]'
                      }`}>
                        {thread.isSolved ? 'SOLVED' : 'OPEN'}
                      </span>
                      {thread.category?.name && (
                        <span className="font-mono text-[9px] font-bold text-[#444] flex items-center gap-1 uppercase tracking-wider">
                          <Hash size={8} strokeWidth={2} /> {thread.category.name}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-white group-hover:text-cyber transition-colors duration-150 mb-1 leading-tight">
                      {thread.title}
                    </h3>
                    <p className="text-sm text-[#555] line-clamp-2 leading-relaxed">
                      {thread.content.substring(0, 160)}...
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-3 font-mono text-[10px] text-[#444] uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare size={10} strokeWidth={1.5} />
                        {thread._count?.comments || 0}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={10} strokeWidth={1.5} />
                        {new Date(thread.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
