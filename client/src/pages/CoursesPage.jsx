import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Icons from '@/assets/icons';
import { Spinner, BadgeTag, ProgressBar } from '@/components/ui';

const LANG_META = {
  javascript: { color: '#F7DF1E', bg: 'rgba(247,223,30,0.1)',  border: 'rgba(247,223,30,0.25)',  emoji: '🟨' },
  typescript:  { color: '#3178C6', bg: 'rgba(49,120,198,0.1)',  border: 'rgba(49,120,198,0.25)',  emoji: '🔷' },
  python:      { color: '#4B8BBE', bg: 'rgba(75,139,190,0.12)', border: 'rgba(75,139,190,0.3)',   emoji: '🐍' },
  java:        { color: '#ED8B00', bg: 'rgba(237,139,0,0.1)',   border: 'rgba(237,139,0,0.25)',   emoji: '☕' },
  cpp:         { color: '#6db3f2', bg: 'rgba(109,179,242,0.1)', border: 'rgba(109,179,242,0.25)', emoji: '⚡' },
  c:           { color: '#9e9e9e', bg: 'rgba(158,158,158,0.08)',border: 'rgba(158,158,158,0.2)',  emoji: '🔧' },
  csharp:      { color: '#9B4F96', bg: 'rgba(155,79,150,0.1)',  border: 'rgba(155,79,150,0.25)',  emoji: '💜' },
  go:          { color: '#00ACD7', bg: 'rgba(0,172,215,0.1)',   border: 'rgba(0,172,215,0.25)',   emoji: '🐹' },
  rust:        { color: '#CE422B', bg: 'rgba(206,66,43,0.1)',   border: 'rgba(206,66,43,0.25)',   emoji: '🦀' },
  kotlin:      { color: '#7F52FF', bg: 'rgba(127,82,255,0.1)',  border: 'rgba(127,82,255,0.25)',  emoji: '🎯' },
  swift:       { color: '#FA7343', bg: 'rgba(250,115,67,0.1)',  border: 'rgba(250,115,67,0.25)',  emoji: '🍎' },
  php:         { color: '#8892BF', bg: 'rgba(136,146,191,0.1)', border: 'rgba(136,146,191,0.25)', emoji: '🐘' },
  ruby:        { color: '#CC342D', bg: 'rgba(204,52,45,0.1)',   border: 'rgba(204,52,45,0.25)',   emoji: '💎' },
  dart:        { color: '#0175C2', bg: 'rgba(1,117,194,0.1)',   border: 'rgba(1,117,194,0.25)',   emoji: '🎯' },
  bash:        { color: '#4EAA25', bg: 'rgba(78,170,37,0.1)',   border: 'rgba(78,170,37,0.25)',   emoji: '💻' },
  sql:         { color: '#E48E00', bg: 'rgba(228,142,0,0.1)',   border: 'rgba(228,142,0,0.25)',   emoji: '🗄️' },
  'web-dev':   { color: '#9D65F5', bg: 'rgba(157,101,245,0.1)', border: 'rgba(157,101,245,0.25)', emoji: '🌐' },
  'data-science': { color: '#00D9B5', bg: 'rgba(0,217,181,0.1)', border: 'rgba(0,217,181,0.25)', emoji: '📊' },
  devops:      { color: '#FF6B35', bg: 'rgba(255,107,53,0.1)',  border: 'rgba(255,107,53,0.25)',  emoji: '⚙️' },
  cybersecurity: { color: '#00FF88', bg: 'rgba(0,255,136,0.1)', border: 'rgba(0,255,136,0.25)',  emoji: '🔐' },
  'game-dev':  { color: '#FF3366', bg: 'rgba(255,51,102,0.1)',  border: 'rgba(255,51,102,0.25)',  emoji: '🎮' },
  'system-design': { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', emoji: '🏗️' },
  blockchain:  { color: '#F7931A', bg: 'rgba(247,147,26,0.1)',  border: 'rgba(247,147,26,0.25)',  emoji: '⛓️' },
  'ai-ml':     { color: '#A855F7', bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.25)',  emoji: '🤖' },
};

const DIFF_COLORS = { BEGINNER: 'teal', INTERMEDIATE: 'purple', ADVANCED: 'red' };

function CourseCard({ course, onClick }) {
  const meta = LANG_META[course.category?.slug] || { color: '#7C3AED', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.25)', emoji: '📚' };
  const enrolled = course.isEnrolled;

  return (
    <div onClick={() => onClick(course.slug)}
      className="arena-card p-5 cursor-pointer hover:-translate-y-1 transition-all duration-200 hover:border-arena-purple/40 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
          {meta.emoji}
        </div>
        <div className="flex items-center gap-2">
          <BadgeTag variant={DIFF_COLORS[course.difficulty] || 'gray'} className="text-xs">
            {course.difficulty}
          </BadgeTag>
          {enrolled && <span className="w-2 h-2 rounded-full bg-arena-teal" title="Enrolled" />}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-display font-bold text-sm text-arena-text mb-1 line-clamp-2">{course.title}</h3>
        <p className="font-mono text-xs text-arena-dim line-clamp-2">{course.description}</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-arena-border/40">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-arena-dim flex items-center gap-1">
            <Icons.Book size={10} /> {course._count?.lessons || 0} lessons
          </span>
          <span className="font-mono text-xs text-arena-purple2 flex items-center gap-1">
            <Icons.Zap size={10} /> {course.xpReward} XP
          </span>
        </div>
        {enrolled && course.enrollment?.progress > 0 && (
          <span className="font-mono text-xs text-arena-teal">{course.enrollment.progress}%</span>
        )}
      </div>

      {enrolled && course.enrollment?.progress > 0 && (
        <ProgressBar value={course.enrollment.progress} max={100} color="teal" height={3} />
      )}
    </div>
  );
}

function CategorySection({ category, courses, onCourseClick }) {
  const meta = LANG_META[category.slug] || { color: '#7C3AED', emoji: '📚' };
  const [expanded, setExpanded] = useState(true);

  if (!courses.length) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setExpanded(v => !v)}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{meta.emoji}</span>
          <div>
            <h2 className="font-display font-bold text-base text-arena-text">{category.name}</h2>
            <p className="font-mono text-xs text-arena-dim">{courses.length} courses</p>
          </div>
        </div>
        <Icons.ChevronRight size={16} className={`text-arena-dim transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </div>
      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onClick={onCourseClick} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/courses/categories'),
      api.get('/courses?limit=200'),
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

  const LANG_CATEGORIES = categories.filter((c) => ['javascript','typescript','python','java','cpp','c','csharp','go','rust','kotlin','swift','php','ruby','dart','bash','sql'].includes(c.slug));
  const FIELD_CATEGORIES = categories.filter((c) => !['javascript','typescript','python','java','cpp','c','csharp','go','rust','kotlin','swift','php','ruby','dart','bash','sql'].includes(c.slug));

  const getCoursesByCategory = (catId) => filtered.filter((c) => c.categoryId === catId || c.category?.id === catId);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size={32} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-2xl text-arena-text">Courses</h1>
        <p className="font-mono text-xs text-arena-dim mt-1">{courses.length} courses across {categories.length} categories</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Icons.Target size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-arena-dim" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="arena-input pl-9 py-2 text-sm w-full"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'enrolled', 'completed'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all capitalize ${activeTab === t ? 'bg-arena-purple/20 border border-arena-purple/40 text-arena-purple2' : 'border border-arena-border text-arena-dim hover:border-arena-purple/40'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((d) => (
            <button key={d} onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${difficulty === d ? 'bg-arena-purple/20 border border-arena-purple/40 text-arena-purple2' : 'border border-arena-border text-arena-dim hover:border-arena-purple/40'}`}>
              {d || 'All levels'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="arena-card p-12 text-center">
          <p className="font-mono text-sm text-arena-dim">No courses found. Check back soon!</p>
        </div>
      ) : (
        <>
          {/* Programming Languages */}
          {LANG_CATEGORIES.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Icons.Code size={16} className="text-arena-purple2" />
                <h2 className="font-display font-bold text-lg text-arena-text">Programming Languages</h2>
              </div>
              {LANG_CATEGORIES.map((cat) => (
                <CategorySection key={cat.id} category={cat} courses={getCoursesByCategory(cat.id)} onCourseClick={(slug) => navigate(`/courses/${slug}`)} />
              ))}
            </div>
          )}

          {/* Tech Fields */}
          {FIELD_CATEGORIES.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6 mt-4">
                <Icons.Target size={16} className="text-arena-teal" />
                <h2 className="font-display font-bold text-lg text-arena-text">Tech Fields</h2>
              </div>
              {FIELD_CATEGORIES.map((cat) => (
                <CategorySection key={cat.id} category={cat} courses={getCoursesByCategory(cat.id)} onCourseClick={(slug) => navigate(`/courses/${slug}`)} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
