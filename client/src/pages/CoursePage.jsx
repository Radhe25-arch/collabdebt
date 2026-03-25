import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Icons from '@/assets/icons';
import { Spinner, BadgeTag, ProgressBar } from '@/components/ui';

const DIFF_COLORS = { BEGINNER: 'green', INTERMEDIATE: 'blue', ADVANCED: 'purple' };

export default function CoursePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${slug}`);
      setCourse(res.data.course);
      setEnrollment(res.data.enrollment || null);
      setCompletedLessonIds(res.data.completedLessonIds || []);
    } catch (err) {
      console.error("Failed to load course", err);
      navigate('/courses');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCourse().finally(() => setLoading(false));
  }, [slug]);

  const handleEnroll = async () => {
    try {
      setActionLoading(true);
      await api.post(`/courses/${slug}/enroll`);
      await fetchCourse(); // refresh to get enrollment object
    } catch (error) {
      console.error('Enrollment failed', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartLesson = (lessonSlug) => {
    navigate(`/courses/${slug}/${lessonSlug}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size={24} className="text-white/40" />
      </div>
    );
  }

  if (!course) return null;

  const isEnrolled = !!enrollment;
  const progress = enrollment?.progress || 0;
  const lessons = course.lessons || [];

  // Find first incomplete lesson
  const nextLesson = lessons.find(l => !completedLessonIds.includes(l.id)) || lessons[0];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      {/* ── Back Navigation ────────────────────────────── */}
      <button 
        onClick={() => navigate('/courses')}
        className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-mono transition-colors mt-4"
      >
        ← Back to Library
      </button>

      {/* ── Header Section ─────────────────────────────── */}
      <div className="space-y-6 lg:mr-32">
        <div className="flex flex-wrap items-center gap-3">
          {course.category && (
            <span className="font-mono text-xs uppercase tracking-widest text-blue-700">
              {course.category.name}
            </span>
          )}
          {course.category && <span className="text-white/20">•</span>}
          <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider border ${
            course.difficulty === 'BEGINNER' ? 'text-green-400 border-green-400/30' :
            course.difficulty === 'INTERMEDIATE' ? 'text-blue-400 border-blue-400/30' :
            'text-purple-400 border-purple-400/30'
          }`}>
            {course.difficulty}
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl text-white font-semibold tracking-tight leading-tight">
          {course.title}
        </h1>

        <p className="font-mono text-sm text-white/60 leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center gap-6 pt-2">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Lessons</span>
            <span className="font-mono text-sm text-white font-medium flex items-center gap-2">
              📚 {lessons.length}
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Reward</span>
            <span className="font-mono text-sm text-white font-medium flex items-center gap-2">
              ⚡ {course.xpReward} XP
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Enrolled</span>
            <span className="font-mono text-sm text-white font-medium">
              {course._count?.enrollments || 0} students
            </span>
          </div>
        </div>

        {/* Action Button & Progress */}
        <div className="pt-8">
          {isEnrolled ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => nextLesson && handleStartLesson(nextLesson.slug)}
                  className="bg-white text-black px-6 py-2.5 rounded-lg font-mono text-sm font-bold hover:bg-white/90 transition-colors flex items-center gap-2"
                >
                  ▶ {progress > 0 ? 'Continue Learning' : 'Start Learning'}
                </button>
                <span className="font-mono text-sm text-indigo-600 font-medium">{progress}% Complete</span>
              </div>
              {progress > 0 && (
                <div className="max-w-xs">
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={handleEnroll}
              disabled={actionLoading}
              className="bg-white text-black px-6 py-2.5 rounded-lg font-mono text-sm font-bold hover:bg-white/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {actionLoading ? '...' : '⚡'} Enroll Now — Free
            </button>
          )}
        </div>
      </div>

      {/* ── Curriculum Syllabus ────────────────────────── */}
      <div className="pt-8 border-t border-white/10">
        <h2 className="font-display text-xl text-white font-semibold tracking-tight mb-8">Course Syllabus</h2>
        
        {lessons.length === 0 ? (
          <div className="p-8 text-center border border-white/5 rounded-xl border-dashed">
            <p className="font-mono text-sm text-white/40">Syllabus is being prepared for this course.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessonIds.includes(lesson.id);
              return (
                <div 
                  key={lesson.id}
                  onClick={() => isEnrolled ? handleStartLesson(lesson.slug) : null}
                  className={`group flex items-start gap-4 p-4 rounded-xl border border-transparent transition-all
                    ${isEnrolled ? 'cursor-pointer hover:bg-white/5 hover:border-white/10' : 'opacity-70'}
                  `}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs mt-0.5 ${
                    isCompleted ? 'bg-indigo-600/20 border border-indigo-600/40 text-indigo-600' : 'bg-white/5 border border-white/10 text-white/40'
                  }`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <h3 className={`font-mono text-sm font-medium ${isCompleted ? 'text-indigo-600 line-through opacity-70' : isEnrolled ? 'text-white/90 group-hover:text-white' : 'text-white/70'}`}>
                        {lesson.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-white/30 flex items-center gap-1 shrink-0">
                          ⚡ {lesson.xpReward} XP
                        </span>
                        {isEnrolled && (
                          <span className="text-white/40 group-hover:text-white/80 transition-colors">→</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
