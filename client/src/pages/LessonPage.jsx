import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spinner } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';

/* ─── Minimal Quiz Modal (Industrial Dark) ────────────────── */
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
        toast.success(`SYSTEM: TARGET_CLEARED (+${r.data.xpAwarded} XP)`);
      } else {
        toast.error(`FAIL: ${r.data.correct}/${r.data.total} CORRECT. 70% THRESHOLD REQUIRED.`);
      }
    } catch { toast.error('SIGNAL LOST: Submission failed'); }
    setLoading(false);
  };

  const retry = () => { setAnswers({}); setSubmitted(false); setResults(null); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div className="w-full max-w-lg bg-[#0A0A0A] border border-white/[0.1] rounded-[4px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-b border-white/[0.08] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[2px] bg-cyber/[0.08] border border-cyber/30 flex items-center justify-center">
              <Icons.Target size={14} className="text-cyber" />
            </div>
            <div>
              <p className="font-mono font-black text-[11px] text-white uppercase tracking-widest">KNOWLEDGE_ASSESSMENT</p>
              <p className="font-mono text-[9px] text-[#444] uppercase tracking-tighter">BREACH SECURITY GATE TO PROCEED</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#333] hover:text-white transition-colors">
            <Icons.X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6 custom-scrollbar">
          {!submitted ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-[#444] uppercase tracking-widest">{shuffled.length} SEGMENTS</span>
                <span className="text-[10px] font-mono text-cyber font-black uppercase tracking-widest px-2 py-0.5 border border-cyber/20 bg-cyber/[0.04]">70% THRESHOLD</span>
              </div>
              {shuffled.map((q, qi) => (
                <div key={q.id} className="space-y-4">
                  <p className="font-mono text-xs text-[#E0E0E0] leading-relaxed select-none">
                    <span className="text-[#333] mr-2">[{qi + 1}]</span> {q.question}
                  </p>
                  <div className="space-y-2">
                    {(q.options || []).map((opt, oi) => {
                      const isSelected = answers[qi] === oi;
                      return (
                        <button
                          key={oi}
                          onClick={() => setAnswers({ ...answers, [qi]: oi })}
                          className={`w-full text-left px-4 py-3 rounded-[4px] border font-mono text-[11px] transition-all flex items-center gap-3 ${
                            isSelected
                              ? 'bg-cyber/[0.08] border-cyber/50 text-white shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                              : 'bg-white/[0.01] border-white/[0.04] text-[#888] hover:border-white/[0.1] hover:text-white'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-[2px] border flex-shrink-0 flex items-center justify-center ${isSelected ? 'border-cyber bg-cyber' : 'border-[#222]'}`}>
                            {isSelected && <Icons.Check size={8} className="text-white" />}
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
            <div className="flex flex-col items-center text-center py-4 space-y-8">
              <div className={`w-20 h-20 rounded-[4px] flex items-center justify-center border-2 ${results?.passed ? 'bg-emerald/[0.08] border-emerald/50 text-emerald' : 'bg-crimson/[0.08] border-crimson/50 text-crimson'}`}>
                {results?.passed ? <Icons.Check size={40} /> : <Icons.X size={40} />}
              </div>
              <div>
                <h3 className="font-mono text-2xl font-black text-white mb-2 uppercase tracking-tighter">{results?.passed ? 'ACCESS_GRANTED' : 'ACCESS_DENIED'}</h3>
                <p className="font-mono text-[#555] text-[11px] uppercase tracking-widest">
                  ACCURACY: <span className="text-white font-black">{Math.round((results?.correct / results?.total) * 100)}%</span>
                </p>
              </div>
              
              {results?.passed && (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 border border-amber/20 bg-amber/[0.04] text-amber-500 rounded-[4px] font-mono text-[10px] font-black uppercase tracking-widest animate-pulse">
                  <Icons.Zap size={14} className="fill-current" /> +{results.xpAwarded} XP HARVESTED
                </div>
              )}

              <div className="w-full text-left mt-6 space-y-3">
                {results?.results?.map((r, i) => {
                  const q = shuffled[i];
                  return (
                    <div key={i} className={`p-4 rounded-[4px] border font-mono text-[11px] ${r.correct ? 'border-emerald/10 bg-emerald/[0.02]' : 'border-crimson/10 bg-crimson/[0.02]'}`}>
                      <p className="text-[#888] mb-3 leading-relaxed">[{i + 1}] {q.question}</p>
                      <div className="flex items-start gap-2">
                         <span className={r.correct ? 'text-emerald' : 'text-crimson'}>
                           {r.correct ? 'PASS // ' : 'FAIL // '}
                         </span>
                         <div>
                           {!r.correct && <p className="text-white mb-1">CORRECT_INDEX: {String.fromCharCode(65 + r.correctIndex)}</p>}
                           {!r.correct && r.explanation && <p className="text-[#555] text-[10px] tracking-tight">{r.explanation}</p>}
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
        <div className="px-6 py-4 border-t border-white/[0.06] flex gap-3">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-[4px] bg-cyber text-white font-mono text-[11px] font-black uppercase tracking-widest hover:bg-[#2563EB] transition-all disabled:opacity-50"
            >
              {loading ? 'TRANSMITTING...' : 'EXECUTE_EVALUATION'}
            </button>
          ) : results?.passed ? (
            <button
              onClick={onPass}
              className="w-full py-3 rounded-[4px] bg-emerald text-white font-mono text-[11px] font-black uppercase tracking-widest hover:bg-emerald/80 transition-all flex items-center justify-center gap-2"
            >
              BREACH SECURE SECTOR <Icons.ArrowRight size={14} />
            </button>
          ) : (
            <div className="flex w-full gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-[4px] border border-white/[0.08] text-white font-mono text-[10px] font-black uppercase tracking-widest hover:bg-white/[0.02]">RE-ANALYZE</button>
              <button onClick={retry} className="flex-1 py-3 rounded-[4px] bg-cyber text-white font-mono text-[10px] font-black uppercase tracking-widest hover:bg-[#2563EB]">RE-TRY SIGNAL</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Lesson Page (Industrial Dark) ─────────────────── */
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
      toast.success(`SYSTEM: +${r.data.xpAwarded} XP`);

      // Find next lesson to auto-advance
      const currentIdx = lesson.course.lessons?.findIndex(l => l.id === lesson.id);
      const nextLesson = lesson.course.lessons?.[currentIdx + 1];

      if (r.data.courseCompleted) {
        toast.success('GOAL: COURSE_FINALIZED. RETURNING TO ARCHIVE.');
        setTimeout(() => navigate(`/courses/${slug}`), 2500);
      } else if (nextLesson) {
        toast.success(`NAV: NEXT_MODULE DETECTED - ${nextLesson.title}`);
        setTimeout(() => navigate(`/courses/${slug}/${nextLesson.slug}`), 1000);
      } else {
        setTimeout(() => navigate(`/courses/${slug}`), 1000);
      }
    } catch { toast.error('ERROR: DATA_PERSISTENCE_FAILED'); }
    setCompleting(false);
  }, [isCompleted, completing, lesson, slug, navigate]);

  const handleMarkComplete = () => {
    if (isCompleted) {
      const currentIdx = lesson.course.lessons?.findIndex(l => l.id === lesson.id);
      const nextLesson = lesson.course.lessons?.[currentIdx + 1];
      if (nextLesson) navigate(`/courses/${slug}/${nextLesson.slug}`);
      else navigate(`/courses/${slug}`);
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
    <div className="flex flex-col justify-center items-center gap-6 min-h-[60vh]">
      <Spinner size={32} className="text-cyber" />
      <div className="text-center space-y-2">
        <p className="font-mono text-white font-black text-xl uppercase tracking-widest animate-pulse">ARCHITECTING_MODULE...</p>
        <p className="font-mono text-[#555] text-[10px] max-w-sm mx-auto uppercase tracking-tighter leading-relaxed">
          Our AI is synthesizing the expert curriculum JIT. This operation requires 10-15 seconds of system throughput.
        </p>
      </div>
    </div>
  );
  if (!lesson) return null;

  const requiresPractice = !!lesson.codeStarter;

  return (
    <div className="max-w-[1400px] mx-auto pb-16 pt-4 animate-fade-in px-4 md:px-6">
      {/* ── Top bar ────────────────── */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4 border-b border-white/[0.04] pb-6">
        <div className="flex items-center gap-3 font-mono text-[11px] font-black uppercase tracking-widest">
          <button
            onClick={() => navigate(`/courses/${slug}`)}
            className="text-[#444] hover:text-white transition-colors"
          >
            {lesson.course?.title || 'ARCHIVE'}
          </button>
          <span className="text-[#222]">/</span>
          <span className="text-cyber underline decoration-cyber/20 underline-offset-4">{lesson.title}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-white/[0.01] border border-white/[0.06] text-[#666] font-mono text-[10px] font-black uppercase">
            <Icons.Clock size={12} className="text-[#333]" />
            <span>EST: {lesson.duration}M</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-amber/[0.04] border border-amber/20 text-amber-500 font-mono text-[10px] font-black uppercase tracking-widest">
            <Icons.Zap size={12} className="fill-current" />
            <span>+{lesson.xpReward} XP</span>
          </div>
          <button
            onClick={handleMarkComplete}
            disabled={completing}
            className={`flex items-center gap-3 px-6 py-2 rounded-[2px] font-mono text-[11px] font-black uppercase tracking-widest transition-all ${
              isCompleted
                ? 'bg-emerald/[0.1] text-emerald border border-emerald/30 hover:bg-emerald/[0.15]'
                : 'bg-cyber text-white hover:bg-[#2563EB] shadow-[0_0_20px_rgba(59,130,246,0.15)]'
            }`}
          >
            {isCompleted ? (
              <><Icons.Check size={14} /> NEXT_MODULE</>
            ) : completing ? '...' : (
              <><Icons.Check size={14} fill="currentColor" /> COMPLETE_UNIT</>
            )}
          </button>
        </div>
      </div>

      {/* ── Dynamic Layout ───────────────────────────────── */}
      <div className={`grid grid-cols-1 ${requiresPractice ? 'lg:grid-cols-12 gap-10' : 'max-w-4xl mx-auto'}`}>

        {/* ── Left: Content (Industrial Blade) ──────────── */}
        <div className={requiresPractice ? 'lg:col-span-7 space-y-8' : 'space-y-8'}>
          <div className="bg-transparent rounded-none overflow-hidden">
            <div className="mb-10">
              <h1 className="font-black text-4xl text-white tracking-tighter uppercase mb-4 leading-none">{lesson.title}</h1>
              <div className="h-0.5 w-12 bg-cyber" />
            </div>
            
            <div className="space-y-6 font-mono text-[13px] text-[#A0A0A0] leading-relaxed">
              {lesson.content?.split('\n\n').map((para, i) => {
                if (para.startsWith('# '))  return <h1  key={i} className="font-black text-2xl text-white mt-12 mb-6 uppercase tracking-tight">{para.slice(2)}</h1>;
                if (para.startsWith('## ')) return <h2  key={i} className="font-black text-xl text-white mt-10 mb-5 uppercase tracking-wide border-l-2 border-cyber/50 pl-4">{para.slice(3)}</h2>;
                if (para.startsWith('### ')) return <h3  key={i} className="font-bold text-lg text-white mt-8 mb-4 uppercase">{para.slice(4)}</h3>;
                if (para.startsWith('> [!TIP]')) return (
                  <div key={i} className="bg-cyber/[0.04] border border-cyber/20 p-5 my-6 flex gap-4">
                    <Icons.Info size={16} className="text-cyber shrink-0 mt-0.5" />
                    <p className="text-cyber text-[12px] font-bold uppercase tracking-tight leading-normal m-0">{para.replace('> [!TIP]', '').replace('> ', '').trim()}</p>
                  </div>
                );
                if (para.startsWith('```')) {
                  const codeContent = para.replace(/```\w*\n?/, '').replace(/```$/, '');
                  return (
                    <div key={i} className="my-8 group relative">
                      <div className="absolute top-0 right-0 px-3 py-1 font-mono text-[9px] font-black text-[#333] uppercase">SNIPPET_RAW</div>
                      <pre className="p-6 bg-[#050505] border border-white/[0.08] text-cyber/90 overflow-x-auto shadow-inner selection:bg-cyber/30 selection:text-white">{codeContent}</pre>
                    </div>
                  );
                }
                if (para.startsWith('- ')) {
                  return (
                    <ul key={i} className="space-y-3 pl-4 mb-6">
                      {para.split('\n').filter(l => l.startsWith('- ')).map((li, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span className="text-cyber mt-1.5 shrink-0 w-1 h-1 bg-cyber" />
                          <span className="text-[#888]">{li.slice(2)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i} className="mb-4">{para.replace(/\*\*(.*?)\*\*/g, (match, words) => <span className="text-white font-black">{words}</span>)}</p>;
              })}
            </div>
            
            {/* Footer action */}
            <div className="mt-16 pt-10 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <p className="font-mono text-[11px] font-black text-white uppercase tracking-widest">UNIT_TERMINATED?</p>
                <p className="font-mono text-[9px] text-[#444] uppercase tracking-tighter">SYNCHRONIZE PROGRESS TO PERSIST DATA.</p>
              </div>
              <button
                onClick={handleMarkComplete}
                disabled={completing}
                className={`px-8 py-3 rounded-[2px] font-mono text-[11px] font-black uppercase tracking-widest transition-all ${
                  isCompleted
                    ? 'bg-white/[0.04] text-[#666] border border-white/[0.08] hover:text-white'
                    : 'bg-cyber text-white hover:bg-[#2563EB] shadow-md'
                }`}
              >
                {isCompleted ? 'CONTINUE_SIGNAL →' : 'ARCHIVE_PROGRESS'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Code Editor (Mechanismorphism) ────────── */}
        {requiresPractice && (
          <div className="lg:col-span-5 h-[calc(100vh-12rem)] sticky top-6">
            <div className="flex flex-col h-full bg-[#050505] border border-white/[0.08] rounded-[2px] shadow-2xl relative overflow-hidden">
               {/* Decorative Mechanism */}
               <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] -rotate-45 translate-x-8 -translate-y-8 border-b border-white/10" />
               
              {/* Editor toolbar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08] bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[2px] bg-black border border-white/[0.1] flex items-center justify-center">
                    <Icons.Terminal size={14} className="text-white" />
                  </div>
                  <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">PRACTICE_ENVIRONMENT</span>
                </div>
                <button
                  onClick={() => setCode(lesson.codeStarter || '// Practice your code here...\n')}
                  className="font-mono text-[9px] font-bold text-[#333] hover:text-white transition-colors uppercase tracking-widest"
                >
                  REBOOT
                </button>
              </div>

              {/* Code textarea */}
              <div className="flex-1 relative bg-black">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full bg-transparent text-cyber/80 font-mono text-[13px] p-6 outline-none resize-none selection:bg-cyber/30 selection:text-white"
                  style={{ tabSize: 2 }}
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
              <div className="bg-[#080808] border-t border-white/[0.08]">
                <button
                  onClick={runCode}
                  className="flex items-center justify-center gap-3 text-emerald font-mono font-black text-[12px] uppercase tracking-[0.3em] w-full py-5 hover:bg-emerald/[0.04] transition-all"
                >
                  <Icons.Play size={14} className="fill-current" /> EXECUTE_SIGNAL
                </button>

                {/* Output panel */}
                {output && (
                  <div className="border-t border-white/[0.08] bg-black max-h-48 overflow-y-auto">
                    <div className="flex items-center justify-between px-5 py-3 sticky top-0 bg-black/90 backdrop-blur-sm border-b border-white/[0.02]">
                      <span className="font-mono text-[9px] font-black text-[#333] uppercase tracking-[0.2em]">CONSOLE_FEED</span>
                      <button onClick={() => setOutput(null)} className="font-mono text-[9px] text-[#444] hover:text-white transition-colors uppercase">CLEAR</button>
                    </div>
                    <div className="px-6 pb-6 pt-2 space-y-1">
                      {output.lines.length === 0 ? (
                        <p className="font-mono text-[10px] text-[#222] italic uppercase">// waiting for execution signal...</p>
                      ) : output.lines.map((line, i) => (
                        <p key={i} className={`font-mono text-[11px] whitespace-pre-wrap ${
                          output.isError && i === output.lines.length - 1 ? 'text-crimson' : 'text-[#666]'
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

      {/* ── XP Float (Industrial) ─────────────────────────── */}
      {showXP && (
        <div className="fixed bottom-12 right-12 z-[100] animate-bounce">
          <div className="flex items-center gap-4 bg-black border border-amber/30 p-5 rounded-[4px] shadow-[0_0_30px_rgba(245,158,11,0.1)]">
            <div className="w-10 h-10 rounded-[2px] bg-amber/[0.08] flex items-center justify-center">
              <Icons.Zap size={20} className="text-amber-500 fill-current" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-[#666] font-black uppercase tracking-widest mb-0.5">UNITS_ACQUIRED</p>
              <span className="font-mono font-black tracking-widest text-2xl text-amber-500">+{showXP} XP</span>
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
