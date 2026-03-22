import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';
 
/* ─── Quiz Modal ───────────────────────────────────────────── */
function QuizGateModal({ quiz, lessonId, onPass, onClose }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
 
  const [shuffled] = useState(() =>
    [...quiz.questions].sort(() => Math.random() - 0.5)
  );
 
  const handleSubmit = async () => {
    const arr = shuffled.map((_, i) => answers[i] ?? -1);
    const unanswered = arr.findIndex(a => a === -1);
    if (unanswered !== -1) {
      setCurrentIndex(unanswered);
      toast.error(`Please answer question ${unanswered + 1}`);
      return;
    }
    setLoading(true);
    try {
      const originalOrderMap = shuffled.map((q, i) => ({ originalIndex: quiz.questions.indexOf(q), answer: answers[i] }));
      const orderedAnswers = quiz.questions.map((_, i) => {
        const found = originalOrderMap.find(o => o.originalIndex === i);
        return found ? found.answer : -1;
      });
      const r = await api.post(`/lessons/${lessonId}/quiz`, { answers: orderedAnswers });
      setResults(r.data);
      setSubmitted(true);
      if (r.data.passed) toast.success(`Passed! +${r.data.xpAwarded} XP`);
      else toast.error('You did not pass the assessment.');
    } catch { toast.error('Submission failed'); }
    setLoading(false);
  };
 
  const progress = Math.round(((Object.keys(answers).length) / shuffled.length) * 100);
 
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-[#020205]/95 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#0A0A0F]/60 border border-white/5 rounded-[24px] md:rounded-[32px] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 md:px-8 py-4 md:py-6 border-b border-white/5 flex items-center justify-between relative flex-shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Icons.Target size={16} className="text-blue-500" />
            </div>
            <div>
              <h3 className="font-display font-black text-base md:text-lg text-white tracking-tight">Technical Assessment</h3>
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                Question {currentIndex + 1} of {shuffled.length}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
            <Icons.X size={20} />
          </button>
          <div className="absolute bottom-0 left-0 h-[2px] bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
 
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            {!submitted ? (
              <div className="max-w-xl mx-auto space-y-8 md:space-y-10">
                {shuffled.map((q, qi) => (
                  currentIndex === qi && (
                    <div key={qi} className="space-y-6 md:space-y-8">
                      <h2 className="text-xl md:text-2xl font-display font-black text-white leading-snug">{q.question}</h2>
                      <div className="space-y-3">
                        {q.options.map((opt, oi) => (
                          <button
                            key={oi}
                            onClick={() => setAnswers({ ...answers, [qi]: oi })}
                            className={`w-full text-left px-5 md:px-6 py-4 md:py-5 rounded-2xl border transition-all flex items-center gap-3 md:gap-4 group ${
                              answers[qi] === oi
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                                : 'bg-white/3 border-white/5 text-slate-400 hover:bg-white/5 hover:border-white/10'
                            }`}
                          >
                            <span className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-black text-xs border flex-shrink-0 ${
                              answers[qi] === oi ? 'bg-white/20 border-white/20 text-white' : 'bg-white/5 border-white/5 text-slate-600'
                            }`}>
                              {String.fromCharCode(65 + oi)}
                            </span>
                            <span className="text-sm font-medium">{opt}</span>
                            {answers[qi] === oi && <Icons.Check size={16} className="ml-auto flex-shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 py-4">
                <div className={`p-6 md:p-8 rounded-[24px] md:rounded-[32px] text-center relative overflow-hidden ${results?.passed ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                  <div className={`font-display font-black text-5xl md:text-7xl mb-4 ${results?.passed ? 'text-emerald-500' : 'text-red-500'}`}>
                    {Math.round((results?.correct / results?.total) * 100)}%
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">{results?.passed ? 'Assessment Passed' : 'Assessment Failed'}</h3>
                  <p className="font-mono text-sm text-slate-400">
                    You scored <span className="text-white">{results?.correct}</span> out of <span className="text-white">{results?.total}</span> questions.
                    {results?.passed && <span className="block mt-2 text-emerald-400">+{results.xpAwarded} XP Earned</span>}
                  </p>
                </div>
                <div className="space-y-4">
                  {results?.results?.map((r, i) => {
                    const q = shuffled[i];
                    return (
                      <div key={i} className={`p-4 md:p-5 rounded-2xl border ${r.correct ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
                        <div className="flex items-start gap-3 md:gap-4">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${r.correct ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                            {r.correct ? <Icons.Check size={12} strokeWidth={4} /> : <Icons.X size={12} strokeWidth={4} />}
                          </div>
                          <div className="space-y-1 min-w-0">
                            <p className="text-sm font-semibold text-white/90">{q.question}</p>
                            {!r.correct && (
                              <p className="text-xs text-red-400 font-medium">Correct: {String.fromCharCode(65 + r.correctIndex)} — {q.options[r.correctIndex]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
 
                {/* Mobile submit/retry buttons */}
                <div className="md:hidden space-y-3">
                  {results?.passed ? (
                    <button onClick={onPass} className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] transition-all">
                      Continue →
                    </button>
                  ) : (
                    <button onClick={() => { setAnswers({}); setSubmitted(false); setResults(null); setCurrentIndex(0); }} className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white font-black uppercase tracking-widest text-[10px] transition-all">
                      Retry
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
 
          {/* Sidebar */}
          <div className="hidden md:flex flex-col w-[260px] border-l border-white/5 p-6 md:p-8 bg-[#020205]/40 backdrop-blur-md flex-shrink-0">
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Navigator</h4>
            <div className="grid grid-cols-4 gap-2 mb-10">
              {shuffled.map((_, i) => (
                <button
                  key={i}
                  disabled={submitted}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-10 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold transition-all border ${
                    currentIndex === i ? 'bg-blue-600 border-blue-500 text-white' :
                    answers[i] !== undefined ? 'bg-white/10 border-white/10 text-slate-300' : 'bg-white/5 border-white/5 text-slate-600 hover:border-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-auto space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Completion</p>
                <span className="text-2xl font-black text-white">{progress}%</span>
              </div>
              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] transition-all disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Answers'}
                </button>
              ) : results?.passed ? (
                <button onClick={onPass} className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] transition-all">
                  Continue →
                </button>
              ) : (
                <button onClick={() => { setAnswers({}); setSubmitted(false); setResults(null); setCurrentIndex(0); }} className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white font-black uppercase tracking-widest text-[10px] transition-all">
                  Retry
                </button>
              )}
            </div>
          </div>
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
  const [course, setCourse]           = useState(null);   // ✅ FIX: was undefined before
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading]         = useState(true);
  const [completing, setCompleting]   = useState(false);
  const [quizOpen, setQuizOpen]       = useState(false);
  const [code, setCode]               = useState('// Practice your code here...\n');
  const [output, setOutput]           = useState(null);
  const [showXP, setShowXP]           = useState(null);
  const [activeTab, setActiveTab]     = useState('content'); // mobile tab: content | editor
 
  useEffect(() => {
    setLoading(true);
    setOutput(null);
    api.get(`/lessons/${lessonSlug}`)
      .then((r) => {
        setLesson(r.data.lesson);
        setCourse(r.data.lesson?.course || null); // ✅ FIX: set course from lesson data
        setIsCompleted(r.data.isCompleted);
        if (r.data.lesson.codeStarter) setCode(r.data.lesson.codeStarter);
        else setCode('// Practice your code here...\n');
      })
      .catch(() => navigate(`/courses/${slug}`))
      .finally(() => setLoading(false));
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
        toast.success('🏆 Course Complete!');
        setTimeout(() => navigate(`/courses/${slug}`), 2000);
      }
    } catch { toast.error('Could not mark complete'); }
    setCompleting(false);
  }, [isCompleted, completing, lesson, slug, navigate]);
 
  const handleMarkComplete = () => {
    if (isCompleted) return;
    if (lesson?.quiz) setQuizOpen(true);
    else doComplete();
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
 
  const courseTitle = course?.title || 'Course';
 
  return (
    <div className="max-w-6xl mx-auto pb-16 px-2 md:px-0">
 
      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="flex items-start md:items-center justify-between mb-6 flex-wrap gap-3 py-4 md:py-6 px-1 border-b border-slate-200">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 flex-wrap">
            <button
              onClick={() => navigate(`/courses/${slug}`)}
              className="hover:text-blue-600 transition-colors uppercase tracking-widest truncate max-w-[120px] md:max-w-none"
            >
              {courseTitle}
            </button>
            <span>/</span>
            <span className="text-slate-900 uppercase tracking-widest truncate max-w-[140px] md:max-w-none">{lesson.title}</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-slate-900 tracking-tight leading-tight">{lesson.title}</h1>
        </div>
 
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <div className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-slate-100 border border-slate-200">
            <Icons.Clock size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-600">{lesson.duration}m</span>
          </div>
          <div className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-purple-50 border border-purple-100">
            <Icons.Zap size={14} className="text-purple-600" />
            <span className="text-xs font-bold text-purple-600">+{lesson.xpReward} XP</span>
          </div>
          <button
            onClick={handleMarkComplete}
            disabled={isCompleted || completing}
            className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
              isCompleted
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-600 cursor-default'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isCompleted ? (
              <><Icons.Check size={14} /> Completed</>
            ) : completing ? '...' : (
              <><Icons.Check size={14} /> Mark Complete</>
            )}
          </button>
        </div>
      </div>
 
      {/* ── Mobile Tab Toggle ───────────────────────────── */}
      <div className="flex xl:hidden bg-slate-100 rounded-xl p-1 mb-4 gap-1">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'content' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
        >
          Lesson Content
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'editor' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
        >
          Code Editor
        </button>
      </div>
 
      {/* ── Main 2-col layout ────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
 
        {/* ── Left: Content ──────────────────────────────── */}
        <div className={`xl:col-span-3 space-y-4 ${activeTab === 'editor' ? 'hidden xl:block' : ''}`}>
          <div className="bg-[#0a0a0a] border border-white/8 rounded-2xl overflow-hidden">
            <div className="px-5 md:px-8 pt-6 md:pt-8 pb-4">
              <h2 className="font-display font-black text-xl md:text-2xl text-white tracking-tight mb-3">{lesson.title}</h2>
              {isCompleted && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-mono text-[10px] font-bold uppercase tracking-wider">
                  <Icons.Check size={10} /> Completed
                </div>
              )}
            </div>
 
            <div className="px-5 md:px-8 pb-6 md:pb-8 space-y-5 text-sm text-slate-400 leading-relaxed font-mono">
              {lesson.content?.split('\n\n').map((para, i) => {
                if (para.startsWith('# '))  return <h1  key={i} className="font-display font-black text-2xl text-white mt-6 mb-4">{para.slice(2)}</h1>;
                if (para.startsWith('## ')) return <h2  key={i} className="font-display font-bold text-lg text-white/90 mt-5 mb-3">{para.slice(3)}</h2>;
                if (para.startsWith('### ')) return <h3 key={i} className="font-bold text-base text-white/80 mt-4 mb-2">{para.slice(4)}</h3>;
                if (para.startsWith('```')) {
                  const content = para.replace(/```\w*\n?/, '').replace(/```$/, '');
                  return (
                    <div key={i} className="border border-white/10 rounded-xl overflow-hidden my-6">
                      <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex justify-between items-center">
                        <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Code</span>
                        <button onClick={() => navigator.clipboard.writeText(content)} className="text-[10px] text-white/30 hover:text-white transition-colors">Copy</button>
                      </div>
                      <pre className="p-4 md:p-5 bg-black/40 text-blue-400 text-xs overflow-x-auto">{content}</pre>
                    </div>
                  );
                }
                if (para.startsWith('- ')) {
                  return (
                    <ul key={i} className="space-y-2.5 pl-2">
                      {para.split('\n').filter(l => l.startsWith('- ')).map((li, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span className="text-blue-500 mt-1 flex-shrink-0">→</span>
                          <span className="text-slate-400">{li.slice(2)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i} className="text-slate-400 leading-7">{para}</p>;
              })}
            </div>
          </div>
 
          {/* Quiz teaser */}
          {lesson.quiz && !isCompleted && (
            <div className="bg-purple-900/20 border border-purple-500/20 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                  <Icons.Target size={15} className="text-purple-400" />
                </div>
                <div>
                  <p className="font-mono text-sm font-bold text-white">Lesson Quiz</p>
                  <p className="font-mono text-[11px] text-white/40">{lesson.quiz.questions?.length || 0} questions · Pass to complete</p>
                </div>
              </div>
              <button
                onClick={() => setQuizOpen(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 font-mono text-xs font-bold text-white hover:bg-purple-500 transition-all"
              >
                Take Quiz
              </button>
            </div>
          )}
        </div>
 
        {/* ── Right: Code Editor ─────────────────────────── */}
        <div className={`xl:col-span-2 ${activeTab === 'content' ? 'hidden xl:block' : ''}`}>
          <div className="bg-[#0a0a0a] border border-white/8 rounded-2xl overflow-hidden xl:sticky xl:top-20">
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
              className="w-full bg-transparent text-teal-400 font-mono text-xs p-4 outline-none resize-none border-0"
              style={{ height: 280, tabSize: 2 }}
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
                className="flex items-center gap-2 text-teal-400 hover:bg-teal-400/5 transition-colors font-mono text-xs w-full px-4 py-3"
              >
                <Icons.Play size={11} /> ▶ Run Code
              </button>
 
              {output && (
                <div className="border-t border-white/6 bg-black/40 max-h-36 overflow-y-auto">
                  <div className="flex items-center justify-between px-4 py-2 sticky top-0 bg-black/60 backdrop-blur-sm">
                    <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Output</span>
                    <button onClick={() => setOutput(null)} className="font-mono text-[9px] text-white/30 hover:text-white transition-colors">clear</button>
                  </div>
                  <div className="px-4 pb-3 space-y-0.5">
                    {output.lines.length === 0 ? (
                      <p className="font-mono text-[11px] text-white/20 uppercase tracking-widest">No Output</p>
                    ) : output.lines.map((line, i) => (
                      <p key={i} className={`font-mono text-[11px] whitespace-pre-wrap ${
                        output.isError && i === output.lines.length - 1 ? 'text-red-400' : 'text-teal-400'
                      }`}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
 
      {/* ── XP Float ──────────────────────────────────── */}
      {showXP && (
        <div className="fixed bottom-8 right-4 md:right-8 z-50 animate-bounce">
          <div className="flex items-center gap-2 bg-purple-600 text-white px-4 md:px-5 py-3 rounded-2xl shadow-2xl border border-purple-500/50">
            <Icons.Zap size={16} />
            <span className="font-display font-black text-lg">+{showXP} XP</span>
          </div>
        </div>
      )}
 
      {/* ── Quiz Modal ─────────────────────────────────── */}
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
