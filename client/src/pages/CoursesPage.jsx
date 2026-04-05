import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Spinner } from '@/components/ui';
import { BookOpen, Globe, Settings, Terminal, Layers, Zap, Shield, Box, Play, TrendingUp, ArrowRight, ArrowLeft, RefreshCw, Check } from 'lucide-react';

const LANG_META = {
  javascript:     { Icon: Zap,         color: '#F59E0B' },
  typescript:     { Icon: Zap,         color: '#3B82F6' },
  python:         { Icon: Terminal,    color: '#60A5FA' },
  'web-dev':      { Icon: Globe,       color: '#6366F1' },
  devops:         { Icon: Settings,    color: '#F97316' },
  systems:        { Icon: Terminal,    color: '#888' },
  'system-design':{ Icon: Layers,      color: '#8B5CF6' },
  'ai-ml':        { Icon: Zap,         color: '#A855F7' },
  cybersecurity:  { Icon: Shield,      color: '#DC2626' },
  blockchain:     { Icon: Box,         color: '#F59E0B' },
  'mobile-dev':   { Icon: Play,        color: '#10B981' },
  'data-science': { Icon: TrendingUp,  color: '#06B6D4' },
  'backend-dev':  { Icon: Terminal,    color: '#555' },
};

const DOMAIN_SLUGS = ['web-dev','devops','systems','system-design','ai-ml','cybersecurity','blockchain','mobile-dev','data-science','backend-dev'];

// ─── CATEGORY CARD ────────────────────────────────────────
function CategoryCard({ category, courseCount, onClick }) {
  const meta = LANG_META[category.slug] || { Icon: BookOpen, color: '#555' };
  const { Icon } = meta;

  return (
    <div
      onClick={() => onClick(category)}
      className="blade p-5 cursor-pointer hover:border-white/20 transition-all duration-150 group"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-[4px] border border-white/[0.06] flex items-center justify-center flex-shrink-0 transition-all duration-150"
          style={{ background: `${meta.color}10` }}
        >
          <Icon size={16} strokeWidth={1.5} style={{ color: meta.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-white group-hover:text-cyber transition-colors duration-150 mb-1">
            {category.name}
          </h3>
          <p className="font-mono text-[10px] font-bold text-[#555] uppercase tracking-wider">
            {courseCount} {courseCount === 1 ? 'COURSE' : 'COURSES'} AVAILABLE
          </p>
        </div>
        <div
          className="w-7 h-7 rounded-[4px] border border-white/[0.06] flex items-center justify-center flex-shrink-0 text-[#444] group-hover:border-cyber/30 group-hover:text-cyber transition-all duration-150"
        >
          <ArrowRight size={13} strokeWidth={1.5} />
        </div>
      </div>
      {category.description && (
        <p className="mt-3 text-xs text-[#555] leading-relaxed line-clamp-2 pl-14">
          {category.description}
        </p>
      )}
    </div>
  );
}

// ─── COURSE CARD ──────────────────────────────────────────
function CourseCard({ course, onClick }) {
  const enrolled  = course.isEnrolled || !!course.enrollment;
  const completed = course.enrollment?.completedAt != null || course.enrollment?.progress === 100;
  const progress  = course.enrollment?.progress || 0;
  const meta = LANG_META[course.category?.slug] || { Icon: BookOpen, color: '#555' };
  const { Icon } = meta;

  return (
    <div
      onClick={() => onClick(course.slug)}
      className="blade p-5 cursor-pointer hover:border-white/20 transition-all duration-150 group"
      style={{ borderLeft: completed ? `2px solid ${meta.color}50` : undefined }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-[4px] border border-white/[0.06] flex items-center justify-center flex-shrink-0"
          style={{ background: `${meta.color}0D` }}
        >
          <Icon size={14} strokeWidth={1.5} style={{ color: meta.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-bold text-sm text-white group-hover:text-cyber transition-colors duration-150 truncate">
              {course.title}
            </h3>
            {completed && (
              <span className="flex items-center gap-1 font-mono text-[9px] font-black text-emerald bg-emerald/[0.08] border border-emerald/20 px-1.5 py-0.5 rounded-[2px] uppercase flex-shrink-0">
                <Check size={9} strokeWidth={2} /> DONE
              </span>
            )}
          </div>
          <span className={`inline-block font-mono text-[9px] px-2 py-0.5 rounded-[2px] uppercase tracking-wider font-bold border ${
            course.difficulty === 'BEGINNER'
              ? 'text-emerald border-emerald/20 bg-emerald/[0.06]'
              : course.difficulty === 'INTERMEDIATE'
              ? 'text-cyber border-cyber/20 bg-cyber/[0.06]'
              : 'text-violet border-violet/20 bg-violet/[0.06]'
          }`}>
            {course.difficulty}
          </span>
        </div>
      </div>

      {course.description && (
        <p className="text-xs text-[#555] leading-relaxed line-clamp-2 mb-3">{course.description}</p>
      )}

      {/* Progress */}
      {enrolled && !completed && progress > 0 && (
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="font-mono text-[9px] font-bold text-[#555] uppercase tracking-wider">PROGRESS</span>
            <span className="font-mono text-[10px] font-black text-cyber">{progress}%</span>
          </div>
          <div className="h-px bg-white/[0.06]">
            <div className="h-px bg-cyber" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="font-mono text-[10px] font-bold text-[#555] flex items-center gap-1.5 uppercase tracking-wider">
          <BookOpen size={10} strokeWidth={1.5} />
          {course._count?.lessons || 0} LESSONS
        </span>
        <span className="font-mono text-[10px] font-bold text-[#555] flex items-center gap-1.5 uppercase tracking-wider">
          <Zap size={10} strokeWidth={1.5} className="text-amber-400" />
          {course.xpReward || 0} XP
        </span>
        {enrolled && !completed && (
          <span className="font-mono text-[10px] font-black text-cyber ml-auto uppercase tracking-wider">IN PROGRESS</span>
        )}
        {!enrolled && (
          <span className="font-mono text-[10px] font-bold text-[#555] ml-auto group-hover:text-cyber transition-colors duration-150 flex items-center gap-1 uppercase tracking-wider">
            START <ArrowRight size={10} strokeWidth={1.5} />
          </span>
        )}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────
export default function CoursesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, courseRes] = await Promise.allSettled([
        api.get('/courses/categories'),
        api.get('/courses?limit=300'),
      ]);
      const cats       = catRes.status === 'fulfilled' ? (catRes.value.data.categories || []) : [];
      const coursesRaw = courseRes.status === 'fulfilled' ? (courseRes.value.data.courses || []) : [];
      setCategories(cats);

      let enrollMap = {};
      try {
        const enrollRes = await api.get('/courses/my-enrollments');
        (enrollRes.data.enrollments || []).forEach(e => { enrollMap[e.courseId] = e; });
      } catch {}

      setCourses(coursesRaw.map(c => ({ ...c, enrollment: enrollMap[c.id] || null })));
      if (cats.length === 0 && coursesRaw.length === 0) setError('no-data');
    } catch {
      setError('fetch-error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const langCategories   = (categories || []).filter(c => c && !DOMAIN_SLUGS.includes(c.slug));
  const domainCategories = (categories || []).filter(c => c && DOMAIN_SLUGS.includes(c.slug));
  const getCoursesByCategory = catId => (courses || []).filter(c => c && (c.categoryId === catId || c.category?.id === catId));
  const handleCourseClick = slug => navigate(`/courses/${slug}`);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={20} className="text-cyber" />
        <span className="font-mono text-[10px] text-[#444] uppercase tracking-[0.2em]">LOADING CURRICULUM...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-md mx-auto text-center py-32 space-y-5">
      <div className="w-14 h-14 rounded-[4px] border border-white/[0.08] flex items-center justify-center mx-auto">
        <BookOpen size={22} strokeWidth={1.5} className="text-[#333]" />
      </div>
      <div>
        <h2 className="font-bold text-lg text-white mb-2 uppercase tracking-tight">
          {error === 'no-data' ? 'NO COURSES AVAILABLE' : 'FAILED TO LOAD'}
        </h2>
        <p className="text-sm text-[#555]">
          {error === 'no-data' ? 'Curriculum is being prepared. Check back soon.' : 'Could not connect to server. Please try again.'}
        </p>
      </div>
      <button onClick={loadData} className="btn-secondary inline-flex items-center gap-2 text-[10px]">
        <RefreshCw size={12} strokeWidth={1.5} /> TRY AGAIN
      </button>
    </div>
  );

  // Category drill-down
  if (activeCategory) {
    const activeCourses = getCoursesByCategory(activeCategory.id).sort((a, b) => a.order - b.order);
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fade-in">
        <button
          onClick={() => setActiveCategory(null)}
          className="flex items-center gap-2 font-mono text-[11px] font-bold text-[#555] hover:text-white transition-colors duration-150 uppercase tracking-wider"
        >
          <ArrowLeft size={13} strokeWidth={1.5} /> BACK TO LIBRARY
        </button>

        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.5rem' }}>
          <h1 className="font-black text-2xl text-white tracking-tight uppercase">{activeCategory.name}</h1>
          <p className="text-sm text-[#555] mt-2 max-w-2xl leading-relaxed">
            {activeCategory.description || `Zero-to-hero curriculum for ${activeCategory.name}.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeCourses.length > 0 ? (
            activeCourses.map(course => (
              <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
            ))
          ) : (
            <div className="col-span-full py-14 text-center rounded-[4px] border border-dashed border-white/[0.06]">
              <BookOpen size={22} strokeWidth={1} className="text-[#222] mx-auto mb-3" />
              <p className="font-mono text-[11px] text-[#444] uppercase tracking-[0.15em]">NO COURSES IN THIS TRACK YET</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main library view
  return (
    <div className="max-w-6xl mx-auto pb-16 animate-fade-in">
      <div className="mb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.5rem' }}>
        <h1 className="font-black text-2xl text-white tracking-tight uppercase mb-1">CURRICULUM LIBRARY</h1>
        <p className="text-sm text-[#555]">
          Select a technology stack or domain to explore available courses.
        </p>
      </div>

      <div className="space-y-10">
        {langCategories.length > 0 && (
          <section>
            <h2 className="font-mono text-[10px] font-black text-[#444] uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
              <span className="flex-1 h-px bg-white/[0.04]" />
              PROGRAMMING LANGUAGES
              <span className="flex-1 h-px bg-white/[0.04]" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {langCategories.map(cat => (
                <CategoryCard key={cat.id} category={cat} courseCount={getCoursesByCategory(cat.id).length} onClick={setActiveCategory} />
              ))}
            </div>
          </section>
        )}

        {domainCategories.length > 0 && (
          <section>
            <h2 className="font-mono text-[10px] font-black text-[#444] uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
              <span className="flex-1 h-px bg-white/[0.04]" />
              DOMAIN ARCHITECTURES
              <span className="flex-1 h-px bg-white/[0.04]" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {domainCategories.map(cat => (
                <CategoryCard key={cat.id} category={cat} courseCount={getCoursesByCategory(cat.id).length} onClick={setActiveCategory} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
