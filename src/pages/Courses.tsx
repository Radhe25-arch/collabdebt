import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, BookOpen, Clock, Star, Zap, ChevronRight, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_COURSES = [
  { id: 1, title: "Advanced Rust Concurrency", domain: "Systems", level: "Advanced", rating: 4.9, students: "12k", duration: "8h", tags: ["Rust", "Systems"], color: "from-orange-500/20 to-red-500/5", border: "border-orange-500/20", icon: <Code2 /> },
  { id: 2, title: "Microservices with Go", domain: "Architecture", level: "Intermediate", rating: 4.8, students: "8.5k", duration: "12h", tags: ["Go", "Backend"], color: "from-blue-500/20 to-cyan-500/5", border: "border-blue-500/20", icon: <Zap /> },
  { id: 3, title: "Functional Programming in Haskell", domain: "Paradigms", level: "Advanced", rating: 4.7, students: "3k", duration: "15h", tags: ["Haskell", "FP"], color: "from-purple-500/20 to-indigo-500/5", border: "border-purple-500/20", icon: <BookOpen /> },
  { id: 4, title: "Modern C++20 Features", domain: "Systems", level: "Intermediate", rating: 4.6, students: "15k", duration: "6h", tags: ["C++"], color: "from-indigo-500/20 to-blue-500/5", border: "border-indigo-500/20", icon: <Code2 /> },
  { id: 5, title: "Distributed Systems Design", domain: "Architecture", level: "Expert", rating: 4.9, students: "22k", duration: "20h", tags: ["System Design"], color: "from-green-500/20 to-emerald-500/5", border: "border-green-500/20", icon: <Zap /> },
  { id: 6, title: "WebAssembly with Zig", domain: "Web", level: "Intermediate", rating: 4.8, students: "4k", duration: "5h", tags: ["Zig", "WASM"], color: "from-yellow-500/20 to-orange-500/5", border: "border-yellow-500/20", icon: <Code2 /> },
  { id: 7, title: "Machine Learning in Python", domain: "AI/ML", level: "Beginner", rating: 4.7, students: "45k", duration: "24h", tags: ["Python", "ML"], color: "from-blue-600/20 to-indigo-600/5", border: "border-blue-600/20", icon: <Zap /> },
  { id: 8, title: "Smart Contracts with Solidity", domain: "Web3", level: "Intermediate", rating: 4.5, students: "18k", duration: "10h", tags: ["Solidity", "Blockchain"], color: "from-slate-500/20 to-gray-500/5", border: "border-slate-500/20", icon: <Code2 /> },
  { id: 9, title: "Real-time Apps with Elixir", domain: "Backend", level: "Advanced", rating: 4.9, students: "6k", duration: "14h", tags: ["Elixir", "Phoenix"], color: "from-purple-600/20 to-fuchsia-600/5", border: "border-purple-600/20", icon: <Zap /> },
];

const CATEGORIES = ["All", "Systems", "Architecture", "Web", "AI/ML", "Web3", "Backend", "Paradigms"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function Courses() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCourses = activeCategory === "All" 
    ? MOCK_COURSES 
    : MOCK_COURSES.filter(c => c.domain === activeCategory);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Curriculum</h1>
          <p className="text-zinc-500 mt-1 font-mono text-sm tracking-wide">Explore 300+ languages and 200+ architecture domains.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search courses..." 
              className="pl-9 h-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500 font-mono text-sm rounded-lg" 
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg">
            <Filter size={16} />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={\`px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-mono transition-all duration-200 \${
              activeCategory === cat 
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }\`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {filteredCourses.map((course) => (
          <motion.div key={course.id} variants={itemVariants}>
            <Link to={\`/app/courses/\${course.id}\`} className="block group h-full">
              <div className={\`flex flex-col h-full rounded-2xl bg-zinc-900/40 border border-zinc-800 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:bg-zinc-900/80 relative overflow-hidden\`}>
                {/* Background Gradient */}
                <div className={\`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br \${course.color} blur-3xl opacity-50 group-hover:opacity-100 transition-opacity\`} />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <Badge variant="outline" className={\`font-mono text-[10px] uppercase tracking-wider \${course.border} bg-black/50 text-zinc-300\`}>
                    {course.domain}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs font-mono text-yellow-500/80 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                    <Star size={10} className="fill-current" />
                    {course.rating}
                  </div>
                </div>
                
                <h3 className="text-xl font-display font-medium text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors relative z-10">
                  {course.title}
                </h3>
                
                <div className="flex-1" />

                <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mb-5 mt-4 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={12} className="text-indigo-400/70" />
                    {course.level}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-indigo-400/70" />
                    {course.duration}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                  {course.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-1 bg-black/40 border border-zinc-800 rounded uppercase text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80 relative z-10">
                  <div className="text-xs font-mono text-zinc-500">
                    {course.students} enrolled
                  </div>
                  <div className="text-indigo-400 flex items-center gap-1 text-sm font-mono opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Enter <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
