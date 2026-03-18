import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, BadgeTag, Spinner, ProgressBar, Modal } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';

function QuizModal({ quiz, open, onClose, onComplete }) {
  const [answers, setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults]   = useState(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    const arr = quiz.questions.map((_, i) => answers[i] ?? -1);
    if (arr.some((a) => a === -1)) return toast.error('Answer all questions first');
    setLoading(true);
    try {
      const r = await api.post(`/lessons/${quiz.lessonId}/quiz`, { answers: arr });
      setResults(r.data);
      setSubmitted(true);
      if (r.data.passed) {
        toast.success(`Quiz passed! +${r.data.xpAwarded} XP`);
        onComplete?.(r.data);
      } else {
        toast.error(`Score: ${r.data.score}% — need 70% to pass`);
      }
    } catch (_) { toast.error('Submission failed'); }
    setLoading(false);
  };

  const reset = () => { setAnswers({}); setSubmitted(false); setResults(null); };

  return (
    <Modal open={open} onClose={onClose} title="Lesson Quiz" width="max-w-2xl">
      {!submitted ? (
        <div className="space-y-5">
          <p className="font-mono text-xs text-arena-dim">Answer all questions to earn bonus XP</p>
          {quiz.questions.map((q, qi) => (
            <div key={q.id} className="space-y-2">
              <p className="font-body text-sm font-medium">{qi + 1}. {q.question}</p>
              <div className="space-y-1.5">
                {(q.options || []).map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => setAnswers({ ...answers, [qi]: oi })}
                    className={`w-full text-left px-4 py-2.5 rounded-lg border font-mono text-xs transition-all ${
                      answers[qi] === oi
                        ? 'bg-arena-purple/20 border-arena-purple/50 text-arena-purple2'
                        : 'bg-arena-bg3 border-arena-border text-arena-muted hover:border-arena-border/80'
                    }`}
                  >
                    <span className="text-arena-dim mr-2">{String.fromCharCode(65+oi)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <Button onClick={handleSubmit} variant="primary" className="w-full py-3" loading={loading}>
            Submit Answers
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl text-center ${results?.passed ? 'bg-arena-teal/10 border border-arena-teal/30' : 'bg-red-500/10 border border-red-500/20'}`}>
            <div className="font-display font-black text-3xl mb-1">{results?.score}%</div>
            <p className="font-mono text-xs">{results?.passed ? `Passed · +${results.xpAwarded} XP` : 'Not passed — need 70%'}</p>
          </div>
          {results?.results?.map((r, i) => {
            const q = quiz.questions[i];
            return (
              <div key={i} className={`p-3 rounded-lg border ${r.correct ? 'border-arena-teal/30 bg-arena-teal/5' : 'border-red-500/20 bg-red-500/5'}`}>
                <p className="font-mono text-xs mb-1">{i+1}. {q.question}</p>
                {!r.correct && r.explanation && (
                  <p className="font-mono text-xs text-arena-muted">{r.explanation}</p>
                )}
                <div className={`font-mono text-xs mt-1 ${r.correct ? 'text-arena-teal' : 'text-red-400'}`}>
                  {r.correct ? 'Correct' : `Correct answer: ${String.fromCharCode(65 + r.correctIndex)}`}
                </div>
              </div>
            );
          })}
          <div className="flex gap-3">
            {!results?.passed && <Button onClick={reset} variant="secondary" className="flex-1">Retry</Button>}
            <Button onClick={onClose} variant="primary" className="flex-1">Continue</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default function LessonPage() {
  const { slug, lesson: lessonSlug } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson]         = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [completing, setCompleting] = useState(false);
  const [quizOpen, setQuizOpen]     = useState(false);
  const [code, setCode]             = useState('');
  const [output, setOutput]         = useState(null); // { lines: [], isError: bool }
  const [showXP, setShowXP]         = useState(null);

  useEffect(() => {
    api.get(`/lessons/${lessonSlug}`).then((r) => {
      setLesson(r.data.lesson);
      setIsCompleted(r.data.isCompleted);
      if (r.data.lesson.codeStarter) setCode(r.data.lesson.codeStarter);
    }).finally(() => setLoading(false));
  }, [lessonSlug]);

  const runCode = () => {
    const lines = [];
    const origLog   = console.log;
    const origWarn  = console.warn;
    const origError = console.error;
    console.log   = (...args) => lines.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
    console.warn  = (...args) => lines.push('⚠ ' + args.map(String).join(' '));
    console.error = (...args) => lines.push('✖ ' + args.map(String).join(' '));
    try {
      // eslint-disable-next-line no-new-func
      new Function(code)();
      setOutput({ lines, isError: false });
    } catch (err) {
      setOutput({ lines: [...lines, err.toString()], isError: true });
    } finally {
      console.log   = origLog;
      console.warn  = origWarn;
      console.error = origError;
    }
  };

  const handleComplete = async () => {
    if (isCompleted) return;
    setCompleting(true);
    try {
      const r = await api.post(`/lessons/${lesson.id}/complete`);
      setIsCompleted(true);
      setShowXP(r.data.xpAwarded);
      toast.success(`Lesson complete! +${r.data.xpAwarded} XP`);
      setTimeout(() => setShowXP(null), 3000);
      if (r.data.courseCompleted) toast.success('Course complete! Badge unlocked.');
    } catch (_) { toast.error('Could not mark complete'); }
    setCompleting(false);
  };

  if (loading) return (
    <div className="flex justify-center py-24"><Spinner size={24} className="text-arena-purple2" /></div>
  );
  if (!lesson) return (
    <div className="text-center py-24"><p className="font-mono text-sm text-arena-dim">Lesson not found</p></div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-0">
      {/* Breadcrumb + actions */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2 font-mono text-xs text-arena-dim">
          <button onClick={() => navigate(`/courses/${slug}`)} className="hover:text-arena-text transition-colors">
            {lesson.course?.title}
          </button>
          <Icons.ChevronRight size={12} />
          <span className="text-arena-muted">{lesson.title}</span>
        </div>
        <div className="flex items-center gap-3">
          {lesson.quiz && (
            <Button onClick={() => setQuizOpen(true)} variant="secondary" size="sm">
              <Icons.Target size={13} /> Take Quiz
            </Button>
          )}
          <Button
            onClick={handleComplete}
            variant={isCompleted ? 'secondary' : 'teal'}
            size="sm"
            loading={completing}
          >
            {isCompleted
              ? <><Icons.Check size={13} /> Completed</>
              : <><Icons.Check size={13} /> Mark Complete (+{lesson.xpReward} XP)</>}
          </Button>
        </div>
      </div>

      {/* XP float animation */}
      {showXP && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce">
          <div className="flex items-center gap-2 bg-arena-purple text-white px-4 py-3 rounded-xl shadow-2xl glow-purple">
            <Icons.Zap size={16} />
            <span className="font-display font-bold">+{showXP} XP</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Content */}
        <div className="xl:col-span-3 space-y-5">
          <div className="arena-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Icons.Clock size={12} className="text-arena-dim" />
                <span className="font-mono text-xs text-arena-dim">{lesson.duration}m</span>
              </div>
              <div className="flex items-center gap-1">
                <Icons.Zap size={11} className="text-arena-purple2" />
                <span className="font-mono text-xs text-arena-purple2">+{lesson.xpReward} XP</span>
              </div>
              {isCompleted && <BadgeTag variant="teal">Completed</BadgeTag>}
            </div>
            <h1 className="font-display font-black text-2xl mb-5">{lesson.title}</h1>

            {/* Video placeholder */}
            {lesson.videoUrl && (
              <div className="bg-arena-bg rounded-xl border border-arena-border aspect-video flex items-center justify-center mb-5 cursor-pointer group hover:border-arena-purple/40 transition-colors">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-arena-purple/20 border border-arena-border flex items-center justify-center group-hover:bg-arena-purple/30 transition-colors">
                    <Icons.Play size={22} className="text-arena-purple2 ml-1" />
                  </div>
                  <span className="font-mono text-xs text-arena-dim">Play Video Lesson</span>
                </div>
              </div>
            )}

            {/* Markdown content — render as pre for now */}
            <div className="prose-like text-arena-muted text-sm leading-relaxed space-y-3">
              {lesson.content?.split('\n\n').map((para, i) => {
                if (para.startsWith('# ')) return <h1 key={i} className="font-display font-bold text-xl text-arena-text">{para.slice(2)}</h1>;
                if (para.startsWith('## ')) return <h2 key={i} className="font-display font-bold text-base text-arena-text mt-4">{para.slice(3)}</h2>;
                if (para.startsWith('```')) {
                  const code = para.replace(/```\w*\n?/, '').replace(/```$/, '');
                  return <pre key={i} className="code-block text-xs">{code}</pre>;
                }
                return <p key={i} className="leading-7">{para}</p>;
              })}
            </div>
          </div>
        </div>

        {/* Code editor */}
        <div className="xl:col-span-2">
          <div className="arena-card overflow-hidden sticky top-20">
            <div className="flex items-center justify-between px-4 py-2.5 bg-arena-bg border-b border-arena-border">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
                <span className="font-mono text-xs text-arena-dim ml-1">practice.js</span>
              </div>
              <button
                onClick={() => { setCode(lesson.codeStarter || '// Write your code here\n\n'); }}
                className="font-mono text-xs text-arena-dim hover:text-arena-muted transition-colors"
              >
                reset
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-arena-bg text-arena-text font-mono text-xs p-4 outline-none resize-none border-0"
              style={{ height: 380, tabSize: 2 }}
              spellCheck={false}
              placeholder="// Practice code here..."
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const s = e.target.selectionStart;
                  const newCode = code.substring(0, s) + '  ' + code.substring(e.target.selectionEnd);
                  setCode(newCode);
                  setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; }, 0);
                }
              }}
            />
            <div className="border-t border-arena-border">
              <button
                onClick={runCode}
                className="flex items-center gap-2 text-arena-teal hover:text-arena-teal2 transition-colors font-mono text-xs w-full px-4 py-2.5 hover:bg-arena-teal/5"
              >
                <Icons.Play size={11} /> ▶ Run Code
              </button>
              {output && (
                <div className={`border-t border-arena-border bg-black/30 px-4 py-3 max-h-40 overflow-y-auto`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-arena-dim uppercase tracking-widest">Output</span>
                    <button onClick={() => setOutput(null)} className="font-mono text-[10px] text-arena-dim hover:text-white">clear</button>
                  </div>
                  {output.lines.length === 0 ? (
                    <p className="font-mono text-xs text-arena-dim italic">// no output</p>
                  ) : output.lines.map((line, i) => (
                    <p key={i} className={`font-mono text-xs whitespace-pre-wrap ${output.isError && i === output.lines.length - 1 ? 'text-red-400' : 'text-arena-teal'}`}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz modal */}
      {lesson.quiz && (
        <QuizModal
          quiz={{ ...lesson.quiz, lessonId: lesson.id }}
          open={quizOpen}
          onClose={() => setQuizOpen(false)}
          onComplete={() => { setQuizOpen(false); if (!isCompleted) handleComplete(); }}
        />
      )}
    </div>
  );
}
