import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '@/lib/api';
import Icons from '@/assets/icons';

const FALLBACK_IMAGES = [
  'bg-blue-100', 'bg-indigo-100', 'bg-emerald-100', 'bg-amber-100', 'bg-rose-100', 'bg-cyan-100'
];

export default function CoursesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [viewType, setViewType] = useState('all'); // 'all' or 'popular'

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, courseRes] = await Promise.all([
          api.get('/courses/categories'),
          api.get('/courses?limit=500'),
        ]);
        setCategories(catRes.data.categories || []);
        setCourses(courseRes.data.courses || []);
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredCourses = useMemo(() => {
    let filtered = courses;
    if (activeCategory) {
      filtered = filtered.filter(c => c.categoryId === activeCategory.id || c.category?.id === activeCategory.id);
    }
    if (viewType === 'popular') {
      filtered = [...filtered].sort((a,b) => (b.xpReward || 0) - (a.xpReward || 0)); // mock sorting for popular
    }
    return filtered;
  }, [courses, activeCategory, viewType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in font-sans">
      
      {/* ─── HERO HEADER ─── */}
      <div className="mb-12">
        <span className="bg-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6 inline-block">
          COURSE CATALOG
        </span>
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl md:text-6xl text-slate-900 font-extrabold tracking-tight leading-[1.1] mb-4">
              Master the Future of <br className="hidden md:block" />
              <span className="text-blue-600 italic">Technology</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Curated industry-leading courses, taught by experts. Completely free, forever. No credit card required.
            </p>
          </div>

          <div className="bg-white rounded-full border border-slate-200 p-1 flex items-center shadow-sm">
            <button 
              onClick={() => setViewType('all')} 
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${viewType === 'all' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              All Courses
            </button>
            <button 
              onClick={() => setViewType('popular')} 
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${viewType === 'popular' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Popular
            </button>
          </div>
        </div>
      </div>

      {/* ─── CATEGORY PILLS ─── */}
      <div className="flex overflow-x-auto gap-3 pb-4 mb-8 scrollbar-hide">
        <button 
          onClick={() => setActiveCategory(null)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${
            !activeCategory ? 'bg-blue-500 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Icons.Grid size={16} /> All Subjects
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${
              activeCategory?.id === cat.id ? 'bg-blue-500 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Icons.Code size={16} className={activeCategory?.id === cat.id ? 'text-white' : 'text-slate-500'} />
            {cat.name}
          </button>
        ))}
      </div>

      {/* ─── COURSE GRID ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course, i) => {
          const diffColor = 
            course.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-700' :
            course.difficulty === 'INTERMEDIATE' ? 'bg-blue-100 text-blue-700' :
            'bg-purple-100 text-purple-700';
          
          const bgClass = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];

          return (
            <div 
              key={course.id} 
              onClick={() => navigate(`/courses/${course.slug}`)}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group p-2"
            >
              {/* Thumbnail Area */}
              <div className={`relative h-48 rounded-2xl ${bgClass} w-full overflow-hidden flex items-center justify-center p-6`}>
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-blue-700 text-[10px] font-black uppercase px-2.5 py-1 rounded shadow-sm">
                  FREE
                </span>
                <h3 className="font-display font-black text-2xl text-slate-800/20 text-center leading-none uppercase">
                  {course.title.split(' ')[0]}<br/>{course.title.split(' ').slice(1).join(' ')}
                </h3>
              </div>

              {/* Content Area */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${diffColor}`}>
                    {course.difficulty}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                    <Icons.Clock size={12} /> {(course.duration || 60) / 60} Hours
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                
                <p className="text-sm text-slate-500 line-clamp-2 mb-6">
                  {course.description || "Master the fundamentals and build responsive, accessible web applications."}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 border border-white flex items-center justify-center text-[8px] font-bold text-blue-700">JS</div>
                    <div className="w-6 h-6 rounded-full bg-emerald-100 border border-white flex items-center justify-center text-[8px] font-bold text-emerald-700">TS</div>
                    <div className="w-6 h-6 rounded-full bg-purple-100 border border-white flex items-center justify-center text-[8px] font-bold text-purple-700">PR</div>
                  </div>
                  <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                    View Details <Icons.ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-slate-500 font-medium">No courses found matching this criteria.</p>
        </div>
      )}
    </div>
  );
}
