import React, { useState, useEffect } from 'react';
import { Button, Card, BadgeTag, Spinner, Input } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { useAuthStore } from '@/store';
import { motion } from 'framer-motion';

export default function ForumPage() {
  const { user } = useAuthStore();
  const [threads, setThreads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="flex justify-center py-24"><Spinner size={24} /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-black tracking-tight">Community Knowledge Hub</h1>
          <p className="text-muted-foreground font-mono text-xs mt-1">// structured discussions for the technical community</p>
        </div>
        <Button variant="primary">
          <Icons.Plus size={16} /> New Discussion
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="sf-card p-5">
            <h3 className="font-mono text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Categories</h3>
            <div className="space-y-1">
              {categories.map(c => (
                <button key={c.id} className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors group">
                  <span className="text-muted-foreground group-hover:text-foreground"># {c.name}</span>
                  <span className="text-[10px] font-mono text-muted-foreground/50">{c._count?.threads || 0}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-4 mb-6">
            {['Latest', 'Most Answered', 'Solved'].map(tab => (
              <button key={tab} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-1 py-1 border-b-2 border-transparent hover:border-primary">
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {threads.length === 0 ? (
              <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-dashed border-border font-mono text-sm text-muted-foreground">
                No discussions yet
              </div>
            ) : threads.map((thread, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={thread.id} 
                className="sf-card p-5 hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <BadgeTag variant={thread.isSolved ? 'teal' : 'gray'}>
                         {thread.isSolved ? 'Solved' : 'Open'}
                       </BadgeTag>
                       <span className="text-[10px] font-mono text-muted-foreground uppercase"># {thread.category?.name}</span>
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{thread.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{thread.content.substring(0, 150)}...</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                      <span className="flex items-center gap-1"><Icons.MessageSquare size={12} /> {thread._count?.comments || 0}</span>
                      <span className="flex items-center gap-1"><Icons.Clock size={12} /> {new Date(thread.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
