import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Icons from '@/assets/icons';
 
const BG_PALETTES = [
  { bg: 'bg-blue-50',   icon: 'bg-blue-500',   dot: 'bg-blue-300'   },
  { bg: 'bg-green-50',  icon: 'bg-green-500',  dot: 'bg-green-300'  },
  { bg: 'bg-amber-50',  icon: 'bg-amber-500',  dot: 'bg-amber-300'  },
  { bg: 'bg-purple-50', icon: 'bg-purple-500', dot: 'bg-purple-300' },
  { bg: 'bg-rose-50',   icon: 'bg-rose-500',   dot: 'bg-rose-300'   },
  { bg: 'bg-cyan-50',   icon: 'bg-cyan-500',   dot: 'bg-cyan-300'   },
];
 
function getInitials(title = '') {
  const words = title.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
 
export default function CoursesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [viewType, setViewType] = useState('all');
  const [search, setSearch] = useState('');
 
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
      filtered = filtered.filter(
        c => c.categoryId === activeCategory.id || c.category?.id === activeCategory.id
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        c => c.title.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
      );
    }
    if (viewType === 'popular') {
      filtered = [...filtered].sort(
        (a, b) => (b._count?.enrollments || 0) - (a._count?.enrollments || 0)
      );
    }
    return filtered;
  }, [courses, activeCategory, viewType, search]);
 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }
 
  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in font-sans">
 
      {/* ─── HERO ─── */}
      <div className="mb-10">
        <span className="bg-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-5 inline-block">
          COURSE CATALOG
        </span>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="font-display text-5xl md:text-6xl text-slate-900 font-extrabold tracking-tight leading-[1.1] mb-4">
              Master the Future of{' '}
              <span className="text-blue-600 italic">Technology</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
              Curated industry-leading courses, taught by experts. Completely free, forever.
            </p>
          </div>
          <div className="bg-white rounded-full border border-slate-200 p-1 flex items-center shadow-sm shrink-0">
            <button
              onClick={() => setViewType('all')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                viewType === 'all' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => setViewType('popular')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                viewType === 'popular' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Popular
            </button>
          </div>
        </div>
      </div>
 
      {/* ─── SEARCH ─── */}
      <div className="relative mb-6">
        <Icons.Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full max-w-md pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>
 
      {/* ─── CATEGORY PILLS ─── */}
      <div className="flex overflow-x-auto gap-3 pb-4 mb-5 scrollbar-hide">
        <button
          onClick={() => setActiveCategory(null)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${
            !activeCategory ? 'bg-blue-500 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Icons.Book size={15} /> All Subjects
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${
              activeCategory?.id === cat.id
                ? 'bg-blue-500 text-white shadow'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Icons.Code size={15} className={activeCategory?.id === cat.id ? 'text-white' : 'text-slate-500'} />
            {cat.name}
          </button>
        ))}
      </div>
 
      {/* ─── COUNT ─── */}
      <p className="text-sm font-medium text-slate-400 mb-6">
        {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
      </p>
 
      {/* ─── GRID ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredCourses.map((course, i) => {
          const palette = BG_PALETTES[i % BG_PALETTES.length];
          const initials = getInitials(course.title);
          const diffColor =
            course.difficulty === 'BEGINNER'     ? 'bg-green-100 text-green-700' :
            course.difficulty === 'INTERMEDIATE' ? 'bg-blue-100 text-blue-700'  :
                                                   'bg-purple-100 text-purple-700';
 
          return (
            <div
              key={course.id}
              onClick={() => navigate(`/courses/${course.slug}`)}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group"
            >
              {/* Thumbnail */}
              <div className={`relative h-44 ${palette.bg} flex items-center justify-center p-6 overflow-hidden`}>
                <span className="absolute top-3 left-3 bg-white/90 text-blue-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shadow-sm">
                  FREE
                </span>
                {/* Decorative dots */}
                <div className={`absolute top-5 right-6 w-2 h-2 rounded-full ${palette.dot} opacity-60`} />
                <div className={`absolute bottom-8 left-6 w-1.5 h-1.5 rounded-full ${palette.dot} opacity-40`} />
                <div className={`absolute bottom-4 right-10 w-1 h-1 rounded-full ${palette.dot} opacity-30`} />
                {/* Icon */}
                <div className={`relative w-16 h-16 ${palette.icon} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-black text-xl tracking-tight">{initials}</span>
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow">
                    <Icons.Code size={12} className="text-slate-500" />
                  </div>
                </div>
              </div>
 
              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${diffColor}`}>
                    {course.difficulty}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Icons.Clock size={11} /> {Math.round((course.duration || 120) / 60)}h
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 leading-tight mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {course.description || 'Master the essential principles and modern architecture.'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
 
      {filteredCourses.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-slate-400 font-medium">No courses found.</p>
        </div>
      )}
    </div>
  );
}
