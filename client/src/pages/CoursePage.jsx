import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Icons from '@/assets/icons';
 
export default function CoursePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
 
  const [course, setCourse]           = useState(null);
  const [enrollment, setEnrollment]   = useState(null);
  const [loading, setLoading]         = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState('0');
 
  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${slug}`);
      setCourse(res.data.course);
      setEnrollment(res.data.enrollment || null);
    } catch (err) {
      console.error('Failed to load course', err);
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
 
  const handleContinue = () => {
    const lessons = course?.lessons || [];
    // Find first incomplete lesson or just go to first
    const firstLesson = lessons[0];
    if (firstLesson?.slug) {
      navigate(`/courses/${slug}/${firstLesson.slug}`);
    } else {
      // Fallback: navigate to course page (already here) or show message
      navigate(`/courses/${slug}`);
    }
  };
 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }
 
  if (!course) return null;
 
  const isEnrolled = !!enrollment;
  const lessons = course.lessons || [];
  const lessonCount = lessons.length;
  const hours = Math.max(1, Math.round((course.duration || 120) / 60));
 
  const diffColor =
    course.difficulty === 'BEGINNER'    ? 'bg-emerald-100 text-emerald-700' :
    course.difficulty === 'INTERMEDIATE' ? 'bg-blue-100 text-blue-700' :
    'bg-purple-100 text-purple-700';
 
  return (
    <div className="max-w-6xl mx-auto pb-24 font-sans animate-fade-in px-2 md:px-0">
 
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
        <button onClick={() => navigate('/courses')} className="hover:text-blue-600 transition-colors font-medium">
          Course Catalog
        </button>
        <Icons.ChevronDown size={14} className="-rotate-90 text-slate-300" />
        <span className="text-slate-900 font-semibold truncate">{course.title}</span>
      </div>
 
      {/* ── Header ── */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${diffColor}`}>
            {course.difficulty || 'BEGINNER'}
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">FREE</span>
          {isEnrolled && (
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Icons.Check size={10} /> Enrolled
            </span>
          )}
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-slate-900 font-extrabold tracking-tight mb-3">
          {course.title}
        </h1>
        <p className="text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed">
          {course.description}
        </p>
      </div>
 
      <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
 
        {/* ── Left Column ── */}
        <div className="lg:w-2/3 space-y-6 md:space-y-8">
 
          {/* Course Overview Banner */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl md:rounded-3xl p-5 md:p-8">
            <h2 className="font-bold text-slate-900 text-lg md:text-xl mb-4 flex items-center gap-2">
              <Icons.BookOpen size={20} className="text-blue-600" />
              What you'll learn
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Build real-world projects from scratch',
                'Master industry-standard best practices',
                'Work through hands-on coding challenges',
                'Earn XP and level up your profile',
                'Get AI mentor support when stuck',
                'Learn at your own pace, forever free',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icons.Check size={11} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-slate-700 font-medium leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
 
          {/* Enrollment Stats */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                {['bg-blue-200', 'bg-emerald-200', 'bg-purple-200'].map((bg, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-white`} />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-600">
                <strong className="text-slate-900">{(course._count?.enrollments || 0).toLocaleString() || '1,240'}</strong> students enrolled
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Icons.Zap size={14} className="text-amber-500" />
              <span className="font-bold text-slate-700">+{course.xpReward || 500} XP</span>
              <span className="text-slate-400">on completion</span>
            </div>
          </div>
 
          {/* Description */}
          <div className="text-slate-600 leading-relaxed space-y-3 text-sm md:text-base">
            <p>Designed for developers who want to level up their skills with real, practical experience. This course takes you from fundamentals to advanced techniques through hands-on projects.</p>
            <p>Each lesson is packed with examples, code challenges, and quizzes. Complete the course to earn your XP and advance your rank on the leaderboard.</p>
          </div>
 
          {/* Syllabus Accordion */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Icons.Book size={20} className="text-slate-400" />
                Syllabus
                {lessonCount > 0 && (
                  <span className="text-sm font-normal text-slate-400 ml-1">({lessonCount} lessons)</span>
                )}
              </h2>
              {lessonCount > 1 && (
                <button
                  onClick={() => setExpandedSection(expandedSection ? null : '0')}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {expandedSection ? 'Collapse' : 'Expand All'}
                </button>
              )}
            </div>
 
            <div className="space-y-3">
              {lessons.length === 0 ? (
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 border-dashed text-center">
                  <Icons.Clock size={24} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 font-medium text-sm">Syllabus is being finalized.</p>
                  <p className="text-slate-400 text-xs mt-1">Check back soon!</p>
                </div>
              ) : (
                lessons.map((lesson, idx) => {
                  const isExpanded = expandedSection === String(idx);
                  return (
                    <div key={lesson.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-200 transition-colors">
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : String(idx))}
                        className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-slate-50/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm flex-shrink-0">
                            {String(idx + 1).padStart(2, '0')}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 truncate">{lesson.title}</h3>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">{lesson.duration || 15} mins</p>
                          </div>
                        </div>
                        <Icons.ChevronDown
                          size={18}
                          className={`text-slate-400 transition-transform flex-shrink-0 ml-2 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
 
                      {isExpanded && (
                        <div className="px-4 md:px-5 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50">
                          <div
                            className="py-3 flex items-center justify-between text-sm group cursor-pointer"
                            onClick={() => isEnrolled && navigate(`/courses/${slug}/${lesson.slug}`)}
                          >
                            <div className={`flex items-center gap-3 font-medium ${isEnrolled ? 'text-slate-600 group-hover:text-blue-600' : 'text-slate-400'}`}>
                              <Icons.Play size={15} className={isEnrolled ? 'text-slate-400 group-hover:text-blue-600' : 'text-slate-300'} />
                              {lesson.title}
                            </div>
                            {isEnrolled ? (
                              <span className="text-xs text-blue-600 font-semibold flex-shrink-0">Start →</span>
                            ) : (
                              <span className="text-xs text-slate-400 font-medium flex-shrink-0 flex items-center gap-1">
                                <Icons.Lock size={11} /> Enroll to unlock
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
 
        {/* ── Right Column ── */}
        <div className="lg:w-1/3 space-y-4">
 
          {/* CTA Card — sticky on desktop */}
          <div className="bg-white border border-slate-200 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] lg:sticky lg:top-24">
 
            {/* Progress if enrolled */}
            {isEnrolled && enrollment?.progress !== undefined && (
              <div className="mb-5 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex justify-between text-xs font-bold text-blue-700 mb-2">
                  <span>Your Progress</span>
                  <span>{enrollment.progress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
              </div>
            )}
 
            {/* Course Details */}
            <h3 className="font-bold text-slate-900 mb-5">Course Details</h3>
            <div className="space-y-3.5 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icons.Clock size={15} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Duration</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{hours} Hours</span>
              </div>
 
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icons.Zap size={15} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Level</span>
                </div>
                <span className="text-sm font-bold text-slate-900 capitalize">{course.difficulty?.toLowerCase() || 'Beginner'}</span>
              </div>
 
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icons.Book size={15} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Lessons</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{lessonCount}</span>
              </div>
 
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icons.Globe size={15} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Language</span>
                </div>
                <span className="text-sm font-bold text-slate-900">English</span>
              </div>
 
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Icons.Zap size={15} className="text-amber-500" />
                  </div>
                  <span className="text-sm font-medium">XP Reward</span>
                </div>
                <span className="text-sm font-bold text-amber-600">+{course.xpReward || 500} XP</span>
              </div>
            </div>
 
            {/* Instructor */}
            <div className="pt-5 border-t border-slate-100 mb-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Instructor</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  AJ
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Alex Johnson</p>
                  <p className="text-xs text-slate-500">Senior Software Architect</p>
                </div>
              </div>
            </div>
 
            {/* CTA Button */}
            {!isEnrolled ? (
              <button
                onClick={handleEnroll}
                disabled={actionLoading}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-[0_8px_20px_rgb(37,99,235,0.25)] hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 text-sm"
              >
                {actionLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <Icons.Zap size={16} />
                    Enroll for Free
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleContinue}
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-[0_8px_20px_rgb(0,0,0,0.15)] hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 text-sm"
              >
                <Icons.Play size={16} /> Continue Learning
              </button>
            )}
 
            <p className="text-xs text-slate-400 text-center mt-3 font-medium">
              ✓ Free forever &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ Self-paced
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
