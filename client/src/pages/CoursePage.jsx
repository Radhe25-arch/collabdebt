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
      await fetchCourse();
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
        <Spinner size={24} className="text-blue-600" />
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
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-sm font-mono transition-colors mt-4"
      >
        ← Back to Library
      </button>

      {/* ── Header Section ─────────────────────────────── */}
      <div className="space-y-6 lg:mr-32">
        <div className="flex flex-wrap items-center gap-3">
          {course.category && (
            <span className="font-mono text-xs uppercase tracking-widest text-blue-600 font-bold">
              {course.category.name}
            </span>
          )}
          {course.category && <span className="text-slate-300">•</span>}
          <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${
            course.difficulty === 'BEGINNER' ? 'text-green-600 border-green-200 bg-green-50' :
            course.difficulty === 'INTERMEDIATE' ? 'text-blue-600 border-blue-200 bg-blue-50' :
            'text-purple-600 border-purple-200 bg-purple-50'
          }`}>
            {course.difficulty}
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl text-slate-900 font-bold tracking-tight leading-tight">
          {course.title}
        </h1>

        <p className="font-mono text-sm text-slate-500 leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center gap-6 pt-2">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Lessons</span>
            <span className="font-mono text-sm text-slate-900 font-bold flex items-center gap-2">
              <Icons.Book size={13} className="text-blue-500" /> {lessons.length}
            </span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Reward</span>
            <span className="font-mono text-sm text-slate-900 font-bold flex items-center gap-2">
              <Icons.Zap size={13} className="text-amber-500" /> {course.xpReward} XP
            </span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Enrolled</span>
            <span className="font-mono text-sm text-slate-900 font-bold">
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
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-mono text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Icons.Play size={13} /> {progress > 0 ? 'Continue Learning' : 'Start Learning'}
                </button>
                <span className="font-mono text-sm text-blue-600 font-bold">{progress}% Complete</span>
              </div>
              {progress > 0 && (
                <div className="max-w-xs">
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={handleEnroll}
              disabled={actionLoading}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-mono text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              <Icons.Zap size={13} /> {actionLoading ? 'Enrolling...' : 'Enroll Now — Free'}
            </button>
          )}
        </div>
      </div>

      {/* ── Curriculum Syllabus ────────────────────────── */}
      <div className="pt-8 border-t border-slate-200">
        <h2 className="font-display text-xl text-slate-900 font-bold tracking-tight mb-8">Course Syllabus</h2>
        
        {lessons.length === 0 ? (
          <div className="p-8 text-center border border-slate-200 rounded-xl border-dashed">
            <p className="font-mono text-sm text-slate-400">Syllabus is being prepared for this course.</p>
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
                    ${isEnrolled ? 'cursor-pointer hover:bg-slate-50 hover:border-slate-200' : 'opacity-70'}
                  `}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold mt-0.5 ${
                    isCompleted ? 'bg-blue-100 border border-blue-200 text-blue-600' : 'bg-slate-100 border border-slate-200 text-slate-400'
                  }`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <h3 className={`font-mono text-sm font-semibold ${isCompleted ? 'text-blue-600 line-through opacity-70' : isEnrolled ? 'text-slate-900 group-hover:text-blue-600' : 'text-slate-600'} transition-colors`}>
                        {lesson.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1 shrink-0 font-semibold">
                          <Icons.Zap size={10} className="text-amber-500" /> {lesson.xpReward} XP
                        </span>
                        {isEnrolled && (
                          <Icons.ArrowRight size={13} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
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
