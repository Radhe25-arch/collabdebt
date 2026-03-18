// CoursePage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DifficultyBadge, BadgeTag, Button, Spinner, ProgressBar } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export function CoursePage() {
  const { slug } = useParams();
  const navigate  = useNavigate();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/courses/${slug}`).then((r) => setData(r.data)).finally(() => setLoading(false));
  }, [slug]);

  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${data.course.id}/enroll`);
      toast.success('Enrolled! Start your first lesson.');
      setData((d) => ({ ...d, enrollment: { progress: 0 } }));
    } catch (_) { toast.error('Enrollment failed'); }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size={28} className="text-arena-purple2" /></div>;
  if (!data) return null;

  const { course, enrollment, completedLessonIds = [] } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate('/courses')} className="flex items-center gap-2 text-arena-dim hover:text-arena-text font-mono text-xs">
        <Icons.ArrowLeft size={13} /> back to courses
      </button>

      <div className="arena-card p-6">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
          <div>
            <span className="font-mono text-xs text-arena-dim uppercase tracking-widest">{course.category?.name}</span>
            <h1 className="font-display font-black text-3xl mt-1 mb-2">{course.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <DifficultyBadge level={course.difficulty} />
              <div className="flex items-center gap-1 font-mono text-xs text-arena-dim">
                <Icons.Book size={11} /> {course._count?.lessons} lessons
              </div>
              <div className="flex items-center gap-1 font-mono text-xs text-arena-dim">
                <Icons.Users size={11} /> {course._count?.enrollments} enrolled
              </div>
              <div className="flex items-center gap-1 font-mono text-xs text-arena-purple2">
                <Icons.Zap size={11} /> +{course.xpReward} XP
              </div>
            </div>
          </div>
          {!enrollment ? (
            <Button onClick={handleEnroll} variant="teal" size="lg">
              <Icons.Play size={15} /> Start Course — Free
            </Button>
          ) : (
            <Button onClick={() => {
              const nextLesson = course.lessons.find((l) => !completedLessonIds.includes(l.id));
              if (nextLesson) navigate(`/courses/${slug}/${nextLesson.slug}`);
            }} variant="primary" size="lg">
              <Icons.Play size={15} /> Continue
            </Button>
          )}
        </div>

        <p className="text-arena-muted text-sm leading-relaxed">{course.description}</p>

        {enrollment && (
          <div className="mt-5">
            <div className="flex justify-between font-mono text-xs text-arena-dim mb-2">
              <span>Progress</span>
              <span>{enrollment.progress}%</span>
            </div>
            <ProgressBar value={enrollment.progress} max={100} color="grad" height={6} />
          </div>
        )}
      </div>

      {/* Lessons list */}
      <div className="arena-card overflow-hidden">
        <div className="px-5 py-3 border-b border-arena-border">
          <span className="font-mono text-xs text-arena-dim uppercase tracking-widest">Curriculum</span>
        </div>
        <div className="divide-y divide-arena-border/40">
          {course.lessons.map((lesson, i) => {
            const done = completedLessonIds.includes(lesson.id);
            const locked = !enrollment && i > 0;
            return (
              <div
                key={lesson.id}
                className={`flex items-center gap-4 px-5 py-3.5 ${
                  !locked && enrollment ? 'cursor-pointer hover:bg-arena-bg3/50' : ''
                }`}
                onClick={() => {
                  if (!locked && enrollment) navigate(`/courses/${slug}/${lesson.slug}`);
                  else if (!enrollment) toast.error('Enroll first to access lessons');
                }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  done ? 'bg-arena-teal/20 border border-arena-teal/40' : 'bg-arena-bg3 border border-arena-border'
                }`}>
                  {done
                    ? <Icons.Check size={11} className="text-arena-teal" />
                    : <span className="font-mono text-xs text-arena-dim">{i + 1}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-body text-sm ${done ? 'text-arena-muted' : 'text-arena-text'}`}>
                    {lesson.title}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-arena-dim">
                  <div className="flex items-center gap-1 font-mono text-xs">
                    <Icons.Clock size={10} />
                    <span>{lesson.duration}m</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-xs text-arena-purple2">
                    <Icons.Zap size={10} />
                    <span>+{lesson.xpReward}</span>
                  </div>
                  {locked && <Icons.Shield size={12} className="text-arena-dim" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
