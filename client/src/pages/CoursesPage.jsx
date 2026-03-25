import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Icons from '@/assets/icons';
import { Spinner, BadgeTag, ProgressBar } from '@/components/ui';

// Professional, Minimalist SaaS Color Palette Mapping
const LANG_META = {
  javascript:     { icon: Icons.Code,       color: '#F7DF1E' },
  typescript:     { icon: Icons.Code,       color: '#3178C6' },
  python:         { icon: Icons.Code,       color: '#4B8BBE' },
  html:           { icon: Icons.Code,       color: '#E34F26' },
  css:            { icon: Icons.Code,       color: '#1572B6' },
  java:           { icon: Icons.Code,       color: '#ED8B00' },
  cpp:            { icon: Icons.Target,     color: '#6db3f2' },
  c:              { icon: Icons.Terminal,   color: '#9e9e9e' },
  csharp:         { icon: Icons.Code,       color: '#9B4F96' },
  go:             { icon: Icons.Zap,        color: '#00ACD7' },
  rust:           { icon: Icons.Target,     color: '#CE422B' },
  kotlin:         { icon: Icons.Code,       color: '#7F52FF' },
  swift:          { icon: Icons.Code,       color: '#FA7343' },
  php:            { icon: Icons.Terminal,   color: '#8892BF' },
  ruby:           { icon: Icons.Award,      color: '#CC342D' },
  dart:           { icon: Icons.Code,       color: '#0175C2' },
  bash:           { icon: Icons.Terminal,   color: '#4EAA25' },
  sql:            { icon: Icons.Code,       color: '#E48E00' },
  'web-dev':      { icon: Icons.Globe,      color: '#9D65F5' },
  'data-science': { icon: Icons.TrendingUp, color: '#00D9B5' },
  devops:         { icon: Icons.Settings,   color: '#FF6B35' },
  cybersecurity:  { icon: Icons.Shield,     color: '#00FF88' },
  'game-dev':     { icon: Icons.Play,       color: '#FF3366' },
  'system-design':{ icon: Icons.Code,       color: '#F59E0B' },
  blockchain:     { icon: Icons.Code,       color: '#F7931A' },
  'ai-ml':        { icon: Icons.Target,     color: '#A855F7' },
};

const DIFF_COLORS = { BEGINNER: 'green', INTERMEDIATE: 'blue', ADVANCED: 'purple' };

const DOMAIN_SLUGS = ['web-dev', 'data-science', 'devops', 'cybersecurity', 'game-dev', 'system-design', 'blockchain', 'ai-ml'];

function CategoryCard({ category, courseCount, onClick, isActive }) {
  const meta = LANG_META[category.slug] || { icon: Icons.Book, color: '#888' };
  const IconComponent = meta.icon;

  return (
    <div 
      onClick={() => onClick(category)}
      className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between h-32
        ${isActive 
          ? 'bg-blue-50 border-blue-200 shadow-[0_0_0_1px_rgba(59,130,246,0.3)]' 
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center">
          <IconComponent size={14} className="text-slate-600" />
        </div>
        <span className="font-mono text-[10px] text-slate-400 font-semibold">{courseCount} paths</span>
      </div>
      <div>
        <h3 className="font-body text-sm text-slate-900 font-bold tracking-wide">{category.name}</h3>
      </div>
    </div>
  );
}

function CourseListCard({ course, onClick }) {
  const enrolled  = course.isEnrolled;
  const completed = course.enrollment?.completedAt != null || course.enrollment?.progress === 100;
  const progress  = course.enrollment?.progress || 0;

  return (
    <div
      onClick={() => onClick(course.slug)}
      className={`group flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 rounded-xl cursor-pointer transition-all duration-200 gap-4 border ${
        completed
          ? 'bg-blue-50/50 border-blue-100 hover:border-blue-200'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-2 mb-2">
          <h3 className="font-body text-base text-slate-900 font-bold group-hover:text-blue-600 transition-colors">{course.title}</h3>
          <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${
            course.difficulty === 'BEGINNER'     ? 'text-green-600 border-green-200 bg-green-50' :
            course.difficulty === 'INTERMEDIATE' ? 'text-blue-600 border-blue-200 bg-blue-50' :
            'text-purple-600 border-purple-200 bg-purple-50'
          }`}>{course.difficulty}</span>
          {completed
            ? <span className="flex items-center gap-1 bg-blue-100 text-blue-700 border border-blue-200 font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">✓ Completed</span>
            : enrolled
            ? <span className="bg-slate-100 text-slate-600 border border-slate-200 font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">{progress}% done</span>
            : null
          }
        </div>
        <p className="font-mono text-xs text-slate-500 leading-relaxed max-w-2xl line-clamp-1">{course.description}</p>
        {enrolled && !completed && progress > 0 && (
          <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden max-w-xs">
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-5 sm:pl-6 sm:border-l border-slate-100 flex-shrink-0">
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono font-semibold text-[11px] text-slate-400 flex items-center gap-1.5">
            <Icons.Book size={11} className="text-slate-400" /> {course._count?.lessons || 0} Lessons
          </span>
          <span className="font-mono font-semibold text-[11px] text-slate-400 flex items-center gap-1.5">
            <Icons.Zap size={11} className="text-amber-500" /> {course.xpReward} XP
          </span>
        </div>
        <div className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center transition-colors border ${
          completed ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200'
        }`}>
          {completed
            ? <Icons.Check size={13} />
            : <Icons.ArrowRight size={13} />
          }
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for minimal categorized view
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

        // Try to get enrollment data (may fail if not logged in)
        let enrollMap = {};
        try {
          const enrollRes = await api.get('/courses/my-enrollments');
          (enrollRes.data.enrollments || []).forEach(e => { enrollMap[e.courseId] = e; });
        } catch { /* not logged in or endpoint error — no problem */ }

        setCourses(coursesRaw.map(c => ({ ...c, enrollment: enrollMap[c.id] || null })));
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const langCategories = categories.filter((c) => !DOMAIN_SLUGS.includes(c.slug));
  const domainCategories = categories.filter((c) => DOMAIN_SLUGS.includes(c.slug));

  const getCoursesByCategory = (catId) => courses.filter((c) => c.categoryId === catId || c.category?.id === catId);
  const handleCourseClick = (slug) => navigate(`/courses/${slug}`);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size={24} className="text-blue-600" />
      </div>
    );
  }

  // If a category is selected, render the list of courses for that category
  if (activeCategory) {
    const activeCourses = getCoursesByCategory(activeCategory.id).sort((a,b) => a.order - b.order);
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

        <div className="grid grid-cols-1 gap-3">
          {activeCourses.length > 0 ? (
            activeCourses.map((course) => (
              <CourseListCard key={course.id} course={course} onClick={handleCourseClick} />
            ))
          ) : (
            <div className="p-8 text-center border border-slate-200 rounded-xl border-dashed">
              <p className="font-body text-sm text-slate-400">No curriculums published in this track yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Library View
  return (
    <div className="max-w-7xl mx-auto pb-16">
      <div className="mb-12">
        <h1 className="font-display text-4xl text-slate-900 font-bold tracking-tight mb-3">Curriculum Library</h1>
        <p className="font-body text-base text-slate-500 max-w-2xl">
          A structured, minimal, and highly professional learning path. Select a technology stack or domain below to begin your journey.
        </p>
      </div>

      <div className="space-y-16">
        {/* Languages */}
        {langCategories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-body text-sm font-bold text-slate-400 uppercase tracking-widest">Programming Languages</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {langCategories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} courseCount={getCoursesByCategory(cat.id).length} onClick={setActiveCategory} />
              ))}
            </div>
          </section>
        )}

        {/* Domains */}
        {domainCategories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-body text-sm font-bold text-slate-400 uppercase tracking-widest">Domain Architectures</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
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
