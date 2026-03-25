import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spinner } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';

/* ─── Quiz Modal (Quiz-Gated Completion) ───────────────────── */
function QuizGateModal({ quiz, lessonId, onPass, onClose }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  // Randomize question order once per mount
  const [shuffled] = useState(() =>
    [...quiz.questions].sort(() => Math.random() - 0.5)
  );

  const handleSubmit = async () => {
    const arr = shuffled.map((_, i) => answers[i] ?? -1);
    if (arr.some((a) => a === -1)) { toast.error('Answer all questions first'); return; }
    setLoading(true);
    try {
      // Map shuffled answers back to original question order
      const originalOrder = shuffled.map((q, i) => ({ originalIndex: quiz.questions.indexOf(q), answer: answers[i] }));
      const orderedAnswers = quiz.questions.map((_, i) => {
        const found = originalOrder.find(o => o.originalIndex === i);
        return found ? found.answer : -1;
      });
      const r = await api.post(`/lessons/${lessonId}/quiz`, { answers: orderedAnswers });
      setResults(r.data);
      setSubmitted(true);
      if (r.data.passed) {
        toast.success(`Quiz passed! +${r.data.xpAwarded} XP 🎉`);
      } else {
        toast.error(`${r.data.correct}/${r.data.total} correct — need 70% to proceed`);
      }
    } catch { toast.error('Submission failed'); }
    setLoading(false);
  };

  const retry = () => { setAnswers({}); setSubmitted(false); setResults(null); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-600/30 flex items-center justify-center">
              <Icons.Target size={14} className="text-blue-700" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white">Lesson Quiz</p>
              <p className="font-mono text-[10px] text-white/40">Must pass to mark complete</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <Icons.X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {!submitted ? (
            <>
              <p className="font-mono text-[11px] text-white/40 uppercase tracking-widest">
                {shuffled.length} Questions · 70% to pass
              </p>
              {shuffled.map((q, qi) => (
                <div key={q.id} className="space-y-2.5">
                  <p className="font-mono text-sm text-white/90 font-medium">{qi + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {(q.options || []).map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => setAnswers({ ...answers, [qi]: oi })}
                        className={`w-full text-left px-4 py-3 rounded-xl border font-mono text-xs transition-all ${
                          answers[qi] === oi
                            ? 'bg-blue-600/15 border-blue-600/50 text-white'
                            : 'bg-white/3 border-white/8 text-white/60 hover:border-white/20 hover:text-white/80'
                        }`}
                      >
                        <span className="text-white/30 mr-2">{String.fromCharCode(65 + oi)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl text-center ${results?.passed ? 'bg-indigo-600/10 border border-indigo-600/25' : 'bg-red-500/8 border border-red-500/20'}`}>
                <div className={`font-display font-black text-5xl mb-2 ${results?.passed ? 'text-indigo-600' : 'text-red-400'}`}>
                  {Math.round((results?.correct / results?.total) * 100)}%
                </div>
                <p className="font-mono text-xs text-white/50">
                  {results?.correct}/{results?.total} correct
                  {results?.passed ? ` · +${results.xpAwarded} XP earned` : ' · Need 70% to proceed'}
                </p>
              </div>
              {results?.results?.map((r, i) => {
                const q = shuffled[i];
                return (
                  <div key={i} className={`p-3.5 rounded-xl border text-xs ${r.correct ? 'border-indigo-600/20 bg-indigo-600/5' : 'border-red-500/15 bg-red-500/5'}`}>
                    <p className="font-mono text-white/70 mb-1">{i + 1}. {q.question}</p>
                    <p className={`font-mono font-bold ${r.correct ? 'text-indigo-600' : 'text-red-400'}`}>
                      {r.correct ? '✓ Correct' : `✗ Answer: ${String.fromCharCode(65 + r.correctIndex)}`}
                    </p>
                    {!r.correct && r.explanation && (
                      <p className="font-mono text-white/40 mt-1">{r.explanation}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/8 flex-shrink-0 flex gap-3">
          {!submitted ? (
            <>
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 font-mono text-xs text-white/50 hover:text-white hover:border-white/20 transition-all">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 font-mono text-xs font-bold text-white hover:bg-blue-600/80 transition-all disabled:opacity-50"
              >
                {loading ? '...' : 'Submit Answers'}
              </button>
            </>
          ) : results?.passed ? (
            <button
              onClick={onPass}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 font-mono text-xs font-bold text-black hover:bg-indigo-600/80 transition-all"
            >
              ✓ Mark Complete & Continue →
            </button>
          ) : (
            <>
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 font-mono text-xs text-white/50 hover:text-white transition-all">
                Study More
              </button>
              <button onClick={retry} className="flex-1 py-2.5 rounded-xl bg-blue-600/80 font-mono text-xs font-bold text-white hover:bg-blue-600 transition-all">
                Retry Quiz
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Lesson Page ─────────────────────────────────────── */
export default function LessonPage() {
  const { slug, lesson: lessonSlug } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson]           = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading]         = useState(true);
  const [completing, setCompleting]   = useState(false);
  const [quizOpen, setQuizOpen]       = useState(false);
  const [code, setCode]               = useState('// Practice your code here...\n');
  const [output, setOutput]           = useState(null);
  const [showXP, setShowXP]           = useState(null);

  useEffect(() => {
    setLoading(true);
    setOutput(null);
    api.get(`/lessons/${lessonSlug}`).then((r) => {
      setLesson(r.data.lesson);
      setIsCompleted(r.data.isCompleted);
      if (r.data.lesson.codeStarter) setCode(r.data.lesson.codeStarter);
      else setCode('// Practice your code here...\n');
    }).catch(() => navigate(`/courses/${slug}`)).finally(() => setLoading(false));
  }, [lessonSlug, slug, navigate]);

  const doComplete = useCallback(async () => {
    if (isCompleted || completing) return;
    setCompleting(true);
    try {
      const r = await api.post(`/lessons/${lesson.id}/complete`);
      setIsCompleted(true);
      setShowXP(r.data.xpAwarded);
      setTimeout(() => setShowXP(null), 3000);
      toast.success(`+${r.data.xpAwarded} XP earned!`);

      if (r.data.courseCompleted) {
        toast.success('🏆 Course Complete! Returning to library...');
        setTimeout(() => navigate(`/courses/${slug}`), 2000);
      }
    } catch { toast.error('Could not mark complete'); }
    setCompleting(false);
  }, [isCompleted, completing, lesson, slug, navigate]);

  const handleMarkComplete = () => {
    if (isCompleted) return;
    if (lesson?.quiz) {
      setQuizOpen(true); // Must pass quiz first
    } else {
      doComplete();
    }
  };

  const runCode = () => {
    const lines = [];
    const orig = { log: console.log, warn: console.warn, error: console.error };
    console.log   = (...a) => lines.push(a.map(x => typeof x === 'object' ? JSON.stringify(x, null, 2) : String(x)).join(' '));
    console.warn  = (...a) => lines.push('⚠ ' + a.map(String).join(' '));
    console.error = (...a) => lines.push('✖ ' + a.map(String).join(' '));
    try {
      // eslint-disable-next-line no-new-func
      new Function(code)();
      setOutput({ lines, isError: false });
    } catch (err) {
      setOutput({ lines: [...lines, err.toString()], isError: true });
    } finally {
      Object.assign(console, orig);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Spinner size={28} className="text-white/20" />
    </div>
  );
  if (!lesson) return null;

  const hasLang = lesson.course?.slug ? true : false;

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* ── Top bar ───────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2 font-mono text-xs text-white/40">
          <button
            onClick={() => navigate(`/courses/${slug}`)}
            className="hover:text-white/70 transition-colors flex items-center gap-1.5"
          >
            <Icons.ArrowLeft size={12} /> {lesson.course?.title || 'Course'}
          </button>
          <span>/</span>
          <span className="text-white/60">{lesson.title}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/4 border border-white/8">
            <Icons.Clock size={11} className="text-white/30" />
            <span className="font-mono text-[11px] text-white/40">{lesson.duration}m</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 border border-blue-600/20">
            <Icons.Zap size={11} className="text-blue-700" />
            <span className="font-mono text-[11px] text-blue-700 font-bold">+{lesson.xpReward} XP</span>
          </div>
          <button
            onClick={handleMarkComplete}
            disabled={isCompleted || completing}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
              isCompleted
                ? 'bg-indigo-600/15 border border-indigo-600/30 text-indigo-600 cursor-default'
                : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            {isCompleted ? (
              <><Icons.Check size={12} /> Completed</>
            ) : completing ? '...' : (
              <><Icons.Check size={12} /> Mark Complete</>
            )}
          </button>
        </div>
      </div>

      {/* ── Main 2-col layout ─────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* ── Left: Content ─────────────────────────────── */}
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-[#0a0a0a] border border-white/8 rounded-2xl overflow-hidden">
            {/* Lesson header */}
            <div className="px-7 pt-7 pb-4">
              <h1 className="font-display font-bold text-2xl text-white tracking-tight mb-3">{lesson.title}</h1>
              {isCompleted && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/12 border border-indigo-600/25 text-indigo-600 font-mono text-[10px]">
                  <Icons.Check size={10} /> Completed
                </div>
              )}
            </div>

            {/* Content renderer */}
            <div className="px-7 pb-7 space-y-4 text-sm text-white/60 leading-relaxed">
              {lesson.content?.split('\n\n').map((para, i) => {
                if (para.startsWith('# '))  return <h1  key={i} className="font-display font-bold text-xl text-white mt-4">{para.slice(2)}</h1>;
                if (para.startsWith('## ')) return <h2  key={i} className="font-display font-bold text-base text-white/90 mt-3">{para.slice(3)}</h2>;
                if (para.startsWith('### ')) return <h3  key={i} className="font-mono font-bold text-sm text-white/80 mt-2">{para.slice(4)}</h3>;
                if (para.startsWith('```')) {
                  const codeContent = para.replace(/```\w*\n?/, '').replace(/```$/, '');
                  return (
                    <div key={i} className="relative group">
                      <div className="flex items-center justify-between px-4 py-2 bg-white/3 border border-white/8 rounded-t-xl">
                        <span className="font-mono text-[10px] text-white/30">code</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(codeContent)}
                          className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors"
                        >copy</button>
                      </div>
                      <pre className="p-4 bg-black/60 border border-white/8 border-t-0 rounded-b-xl font-mono text-xs text-indigo-600 overflow-x-auto">{codeContent}</pre>
                    </div>
                  );
                }
                if (para.startsWith('- ')) {
                  return (
                    <ul key={i} className="space-y-1.5 pl-4">
                      {para.split('\n').filter(l => l.startsWith('- ')).map((li, j) => (
                        <li key={j} className="flex items-start gap-2 font-mono text-sm text-white/60">
                          <span className="text-blue-700 mt-0.5">▸</span>
                          <span>{li.slice(2)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i} className="font-mono text-sm text-white/60 leading-7">{para}</p>;
              })}
            </div>
          </div>

          {/* Quiz teaser (if has quiz and not completed) */}
          {lesson.quiz && !isCompleted && (
            <div className="bg-blue-600/8 border border-blue-600/20 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-600/30 flex items-center justify-center">
                  <Icons.Target size={15} className="text-blue-700" />
                </div>
                <div>
                  <p className="font-mono text-sm font-bold text-white">Lesson Quiz</p>
                  <p className="font-mono text-[11px] text-white/40">{lesson.quiz.questions?.length || 0} questions · Pass to complete</p>
                </div>
              </div>
              <button
                onClick={() => setQuizOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 font-mono text-xs font-bold text-white hover:bg-blue-600/80 transition-all"
              >
                Take Quiz
              </button>
            </div>
          )}
        </div>

        {/* ── Right: Code Editor ─────────────────────────── */}
        <div className="xl:col-span-2">
          <div className="bg-[#0a0a0a] border border-white/8 rounded-2xl overflow-hidden sticky top-20">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                <span className="font-mono text-[10px] text-white/30 ml-2">practice.js</span>
              </div>
              <button
                onClick={() => setCode(lesson.codeStarter || '// Practice your code here...\n')}
                className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors"
              >
                reset
              </button>
            </div>

            {/* Code textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-transparent text-indigo-600 font-mono text-xs p-4 outline-none resize-none border-0"
              style={{ height: 320, tabSize: 2 }}
              spellCheck={false}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const s = e.target.selectionStart;
                  const newVal = code.substring(0, s) + '  ' + code.substring(e.target.selectionEnd);
                  setCode(newVal);
                  setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; }, 0);
                }
              }}
            />

            {/* Run button */}
            <div className="border-t border-white/6">
              <button
                onClick={runCode}
                className="flex items-center gap-2 text-indigo-600 hover:bg-indigo-600/5 transition-colors font-mono text-xs w-full px-4 py-3"
              >
                <Icons.Play size={11} /> ▶ Run Code
              </button>

              {/* Output panel */}
              {output && (
                <div className="border-t border-white/6 bg-black/40 max-h-36 overflow-y-auto">
                  <div className="flex items-center justify-between px-4 py-2 sticky top-0 bg-black/60 backdrop-blur-sm">
                    <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Output</span>
                    <button onClick={() => setOutput(null)} className="font-mono text-[9px] text-white/30 hover:text-white transition-colors">clear</button>
                  </div>
                  <div className="px-4 pb-3 space-y-0.5">
                    {output.lines.length === 0 ? (
                      <p className="font-mono text-[11px] text-white/20 italic">// no output</p>
                    ) : output.lines.map((line, i) => (
                      <p key={i} className={`font-mono text-[11px] whitespace-pre-wrap ${
                        output.isError && i === output.lines.length - 1 ? 'text-red-400' : 'text-indigo-600'
                      }`}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── XP Float ───────────────────────────────────── */}
      {showXP && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce">
          <div className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-600/50">
            <Icons.Zap size={16} />
            <span className="font-display font-black text-lg">+{showXP} XP</span>
          </div>
        </div>
      )}

      {/* ── Quiz Modal ────────────────────────────────── */}
      {lesson.quiz && quizOpen && (
        <QuizGateModal
          quiz={lesson.quiz}
          lessonId={lesson.id}
          onPass={() => { setQuizOpen(false); doComplete(); }}
          onClose={() => setQuizOpen(false)}
        />
      )}
    </div>
  );
}
