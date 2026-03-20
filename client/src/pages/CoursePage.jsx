import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Icons from '@/assets/icons';

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
      
      {/* ── Header Titles ── */}
      <div className="mb-8">
        <h1 className="font-display text-4xl text-slate-900 font-extrabold tracking-tight mb-3">
          {course.title}
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          {course.description} Build scalable, themeable, and accessible applications with modern architecture.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* ── Left Column (70%) ── */}
        <div className="lg:w-2/3 space-y-8">
          
          {/* Video Placeholder */}
          <div className="relative aspect-video bg-teal-50 rounded-3xl border border-slate-200 overflow-hidden flex items-center justify-center group cursor-pointer shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-100/50 to-emerald-50/50 mix-blend-multiply" />
            <div className="w-20 h-20 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
              <Icons.Play size={32} className="text-blue-600 ml-2" />
            </div>
          </div>

          {/* Actions & Enrolled Count */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-6">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm font-semibold text-slate-700 transition-colors">
              <Icons.Heart size={16} /> Add to Wishlist
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white" />
              </div>
              <span className="text-sm font-medium text-slate-600">
                <strong className="text-slate-900">{(course._count?.enrollments || 1240).toLocaleString()}</strong> students enrolled
              </span>
            </div>
          </div>

          {/* Description Body */}
          <div className="prose prose-slate max-w-none text-slate-600">
            <p>Designed for junior developers and lead designers who want to bridge the gap between code and design. Explore how to architect a Design System that survives the transition from Figma to Production.</p>
            <p>Through hands-on projects, you'll learn to manage complex state transitions, implement accessible component libraries, and automate your workflow with CI/CD integrations for styling assets.</p>
          </div>

          {/* Syllabus Accordion */}
          <div className="pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Syllabus</h2>
              <button className="text-sm font-semibold text-blue-600">Expand All</button>
            </div>
            
            <div className="space-y-4">
              {lessons.length === 0 ? (
                <p className="text-slate-500 italic p-6 bg-slate-50 rounded-2xl border border-slate-200 border-dashed text-center">Syllabus is being finalized.</p>
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
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm">
                            {String(idx + 1).padStart(2, '0')}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">{lesson.title}</h3>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">1 Lesson • {lesson.duration || 15} mins</p>
                          </div>
                        </div>
                        <Icons.ChevronDown size={20} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50">
                          <div className="py-3 flex items-center justify-between text-sm group cursor-pointer" onClick={() => navigate(`/courses/${slug}/${lesson.slug}`)}>
                            <div className="flex items-center gap-3 text-slate-600 group-hover:text-blue-600 font-medium">
                              <Icons.Play size={16} className="text-slate-400 group-hover:text-blue-600" />
                              {lesson.title}
                            </div>
                            <span className="text-slate-400 text-xs font-mono">{lesson.duration || 15}:00</span>
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

        {/* ── Right Column (30%) ── */}
        <div className="lg:w-1/3 space-y-6">
          
          {/* Details Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">Course Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-600">
                  <Icons.Clock size={16} className="text-blue-600"/>
                  <span className="text-sm font-medium">Duration</span>
                </div>
                <span className="text-sm font-bold text-slate-900 tracking-tight">{(course.duration || 120) / 60} Hours</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-600">
                  <Icons.Zap size={16} className="text-blue-600"/>
                  <span className="text-sm font-medium">Level</span>
                </div>
                <span className="text-sm font-bold text-slate-900 tracking-tight capitalize">{course.difficulty?.toLowerCase() || 'Advanced'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-600">
                  <Icons.Globe size={16} className="text-blue-600"/>
                  <span className="text-sm font-medium">Language</span>
                </div>
                <span className="text-sm font-bold text-slate-900 tracking-tight">English</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-4">Instructor</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden">
                  <span className="font-bold text-slate-400">AJ</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Alex Johnson</p>
                  <p className="text-xs text-slate-500 font-medium">Senior Architect</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                Alex has built scalable systems for Fortune 500 tech firms and is a regular speaker at UI conferences worldwide.
              </p>
              <button className="w-full mt-5 py-2.5 rounded-full border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
                View Profile
              </button>
            </div>
          </div>

          {/* Action CTA */}
          {!isEnrolled ? (
            <button 
              onClick={handleEnroll}
              disabled={actionLoading}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-[0_8px_30px_rgb(37,99,235,0.2)] hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
            >
              {actionLoading ? 'Enrolling...' : 'Enroll Now for Free'}
            </button>
          ) : (
            <button 
              onClick={() => navigate(`/courses/${slug}/${course.lessons?.[0]?.slug || ''}`)}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
            >
              <Icons.Play size={18} /> Continue Learning
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
