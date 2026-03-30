import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Icons from '@/assets/icons';
import { Spinner, BadgeTag, ProgressBar } from '@/components/ui';

const LANG_META = {
  javascript:     { icon: Icons.Code,       color: '#F7DF1E', bg: 'bg-yellow-50' },
  typescript:     { icon: Icons.Code,       color: '#3178C6', bg: 'bg-blue-50' },
  python:         { icon: Icons.Code,       color: '#4B8BBE', bg: 'bg-sky-50' },
  html:           { icon: Icons.Code,       color: '#E34F26', bg: 'bg-orange-50' },
  css:            { icon: Icons.Code,       color: '#1572B6', bg: 'bg-blue-50' },
  java:           { icon: Icons.Code,       color: '#ED8B00', bg: 'bg-amber-50' },
  cpp:            { icon: Icons.Target,     color: '#6db3f2', bg: 'bg-sky-50' },
  c:              { icon: Icons.Terminal,   color: '#9e9e9e', bg: 'bg-slate-50' },
  csharp:         { icon: Icons.Code,       color: '#9B4F96', bg: 'bg-purple-50' },
  go:             { icon: Icons.Zap,        color: '#00ACD7', bg: 'bg-cyan-50' },
  rust:           { icon: Icons.Target,     color: '#CE422B', bg: 'bg-red-50' },
  kotlin:         { icon: Icons.Code,       color: '#7F52FF', bg: 'bg-violet-50' },
  swift:          { icon: Icons.Code,       color: '#FA7343', bg: 'bg-orange-50' },
  php:            { icon: Icons.Terminal,   color: '#8892BF', bg: 'bg-indigo-50' },
  ruby:           { icon: Icons.Award,      color: '#CC342D', bg: 'bg-red-50' },
  dart:           { icon: Icons.Code,       color: '#0175C2', bg: 'bg-blue-50' },
  bash:           { icon: Icons.Terminal,   color: '#4EAA25', bg: 'bg-green-50' },
  sql:            { icon: Icons.Code,       color: '#E48E00', bg: 'bg-amber-50' },
  'web-dev':      { icon: Icons.Globe,      color: '#9D65F5', bg: 'bg-purple-50' },
  'data-science': { icon: Icons.TrendingUp, color: '#00D9B5', bg: 'bg-emerald-50' },
  devops:         { icon: Icons.Settings,   color: '#FF6B35', bg: 'bg-orange-50' },
  cybersecurity:  { icon: Icons.Shield,     color: '#00FF88', bg: 'bg-green-50' },
  'game-dev':     { icon: Icons.Play,       color: '#FF3366', bg: 'bg-pink-50' },
  'system-design':{ icon: Icons.Code,       color: '#F59E0B', bg: 'bg-amber-50' },
  blockchain:     { icon: Icons.Code,       color: '#F7931A', bg: 'bg-orange-50' },
  'ai-ml':        { icon: Icons.Target,     color: '#A855F7', bg: 'bg-violet-50' },
};

const DOMAIN_SLUGS = ['web-dev', 'data-science', 'devops', 'cybersecurity', 'game-dev', 'system-design', 'blockchain', 'ai-ml'];

function CategoryCard({ category, courseCount, onClick }) {
  const meta = LANG_META[category.slug] || { icon: Icons.Book, color: '#64748b', bg: 'bg-slate-50' };
  const Ic = meta.icon;

  return (
    <div
      onClick={() => onClick(category)}
      className="group relative p-6 rounded-2xl border border-slate-200 bg-white cursor-pointer transition-all duration-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${meta.bg} border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
          <Ic size={20} style={{ color: meta.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors mb-1">
            {category.name}
          </h3>
          <p className="font-mono text-xs text-slate-500">
            {courseCount} {courseCount === 1 ? 'course' : 'courses'} available
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white text-slate-400 transition-all">
          <Icons.ArrowRight size={14} />
        </div>
      </div>
      {category.description && (
        <p className="mt-3 font-body text-xs text-slate-500 leading-relaxed line-clamp-2 pl-16">
          {category.description}
        </p>
      )}
    </div>
  );
}

function CourseCard({ course, onClick }) {
  const enrolled  = course.isEnrolled || !!course.enrollment;
  const completed = course.enrollment?.completedAt != null || course.enrollment?.progress === 100;
  const progress  = course.enrollment?.progress || 0;
  const meta = LANG_META[course.category?.slug] || { icon: Icons.Book, color: '#64748b', bg: 'bg-slate-50' };
  const Ic = meta.icon;

  return (
    <div
      onClick={() => onClick(course.slug)}
      className={`group relative p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
        completed
          ? 'bg-blue-50/50 border-blue-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50'
          : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50'
      }`}
    >
      {/* Top: icon + metadata */}
      <div className="flex items-start gap-4 mb-3">
        <div className={`w-11 h-11 rounded-xl ${meta.bg} border border-slate-100 flex items-center justify-center flex-shrink-0`}>
          <Ic size={18} style={{ color: meta.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors truncate">
              {course.title}
            </h3>
            {completed && (
              <span className="flex items-center gap-1 bg-blue-100 text-blue-700 border border-blue-200 font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
                <Icons.Check size={9} /> Completed
              </span>
            )}
          </div>
          <span className={`inline-block font-mono text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${
            course.difficulty === 'BEGINNER'     ? 'text-green-600 border-green-200 bg-green-50' :
            course.difficulty === 'INTERMEDIATE' ? 'text-blue-600 border-blue-200 bg-blue-50' :
            'text-purple-600 border-purple-200 bg-purple-50'
          }`}>{course.difficulty}</span>
        </div>
      </div>

      {/* Description */}
      {course.description && (
        <p className="font-body text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
          {course.description}
        </p>
      )}

      {/* Progress bar */}
      {enrolled && !completed && progress > 0 && (
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="font-mono text-xs text-slate-500">Progress</span>
            <span className="font-mono text-xs text-blue-600 font-bold">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Footer stats */}
      <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
        <span className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
          <Icons.Book size={11} className="text-slate-400" />
          {course._count?.lessons || 0} Lessons
        </span>
        <span className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
          <Icons.Zap size={11} className="text-amber-500" />
          {course.xpReward || 0} XP
        </span>
        {enrolled && !completed && (
          <span className="font-mono text-xs text-blue-600 ml-auto font-bold">
            In Progress
          </span>
        )}
        {!enrolled && (
          <span className="font-mono text-xs text-slate-400 ml-auto group-hover:text-blue-600 transition-colors flex items-center gap-1">
            Start <Icons.ArrowRight size={10} />
          </span>
        )}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, courseRes] = await Promise.all([
          api.get('/courses/categories'),
          api.get('/courses?limit=300'),
        ]);
        setCategories(catRes.data.categories || []);
        const coursesRaw = courseRes.data.courses || [];

        let enrollMap = {};
        try {
          const enrollRes = await api.get('/courses/my-enrollments');
          (enrollRes.data.enrollments || []).forEach(e => { enrollMap[e.courseId] = e; });
        } catch { /* not logged in */ }

        setCourses(coursesRaw.map(c => ({ ...c, enrollment: enrollMap[c.id] || null })));
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const langCategories = (categories || []).filter((c) => c && !DOMAIN_SLUGS.includes(c.slug));
  const domainCategories = (categories || []).filter((c) => c && DOMAIN_SLUGS.includes(c.slug));
  const getCoursesByCategory = (catId) => (courses || []).filter((c) => c && (c.categoryId === catId || c.category?.id === catId));
  const handleCourseClick = (slug) => navigate(`/courses/${slug}`);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size={24} className="text-blue-600" />
      </div>
    );
  }

  // Category drill-down view with course cards
  if (activeCategory) {
    const activeCourses = getCoursesByCategory(activeCategory.id).sort((a, b) => a.order - b.order);
    return (
      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        <button
          onClick={() => setActiveCategory(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-sm font-body transition-colors"
        >
          <Icons.ArrowLeft size={14} /> Back to Library
        </button>

        <div>
          <h1 className="font-display text-3xl text-slate-900 font-bold tracking-tight">{activeCategory.name}</h1>
          <p className="font-body text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
            {activeCategory.description || `Explore the complete zero-to-hero curriculum for ${activeCategory.name}. Advance your skills step-by-step.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCourses.length > 0 ? (
            activeCourses.map((course) => (
              <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
            ))
          ) : (
            <div className="col-span-full p-12 text-center border border-slate-200 rounded-2xl border-dashed">
              <Icons.Book size={28} className="text-slate-300 mx-auto mb-3" />
              <p className="font-body text-sm text-slate-400">No courses published in this track yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Library View
  return (
    <div className="max-w-6xl mx-auto pb-16">
      <div className="mb-10">
        <h1 className="font-display text-3xl text-slate-900 font-bold tracking-tight mb-2">Curriculum Library</h1>
        <p className="font-body text-sm text-slate-500 max-w-2xl">
          Select a technology stack or domain to explore available courses.
        </p>
      </div>

      <div className="space-y-12">
        {/* Languages */}
        {langCategories.length > 0 && (
          <section>
            <h2 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
              Programming Languages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {langCategories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} courseCount={getCoursesByCategory(cat.id).length} onClick={setActiveCategory} />
              ))}
            </div>
          </section>
        )}

        {/* Domains */}
        {domainCategories.length > 0 && (
          <section>
            <h2 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
              Domain Architectures
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {domainCategories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} courseCount={getCoursesByCategory(cat.id).length} onClick={setActiveCategory} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
