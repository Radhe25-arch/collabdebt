import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spinner } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';

/* ─── Minimal Quiz Modal ───────────────────────────────────── */
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Icons.Target size={14} className="text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900">Knowledge Check</p>
              <p className="text-[11px] text-slate-500">Pass to complete lesson</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <Icons.X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {!submitted ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">{shuffled.length} Questions</span>
                <span className="text-[11px] font-mono text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">70% to pass</span>
              </div>
              {shuffled.map((q, qi) => (
                <div key={q.id} className="space-y-3">
                  <p className="text-sm text-slate-800 font-medium leading-relaxed">{qi + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {(q.options || []).map((opt, oi) => {
                      const isSelected = answers[qi] === oi;
                      return (
                        <button
                          key={oi}
                          onClick={() => setAnswers({ ...answers, [qi]: oi })}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none flex items-center gap-3 ${
                            isSelected
                              ? 'bg-blue-50 border-blue-200 text-blue-800 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${isSelected ? 'border-blue-600' : 'border-slate-300'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                          </div>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-4 space-y-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${results?.passed ? 'bg-green-50 border-green-400 text-green-500' : 'bg-red-50 border-red-400 text-red-500'}`}>
                {results?.passed ? <Icons.Check size={40} /> : <Icons.X size={40} />}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{results?.passed ? 'Great job!' : 'Needs review'}</h3>
                <p className="text-slate-500 text-sm">You got <span className="font-semibold text-slate-700">{results?.correct} out of {results?.total}</span> correct ({Math.round((results?.correct / results?.total) * 100)}%)</p>
              </div>
              
              {results?.passed && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs font-semibold mt-2">
                  <Icons.Zap size={14} className="text-yellow-500" /> +{results.xpAwarded} XP Earned
                </div>
              )}

              <div className="w-full text-left mt-6 space-y-3">
                {results?.results?.map((r, i) => {
                  const q = shuffled[i];
                  return (
                    <div key={i} className={`p-4 rounded-xl border text-sm ${r.correct ? 'border-green-100 bg-green-50/50' : 'border-red-100 bg-red-50/50'}`}>
                      <p className="text-slate-800 font-medium mb-2">{i + 1}. {q.question}</p>
                      <div className="flex items-start gap-2">
                        {r.correct ? (
                          <Icons.Check size={16} className="text-green-600 mt-0.5 shrink-0" />
                        ) : (
                          <Icons.X size={16} className="text-red-500 mt-0.5 shrink-0" />
                        )}
                        <div>
                          {r.correct ? (
                            <p className="text-green-700 font-medium">Correct!</p>
                          ) : (
                            <p className="text-red-600 font-medium mb-1">Incorrect. The correct answer was: <span className="font-bold">{String.fromCharCode(65 + r.correctIndex)}</span></p>
                          )}
                          {!r.correct && r.explanation && <p className="text-slate-500 text-xs mt-1 leading-relaxed">{r.explanation}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex-shrink-0 flex gap-3">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-all disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Submitting...' : 'Submit Answers'}
            </button>
          ) : results?.passed ? (
            <button
              onClick={onPass}
              className="w-full py-3 rounded-xl bg-green-600 text-sm font-semibold text-white hover:bg-green-700 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Continue to next <Icons.ArrowRight size={16} />
            </button>
          ) : (
            <div className="flex w-full gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">Review Lesson</button>
              <button onClick={retry} className="flex-1 py-3 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-sm">Try Again</button>
            </div>
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
      toast.success(`+${r.data.xpAwarded} XP earned!`);

      if (r.data.courseCompleted) {
        toast.success('🏆 Course Complete! Returning to library...');
        setTimeout(() => navigate(`/courses/${slug}`), 2500);
      } else {
        // Auto-advance back to the course outline immediately to click the next lesson
        setTimeout(() => navigate(`/courses/${slug}`), 1000);
      }
    } catch { toast.error('Could not mark complete'); }
    setCompleting(false);
  }, [isCompleted, completing, lesson, slug, navigate]);

  const handleMarkComplete = () => {
    if (isCompleted) {
      // If already complete, just go back to outline
      navigate(`/courses/${slug}`);
      return;
    }
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

  // Rule: Only show the code compiler panel if the lesson explicitly provides codeStarter
  // or if the content has "Interactive Practice" mentioned. 
  // Let's use codeStarter as the primary flag for "needs compiler".
  const requiresPractice = !!lesson.codeStarter;

  return (
    <div className="max-w-[1200px] mx-auto pb-16">
      {/* ── Top bar with Clean Breadcrumbs ────────────────── */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        {/* Clean Breadcrumb: No double arrows. Text-based navigation. */}
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate(`/courses/${slug}`)}
            className="text-slate-400 hover:text-blue-600 transition-colors font-medium"
          >
            {lesson.course?.title || 'Course'}
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-semibold">{lesson.title}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500">
            <Icons.Clock size={12} />
            <span className="text-xs font-semibold">{lesson.duration}m</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600">
            <Icons.Zap size={12} />
            <span className="text-xs font-bold">+{lesson.xpReward} XP</span>
          </div>
          <button
            onClick={handleMarkComplete}
            disabled={completing}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
              isCompleted
                ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
            }`}
          >
            {isCompleted ? (
              <><Icons.Check size={14} /> Continue next</>
            ) : completing ? '...' : (
              <><Icons.Check size={14} /> Mark Complete</>
            )}
          </button>
        </div>
      </div>

      {/* ── Dynamic Layout ───────────────────────────────── */}
      <div className={`grid grid-cols-1 ${requiresPractice ? 'lg:grid-cols-5 gap-6' : 'lg:grid-cols-1 max-w-3xl mx-auto'}`}>

        {/* ── Left: Content ─────────────────────────────── */}
        <div className={requiresPractice ? 'lg:col-span-3 space-y-6' : 'space-y-6'}>
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-8 lg:p-10">
              <h1 className="font-display font-bold text-3xl text-slate-900 tracking-tight mb-6">{lesson.title}</h1>
              
              {/* Content renderer */}
              <div className="space-y-5 text-base text-slate-600 leading-relaxed font-body">
                {lesson.content?.split('\n\n').map((para, i) => {
                  if (para.startsWith('# '))  return <h1  key={i} className="font-display font-bold text-2xl text-slate-900 mt-8 mb-4">{para.slice(2)}</h1>;
                  if (para.startsWith('## ')) return <h2  key={i} className="font-display font-semibold text-xl text-slate-900 mt-6 mb-3">{para.slice(3)}</h2>;
                  if (para.startsWith('### ')) return <h3  key={i} className="font-display font-medium text-lg text-slate-800 mt-5">{para.slice(4)}</h3>;
                  if (para.startsWith('> [!TIP]')) return (
                    <div key={i} className="bg-blue-50/50 border-l-2 border-blue-500 pl-4 py-3 my-4 flex gap-3">
                      <Icons.Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-blue-900 text-sm mt-0">{para.replace('> [!TIP]', '').replace('> ', '').trim()}</p>
                    </div>
                  );
                  if (para.startsWith('```')) {
                    const codeContent = para.replace(/```\w*\n?/, '').replace(/```$/, '');
                    return (
                      <div key={i} className="my-6">
                        <pre className="p-5 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-sm text-slate-800 overflow-x-auto shadow-inner">{codeContent}</pre>
                      </div>
                    );
                  }
                  if (para.startsWith('- ')) {
                    return (
                      <ul key={i} className="space-y-2 pl-4 mb-4">
                        {para.split('\n').filter(l => l.startsWith('- ')).map((li, j) => (
                          <li key={j} className="flex items-start gap-2 text-slate-600">
                            <span className="text-blue-500 mt-1 shrink-0">•</span>
                            <span>{li.slice(2)}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={i}>{para.replace(/\*\*(.*?)\*\*/g, (match, words) => words)}</p>; // Basic bold stripping if needed, or proper markdown. For now, keep simple paragraph.
                })}
              </div>
            </div>
            
            {/* Footer action */}
            <div className="p-8 lg:p-10 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Done reading?</p>
                <p className="text-sm text-slate-500">Mark as complete to track your progress.</p>
              </div>
              <button
                onClick={handleMarkComplete}
                disabled={completing}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  isCompleted
                    ? 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                }`}
              >
                {isCompleted ? 'Next Lesson →' : 'Complete Lesson'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Code Editor (Conditional) ───────────── */}
        {requiresPractice && (
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm sticky top-6">
              {/* Editor toolbar */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <Icons.Terminal size={14} className="text-slate-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">Practice Editor</span>
                </div>
                <button
                  onClick={() => setCode(lesson.codeStarter || '// Practice your code here...\n')}
                  className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Code textarea */}
              <div className="relative">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 font-mono text-sm p-5 outline-none resize-none"
                  style={{ height: 380, tabSize: 2 }}
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
              </div>

              {/* Run button */}
              <div className="bg-slate-900 border-t border-slate-800">
                <button
                  onClick={runCode}
                  className="flex items-center justify-center gap-2 text-green-400 hover:bg-slate-800 hover:text-green-300 transition-colors font-semibold text-sm w-full py-4"
                >
                  <Icons.Play size={14} /> Run Code
                </button>

                {/* Output panel */}
                {output && (
                  <div className="border-t border-slate-800 bg-black min-h-[120px] max-h-48 overflow-y-auto">
                    <div className="flex items-center justify-between px-5 py-2 sticky top-0 bg-black/90 backdrop-blur-sm">
                      <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest">Output / Console</span>
                      <button onClick={() => setOutput(null)} className="text-[10px] font-mono font-semibold text-slate-500 hover:text-slate-300 transition-colors">Clear</button>
                    </div>
                    <div className="px-5 pb-4 space-y-1">
                      {output.lines.length === 0 ? (
                        <p className="font-mono text-xs text-slate-600 italic">// execution finished with no output</p>
                      ) : output.lines.map((line, i) => (
                        <p key={i} className={`font-mono text-xs whitespace-pre-wrap ${
                          output.isError && i === output.lines.length - 1 ? 'text-red-400' : 'text-slate-300'
                        }`}>{line}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── XP Float ───────────────────────────────────── */}
      {showXP && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce">
          <div className="flex items-center gap-3 bg-white text-slate-900 px-6 py-4 rounded-full shadow-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Icons.Zap size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-0.5">Lesson Complete</p>
              <span className="font-display font-black tracking-tight text-xl text-amber-600">+{showXP} XP</span>
            </div>
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
