import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, CheckCircle2, Play, Code2,
  Trophy, BookOpen, Terminal, Zap, X, Check, Lock,
  ArrowLeft, Clock, Star
} from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { MOCK_COURSES } from '@/data/mockData';

function XpPopup({ show, amount }: { show: boolean; amount: number }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -60, scale: 0.7 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-yellow-500 text-black rounded-2xl shadow-[0_0_40px_rgba(234,179,8,0.4)] font-mono font-bold text-lg"
        >
          <Zap size={20} />
          +{amount} XP Earned!
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courseProgress, completeLesson } = useGameStore();
  
  const course = MOCK_COURSES.find(c => c.id === id) || MOCK_COURSES[0];
  const progress = courseProgress[course.id] || { completedLessons: [], lastAccessed: 0 };

  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [runningCode, setRunningCode] = useState(false);

  const lesson = course.lessons[activeLessonIdx];
  const completedCount = progress.completedLessons.length;
  const progressPct = (completedCount / course.totalLessons) * 100;

  useEffect(() => {
    setUserCode(lesson.code);
    setCodeOutput(null);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  }, [activeLessonIdx, lesson]);

  const goToLesson = (idx: number) => {
    setActiveLessonIdx(idx);
  };

  const isLessonCompleted = (lId: number) => progress.completedLessons.includes(lId);

  const handleComplete = () => {
    if (lesson.quiz) {
      setShowQuiz(true);
    } else {
      finalizeLesson();
    }
  };

  const finalizeLesson = () => {
    completeLesson(course.id, lesson.id, course.xpReward);
    setShowXp(true);
    setTimeout(() => setShowXp(false), 2200);
    
    if (activeLessonIdx < course.lessons.length - 1) {
      setTimeout(() => goToLesson(activeLessonIdx + 1), 600);
    }
  };

  const handleRunCode = async () => {
    setRunningCode(true);
    setCodeOutput(null);
    await new Promise(r => setTimeout(r, 900));
    setCodeOutput(`✓ Compiled successfully\nResult: Execution Complete\nAll assertions passed.`);
    setRunningCode(false);
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (quizAnswer === lesson.quiz?.correct) {
      setTimeout(() => {
        setShowQuiz(false);
        finalizeLesson();
      }, 1200);
    }
  };

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-display font-bold mb-4 mt-2">{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-semibold mb-3 mt-5 text-zinc-200">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold mb-2 mt-4 text-zinc-300">{line.slice(4)}</h3>;
      if (line.trim() === '') return <div key={i} className="h-3" />;
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="text-zinc-400 text-sm leading-relaxed mb-1">
          {parts.map((part, pi) => pi % 2 === 1 ? <strong key={pi} className="text-white font-semibold">{part}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <div className="space-y-0 -mt-8 -mx-8 min-h-[calc(100vh-4rem)]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-950/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link to="/app/courses" className="text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-white">{course.title}</h1>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1"><BookOpen size={11} /> {course.domain}</span>
              <span className="flex items-center gap-1 text-zinc-400">{course.level}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-48 hidden md:block">
            <div className="flex justify-between text-[10px] uppercase font-mono text-zinc-500 mb-1 tracking-wider">
              <span>{completedCount}/{course.totalLessons} Lessons</span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <Progress value={progressPct} className="h-1" />
          </div>
          <Badge variant="outline" className="font-mono text-yellow-500 border-yellow-500/30 bg-yellow-500/5 px-2 py-0">
            <Zap size={10} className="mr-1" /> +{course.xpReward} XP
          </Badge>
        </div>
      </div>

      {/* Main split pane */}
      <div className="flex h-[calc(100vh-9rem)]">
        {/* LEFT: Sidebar + Content */}
        <div className="flex w-1/2 border-r border-zinc-800">
          <div className="w-52 border-r border-zinc-800 bg-zinc-950 flex flex-col overflow-y-auto">
            <div className="px-4 py-3 border-b border-zinc-800 bg-black/20">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Curriculum</div>
            </div>
            {course.lessons.map((l, i) => {
              const isActive = i === activeLessonIdx;
              const isComp = isLessonCompleted(l.id);
              return (
                <button
                  key={l.id}
                  onClick={() => goToLesson(i)}
                  className={`w-full text-left px-4 py-3 border-b border-zinc-900/50 flex items-start gap-2 transition-all ${
                    isActive ? 'bg-indigo-500/10 border-l-2 border-l-indigo-500' : 'hover:bg-zinc-900/50'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isComp ? <CheckCircle2 size={13} className="text-green-500" /> : <div className={`w-3 h-3 rounded-full border ${isActive ? 'border-indigo-500 bg-indigo-500/20' : 'border-zinc-700'}`} />}
                  </div>
                  <div>
                    <div className={`text-xs font-medium leading-tight ${isActive ? 'text-white' : 'text-zinc-400'}`}>{l.title}</div>
                    <div className="text-[10px] text-zinc-600 mt-0.5 flex items-center gap-1 font-mono">
                      <Clock size={10} /> {l.duration}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto bg-zinc-900/30">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Play size={16} className="text-indigo-400 ml-0.5" />
                </div>
                <div>
                  <div className="font-display font-bold text-white text-lg tracking-tight">{lesson.title}</div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">Lesson {activeLessonIdx + 1} of {course.totalLessons}</div>
                </div>
              </div>

              <div className="prose prose-invert max-w-none mb-12">
                {renderContent(lesson.content)}
              </div>

              <div className="pt-8 border-t border-zinc-800">
                {!isLessonCompleted(lesson.id) ? (
                  <Button onClick={handleComplete} className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono gap-2 h-11 px-8">
                    <CheckCircle2 size={18} /> Mark as Complete
                  </Button>
                ) : (
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 py-1.5 px-3">
                      <CheckCircle2 size={14} className="mr-2" /> Lesson Completed
                    </Badge>
                    {activeLessonIdx < course.lessons.length - 1 && (
                      <Button variant="ghost" onClick={() => goToLesson(activeLessonIdx + 1)} className="text-zinc-400 hover:text-white font-mono gap-2">
                        Next Lesson <ChevronRight size={16} />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Code Editor */}
        <div className="flex-1 flex flex-col bg-zinc-950">
          <div className="h-10 border-b border-zinc-800 flex items-center px-4 gap-3 bg-black/40">
            <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-2">
              <Terminal size={12} className="text-indigo-500" /> interactive_shell.rs
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" onClick={handleRunCode} disabled={runningCode} className="h-7 text-[10px] bg-green-600 hover:bg-green-500 text-white font-mono gap-1.5 px-3">
                {runningCode ? <><span className="w-2 h-2 border border-white/30 border-t-white rounded-full animate-spin" /> RUNNING</> : <><Play size={10} /> RUN CODE</>}
              </Button>
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-black/40 border-r border-zinc-800/50 flex flex-col pt-3 z-10">
              {userCode.split('\n').map((_, i) => <div key={i} className="text-zinc-800 text-[10px] font-mono text-right pr-3 leading-6">{i + 1}</div>)}
            </div>
            <textarea
              value={userCode}
              onChange={e => setUserCode(e.target.value)}
              className="absolute inset-0 pl-12 pr-4 pt-3 w-full h-full bg-transparent font-mono text-sm text-zinc-300 resize-none outline-none leading-6 focus:ring-0 z-20"
              spellCheck={false}
            />
          </div>
          <div className="border-t border-zinc-800 bg-zinc-950">
            <div className="flex items-center gap-2 px-4 py-1.5 border-b border-zinc-900 bg-black/20">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Compiler Output</span>
            </div>
            <div className="px-4 py-3 min-h-[120px] font-mono text-xs overflow-y-auto">
              {codeOutput ? <div className={codeOutput.includes('✓') ? 'text-green-400' : 'text-zinc-300'}>{codeOutput}</div> : <div className="text-zinc-700">Empty output. Press "RUN CODE" to execute.</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Trophy size={20} className="text-yellow-500" /> Knowledge Check
            </DialogTitle>
          </DialogHeader>
          {lesson.quiz && (
            <div className="space-y-6 py-4">
              <p className="text-zinc-200 text-sm font-medium leading-relaxed">{lesson.quiz.question}</p>
              <div className="space-y-2">
                {lesson.quiz.options.map((opt, i) => {
                  let cls = 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 text-zinc-400 hover:text-white';
                  if (quizSubmitted) {
                    if (i === lesson.quiz?.correct) cls = 'border-green-500 bg-green-500/10 text-green-300';
                    else if (i === quizAnswer) cls = 'border-red-500 bg-red-500/10 text-red-300';
                  } else if (quizAnswer === i) cls = 'border-indigo-500 bg-indigo-500/10 text-white';
                  return (
                    <button key={i} onClick={() => !quizSubmitted && setQuizAnswer(i)} className={`w-full text-left p-4 rounded-xl border text-xs transition-all font-mono flex items-center gap-3 ${cls}`}>
                      <span className="w-5 h-5 rounded bg-black/40 flex items-center justify-center text-[10px] border border-zinc-800">{String.fromCharCode(65 + i)}</span>
                      {opt}
                      {quizSubmitted && i === lesson.quiz?.correct && <Check size={14} className="ml-auto text-green-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setShowQuiz(false)} className="text-zinc-500 hover:text-white font-mono text-xs">Skip</Button>
            <Button onClick={handleQuizSubmit} disabled={quizAnswer === null || quizSubmitted} className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono px-8">Submit Answer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <XpPopup show={showXp} amount={course.xpReward} />
    </div>
  );
}
