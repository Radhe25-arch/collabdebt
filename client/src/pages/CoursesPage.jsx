import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Zap, 
  Code, 
  ChevronRight, 
  Star, 
  ArrowRight,
  Shield,
  Clock,
  Layout,
  Globe,
  Database,
  Terminal,
  Layers,
  Sparkles,
  BarChart3,
  BadgeCheck
} from 'lucide-react';
import { Button, Input, Spinner } from '@/components/ui';
import api from '@/lib/api';

// ─── PREMIUM COURSE CARD (LIST STYLE) ─────────────────────
const CourseListCard = ({ course, onAction }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-[#1e293b] border border-white/5 rounded-[32px] p-1 shadow-sm hover:shadow-xl hover:shadow-blue-600/5 hover:border-blue-600/20 transition-all duration-300"
    >
      <div className="bg-slate-900/40 rounded-[31px] p-8 flex flex-col lg:flex-row items-center gap-10">
        
        {/* Course Identity */}
        <div className="flex-1 flex gap-8 items-start w-full">
           <div className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition-colors">
              <Code size={36} className="text-blue-500" />
           </div>
           <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                 <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className={i < 4 ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700'} />
                    ))}
                 </div>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-full">Elite Rating</span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-4 group-hover:text-blue-400 transition-colors">{course.title}</h3>
              <p className="text-slate-500 text-base leading-relaxed line-clamp-2 max-w-2xl">{course.description}</p>
           </div>
        </div>

        {/* Course Metadata — 'Business Listing' Style */}
        <div className="flex-shrink-0 grid grid-cols-2 lg:flex lg:flex-row items-center gap-10 border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-10 w-full lg:w-auto">
           
           <div className="space-y-1 min-w-[120px]">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mb-2">Difficulty</p>
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${course.level === 'Advanced' ? 'bg-red-500' : course.level === 'Intermediate' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                 <span className="text-white font-black tracking-tight">{course.level || 'Intermediate'}</span>
              </div>
           </div>

           <div className="space-y-1 min-w-[150px]">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mb-2">Skills Gained</p>
              <span className="text-slate-300 font-bold text-sm tracking-tight">{course.tags?.slice(0, 2).join(', ').toUpperCase() || 'SYSTEMS, SCALE'}</span>
           </div>

           <div className="space-y-1 min-w-[100px]">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mb-2">Lessons</p>
              <span className="text-white font-black tracking-tight">{course._count?.lessons || 24} MODULES</span>
           </div>

           <div className="col-span-2 lg:col-span-1 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-10">
              <Button 
                onClick={() => onAction(course.slug)}
                className="w-full lg:w-44 h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black transition-all glow-blue border-none flex items-center justify-center gap-3"
              >
                View Asset <ArrowRight size={18} />
              </Button>
           </div>

        </div>

      </div>
    </motion.div>
  );
};

// ─── MAIN COURSES PAGE ──────────────────────────────────
export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    api.get('/courses')
      .then(r => setCourses(r.data.courses || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || c.level === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <Spinner size={32} className="text-blue-500" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-40 space-y-16 animate-fade-in">
      
      {/* ── HEADER & SEARCH ── */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto pt-10">
         <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full">
            <BadgeCheck size={14} className="text-blue-500" />
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Verified Curriculum</span>
         </div>
         <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-4">Elite Coding Assets.</h1>
         <p className="text-slate-500 text-lg font-medium leading-relaxed">
            Acquire high-demand technical skills through our industrial-grade curriculum. 
            Built for those who optimize for scale. 100% Free Acquisition.
         </p>
         
         <div className="w-full relative group pt-10">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-blue-500 transition-colors" size={20} />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by asset name, skill, or difficulty..."
              className="h-16 pl-16 pr-6 rounded-3xl bg-[#1e293b]/50 border-white/5 text-lg font-medium placeholder:text-slate-600 focus:bg-[#1e293b] focus:border-blue-600/50 transition-all w-full"
            />
         </div>
      </div>

      {/* ── FILTER TABS ── */}
      <div className="flex flex-wrap items-center justify-center gap-3">
         {['ALL', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map(f => (
           <button
             key={f}
             onClick={() => setFilter(f)}
             className={`h-11 px-8 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
               filter === f 
                 ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                 : 'bg-[#1e293b] text-slate-500 hover:bg-slate-800 border border-white/5'
             }`}
           >
             {f}
           </button>
         ))}
      </div>

      {/* ── ASSET LISTING ── */}
      <div className="space-y-6">
         <div className="flex items-center justify-between px-8 mb-8">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">{filtered.length} ASSETS FOUND</span>
            <div className="flex items-center gap-3 text-slate-600">
               <span className="text-[10px] font-bold uppercase tracking-widest">Sort:</span>
               <button className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-white transition-colors">Popularity</button>
            </div>
         </div>

         <div className="space-y-6">
            <AnimatePresence mode="popLayout">
               {filtered.map(course => (
                 <CourseListCard 
                    key={course.id} 
                    course={course} 
                    onAction={(slug) => navigate(`/courses/${slug}`)} 
                 />
               ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="py-40 text-center bg-[#1e293b]/30 rounded-[40px] border border-dashed border-white/10">
                 <Search size={48} className="text-slate-700 mx-auto mb-6" />
                 <h4 className="text-xl font-bold text-white mb-2">No assets match your search.</h4>
                 <p className="text-slate-500">Try adjusting your filters or search parameters.</p>
              </div>
            )}
         </div>
      </div>

      {/* ── FOOTER CALLOUT ── */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-[50px] p-16 text-center text-white relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent)]" />
         <div className="relative z-10 max-w-2xl mx-auto">
            <Sparkles className="mx-auto mb-8 text-white/50" size={32} />
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">Own Your Future today.</h2>
            <p className="text-lg font-medium text-white/80 mb-10 leading-relaxed">
               Every course you complete is a verified asset in your portfolio. 
               Join 500k+ engineers mastering the industrial stack.
            </p>
            <Button className="h-16 px-12 rounded-2xl bg-white text-blue-600 hover:bg-slate-50 border-none font-black text-lg shadow-2xl">
               Start Learning Now
            </Button>
         </div>
      </div>

    </div>
  );
}
