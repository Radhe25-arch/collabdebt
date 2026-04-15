import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, BookOpen, Clock, Star, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGameStore } from '@/store/useGameStore';
import { MOCK_COURSES } from '@/data/mockData';

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
  const { courseProgress } = useGameStore();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCourses = activeCategory === "All" 
    ? MOCK_COURSES 
    : MOCK_COURSES.filter(c => c.domain === activeCategory);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Curriculum</h1>
          <p className="text-zinc-500 mt-1 font-mono text-sm tracking-wide">Explore expert-grade curriculum across systems, architecture, and core paradigms.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search curriculum..." 
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
            className={`px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-mono transition-all duration-200 ${
              activeCategory === cat 
                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
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
        {filteredCourses.map((course) => {
          const progress = courseProgress[course.id];
          const pct = progress ? Math.min(100, Math.round((progress.completedLessons.length / course.totalLessons) * 100)) : 0;
          
          return (
            <motion.div key={course.id} variants={itemVariants}>
              <Link to={`/app/courses/${course.id}`} className="block group h-full">
                <div className={`flex flex-col h-full rounded-2xl bg-zinc-900/40 border border-zinc-800 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:bg-zinc-900/80 relative overflow-hidden`}>
                  {/* Background Gradient */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${course.color} blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <Badge variant="outline" className={`font-mono text-[10px] uppercase tracking-wider ${course.border} bg-black/50 text-zinc-300`}>
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
                      {pct > 0 ? `${pct}% Complete` : `${course.students} enrolled`}
                    </div>
                    <div className="text-indigo-400 flex items-center gap-1 text-sm font-mono opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      Enter <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
