import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Icons from '@/assets/icons';
import { Spinner, BadgeTag, ProgressBar } from '@/components/ui';

// Professional, Minimalist SaaS Color Palette Mapping
const LANG_META = {
  javascript:     { icon: Icons.FileCode, color: '#F7DF1E' },
  typescript:     { icon: Icons.FileCode, color: '#3178C6' },
  python:         { icon: Icons.FileCode, color: '#4B8BBE' },
  html:           { icon: Icons.Layout,   color: '#E34F26' },
  css:            { icon: Icons.Layout,   color: '#1572B6' },
  java:           { icon: Icons.Coffee,   color: '#ED8B00' },
  cpp:            { icon: Icons.Cpu,      color: '#6db3f2' },
  c:              { icon: Icons.Terminal, color: '#9e9e9e' },
  csharp:         { icon: Icons.FileCode, color: '#9B4F96' },
  go:             { icon: Icons.Zap,      color: '#00ACD7' },
  rust:           { icon: Icons.Cpu,      color: '#CE422B' },
  kotlin:         { icon: Icons.Smartphone, color: '#7F52FF' },
  swift:          { icon: Icons.Smartphone, color: '#FA7343' },
  php:            { icon: Icons.Server,   color: '#8892BF' },
  ruby:           { icon: Icons.Diamond,  color: '#CC342D' },
  dart:           { icon: Icons.Smartphone, color: '#0175C2' },
  bash:           { icon: Icons.Terminal, color: '#4EAA25' },
  sql:            { icon: Icons.Database, color: '#E48E00' },
  'web-dev':      { icon: Icons.Globe,    color: '#9D65F5' },
  'data-science': { icon: Icons.BarChart, color: '#00D9B5' },
  devops:         { icon: Icons.Settings, color: '#FF6B35' },
  cybersecurity:  { icon: Icons.Shield,   color: '#00FF88' },
  'game-dev':     { icon: Icons.Play,     color: '#FF3366' },
  'system-design':{ icon: Icons.Layers,   color: '#F59E0B' },
  blockchain:     { icon: Icons.Link,     color: '#F7931A' },
  'ai-ml':        { icon: Icons.Cpu,      color: '#A855F7' },
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
          ? 'bg-[#111] border-arena-purple/50 shadow-[0_0_0_1px_rgba(124,58,237,0.3)]' 
          : 'bg-[#0A0A0A] border-white/5 hover:border-white/15'
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
          <IconComponent size={14} className="text-white/80" />
        </div>
        <span className="font-mono text-[10px] text-white/40">{courseCount} paths</span>
      </div>
      <div>
        <h3 className="font-body text-sm text-white font-semibold tracking-wide">{category.name}</h3>
      </div>
    </div>
  );
}

function CourseListCard({ course, onClick }) {
  const enrolled = course.isEnrolled;

  return (
    <div 
      onClick={() => onClick(course.slug)}
      className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 bg-[#0A0A0A] border border-white/5 hover:border-white/15 rounded-xl cursor-pointer transition-colors duration-200 gap-4"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-body text-base text-white/90 font-medium group-hover:text-white transition-colors">{course.title}</h3>
          <BadgeTag variant={DIFF_COLORS[course.difficulty] || 'gray'} className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider bg-transparent border border-current text-opacity-80">
            {course.difficulty}
          </BadgeTag>
          {enrolled && <span className="bg-arena-teal/10 text-arena-teal border border-arena-teal/20 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">Enrolled</span>}
        </div>
        <p className="font-body text-sm text-white/50 leading-relaxed truncate">{course.description}</p>
      </div>

      <div className="flex items-center gap-6 sm:pl-6 sm:border-l border-white/5">
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-[11px] text-white/40 flex items-center gap-1.5">
            <Icons.Book size={12} /> {course._count?.lessons || 0} Lessons
          </span>
          <span className="font-mono text-[11px] text-white/40 flex items-center gap-1.5">
            <Icons.Zap size={12} /> {course.xpReward} XP
          </span>
        </div>
        <div className="w-8 h-8 rounded-full border border-white/10 flex flex-shrink-0 items-center justify-center group-hover:bg-white/5 transition-colors">
          <Icons.ArrowRight size={14} className="text-white/60 group-hover:text-white transition-colors" />
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
    Promise.all([
      api.get('/courses/categories'),
      api.get('/courses?limit=300'),
    ]).then(([catRes, courseRes]) => {
      setCategories(catRes.data.categories || []);
      setCourses(courseRes.data.courses || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const langCategories = categories.filter((c) => !DOMAIN_SLUGS.includes(c.slug));
  const domainCategories = categories.filter((c) => DOMAIN_SLUGS.includes(c.slug));

  const getCoursesByCategory = (catId) => courses.filter((c) => c.categoryId === catId || c.category?.id === catId);
  const handleCourseClick = (slug) => navigate(`/courses/${slug}`);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size={24} className="text-white/40" />
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
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-body transition-colors"
        >
          <Icons.ArrowLeft size={14} /> Back to Library
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

  // Main Library View
  return (
    <div className="max-w-7xl mx-auto pb-16">
      <div className="mb-12">
        <h1 className="font-display text-4xl text-white font-semibold tracking-tight mb-3">Curriculum Library</h1>
        <p className="font-body text-base text-white/50 max-w-2xl">
          A structured, minimal, and highly professional learning path. Select a technology stack or domain below to begin your journey.
        </p>
      </div>

      <div className="space-y-16">
        {/* Languages */}
        {langCategories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-body text-sm font-medium text-white/70 uppercase tracking-widest">Programming Languages</h2>
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
              <h2 className="font-body text-sm font-medium text-white/70 uppercase tracking-widest">Domain Architectures</h2>
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
