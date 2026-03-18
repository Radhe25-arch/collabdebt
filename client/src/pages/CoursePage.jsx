import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Icons from '@/assets/icons';
import { Spinner, BadgeTag, ProgressBar } from '@/components/ui';

// Simple difficulty colors matching the clean UI
const DIFF_COLORS = { BEGINNER: 'green', INTERMEDIATE: 'blue', ADVANCED: 'purple' };

export default function CoursePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/courses/${slug}`)
      .then(res => setCourse(res.data.course || res.data))
      .catch(err => {
        console.error("Failed to load course", err);
        navigate('/courses');
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  const handleEnroll = async () => {
    try {
      setActionLoading(true);
      await api.post(`/courses/${slug}/enroll`);
      // Refresh course data
      const res = await api.get(`/courses/${slug}`);
      setCourse(res.data.course || res.data);
    } catch (error) {
      console.error('Enrollment failed', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleContinue = () => {
    if (!course?.lessons?.length) return;
    // Find first incomplete lesson, or just go to first
    const firstLesson = course.lessons[0].slug;
    navigate(`/courses/${slug}/${firstLesson}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size={24} className="text-white/40" />
      </div>
    );
  }

  if (!course) return null;

  const isEnrolled = course.isEnrolled || !!course.enrollment;
  const progress = course.enrollment?.progress || 0;
  const lessons = course.lessons || [];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      {/* ── Back Navigation ────────────────────────────── */}
      <button 
        onClick={() => navigate('/courses')}
        className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-body transition-colors mt-4"
      >
        <Icons.ArrowLeft size={14} /> Back to Library
      </button>

      {/* ── Header Section ─────────────────────────────── */}
      <div className="space-y-6 lg:mr-32">
        <div className="flex flex-wrap items-center gap-3">
          {course.category && (
            <span className="font-mono text-xs uppercase tracking-widest text-arena-purple2">
              {course.category.name}
            </span>
          )}
          {course.category && <span className="text-white/20">•</span>}
          <BadgeTag variant={DIFF_COLORS[course.difficulty] || 'gray'} className="text-[10px] px-1.5 py-0.5 uppercase tracking-wider bg-transparent border border-current text-opacity-80">
            {course.difficulty}
          </BadgeTag>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl text-white font-semibold tracking-tight leading-tight">
          {course.title}
        </h1>

        <p className="font-body text-base text-white/60 leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center gap-6 pt-2">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Lessons</span>
            <span className="font-body text-sm text-white font-medium flex items-center gap-2">
              <Icons.Book size={14} className="text-white/40" /> {lessons.length}
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Reward</span>
            <span className="font-body text-sm text-white font-medium flex items-center gap-2">
              <Icons.Zap size={14} className="text-arena-teal" /> {course.xpReward} XP
            </span>
          </div>
        </div>

        {/* Action Button & Progress */}
        <div className="pt-8">
          {isEnrolled ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleContinue}
                  className="bg-white text-black px-6 py-2.5 rounded-lg font-body text-sm font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
                >
                  <Icons.Play size={14} /> Continue Learning
                </button>
                <span className="font-mono text-sm text-arena-teal font-medium">{progress}% Complete</span>
              </div>
              <div className="max-w-xs">
                <ProgressBar value={progress} max={100} color="teal" height={4} />
              </div>
            </div>
          ) : (
            <button 
              onClick={handleEnroll}
              disabled={actionLoading}
              className="bg-white text-black px-6 py-2.5 rounded-lg font-body text-sm font-semibold hover:bg-white/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {actionLoading ? <Spinner size={14} /> : <Icons.Zap size={14} />} 
              Enroll Now — Free
            </button>
          )}
        </div>
      </div>

      {/* ── Curriculum Syllabus ────────────────────────── */}
      <div className="pt-8 border-t border-white/10">
        <h2 className="font-display text-xl text-white font-semibold tracking-tight mb-8">Course Syllabus</h2>
        
        {lessons.length === 0 ? (
          <div className="p-8 text-center border border-white/5 rounded-xl border-dashed">
            <p className="font-body text-sm text-white/40">Syllabus is being prepared for this course.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {lessons.map((lesson, index) => (
              <div 
                key={lesson.id}
                onClick={() => isEnrolled ? navigate(`/courses/${slug}/${lesson.slug}`) : null}
                className={`group flex items-start gap-4 p-4 rounded-xl border border-transparent transition-all
                  ${isEnrolled ? 'cursor-pointer hover:bg-white/5 hover:border-white/10' : 'opacity-70'}
                `}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs text-white/40 mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h3 className={`font-body text-base font-medium ${isEnrolled ? 'text-white/90 group-hover:text-white' : 'text-white/70'}`}>
                      {lesson.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-white/30 flex items-center gap-1 shrink-0">
                        <Icons.Zap size={12} /> {lesson.xpReward} XP
                      </span>
                      {isEnrolled && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <Icons.ChevronRight size={14} className="text-white/40 group-hover:text-white/80" />
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="font-body text-sm text-white/40 line-clamp-2 pr-12">
                    {lesson.description || "Master the core concepts in this lesson module."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
