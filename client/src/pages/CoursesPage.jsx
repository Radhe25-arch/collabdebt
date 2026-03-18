import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Icons from '@/assets/icons';
import { Spinner, BadgeTag, ProgressBar } from '@/components/ui';

const LANG_META = {
  javascript:     { color: '#F7DF1E', bg: 'rgba(247,223,30,0.1)',   border: 'rgba(247,223,30,0.25)',   emoji: '🟨' },
  typescript:     { color: '#3178C6', bg: 'rgba(49,120,198,0.1)',   border: 'rgba(49,120,198,0.25)',   emoji: '🔷' },
  python:         { color: '#4B8BBE', bg: 'rgba(75,139,190,0.12)',  border: 'rgba(75,139,190,0.3)',    emoji: '🐍' },
  html:           { color: '#E34F26', bg: 'rgba(227,79,38,0.1)',    border: 'rgba(227,79,38,0.25)',    emoji: '🌐' },
  css:            { color: '#1572B6', bg: 'rgba(21,114,182,0.1)',   border: 'rgba(21,114,182,0.25)',   emoji: '🎨' },
  java:           { color: '#ED8B00', bg: 'rgba(237,139,0,0.1)',    border: 'rgba(237,139,0,0.25)',    emoji: '☕' },
  cpp:            { color: '#6db3f2', bg: 'rgba(109,179,242,0.1)',  border: 'rgba(109,179,242,0.25)',  emoji: '⚡' },
  c:              { color: '#9e9e9e', bg: 'rgba(158,158,158,0.08)', border: 'rgba(158,158,158,0.2)',   emoji: '🔧' },
  csharp:         { color: '#9B4F96', bg: 'rgba(155,79,150,0.1)',   border: 'rgba(155,79,150,0.25)',   emoji: '💜' },
  go:             { color: '#00ACD7', bg: 'rgba(0,172,215,0.1)',    border: 'rgba(0,172,215,0.25)',    emoji: '🐹' },
  rust:           { color: '#CE422B', bg: 'rgba(206,66,43,0.1)',    border: 'rgba(206,66,43,0.25)',    emoji: '🦀' },
  kotlin:         { color: '#7F52FF', bg: 'rgba(127,82,255,0.1)',   border: 'rgba(127,82,255,0.25)',   emoji: '🎯' },
  swift:          { color: '#FA7343', bg: 'rgba(250,115,67,0.1)',   border: 'rgba(250,115,67,0.25)',   emoji: '🍎' },
  php:            { color: '#8892BF', bg: 'rgba(136,146,191,0.1)',  border: 'rgba(136,146,191,0.25)',  emoji: '🐘' },
  ruby:           { color: '#CC342D', bg: 'rgba(204,52,45,0.1)',    border: 'rgba(204,52,45,0.25)',    emoji: '💎' },
  dart:           { color: '#0175C2', bg: 'rgba(1,117,194,0.1)',    border: 'rgba(1,117,194,0.25)',    emoji: '🎯' },
  bash:           { color: '#4EAA25', bg: 'rgba(78,170,37,0.1)',    border: 'rgba(78,170,37,0.25)',    emoji: '💻' },
  sql:            { color: '#E48E00', bg: 'rgba(228,142,0,0.1)',    border: 'rgba(228,142,0,0.25)',    emoji: '🗄️' },
  'web-dev':      { color: '#9D65F5', bg: 'rgba(157,101,245,0.1)',  border: 'rgba(157,101,245,0.25)',  emoji: '🕸️' },
  'data-science': { color: '#00D9B5', bg: 'rgba(0,217,181,0.1)',    border: 'rgba(0,217,181,0.25)',    emoji: '📊' },
  devops:         { color: '#FF6B35', bg: 'rgba(255,107,53,0.1)',   border: 'rgba(255,107,53,0.25)',   emoji: '⚙️' },
  cybersecurity:  { color: '#00FF88', bg: 'rgba(0,255,136,0.1)',    border: 'rgba(0,255,136,0.25)',    emoji: '🔐' },
  'game-dev':     { color: '#FF3366', bg: 'rgba(255,51,102,0.1)',   border: 'rgba(255,51,102,0.25)',   emoji: '🎮' },
  'system-design':{ color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.25)',   emoji: '🏗️' },
  blockchain:     { color: '#F7931A', bg: 'rgba(247,147,26,0.1)',   border: 'rgba(247,147,26,0.25)',   emoji: '⛓️' },
  'ai-ml':        { color: '#A855F7', bg: 'rgba(168,85,247,0.1)',   border: 'rgba(168,85,247,0.25)',   emoji: '🤖' },
};

const DIFF_COLORS = { BEGINNER: 'teal', INTERMEDIATE: 'purple', ADVANCED: 'red' };

// Domains that do not belong to basic programming languages:
const DOMAIN_SLUGS = ['web-dev', 'data-science', 'devops', 'cybersecurity', 'game-dev', 'system-design', 'blockchain', 'ai-ml'];

function CourseCard({ course, onClick }) {
  const meta = LANG_META[course.category?.slug] || { color: '#7C3AED', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.25)', emoji: '📚' };
  const enrolled = course.isEnrolled;

  return (
    <div 
      onClick={() => onClick(course.slug)}
      className="group relative bg-arena-bg3 border border-arena-border/60 hover:border-arena-purple hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] rounded-2xl p-6 cursor-pointer flex flex-col gap-4 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Decorative gradient orb on hover */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-arena-purple opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-300 pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
          style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
        >
          {meta.emoji}
        </div>
        <div className="flex items-center gap-2">
          <BadgeTag variant={DIFF_COLORS[course.difficulty] || 'gray'} className="text-[10px] tracking-wider font-bold shadow-sm">
            {course.difficulty}
          </BadgeTag>
          {enrolled && <span className="w-2.5 h-2.5 rounded-full bg-arena-teal shadow-[0_0_8px_#00D9B5]" title="Enrolled" />}
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <h3 className="font-display font-black text-lg text-white mb-1.5 group-hover:text-arena-purple2 transition-colors">{course.title}</h3>
        <p className="font-mono text-xs text-arena-muted leading-relaxed line-clamp-2">{course.description}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-arena-border/50 relative z-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-arena-dim flex items-center gap-1.5 bg-arena-bg px-2 py-1 rounded-md">
            <Icons.Book size={11} className="text-arena-purple2" /> 
            {course._count?.lessons || 0} lessons
          </span>
          <span className="font-mono text-xs text-arena-dim flex items-center gap-1.5 bg-arena-bg px-2 py-1 rounded-md">
            <Icons.Zap size={11} className="text-arena-teal" /> 
            +{course.xpReward}
          </span>
        </div>
        
        {enrolled && course.enrollment?.progress > 0 ? (
          <span className="font-mono text-xs text-arena-teal font-bold">{course.enrollment.progress}%</span>
        ) : (
          <Icons.ArrowRight size={14} className="text-arena-dim group-hover:text-arena-purple2 group-hover:translate-x-1 transition-all" />
        )}
      </div>

      {enrolled && course.enrollment?.progress > 0 && (
        <div className="relative z-10 mt-1">
          <ProgressBar value={course.enrollment.progress} max={100} color="teal" height={4} />
        </div>
      )}
    </div>
  );
}

function PathSection({ category, courses, onCourseClick }) {
  const meta = LANG_META[category.slug] || { color: '#7C3AED', emoji: '📚' };
  if (!courses.length) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg border border-arena-border" style={{ background: meta.bg }}>
            {meta.emoji}
          </div>
          <div>
            <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">{category.name} Curriculum</h2>
            <p className="font-mono text-xs text-arena-purple2 mt-1">From Zero to Hero Path ({courses.length} courses)</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.sort((a,b) => a.order - b.order).map((course) => (
          <CourseCard key={course.id} course={course} onClick={onCourseClick} />
        ))}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/courses/categories'),
      api.get('/courses?limit=300'),
    ]).then(([catRes, courseRes]) => {
      setCategories(catRes.data.categories || []);
      setCourses(courseRes.data.courses || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase());
    const matchDiff = !difficulty || c.difficulty === difficulty;
    const matchTab = activeTab === 'all' || (activeTab === 'enrolled' && c.isEnrolled) || (activeTab === 'completed' && c.enrollment?.completedAt);
    return matchSearch && matchDiff && matchTab;
  });

  // Organize dynamically based on slug
  const langCategories = categories.filter((c) => !DOMAIN_SLUGS.includes(c.slug));
  const domainCategories = categories.filter((c) => DOMAIN_SLUGS.includes(c.slug));

  const getCoursesByCategory = (catId) => filtered.filter((c) => c.categoryId === catId || c.category?.id === catId);
  const handleCourseClick = (slug) => navigate(`/courses/${slug}`);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={32} className="text-arena-purple2" />
          <p className="font-mono text-xs text-arena-purple animate-pulse">Loading curriculum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-arena-bg3 border border-arena-border/60 p-8 sm:p-12 shadow-2xl isolate">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-arena-purple opacity-10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-arena-teal opacity-10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <BadgeTag variant="purple" className="mb-4">CodeArena Curriculum</BadgeTag>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-tight">
            Learn To Code <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-arena-purple2 to-arena-teal">From Zero to Hero.</span>
          </h1>
          <p className="font-mono text-sm text-arena-muted mt-4 leading-relaxed max-w-xl">
            Our expertly crafted curriculum takes you from absolute beginner to advanced software architect. No prior experience required—just pick a path and we will guide you pixel by pixel.
          </p>
        </div>
      </div>

      {/* Control Tools (Search + Chips) */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-arena-bg2 border border-arena-border/50 p-4 rounded-2xl shadow-sm relative z-20 sticky top-4">
        <div className="relative flex-1 w-full md:max-w-xs group flex items-center">
          <Icons.Target size={16} className="absolute left-4 z-10 text-arena-dim group-focus-within:text-arena-purple transition-colors pointer-events-none" />
          <input
            type="text"
            placeholder="Search thousands of lessons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-arena-bg3 border border-arena-border/80 focus:border-arena-purple/50 focus:ring-1 focus:ring-arena-purple/50 rounded-xl pl-11 pr-4 py-2.5 font-mono text-sm text-white placeholder-arena-dim transition-all outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="flex bg-arena-bg3 p-1 rounded-xl border border-arena-border/60 shadow-inner">
            {['all', 'enrolled', 'completed'].map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-4 py-1.5 rounded-lg font-mono text-xs font-bold transition-all capitalize ${activeTab === t ? 'bg-arena-purple text-white shadow-md' : 'text-arena-dim hover:text-white hover:bg-arena-bg'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="flex bg-arena-bg3 p-1 rounded-xl border border-arena-border/60 shadow-inner">
            {['', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((d) => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold tracking-wider transition-all ${difficulty === d ? 'bg-arena-bg border border-arena-dim text-white' : 'text-arena-dim hover:text-white hover:bg-arena-bg'}`}>
                {d || 'ALL LEVELS'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 border border-dashed border-arena-border/60 rounded-3xl bg-arena-bg2">
          <Icons.Code size={48} className="text-arena-dim opacity-30 mb-4" />
          <h3 className="font-display text-xl text-white font-bold mb-2">No courses found</h3>
          <p className="font-mono text-xs text-arena-muted max-w-md text-center">Try adjusting your search criteria or explore a different difficulty level.</p>
        </div>
      ) : (
        <div className="space-y-16 mt-8">
          
          {/* Programming Languages Track */}
          {langCategories.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-arena-border/40">
                <div className="w-10 h-10 rounded-full bg-arena-purple/10 border border-arena-purple/30 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.2)]">
                  <Icons.Code size={20} className="text-arena-purple2" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-white tracking-wide">Coding Languages</h2>
                  <p className="font-mono text-xs text-arena-dim mt-0.5">Master the syntax from scratch.</p>
                </div>
              </div>
              
              {langCategories.map((cat) => (
                <PathSection key={cat.id} category={cat} courses={getCoursesByCategory(cat.id)} onCourseClick={handleCourseClick} />
              ))}
            </div>
          )}

          {/* Domain Specific Tracks */}
          {domainCategories.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-arena-border/40">
                <div className="w-10 h-10 rounded-full bg-arena-teal/10 border border-arena-teal/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,217,181,0.2)]">
                  <Icons.Target size={20} className="text-arena-teal" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-white tracking-wide">Domain Paths</h2>
                  <p className="font-mono text-xs text-arena-dim mt-0.5">Elevate from coder to specialized architect.</p>
                </div>
              </div>
              
              {domainCategories.map((cat) => (
                <PathSection key={cat.id} category={cat} courses={getCoursesByCategory(cat.id)} onCourseClick={handleCourseClick} />
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
