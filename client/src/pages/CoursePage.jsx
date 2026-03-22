import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Icons from '@/assets/icons';

// Humanized course cover illustrations using pure CSS/SVG — no AI images
const CourseCover = ({ title, index }) => {
  const palettes = [
    { bg: '#EFF6FF', accent: '#2563EB', dot: '#BFDBFE' },
    { bg: '#F0FDF4', accent: '#16A34A', dot: '#BBF7D0' },
    { bg: '#FFFBEB', accent: '#D97706', dot: '#FDE68A' },
    { bg: '#FDF4FF', accent: '#9333EA', dot: '#E9D5FF' },
    { bg: '#FFF1F2', accent: '#E11D48', dot: '#FECDD3' },
    { bg: '#F0FDFA', accent: '#0D9488', dot: '#99F6E4' },
  ];
  const p = palettes[index % palettes.length];
  const letter = title?.[0]?.toUpperCase() || '?';
  const shapes = [
    [12, 14], [68, 10], [82, 60], [8, 70], [45, 80], [90, 30],
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ background: p.bg }}>
      {/* Decorative dots */}
      {shapes.map(([x, y], i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${x}%`, top: `${y}%`,
            width: i % 2 === 0 ? 10 : 6,
            height: i % 2 === 0 ? 10 : 6,
            background: p.dot,
          }}
        />
      ))}
      {/* Center circle */}
      <div
        className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
        style={{ background: p.accent }}
      >
        <span className="text-white font-black text-2xl font-display">{letter}</span>
      </div>
      {/* Small code icon */}
      <div
        className="absolute bottom-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: p.dot }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={p.accent} strokeWidth="2.5" strokeLinecap="round">
          <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
        </svg>
      </div>
      {/* Top-left tag */}
      <div
        className="absolute top-3 left-3 w-6 h-6 rounded-lg"
        style={{ background: p.dot, opacity: 0.7 }}
      />
    </div>
  );
};

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
      filtered = filtered.filter(c => c.categoryId === activeCategory.id || c.category?.id === activeCategory.id);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }
    if (viewType === 'popular') {
      filtered = [...filtered].sort((a, b) => (b.xpReward || 0) - (a.xpReward || 0));
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

      {/* ── HERO HEADER ── */}
      <div className="mb-10 pt-2">
        <span className="bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-5 inline-block border border-blue-100">
          Course Catalog
        </span>

        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-xl">
            <h1 className="font-display text-4xl md:text-5xl text-slate-900 font-black tracking-tight leading-tight mb-3">
              Master the Future of <br />
              <span className="text-blue-600 italic">Technology</span>
            </h1>
            <p className="text-base text-slate-500 leading-relaxed">
              Curated industry-leading courses, taught by experts. Completely free, forever.
            </p>
          </div>

          <div className="bg-white rounded-full border border-slate-200 p-1 flex items-center shadow-sm flex-shrink-0">
            <button
              onClick={() => setViewType('all')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${viewType === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              All Courses
            </button>
            <button
              onClick={() => setViewType('popular')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${viewType === 'popular' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Popular
            </button>
          </div>
        </div>
      </div>

      {/* ── SEARCH + CATEGORIES ── */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-sm">
          <Icons.Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all"
          />
        </div>

        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all flex-shrink-0 ${
              !activeCategory ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            <Icons.Book size={14} /> All Subjects
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all flex-shrink-0 ${
                activeCategory?.id === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <Icons.Code size={14} className={activeCategory?.id === cat.id ? 'text-white' : 'text-slate-400'} />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── RESULTS COUNT ── */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-900">{filteredCourses.length}</span> courses
          {activeCategory && <span> in <span className="font-semibold text-blue-600">{activeCategory.name}</span></span>}
          {search && <span> matching "<span className="font-semibold">{search}</span>"</span>}
        </p>
      </div>

      {/* ── COURSE GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredCourses.map((course, i) => {
          const diffColor =
            course.difficulty === 'BEGINNER'     ? 'bg-green-50 text-green-700 border-green-100' :
            course.difficulty === 'INTERMEDIATE'  ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    'bg-purple-50 text-purple-700 border-purple-100';

          return (
            <div
              key={course.id}
              onClick={() => navigate(`/courses/${course.slug}`)}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col group"
            >
              {/* Cover */}
              <div className="h-44 relative overflow-hidden">
                <CourseCover title={course.title} index={i} />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-blue-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg shadow-sm border border-blue-100">
                  FREE
                </span>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${diffColor}`}>
                    {course.difficulty}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <Icons.Clock size={11} /> {(course.duration || 60) / 60}h
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
                  {course.description || 'Master the fundamentals and build real-world applications.'}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center -space-x-1.5">
                    {['bg-blue-400', 'bg-emerald-400', 'bg-purple-400'].map((c, j) => (
                      <div key={j} className={`w-5 h-5 rounded-full ${c} border border-white`} />
                    ))}
                    <span className="ml-2 text-[10px] text-slate-400 font-medium">+24</span>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 transition-colors">
                    Start <Icons.ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Icons.Book size={22} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-semibold">No courses found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
}
