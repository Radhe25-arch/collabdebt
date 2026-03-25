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
  const [shuffled] = useState(() =>
    [...quiz.questions].sort(() => Math.random() - 0.5)
  );

  const handleSubmit = async () => {
    const arr = shuffled.map((_, i) => answers[i] ?? -1);
    if (arr.some((a) => a === -1)) { toast.error('Answer all questions first'); return; }
    setLoading(true);
    try {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Icons.Target size={14} className="text-blue-600" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-slate-900">Lesson Quiz</p>
              <p className="font-mono text-[10px] text-slate-400">Must pass to mark complete</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-600 transition-colors">
            <Icons.X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {!submitted ? (
            <>
              <p className="font-mono text-[11px] text-slate-400 uppercase tracking-widest font-semibold">
                {shuffled.length} Questions · 70% to pass
              </p>
              {shuffled.map((q, qi) => (
                <div key={q.id} className="space-y-2.5">
                  <p className="font-mono text-sm text-slate-900 font-semibold">{qi + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {(q.options || []).map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => setAnswers({ ...answers, [qi]: oi })}
                        className={`w-full text-left px-4 py-3 rounded-xl border font-mono text-xs transition-all ${
                          answers[qi] === oi
                            ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800'
                        }`}
                      >
                        <span className="text-slate-400 mr-2 font-semibold">{String.fromCharCode(65 + oi)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl text-center ${results?.passed ? 'bg-blue-50 border border-blue-200' : 'bg-red-50 border border-red-200'}`}>
                <div className={`font-display font-black text-5xl mb-2 ${results?.passed ? 'text-blue-600' : 'text-red-500'}`}>
                  {Math.round((results?.correct / results?.total) * 100)}%
                </div>
                <p className="font-mono text-xs text-slate-500">
                  {results?.correct}/{results?.total} correct
                  {results?.passed ? ` · +${results.xpAwarded} XP earned` : ' · Need 70% to proceed'}
                </p>
              </div>
              {results?.results?.map((r, i) => {
                const q = shuffled[i];
                return (
                  <div key={i} className={`p-3.5 rounded-xl border text-xs ${r.correct ? 'border-blue-200 bg-blue-50' : 'border-red-200 bg-red-50'}`}>
                    <p className="font-mono text-slate-700 mb-1">{i + 1}. {q.question}</p>
                    <p className={`font-mono font-bold ${r.correct ? 'text-blue-600' : 'text-red-500'}`}>
                      {r.correct ? '✓ Correct' : `✗ Answer: ${String.fromCharCode(65 + r.correctIndex)}`}
                    </p>
                    {!r.correct && r.explanation && (
                      <p className="font-mono text-slate-400 mt-1">{r.explanation}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex-shrink-0 flex gap-3">
          {!submitted ? (
            <>
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 font-mono text-xs font-bold text-white hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {loading ? '...' : 'Submit Answers'}
              </button>
            </>
          ) : results?.passed ? (
            <button
              onClick={onPass}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 font-mono text-xs font-bold text-white hover:bg-blue-700 transition-all"
            >
              ✓ Mark Complete & Continue →
            </button>
          ) : (
            <>
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-500 hover:text-slate-900 transition-all">
                Study More
              </button>
              <button onClick={retry} className="flex-1 py-2.5 rounded-xl bg-blue-600 font-mono text-xs font-bold text-white hover:bg-blue-700 transition-all">
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
      setQuizOpen(true);
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
      <Spinner size={28} className="text-blue-600" />
    </div>
  );
  if (!lesson) return null;

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* ── Top bar ───────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <button
            onClick={() => navigate(`/courses/${slug}`)}
            className="hover:text-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Icons.ArrowLeft size={12} /> {lesson.course?.title || 'Course'}
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-600 font-semibold">{lesson.title}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
            <Icons.Clock size={11} className="text-slate-400" />
            <span className="font-mono text-[11px] text-slate-500 font-semibold">{lesson.duration}m</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100">
            <Icons.Zap size={11} className="text-blue-600" />
            <span className="font-mono text-[11px] text-blue-600 font-bold">+{lesson.xpReward} XP</span>
          </div>
          <button
            onClick={handleMarkComplete}
            disabled={isCompleted || completing}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
              isCompleted
                ? 'bg-blue-50 border border-blue-200 text-blue-600 cursor-default'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
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
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Lesson header */}
            <div className="px-7 pt-7 pb-4">
              <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight mb-3">{lesson.title}</h1>
              {isCompleted && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 font-mono text-[10px] font-bold">
                  <Icons.Check size={10} /> Completed
                </div>
              )}
            </div>

            {/* Content renderer */}
            <div className="px-7 pb-7 space-y-4 text-sm text-slate-600 leading-relaxed">
              {lesson.content?.split('\n\n').map((para, i) => {
                if (para.startsWith('# '))  return <h1  key={i} className="font-display font-bold text-xl text-slate-900 mt-4">{para.slice(2)}</h1>;
                if (para.startsWith('## ')) return <h2  key={i} className="font-display font-bold text-base text-slate-800 mt-3">{para.slice(3)}</h2>;
                if (para.startsWith('### ')) return <h3  key={i} className="font-mono font-bold text-sm text-slate-700 mt-2">{para.slice(4)}</h3>;
                if (para.startsWith('```')) {
                  const codeContent = para.replace(/```\w*\n?/, '').replace(/```$/, '');
                  return (
                    <div key={i} className="relative group">
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border border-slate-200 rounded-t-xl">
                        <span className="font-mono text-[10px] text-slate-400 font-semibold">code</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(codeContent)}
                          className="font-mono text-[10px] text-slate-400 hover:text-blue-600 transition-colors"
                        >copy</button>
                      </div>
                      <pre className="p-4 bg-slate-50 border border-slate-200 border-t-0 rounded-b-xl font-mono text-xs text-blue-700 overflow-x-auto">{codeContent}</pre>
                    </div>
                  );
                }
                if (para.startsWith('- ')) {
                  return (
                    <ul key={i} className="space-y-1.5 pl-4">
                      {para.split('\n').filter(l => l.startsWith('- ')).map((li, j) => (
                        <li key={j} className="flex items-start gap-2 font-mono text-sm text-slate-600">
                          <span className="text-blue-600 mt-0.5">▸</span>
                          <span>{li.slice(2)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i} className="font-mono text-sm text-slate-600 leading-7">{para}</p>;
              })}
            </div>
          </div>

          {/* Quiz teaser (if has quiz and not completed) */}
          {lesson.quiz && !isCompleted && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center">
                  <Icons.Target size={15} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-mono text-sm font-bold text-slate-900">Lesson Quiz</p>
                  <p className="font-mono text-[11px] text-slate-500">{lesson.quiz.questions?.length || 0} questions · Pass to complete</p>
                </div>
              </div>
              <button
                onClick={() => setQuizOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 font-mono text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-sm"
              >
                Take Quiz
              </button>
            </div>
          )}
        </div>

        {/* ── Right: Code Editor ─────────────────────────── */}
        <div className="xl:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden sticky top-20 shadow-sm">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="font-mono text-[10px] text-slate-400 ml-2 font-semibold">practice.js</span>
              </div>
              <button
                onClick={() => setCode(lesson.codeStarter || '// Practice your code here...\n')}
                className="font-mono text-[10px] text-slate-400 hover:text-blue-600 transition-colors font-semibold"
              >
                reset
              </button>
            </div>

            {/* Code textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-white text-slate-800 font-mono text-xs p-4 outline-none resize-none border-0"
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
            <div className="border-t border-slate-100">
              <button
                onClick={runCode}
                className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 transition-colors font-mono text-xs font-bold w-full px-4 py-3"
              >
                <Icons.Play size={11} /> ▶ Run Code
              </button>

              {/* Output panel */}
              {output && (
                <div className="border-t border-slate-100 bg-slate-50 max-h-36 overflow-y-auto">
                  <div className="flex items-center justify-between px-4 py-2 sticky top-0 bg-slate-50 backdrop-blur-sm">
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest font-bold">Output</span>
                    <button onClick={() => setOutput(null)} className="font-mono text-[9px] text-slate-400 hover:text-slate-700 transition-colors font-semibold">clear</button>
                  </div>
                  <div className="px-4 pb-3 space-y-0.5">
                    {output.lines.length === 0 ? (
                      <p className="font-mono text-[11px] text-slate-300 italic">// no output</p>
                    ) : output.lines.map((line, i) => (
                      <p key={i} className={`font-mono text-[11px] whitespace-pre-wrap ${
                        output.isError && i === output.lines.length - 1 ? 'text-red-500' : 'text-slate-700'
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
          <div className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-500">
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
