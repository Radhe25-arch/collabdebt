import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Icons from '@/assets/icons';
 
const CATEGORY_COLORS = [
  'from-blue-500/20 to-indigo-500/20 border-blue-500/20',
  'from-emerald-500/20 to-teal-500/20 border-emerald-500/20',
  'from-purple-500/20 to-violet-500/20 border-purple-500/20',
  'from-amber-500/20 to-orange-500/20 border-amber-500/20',
  'from-rose-500/20 to-pink-500/20 border-rose-500/20',
  'from-cyan-500/20 to-sky-500/20 border-cyan-500/20',
];
 
const ICON_COLORS = [
  'text-blue-400', 'text-emerald-400', 'text-purple-400',
  'text-amber-400', 'text-rose-400', 'text-cyan-400',
];
 
export default function CoursesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [viewType, setViewType]     = useState('all');
  const [search, setSearch]         = useState('');
 
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
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(c => c.title?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
    }
    if (viewType === 'popular') {
      filtered = [...filtered].sort((a, b) => (b._count?.enrollments || 0) - (a._count?.enrollments || 0));
    }
    return filtered;
  }, [courses, activeCategory, viewType, search]);
 
  const stats = useMemo(() => ({
    total: courses.length,
    beginner: courses.filter(c => c.difficulty === 'BEGINNER').length,
    advanced: courses.filter(c => c.difficulty === 'ADVANCED').length,
  }), [courses]);
 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }
 
  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in font-sans px-2 md:px-0">
 
      {/* ─── HERO HEADER ─── */}
      <div className="mb-8 md:mb-12">
        <span className="bg-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 md:mb-6 inline-block">
          COURSE CATALOG
        </span>
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-slate-900 font-extrabold tracking-tight leading-[1.1] mb-3">
              Master the Future of{' '}
              <span className="text-blue-600 italic">Technology</span>
            </h1>
            <p className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed">
              {stats.total}+ curated courses, completely free — no credit card, no limits.
            </p>
          </div>
 
          {/* Stats row */}
          <div className="flex flex-wrap gap-3 mt-2">
            {[
              { label: 'Total Courses', value: stats.total + '+' },
              { label: 'Beginner Friendly', value: stats.beginner },
              { label: 'Advanced Tracks', value: stats.advanced },
              { label: 'Price', value: 'FREE' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex flex-col">
                <span className="font-display font-extrabold text-xl text-slate-900">{s.value}</span>
                <span className="text-xs text-slate-500 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* ─── SEARCH + FILTER BAR ─── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex-1 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Icons.Search size={16} className="text-slate-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="ml-2 text-slate-400 hover:text-slate-700 transition-colors">
              <Icons.X size={14} />
            </button>
          )}
        </div>
 
        {/* View toggle */}
        <div className="bg-white rounded-xl border border-slate-200 p-1 flex items-center gap-1 self-start sm:self-auto">
          <button
            onClick={() => setViewType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewType === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            All
          </button>
          <button
            onClick={() => setViewType('popular')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewType === 'popular' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Popular
          </button>
        </div>
      </div>
 
      {/* ─── CATEGORY PILLS ─── */}
      <div className="flex overflow-x-auto gap-2 pb-3 mb-8 scrollbar-hide -mx-2 px-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all flex-shrink-0 ${
            !activeCategory ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600'
          }`}
        >
          <Icons.Book size={14} /> All ({courses.length})
        </button>
        {categories.map((cat, idx) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(activeCategory?.id === cat.id ? null : cat)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all flex-shrink-0 ${
              activeCategory?.id === cat.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600'
            }`}
          >
            <Icons.Code size={14} />
            {cat.name}
          </button>
        ))}
      </div>
 
      {/* ─── COURSE GRID ─── */}
      {filteredCourses.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Icons.Book size={28} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-semibold mb-1">No courses found</p>
          <p className="text-slate-400 text-sm">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredCourses.map((course, i) => {
            const diffColor =
              course.difficulty === 'BEGINNER'     ? 'bg-emerald-100 text-emerald-700' :
              course.difficulty === 'INTERMEDIATE'  ? 'bg-blue-100 text-blue-700' :
              'bg-purple-100 text-purple-700';
 
            const lessonCount = course._count?.lessons || course.lessons?.length || 0;
            const enrollCount = course._count?.enrollments || 0;
            const hours = Math.max(1, Math.round((course.duration || 60) / 60));
 
            return (
              <div
                key={course.id}
                onClick={() => navigate(`/courses/${course.slug}`)}
                className="bg-white border border-slate-200 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 flex flex-col group"
              >
                {/* Color header bar */}
                <div className={`h-2 w-full bg-gradient-to-r ${
                  i % 6 === 0 ? 'from-blue-400 to-indigo-500' :
                  i % 6 === 1 ? 'from-emerald-400 to-teal-500' :
                  i % 6 === 2 ? 'from-purple-400 to-violet-500' :
                  i % 6 === 3 ? 'from-amber-400 to-orange-500' :
                  i % 6 === 4 ? 'from-rose-400 to-pink-500' :
                  'from-cyan-400 to-sky-500'
                }`} />
 
                <div className="p-4 md:p-5 flex flex-col flex-1">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${diffColor}`}>
                      {course.difficulty || 'BEGINNER'}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg flex-shrink-0">FREE</span>
                  </div>
 
                  {/* Title */}
                  <h3 className="font-bold text-base md:text-lg text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
 
                  {/* Description */}
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                    {course.description || 'Master real-world skills through hands-on projects and challenges.'}
                  </p>
 
                  {/* Meta row */}
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mb-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Icons.Clock size={12} /> {hours}h
                    </span>
                    {lessonCount > 0 && (
                      <span className="flex items-center gap-1">
                        <Icons.Book size={12} /> {lessonCount} lessons
                      </span>
                    )}
                    {enrollCount > 0 && (
                      <span className="flex items-center gap-1">
                        <Icons.Users size={12} /> {enrollCount.toLocaleString()} students
                      </span>
                    )}
                  </div>
 
                  {/* Footer CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                        <Icons.Zap size={10} className="text-white" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">+{course.xpReward || 100} XP</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 transition-all group-hover:gap-2">
                      Start <Icons.ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
