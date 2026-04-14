import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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

// --- Mock curriculum data ---
const COURSE_DATA: Record<string, any> = {
  default: {
    title: 'Advanced Rust Concurrency',
    domain: 'Systems',
    level: 'Advanced',
    totalLessons: 12,
    xpReward: 50,
    lessons: [
      {
        id: 1, title: 'Ownership & Borrow Checker', duration: '18 min', completed: true,
        content: `# Ownership & the Borrow Checker\n\nRust's ownership model is its most distinctive feature. It eliminates entire classes of bugs at compile time with **zero runtime cost**.\n\n## The Three Rules\n\n1. Each value has exactly one **owner**.\n2. When the owner goes out of scope, the value is **dropped**.\n3. There can only be **one mutable reference** OR **any number of immutable references** at a time — never both simultaneously.\n\n## Why This Matters\n\nThese rules prevent data races at the type level. The compiler rejects programs that could have undefined behavior.`,
        code: `fn main() {\n    // s1 owns the string\n    let s1 = String::from("hello");\n    // s2 borrows s1 immutably\n    let s2 = &s1;\n    println!("s1: {}, s2: {}", s1, s2);\n    // s3 tries to MOVE s1 — but s2 borrows it!\n    // let s3 = s1; // ← COMPILE ERROR ✗\n}`,
        quiz: {
          question: 'What does Rust do when an owner goes out of scope?',
          options: ['Calls garbage collector', 'Drops the value (frees memory)', 'Sets to null', 'Throws an exception'],
          correct: 1,
        }
      },
      {
        id: 2, title: 'Arc & Mutex for Shared State', duration: '22 min', completed: true,
        content: `# Arc<Mutex<T>> — Thread-Safe Shared State\n\n\`Arc\` (Atomic Reference Count) allows **multiple ownership** across threads. \`Mutex\` ensures **exclusive access** when mutating.\n\n## The Pattern\n\n\`\`\`\nArc<Mutex<T>>\n│   └─ Mutex — guarantees one writer at a time\n└─ Arc — enables multiple owners across threads\n\`\`\`\n\nThis combination gives you safe, shared mutable state without data races.`,
        code: `use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn main() {\n    let counter = Arc::new(Mutex::new(0));\n    let mut handles = vec![];\n\n    for _ in 0..10 {\n        let c = Arc::clone(&counter);\n        handles.push(thread::spawn(move || {\n            *c.lock().unwrap() += 1;\n        }));\n    }\n\n    for h in handles { h.join().unwrap(); }\n    println!("Result: {}", *counter.lock().unwrap());\n    // Output: Result: 10\n}`,
        quiz: {
          question: 'Why do we need Arc instead of just Mutex?',
          options: [
            'Arc provides locking', 'Mutex alone cannot be shared across threads because it is not Clone', 
            'Arc is faster', 'Mutex uses too much memory'
          ],
          correct: 1,
        }
      },
      {
        id: 3, title: 'Channels & Message Passing', duration: '25 min', completed: false,
        content: `# Channels: "Do not share memory; instead, communicate."\n\nRust's channels follow Go's philosophy. \`mpsc\` = **Multiple Producer, Single Consumer**.\n\n## When to Use Channels vs. Mutex\n\n| Channels | Mutex |\n|---|---|\n| Transfer ownership of data | Share data in place |\n| Producer/consumer pipelines | Counter/cache patterns |\n| Clean actor model | Simple shared state |`,
        code: `use std::sync::mpsc;\nuse std::thread;\n\nfn main() {\n    let (tx, rx) = mpsc::channel();\n    \n    // Spawn a producer\n    let tx1 = tx.clone();\n    thread::spawn(move || {\n        tx1.send("ping from thread 1").unwrap();\n    });\n\n    thread::spawn(move || {\n        tx.send("ping from thread 2").unwrap();\n    });\n\n    // Receive two messages\n    for msg in rx.iter().take(2) {\n        println!("Got: {}", msg);\n    }\n}`,
        quiz: {
          question: 'What does mpsc stand for?',
          options: ['Multi-process single-core', 'Multiple producer, single consumer', 'Memory-protected shared cache', 'Mutex-protected shared channel'],
          correct: 1,
        }
      },
      { id: 4, title: 'Async/Await with Tokio', duration: '30 min', completed: false, content: '# Async Rust with Tokio', code: 'use tokio;\n\n#[tokio::main]\nasync fn main() {\n    // async code here\n}', quiz: null },
      { id: 5, title: 'Rayon: Data Parallelism', duration: '20 min', completed: false, content: '# Rayon', code: '// rayon example', quiz: null },
      { id: 6, title: 'Final Project: Thread Pool', duration: '40 min', completed: false, content: '# Build a Thread Pool', code: '// thread pool', quiz: null },
    ]
  }
};

const XP_AMOUNT = 50;

function XpPopup({ show }: { show: boolean }) {
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
          +{XP_AMOUNT} XP Earned!
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CourseDetail() {
  const { id } = useParams();
  const courseKey = id && COURSE_DATA[id] ? id : 'default';
  const course = COURSE_DATA[courseKey];

  const [activeLesson, setActiveLesson] = useState(0);
  const [lessons, setLessons] = useState(course.lessons);
  const [userCode, setUserCode] = useState(course.lessons[0].code);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [runningCode, setRunningCode] = useState(false);

  const lesson = lessons[activeLesson];
  const completedCount = lessons.filter((l: any) => l.completed).length;
  const progressPct = (completedCount / lessons.length) * 100;

  const goToLesson = (idx: number) => {
    setActiveLesson(idx);
    setUserCode(lessons[idx].code);
    setCodeOutput(null);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const markComplete = () => {
    const updated = lessons.map((l: any, i: number) =>
      i === activeLesson ? { ...l, completed: true } : l
    );
    setLessons(updated);

    if (lesson.quiz) {
      setShowQuiz(true);
    } else {
      triggerXp();
      if (activeLesson < lessons.length - 1) {
        setTimeout(() => goToLesson(activeLesson + 1), 600);
      }
    }
  };

  const triggerXp = () => {
    setShowXp(true);
    setTimeout(() => setShowXp(false), 2200);
  };

  const handleRunCode = async () => {
    setRunningCode(true);
    setCodeOutput(null);
    await new Promise(r => setTimeout(r, 900));
    setCodeOutput(`✓ Compiled successfully (0.38s)\nResult: 10\nAll assertions passed.`);
    setRunningCode(false);
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (quizAnswer === lesson.quiz.correct) {
      setTimeout(() => {
        setShowQuiz(false);
        triggerXp();
        if (activeLesson < lessons.length - 1) {
          goToLesson(activeLesson + 1);
        }
      }, 1200);
    }
  };

  // Parse simple markdown-ish content
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-display font-bold mb-4 mt-2">{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-semibold mb-3 mt-5 text-zinc-200">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold mb-2 mt-4 text-zinc-300">{line.slice(4)}</h3>;
      if (line.startsWith('```')) return null;
      if (line.startsWith('|')) {
        const cells = line.split('|').filter(Boolean);
        return (
          <div key={i} className="flex gap-px mb-1">
            {cells.map((c, ci) => (
              <div key={ci} className="flex-1 px-3 py-1.5 bg-zinc-800/50 text-xs font-mono text-zinc-300 first:rounded-l last:rounded-r">
                {c.trim().replace(/---/g, '─')}
              </div>
            ))}
          </div>
        );
      }
      if (line.trim() === '') return <div key={i} className="h-3" />;
      // Bold
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
              <span className="flex items-center gap-1"><Star size={11} className="text-yellow-500" /> {course.level}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-48">
            <div className="flex justify-between text-xs text-zinc-500 mb-1 font-mono">
              <span>{completedCount}/{lessons.length} lessons</span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <Progress value={progressPct} className="h-1.5" />
          </div>
          <Badge variant="outline" className="font-mono text-yellow-500 border-yellow-500/30 bg-yellow-500/5">
            <Zap size={12} className="mr-1" /> +{XP_AMOUNT} XP/lesson
          </Badge>
        </div>
      </div>

      {/* Main split pane */}
      <div className="flex h-[calc(100vh-9rem)]">
        {/* LEFT: Sidebar + Content */}
        <div className="flex w-1/2 border-r border-zinc-800">
          {/* Lesson sidebar */}
          <div className="w-52 border-r border-zinc-800 bg-zinc-950 flex flex-col overflow-y-auto">
            <div className="px-4 py-3 border-b border-zinc-800">
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Curriculum</div>
            </div>
            {lessons.map((l: any, i: number) => {
              const isActive = i === activeLesson;
              const isLocked = i > completedCount + 1;
              return (
                <button
                  key={l.id}
                  onClick={() => !isLocked && goToLesson(i)}
                  disabled={isLocked}
                  className={`w-full text-left px-4 py-3 border-b border-zinc-900 flex items-start gap-2 transition-colors text-xs ${
                    isActive
                      ? 'bg-indigo-500/10 border-l-2 border-l-indigo-500'
                      : isLocked
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-zinc-900 cursor-pointer'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {l.completed ? (
                      <CheckCircle2 size={13} className="text-green-500" />
                    ) : isLocked ? (
                      <Lock size={13} className="text-zinc-600" />
                    ) : (
                      <div className={`w-3 h-3 rounded-full border ${isActive ? 'border-indigo-500 bg-indigo-500/20' : 'border-zinc-600'}`} />
                    )}
                  </div>
                  <div>
                    <div className={`font-medium leading-tight ${isActive ? 'text-white' : 'text-zinc-400'}`}>{l.title}</div>
                    <div className="text-zinc-600 mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {l.duration}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Lesson content */}
          <div className="flex-1 overflow-y-auto bg-zinc-900/30">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <BookOpen size={14} className="text-indigo-400" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{lesson.title}</div>
                  <div className="text-xs text-zinc-500 flex items-center gap-1 font-mono">
                    <Clock size={10} /> {lesson.duration}
                  </div>
                </div>
                {lesson.completed && (
                  <Badge className="ml-auto bg-green-500/15 text-green-400 border-green-500/30 text-xs">
                    <CheckCircle2 size={10} className="mr-1" /> Complete
                  </Badge>
                )}
              </div>

              <div className="prose prose-invert max-w-none">
                {renderContent(lesson.content)}
              </div>

              {!lesson.completed && (
                <Button
                  onClick={markComplete}
                  className="mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-mono gap-2"
                >
                  <CheckCircle2 size={16} /> Mark as Complete
                </Button>
              )}
              {lesson.completed && activeLesson < lessons.length - 1 && (
                <Button
                  variant="outline"
                  onClick={() => goToLesson(activeLesson + 1)}
                  className="mt-8 border-zinc-700 hover:bg-zinc-800 font-mono gap-2"
                >
                  Next Lesson <ChevronRight size={16} />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Code Editor */}
        <div className="flex-1 flex flex-col bg-zinc-950">
          {/* Editor header */}
          <div className="h-10 border-b border-zinc-800 flex items-center px-4 gap-3 bg-black/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-xs font-mono text-zinc-500 flex items-center gap-2">
              <Code2 size={11} /> main.rs
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleRunCode}
                disabled={runningCode}
                className="h-7 text-xs bg-green-600 hover:bg-green-500 text-white font-mono gap-1.5 px-3"
              >
                {runningCode ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                    Running...
                  </span>
                ) : (
                  <><Play size={11} /> Run Code</>
                )}
              </Button>
            </div>
          </div>

          {/* Code area */}
          <div className="flex-1 relative overflow-hidden">
            {/* Line numbers */}
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-black/40 border-r border-zinc-800/50 flex flex-col pt-3 z-10">
              {userCode.split('\n').map((_, i) => (
                <div key={i} className="text-zinc-700 text-xs font-mono text-right pr-3 leading-6 select-none">
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              value={userCode}
              onChange={e => setUserCode(e.target.value)}
              className="absolute inset-0 pl-12 pr-4 pt-3 w-full h-full bg-transparent font-mono text-sm text-zinc-300 resize-none outline-none leading-6 focus:ring-0 z-20"
              spellCheck={false}
            />
          </div>

          {/* Terminal output */}
          <div className="border-t border-zinc-800 bg-black/60">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-900">
              <Terminal size={12} className="text-zinc-500" />
              <span className="text-xs font-mono text-zinc-500">Output</span>
              {codeOutput && (
                <button onClick={() => setCodeOutput(null)} className="ml-auto text-zinc-600 hover:text-zinc-400">
                  <X size={12} />
                </button>
              )}
            </div>
            <div className="px-4 py-3 min-h-[80px] max-h-32 overflow-y-auto">
              {codeOutput ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-xs">
                  {codeOutput.split('\n').map((line, i) => (
                    <div key={i} className={line.startsWith('✓') ? 'text-green-400' : 'text-zinc-300'}>{line}</div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-zinc-700 font-mono text-xs">Click "Run Code" to execute ▶</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <Dialog open={showQuiz} onClose={() => setShowQuiz(false)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy size={18} className="text-yellow-500" />
            Quick Quiz — Earn {XP_AMOUNT} XP
          </DialogTitle>
        </DialogHeader>
        <DialogContent>
          {lesson.quiz && (
            <div className="space-y-4">
              <p className="text-zinc-300 text-sm font-medium">{lesson.quiz.question}</p>
              <div className="space-y-2">
                {lesson.quiz.options.map((opt: string, i: number) => {
                  let cls = 'border-zinc-700 bg-zinc-900 hover:border-zinc-500 text-zinc-300';
                  if (quizSubmitted) {
                    if (i === lesson.quiz.correct) cls = 'border-green-500 bg-green-500/10 text-green-300';
                    else if (i === quizAnswer) cls = 'border-red-500 bg-red-500/10 text-red-300';
                  } else if (quizAnswer === i) {
                    cls = 'border-indigo-500 bg-indigo-500/10 text-white';
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => !quizSubmitted && setQuizAnswer(i)}
                      className={`w-full text-left p-3 rounded-lg border text-sm transition-all font-mono ${cls}`}
                    >
                      <span className="text-zinc-500 mr-2">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                      {quizSubmitted && i === lesson.quiz.correct && <Check size={14} className="inline ml-2 text-green-400" />}
                      {quizSubmitted && i === quizAnswer && i !== lesson.quiz.correct && <X size={14} className="inline ml-2 text-red-400" />}
                    </button>
                  );
                })}
              </div>
              {quizSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg text-sm font-mono ${
                    quizAnswer === lesson.quiz.correct
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}
                >
                  {quizAnswer === lesson.quiz.correct
                    ? `✓ Correct! +${XP_AMOUNT} XP awarded. Moving to next lesson...`
                    : '✗ Not quite. Review the lesson material and try again.'}
                </motion.div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setShowQuiz(false)} className="text-zinc-500">
            Skip Quiz
          </Button>
          <Button
            onClick={handleQuizSubmit}
            disabled={quizAnswer === null || quizSubmitted}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono"
          >
            Submit Answer
          </Button>
        </DialogFooter>
      </Dialog>

      {/* XP Popup */}
      <XpPopup show={showXp} />
    </div>
  );
}
