import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

// ── Metadata ──────────────────────────────────────────────
const LANG_META = {
  javascript:   { color: '#F7DF1E', dark: '#1C1900', label: 'JS',   emoji: '⚡', desc: 'The language of the web' },
  typescript:   { color: '#3178C6', dark: '#001429', label: 'TS',   emoji: '🔷', desc: 'JavaScript with superpowers' },
  python:       { color: '#4B8BBE', dark: '#001520', label: 'PY',   emoji: '🐍', desc: 'Simple. Powerful. Everywhere.' },
  java:         { color: '#ED8B00', dark: '#1A0E00', label: 'JV',   emoji: '☕', desc: 'Write once, run anywhere' },
  cpp:          { color: '#659BD3', dark: '#001020', label: 'C++',  emoji: '⚡', desc: 'Raw power, refined control' },
  c:            { color: '#A8B9CC', dark: '#111318', label: 'C',    emoji: '🔧', desc: 'The foundation of everything' },
  csharp:       { color: '#9B4F96', dark: '#150010', label: 'C#',   emoji: '💜', desc: "Microsoft's modern powerhouse" },
  go:           { color: '#00ACD7', dark: '#001A22', label: 'GO',   emoji: '🐹', desc: 'Fast. Simple. Reliable.' },
  rust:         { color: '#CE422B', dark: '#1A0500', label: 'RS',   emoji: '🦀', desc: 'Systems code without fear' },
  kotlin:       { color: '#7F52FF', dark: '#0D0020', label: 'KT',   emoji: '🎯', desc: 'Modern Android, beautiful syntax' },
  swift:        { color: '#FA7343', dark: '#1A0800', label: 'SW',   emoji: '🍎', desc: 'The soul of Apple platforms' },
  php:          { color: '#8892BF', dark: '#0D0F1A', label: 'PHP',  emoji: '🐘', desc: '80% of the web runs on this' },
  ruby:         { color: '#CC342D', dark: '#1A0400', label: 'RB',   emoji: '💎', desc: 'Optimized for developer joy' },
  dart:         { color: '#0175C2', dark: '#001525', label: 'DT',   emoji: '🎯', desc: 'Power behind Flutter' },
  bash:         { color: '#4EAA25', dark: '#051200', label: 'SH',   emoji: '💻', desc: 'Automate everything' },
  sql:          { color: '#E48E00', dark: '#1A0E00', label: 'SQL',  emoji: '🗄️', desc: 'Every app needs a database' },
  'r-lang':     { color: '#276DC3', dark: '#001020', label: 'R',    emoji: '📊', desc: 'Statistics & data science' },
  scala:        { color: '#DC322F', dark: '#1A0400', label: 'SC',   emoji: '⚙️', desc: 'Functional + OOP on the JVM' },
};

const FIELD_META = {
  'web-dev':          { color: '#9D65F5', emoji: '🌐', label: 'Web Development' },
  'mobile-dev':       { color: '#00D9B5', emoji: '📱', label: 'Mobile Dev' },
  'data-science':     { color: '#3B82F6', emoji: '📊', label: 'Data Science & ML' },
  'devops':           { color: '#F59E0B', emoji: '⚙️', label: 'DevOps & Cloud' },
  'cybersecurity':    { color: '#10B981', emoji: '🔐', label: 'Cybersecurity' },
  'game-dev':         { color: '#EF4444', emoji: '🎮', label: 'Game Development' },
  'system-design':    { color: '#8B5CF6', emoji: '🏗️', label: 'System Design' },
  'blockchain':       { color: '#F97316', emoji: '⛓️', label: 'Blockchain & Web3' },
  'ai-ml':            { color: '#A855F7', emoji: '🤖', label: 'AI & Prompt Eng.' },
  'dsa':              { color: '#06B6D4', emoji: '🧠', label: 'DSA & Algorithms' },
  'cloud':            { color: '#0EA5E9', emoji: '☁️', label: 'Cloud Computing' },
  'digital-marketing':{ color: '#F43F5E', emoji: '📈', label: 'Digital Marketing' },
  'ui-ux':            { color: '#EC4899', emoji: '🎨', label: 'UI/UX Design' },
  'product-mgmt':     { color: '#84CC16', emoji: '📋', label: 'Product Management' },
  'interview-prep':   { color: '#FBBF24', emoji: '🎯', label: 'Interview Prep' },
  'it-support':       { color: '#6366F1', emoji: '🖥️', label: 'IT Support' },
  'data-analytics':   { color: '#14B8A6', emoji: '📉', label: 'Data Analytics' },
  'project-mgmt':     { color: '#78716C', emoji: '📅', label: 'Project Management' },
  'azure':            { color: '#0078D4', emoji: '☁️', label: 'Azure & Microsoft' },
  'android':          { color: '#3DDC84', emoji: '🤖', label: 'Android Dev' },
  'api-dev':          { color: '#F59E0B', emoji: '🔌', label: 'API Development' },
  'testing':          { color: '#10B981', emoji: '🧪', label: 'Testing & QA' },
  'cs-fundamentals':  { color: '#6366F1', emoji: '💡', label: 'Computer Science' },
  'open-source':      { color: '#22C55E', emoji: '🌍', label: 'Open Source' },
};

const LANG_SLUGS = Object.keys(LANG_META);
const DIFF_LABEL = { BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced' };
const DIFF_COLOR = { BEGINNER: '#00D9B5', INTERMEDIATE: '#9D65F5', ADVANCED: '#f87171' };

// ── Language Card ─────────────────────────────────────────
function LangCard({ category, courses, onClick }) {
  const meta = LANG_META[category.slug] || { color: '#7C3AED', dark: '#0D0020', label: '?', emoji: '📦', desc: '' };
  const beginner   = courses.filter(c => c.difficulty === 'BEGINNER').length;
  const inter      = courses.filter(c => c.difficulty === 'INTERMEDIATE').length;
  const advanced   = courses.filter(c => c.difficulty === 'ADVANCED').length;

  return (
    <div
      onClick={() => onClick(category.slug)}
      className="relative overflow-hidden rounded-2xl cursor-pointer group transition-all duration-300 hover:-translate-y-2"
      style={{
        background: `linear-gradient(135deg, ${meta.dark} 0%, #0A0A0F 100%)`,
        border: `1px solid ${meta.color}22`,
        boxShadow: `0 0 0 1px ${meta.color}11`,
      }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 0%, ${meta.color}15 0%, transparent 70%)` }} />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)` }} />

      <div className="p-5 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black"
              style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30`, color: meta.color }}>
              {meta.label}
            </div>
            <div>
              <h3 className="font-display font-black text-sm text-white">{category.name}</h3>
              <p className="font-mono text-xs mt-0.5" style={{ color: `${meta.color}99` }}>{meta.desc}</p>
            </div>
          </div>
          <span className="text-lg">{meta.emoji}</span>
        </div>

        {/* Course count badges */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          {beginner > 0 && (
            <span className="px-2 py-0.5 rounded-md font-mono text-xs" style={{ background: '#00D9B515', color: '#00D9B5', border: '1px solid #00D9B530' }}>
              {beginner} Beginner
            </span>
          )}
          {inter > 0 && (
            <span className="px-2 py-0.5 rounded-md font-mono text-xs" style={{ background: '#9D65F515', color: '#9D65F5', border: '1px solid #9D65F530' }}>
              {inter} Inter
            </span>
          )}
          {advanced > 0 && (
            <span className="px-2 py-0.5 rounded-md font-mono text-xs" style={{ background: '#f8717115', color: '#f87171', border: '1px solid #f8717130' }}>
              {advanced} Advanced
            </span>
          )}
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-arena-dim">{courses.length} courses total</span>
          <div className="flex items-center gap-1 font-mono text-xs transition-all group-hover:gap-2"
            style={{ color: meta.color }}>
            Explore <span>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Field Card ────────────────────────────────────────────
function FieldCard({ category, courses, onClick }) {
  const meta = FIELD_META[category.slug] || { color: '#7C3AED', emoji: '📚', label: category.name };
  const totalXP = courses.reduce((s, c) => s + c.xpReward, 0);

  return (
    <div
      onClick={() => onClick(category.slug)}
      className="arena-card p-5 cursor-pointer group hover:-translate-y-1 transition-all duration-200"
      style={{ borderColor: `${meta.color}20` }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${meta.color}12`, border: `1px solid ${meta.color}25` }}>
          {meta.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-sm text-arena-text mb-1">{category.name}</h3>
          <p className="font-mono text-xs text-arena-dim mb-3 line-clamp-1">{category.description}</p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-arena-dim">{courses.length} courses</span>
            <span className="font-mono text-xs" style={{ color: meta.color }}>
              ⚡ {totalXP.toLocaleString()} XP total
            </span>
          </div>
        </div>
        <div className="text-arena-dim group-hover:text-arena-text transition-colors">→</div>
      </div>
    </div>
  );
}

// ── Course Mini Card ──────────────────────────────────────
function CourseCard({ course, onClick }) {
  const diff = course.difficulty;
  return (
    <div
      onClick={() => onClick(course.slug)}
      className="arena-card p-4 cursor-pointer hover:-translate-y-0.5 transition-all duration-150 hover:border-arena-purple/30"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-display font-bold text-xs text-arena-text leading-tight pr-2">{course.title}</h4>
        <span className="px-1.5 py-0.5 rounded font-mono text-xs flex-shrink-0"
          style={{ background: `${DIFF_COLOR[diff]}15`, color: DIFF_COLOR[diff], border: `1px solid ${DIFF_COLOR[diff]}30` }}>
          {DIFF_LABEL[diff]}
        </span>
      </div>
      <p className="font-mono text-xs text-arena-dim line-clamp-2 mb-3">{course.description}</p>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-arena-dim">📚 {course._count?.lessons || 0} lessons</span>
        <span className="font-mono text-xs text-arena-purple2">⚡ {course.xpReward} XP</span>
      </div>
    </div>
  );
}

// ── Category Detail Modal ─────────────────────────────────
function CategoryModal({ category, courses, onClose, onCourseClick }) {
  const meta = LANG_META[category?.slug] || FIELD_META[category?.slug] || { color: '#7C3AED', emoji: '📚' };
  const isLang = LANG_SLUGS.includes(category?.slug);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!category) return null;

  const grouped = {
    BEGINNER: courses.filter(c => c.difficulty === 'BEGINNER'),
    INTERMEDIATE: courses.filter(c => c.difficulty === 'INTERMEDIATE'),
    ADVANCED: courses.filter(c => c.difficulty === 'ADVANCED'),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl z-10"
        style={{ background: '#0D0D14', border: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Header */}
        <div className="sticky top-0 z-10 px-6 pt-6 pb-4"
          style={{ background: 'linear-gradient(180deg, #0D0D14 80%, transparent 100%)' }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{meta.emoji}</span>
              <div>
                <h2 className="font-display font-black text-xl text-white">{category.name}</h2>
                <p className="font-mono text-xs text-arena-dim">{courses.length} courses · Start from zero, reach expert</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-arena-bg3 flex items-center justify-center text-arena-dim hover:text-white transition-colors">✕</button>
          </div>

          {/* Journey bar */}
          <div className="flex items-center gap-2 mt-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <span className="font-mono text-xs text-arena-dim">Your path:</span>
            {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((d, i) => (
              <div key={d} className="flex items-center gap-2">
                {i > 0 && <span className="text-arena-dim text-xs">→</span>}
                <span className="px-2 py-0.5 rounded font-mono text-xs"
                  style={{ background: `${DIFF_COLOR[d]}15`, color: DIFF_COLOR[d], border: `1px solid ${DIFF_COLOR[d]}30` }}>
                  {grouped[d].length} {DIFF_LABEL[d]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Courses grouped by difficulty */}
        <div className="px-6 pb-6 space-y-6">
          {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((diff) => (
            grouped[diff].length > 0 && (
              <div key={diff}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: DIFF_COLOR[diff] }} />
                  <h3 className="font-display font-bold text-sm" style={{ color: DIFF_COLOR[diff] }}>
                    {diff === 'BEGINNER' ? '🌱 Start Here — Zero to Confident' :
                     diff === 'INTERMEDIATE' ? '🚀 Level Up — Build Real Things' :
                     '🔥 Go Deep — Master the Craft'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {grouped[diff].map(course => (
                    <CourseCard key={course.id} course={course} onClick={(slug) => { onCourseClick(slug); onClose(); }} />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function CoursesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('languages');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalCourses, setModalCourses] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/courses/categories'),
      api.get('/courses?limit=500'),
    ]).then(([catRes, courseRes]) => {
      setCategories(catRes.data.categories || []);
      setCourses(courseRes.data.courses || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const getCoursesByCategory = (catId) =>
    courses.filter(c => c.categoryId === catId || c.category?.id === catId);

  const langCategories = categories.filter(c => LANG_SLUGS.includes(c.slug));
  const fieldCategories = categories.filter(c => !LANG_SLUGS.includes(c.slug));

  const filteredLangs = langCategories.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredFields = fieldCategories.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    getCoursesByCategory(c.id).some(course => course.title.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCategoryClick = (slug) => {
    const cat = categories.find(c => c.slug === slug);
    if (!cat) return;
    const catCourses = getCoursesByCategory(cat.id);
    setSelectedCategory(cat);
    setModalCourses(catCourses);
  };

  const totalCourses = courses.length;
  const totalCategories = categories.length;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="font-mono text-sm text-arena-dim animate-pulse">Loading courses...</div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">

      {/* ── Hero Header ───────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl p-8"
        style={{ background: 'linear-gradient(135deg, #0D0A1F 0%, #0A0A0F 50%, #0D1A0D 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(124,58,237,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,217,181,0.2) 0%, transparent 50%)' }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 font-mono text-xs"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#9D65F5' }}>
            📚 Course Library
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-2" style={{ letterSpacing: '-1.5px' }}>
            Every Skill.<br />
            <span style={{ background: 'linear-gradient(90deg, #7C3AED, #00D9B5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Zero to Expert.
            </span>
          </h1>
          <p className="font-mono text-sm text-arena-dim mb-6 max-w-lg">
            {totalCourses} courses across {totalCategories} tracks. Start anywhere. Go everywhere.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            {[
              { v: `${totalCourses}+`, l: 'Total Courses' },
              { v: `${langCategories.length}`, l: 'Languages' },
              { v: `${fieldCategories.length}`, l: 'Tech Fields' },
              { v: '100%', l: 'Always Free' },
            ].map(({ v, l }) => (
              <div key={l} className="flex items-baseline gap-2">
                <span className="font-display font-black text-xl text-white">{v}</span>
                <span className="font-mono text-xs text-arena-dim">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search + Tabs ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-arena-dim text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search languages, topics, skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="arena-input pl-9 py-2.5 text-sm w-full"
          />
        </div>
        <div className="flex gap-2">
          {[
            { id: 'languages', label: '⚡ Languages', count: langCategories.length },
            { id: 'fields',    label: '🚀 Tech Fields', count: fieldCategories.length },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2.5 rounded-xl font-mono text-xs transition-all whitespace-nowrap flex items-center gap-2"
              style={activeTab === tab.id ? {
                background: 'rgba(124,58,237,0.2)',
                border: '1px solid rgba(124,58,237,0.4)',
                color: '#9D65F5',
              } : {
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#666',
              }}>
              {tab.label}
              <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(255,255,255,0.08)' }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Programming Languages ──────────────────────── */}
      {activeTab === 'languages' && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'rgba(247,223,30,0.1)', border: '1px solid rgba(247,223,30,0.2)' }}>⚡</div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">Programming Languages</h2>
              <p className="font-mono text-xs text-arena-dim">Pick a language. Own it completely.</p>
            </div>
          </div>

          {filteredLangs.length === 0 ? (
            <div className="arena-card p-10 text-center">
              <p className="font-mono text-sm text-arena-dim">No languages found for "{search}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredLangs.map(cat => (
                <LangCard
                  key={cat.id}
                  category={cat}
                  courses={getCoursesByCategory(cat.id)}
                  onClick={handleCategoryClick}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tech Fields ────────────────────────────────── */}
      {activeTab === 'fields' && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'rgba(0,217,181,0.1)', border: '1px solid rgba(0,217,181,0.2)' }}>🚀</div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">Tech Fields & Career Tracks</h2>
              <p className="font-mono text-xs text-arena-dim">Industry skills. Real careers. No fluff.</p>
            </div>
          </div>

          {filteredFields.length === 0 ? (
            <div className="arena-card p-10 text-center">
              <p className="font-mono text-sm text-arena-dim">No fields found for "{search}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFields.map(cat => (
                <FieldCard
                  key={cat.id}
                  category={cat}
                  courses={getCoursesByCategory(cat.id)}
                  onClick={handleCategoryClick}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Category Modal ─────────────────────────────── */}
      {selectedCategory && (
        <CategoryModal
          category={selectedCategory}
          courses={modalCourses}
          onClose={() => setSelectedCategory(null)}
          onCourseClick={(slug) => navigate(`/courses/${slug}`)}
        />
      )}
    </div>
  );
}
