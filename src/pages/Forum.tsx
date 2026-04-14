import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp, Eye, Clock, Plus, Flame, Sparkles } from 'lucide-react';

const DISCUSSIONS = [
  { id: 1, title: "Best practices for structuring a large Go monorepo?", author: "@gopher_king", replies: 42, views: "1.2k", likes: 156, tags: ["Go", "Architecture"], time: "2h ago", hot: true },
  { id: 2, title: "Understanding the borrow checker in complex lifetimes", author: "@rustacean", replies: 18, views: "850", likes: 94, tags: ["Rust", "Help"], time: "5h ago", hot: false },
  { id: 3, title: "Showcase: I built a distributed KV store in Zig", author: "@zig_zag", replies: 64, views: "3.4k", likes: 420, tags: ["Zig", "Systems", "Showcase"], time: "1d ago", hot: true },
  { id: 4, title: "Why is my React app re-rendering infinitely here?", author: "@frontend_dev", replies: 5, views: "120", likes: 12, tags: ["React", "Help"], time: "1d ago", hot: false },
  { id: 5, title: "Evaluating PostgreSQL vs MySQL for high-write workloads", author: "@db_admin", replies: 112, views: "5.5k", likes: 310, tags: ["Database", "Architecture"], time: "2d ago", hot: false },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
};

export function Forum() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <MessageSquare className="text-indigo-500" size={32} /> Knowledge Base
          </h1>
          <p className="text-zinc-500 mt-2 font-mono text-sm tracking-wide">Discuss architecture, share solutions, and get help from the community.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-5 py-2.5 font-mono font-bold text-sm transition-colors whitespace-nowrap shadow-[0_0_20px_rgba(79,70,229,0.3)]">
          <Plus size={16} /> New Thread
        </button>
      </div>

      <div className="flex items-center gap-4 border-b border-zinc-800 pb-px overflow-x-auto scrollbar-hide">
        {["Trending", "Latest", "Unanswered", "Showcase", "Architecture"].map((tab, i) => (
          <button 
            key={tab}
            className={`px-4 py-3 text-sm font-mono font-medium transition-colors border-b-2 whitespace-nowrap ${
              i === 0 
                ? 'border-indigo-500 text-white' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {DISCUSSIONS.map((post) => (
          <motion.div 
            key={post.id}
            variants={itemVariants}
            className="group block p-5 rounded-2xl border border-zinc-800 bg-zinc-950/30 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300 cursor-pointer"
          >
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  {post.hot && (
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30 font-mono text-[10px] px-1.5 flex items-center gap-1">
                      <Flame size={10} className="fill-current" /> Hot
                    </Badge>
                  )}
                  <h3 className="text-lg font-medium text-white group-hover:text-indigo-400 transition-colors truncate">
                    {post.title}
                  </h3>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-500">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} alt="Avatar" className="w-5 h-5 rounded-full bg-zinc-800" />
                    {post.author}
                  </span>
                  <span className="text-zinc-700">•</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {post.time}</span>
                  <span className="text-zinc-700 hidden sm:inline">•</span>
                  <div className="flex gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-black border border-zinc-800 text-zinc-400 uppercase tracking-widest text-[9px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-xs font-mono text-zinc-500 shrink-0 mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-800/50 w-full md:w-auto">
                <div className="flex items-center gap-1.5 group-hover:text-white transition-colors">
                  <ThumbsUp size={14} className="text-zinc-600 group-hover:text-indigo-400 transition-colors" /> {post.likes}
                </div>
                <div className="flex items-center gap-1.5 group-hover:text-white transition-colors">
                  <MessageSquare size={14} className="text-zinc-600 group-hover:text-indigo-400 transition-colors" /> {post.replies}
                </div>
                <div className="flex items-center gap-1.5 group-hover:text-white transition-colors">
                  <Eye size={14} className="text-zinc-600 group-hover:text-indigo-400 transition-colors" /> {post.views}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="pt-8 text-center">
        <button className="text-sm font-mono text-zinc-500 hover:text-white transition-colors flex items-center gap-2 mx-auto">
          <Sparkles size={16} /> Load more discussions
        </button>
      </div>
    </div>
  );
}
