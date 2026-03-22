import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Icons from '@/assets/icons';
import toast from 'react-hot-toast';
 
export default function CoursePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
 
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
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
      toast.success('Enrolled! Starting your first lesson...');
      const res = await api.get(`/courses/${slug}`);
      const updated = res.data.course;
      setCourse(updated);
      setEnrollment(res.data.enrollment || null);
      const firstLesson = updated?.lessons?.[0];
      if (firstLesson?.slug) {
        navigate(`/courses/${slug}/${firstLesson.slug}`);
      } else {
        toast('Enrolled! No lessons available yet.', { icon: '📚' });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Enrollment failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };
 
  const handleContinue = () => {
    const firstLesson = course?.lessons?.[0];
    if (firstLesson?.slug) {
      navigate(`/courses/${slug}/${firstLesson.slug}`);
    } else {
      toast.error('No lessons available yet for this course.');
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
 
  return (
    <div className="max-w-6xl mx-auto pb-24 font-sans animate-fade-in">
 
      {/* ── Breadcrumb ── */}
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors font-medium"
      >
        <Icons.ArrowRight size={14} className="rotate-180" /> Back to Catalog
      </button>
 
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="font-display text-4xl text-slate-900 font-extrabold tracking-tight mb-3">
          {course.title}
        </h1>
        <p className="text-lg text-slate-500 max-w-3xl leading-relaxed">
          {course.description || 'Master the essential principles and modern architecture of this technology.'}
        </p>
      </div>
 
      <div className="flex flex-col lg:flex-row gap-10">
 
        {/* ── Left Column ── */}
        <div className="lg:w-2/3 space-y-8">
 
          {/* Video Placeholder */}
          <div className="relative aspect-video bg-teal-50 rounded-3xl border border-slate-200 overflow-hidden flex items-center justify-center group cursor-pointer shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-100/50 to-emerald-50/50" />
            <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300">
              <Icons.Play size={32} className="text-blue-600 ml-1.5" />
            </div>
          </div>
 
          {/* Actions Row */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-6">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm font-semibold text-slate-700 transition-colors">
              <Icons.Star size={15} /> Add to Wishlist
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-purple-200 border-2 border-white" />
              </div>
              <span className="text-sm font-medium text-slate-600">
                <strong className="text-slate-900">
                  {(course._count?.enrollments || 0).toLocaleString()}
                </strong>{' '}
                students enrolled
              </span>
            </div>
          </div>
 
          {/* Description */}
          <div className="text-slate-600 space-y-4 leading-relaxed text-[15px]">
            <p>
              Designed for developers who want to master this technology from the ground up.
              Build real-world projects while learning industry best practices and architectural patterns.
            </p>
            <p>
              Through hands-on exercises, you'll gain deep understanding and be able to apply
              these skills immediately in professional environments.
            </p>
          </div>
 
          {/* Syllabus */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Syllabus</h2>
              <button
                onClick={() => setExpandedSection(expandedSection !== null ? null : '0')}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                {expandedSection !== null ? 'Collapse All' : 'Expand All'}
              </button>
            </div>
 
            <div className="space-y-3">
              {lessons.length === 0 ? (
                <p className="text-slate-400 italic p-6 bg-slate-50 rounded-2xl border border-slate-200 border-dashed text-center">
                  Syllabus is being finalized. Check back soon.
                </p>
              ) : (
                lessons.map((lesson, idx) => {
                  const isExpanded = expandedSection === String(idx);
                  return (
                    <div key={lesson.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : String(idx))}
                        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm shrink-0">
                            {String(idx + 1).padStart(2, '0')}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">{lesson.title}</h3>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">
                              1 Lesson • {lesson.duration || 15} mins
                            </p>
                          </div>
                        </div>
                        <Icons.ChevronDown
                          size={20}
                          className={`text-slate-400 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
 
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50">
                          <div
                            className="py-3 flex items-center justify-between text-sm group cursor-pointer"
                            onClick={() => {
                              if (isEnrolled) {
                                navigate(`/courses/${slug}/${lesson.slug}`);
                              } else {
                                toast('Enroll first to access this lesson.', { icon: '🔒' });
                              }
                            }}
                          >
                            <div className="flex items-center gap-3 text-slate-600 group-hover:text-blue-600 font-medium">
                              <Icons.Play size={15} className="text-slate-400 group-hover:text-blue-600" />
                              {lesson.title}
                            </div>
                            <span className="text-slate-400 text-xs font-mono">
                              {String(Math.floor((lesson.duration || 15) / 60)).padStart(2, '0')}:
                              {String((lesson.duration || 15) % 60).padStart(2, '0')}
                            </span>
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
        <div className="lg:w-1/3 space-y-5">
 
          {/* CTA Card */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="h-32 bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center border-b border-slate-100">
              <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center">
                <Icons.Play size={20} className="text-blue-600 ml-0.5" />
              </div>
            </div>
            <div className="p-6 space-y-3">
              {!isEnrolled ? (
                <>
                  <button
                    onClick={handleEnroll}
                    disabled={actionLoading}
                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {actionLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enrolling...
                      </>
                    ) : (
                      <>
                        <Icons.Zap size={16} /> Start Now — It's Free
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-400">No credit card required</p>
                </>
              ) : (
                <button
                  onClick={handleContinue}
                  className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 shadow-lg shadow-slate-900/10"
                >
                  <Icons.Play size={16} /> Continue Learning
                </button>
              )}
            </div>
          </div>
 
          {/* Details Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-5">Course Details</h3>
            <div className="space-y-4">
              {[
                { icon: <Icons.Clock size={15} className="text-blue-500" />, label: 'Duration', value: `${Math.round((course.duration || 120) / 60)} Hours` },
                { icon: <Icons.Zap size={15} className="text-blue-500" />, label: 'Level', value: course.difficulty ? course.difficulty.charAt(0) + course.difficulty.slice(1).toLowerCase() : 'Beginner' },
                { icon: <Icons.Globe size={15} className="text-blue-500" />, label: 'Language', value: 'English' },
                { icon: <Icons.Star size={15} className="text-blue-500" />, label: 'Certificate', value: 'Yes' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-500">
                    {icon}
                    <span className="text-sm">{label}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{value}</span>
                </div>
              ))}
            </div>
 
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-4">Instructor</h4>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <span className="font-bold text-blue-500 text-sm">AJ</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Alex Johnson</p>
                  <p className="text-xs text-slate-400">Senior Architect</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Alex has built scalable systems for Fortune 500 tech firms and is a regular speaker at conferences worldwide.
              </p>
              <button className="mt-4 w-full border border-slate-200 rounded-xl py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                View Profile
              </button>
            </div>
          </div>
 
          {/* Certificate Card */}
          <div className="bg-blue-600 rounded-3xl p-6 text-white">
            <h4 className="font-bold text-lg mb-2">Earn Your Certificate</h4>
            <p className="text-sm text-blue-100 leading-relaxed mb-4">
              Complete all modules and the final project to receive a verified certificate from CodeArena.
            </p>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Icons.Star size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
