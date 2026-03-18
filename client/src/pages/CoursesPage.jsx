import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '@/lib/api';
import Icons from '@/assets/icons';
import { Spinner, BadgeTag } from '@/components/ui';

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

// Core languages are these specific slugs, everything else is a "Domain Architecture"
const CORE_LANG_SLUGS = [
  'javascript', 'typescript', 'python', 'html', 'css', 'java', 'cpp', 'c', 
  'csharp', 'go', 'rust', 'kotlin', 'swift', 'php', 'ruby', 'dart', 'bash', 'sql'
];

function CategoryCard({ category, courseCount, onClick, isActive }) {
  const meta = LANG_META[category.slug] || { 
    icon: Icons[Object.keys(Icons).find(k => k.toLowerCase().includes(category.iconName?.toLowerCase()))] || Icons.Book, 
    color: '#3B82F6' 
  };
  const IconComponent = meta.icon;

  return (
    <div 
      onClick={() => onClick(category)}
      className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between h-28 animate-fade-in
        ${isActive 
          ? 'bg-[#111] border-arena-purple/50 shadow-[0_0_0_1px_rgba(124,58,237,0.3)]' 
          : 'bg-[#0A0A0A] border-white/5 hover:border-white/10 hover:bg-[#0E0E0E]'
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
          <IconComponent size={13} className="text-white/70" />
        </div>
        <span className="font-mono text-[9px] text-white/30 uppercase tracking-tighter">{courseCount} paths</span>
      </div>
      <div>
        <h3 className="font-body text-xs text-white/90 font-semibold tracking-tight leading-tight line-clamp-2">{category.name}</h3>
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
      className={`group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl cursor-pointer transition-all duration-200 gap-4 border ${
        completed
          ? 'bg-arena-teal/5 border-arena-teal/20 hover:border-arena-teal/35'
          : 'bg-[#0A0A0A] border-white/5 hover:border-white/15'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-2 mb-2">
          <h3 className="font-body text-base text-white/90 font-medium group-hover:text-white transition-colors">{course.title}</h3>
          <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider border ${
            course.difficulty === 'BEGINNER'     ? 'text-green-400 border-green-400/25' :
            course.difficulty === 'INTERMEDIATE' ? 'text-blue-400 border-blue-400/25' :
            'text-purple-400 border-purple-400/25'
          }`}>{course.difficulty}</span>
          {completed
            ? <span className="flex items-center gap-1 bg-arena-teal/15 text-arena-teal border border-arena-teal/25 font-mono text-[10px] px-2 py-0.5 rounded-full">✓ Completed</span>
            : enrolled
            ? <span className="bg-white/6 text-white/50 border border-white/10 font-mono text-[10px] px-2 py-0.5 rounded-full">{progress}% done</span>
            : null
          }
        </div>
        <p className="font-mono text-xs text-white/40 leading-relaxed line-clamp-1">{course.description}</p>
        {enrolled && !completed && progress > 0 && (
          <div className="mt-2.5 h-0.5 rounded-full bg-white/8 overflow-hidden max-w-xs">
            <div className="h-full rounded-full bg-arena-teal/60" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-5 sm:pl-6 sm:border-l border-white/5 flex-shrink-0">
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-[11px] text-white/35 flex items-center gap-1.5">
            <Icons.Book size={11} /> {course._count?.lessons || 0} Lessons
          </span>
          <span className="font-mono text-[11px] text-white/35 flex items-center gap-1.5">
            <Icons.Zap size={11} /> {course.xpReward} XP
          </span>
        </div>
        <div className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center transition-colors border ${
          completed ? 'bg-arena-teal/15 border-arena-teal/30' : 'border-white/10 group-hover:bg-white/5'
        }`}>
          {completed
            ? <Icons.Check size={13} className="text-arena-teal" />
            : <Icons.ArrowRight size={13} className="text-white/50 group-hover:text-white transition-colors" />
          }
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'languages'; // default to languages

  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, courseRes] = await Promise.all([
          api.get('/courses/categories'),
          api.get('/courses?limit=500'),
        ]);
        setCategories(catRes.data.categories || []);
        const coursesRaw = courseRes.data.courses || [];

        let enrollMap = {};
        try {
          const enrollRes = await api.get('/courses/my-enrollments', { _silent: true });
          (enrollRes.data.enrollments || []).forEach(e => { enrollMap[e.courseId] = e; });
        } catch { /* ignored */ }

        setCourses(coursesRaw.map(c => ({ ...c, enrollment: enrollMap[c.id] || null })));
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    };
    load();
    // Reset active category when switching view type
    setActiveCategory(null);
  }, [type]);

  const filteredCategories = useMemo(() => {
    if (type === 'languages') {
      return categories.filter(c => CORE_LANG_SLUGS.includes(c.slug));
    } else {
      return categories.filter(c => !CORE_LANG_SLUGS.includes(c.slug));
    }
  }, [categories, type]);

  const getCoursesByCategory = (catId) => courses.filter((c) => c.categoryId === catId || c.category?.id === catId);
  const handleCourseClick = (slug) => navigate(`/courses/${slug}`);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size={24} className="text-white/40" />
      </div>
    );
  }

  if (activeCategory) {
    const activeCourses = getCoursesByCategory(activeCategory.id).sort((a,b) => a.order - b.order);
    return (
      <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-fade-in">
        <button 
          onClick={() => setActiveCategory(null)}
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-body transition-colors"
        >
          <Icons.ArrowLeft size={14} /> Back to {type === 'languages' ? 'Languages' : 'Domains'}
        </button>

        <div>
          <h1 className="font-display text-3xl text-white font-semibold tracking-tight">{activeCategory.name}</h1>
          <p className="font-body text-sm text-white/50 mt-2 max-w-2xl leading-relaxed">
            {activeCategory.description || `Explore the complete zero-to-hero curriculum for ${activeCategory.name}. Advance your skills step-by-step.`}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {activeCourses.length > 0 ? (
            activeCourses.map((course) => (
              <CourseListCard key={course.id} course={course} onClick={handleCourseClick} />
            ))
          ) : (
            <div className="p-8 text-center border border-white/5 rounded-xl border-dashed">
              <p className="font-body text-sm text-white/40">No curriculums published in this track yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-16 animate-fade-in">
      <div className="mb-10">
        <BadgeTag variant={type === 'languages' ? 'purple' : 'teal'} className="mb-3 uppercase tracking-widest text-[10px]">
          {type === 'languages' ? 'Core Curriculum' : 'Expertise Paths'}
        </BadgeTag>
        <h1 className="font-display text-4xl text-white font-semibold tracking-tight mb-3">
          {type === 'languages' ? 'Programming Languages' : 'Tech Architectures'}
        </h1>
        <p className="font-body text-base text-white/50 max-w-2xl">
          {type === 'languages' 
            ? 'Master the syntax and patterns of modern programming languages. From assembly to high-level logic.'
            : 'Deep dive into specialized architecture domains. Scale systems, secure networks, and build hardware.'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filteredCategories.map((cat) => (
          <CategoryCard 
            key={cat.id} 
            category={cat} 
            courseCount={getCoursesByCategory(cat.id).length} 
            onClick={setActiveCategory} 
          />
        ))}
      </div>
      
      {filteredCategories.length === 0 && (
        <div className="py-20 text-center border border-white/5 border-dashed rounded-2xl">
          <p className="font-mono text-sm text-white/30">No tracks found in this section.</p>
        </div>
      )}
    </div>
  );
}
