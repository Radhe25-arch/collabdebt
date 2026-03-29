import { useState, useEffect, useCallback, useRef } from 'react';
import { ProgressBar, BadgeTag, Spinner } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { format } from 'date-fns';

// ─── QUIZ QUESTION BANK (fallback) ──────────────────────────
const FALLBACK_QUESTIONS = {
  javascript: [
    { q: 'What does `typeof null` return in JavaScript?', opts: ['null', 'undefined', 'object', 'boolean'], answer: 2 },
    { q: 'Which method converts JSON string to a JS object?', opts: ['JSON.stringify()', 'JSON.parse()', 'JSON.convert()', 'JSON.toObject()'], answer: 1 },
    { q: 'What is the output of `[] + []`?', opts: ['[]', '0', '""', 'undefined'], answer: 2 },
    { q: 'Which keyword declares a block-scoped variable?', opts: ['var', 'let', 'function', 'global'], answer: 1 },
    { q: 'What does `===` check in JavaScript?', opts: ['Value only', 'Type only', 'Value and type', 'Reference'], answer: 2 },
  ],
  python: [
    { q: 'What is the output of `type([])` in Python?', opts: ['list', '<class \'list\'>', 'array', 'tuple'], answer: 1 },
    { q: 'Which keyword is used for anonymous functions?', opts: ['def', 'lambda', 'func', 'anon'], answer: 1 },
    { q: 'What does `len("hello")` return?', opts: ['4', '5', '6', 'Error'], answer: 1 },
    { q: 'Which data structure is immutable?', opts: ['list', 'dict', 'set', 'tuple'], answer: 3 },
    { q: 'How do you start a comment in Python?', opts: ['//', '#', '/*', '--'], answer: 1 },
  ],
  general: [
    { q: 'What is the time complexity of binary search?', opts: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 1 },
    { q: 'What does API stand for?', opts: ['Application Programming Interface', 'Applied Program Integration', 'Auto Program Interface', 'Application Process Integration'], answer: 0 },
    { q: 'Which data structure uses FIFO?', opts: ['Stack', 'Queue', 'Tree', 'Graph'], answer: 1 },
    { q: 'What does SQL stand for?', opts: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'System Query Language'], answer: 0 },
    { q: 'Which is NOT a programming paradigm?', opts: ['OOP', 'Functional', 'Procedural', 'Sequential'], answer: 3 },
    { q: 'What is a closure in programming?', opts: ['A function within a function retaining outer scope', 'A way to close a program', 'A type of loop', 'A database query'], answer: 0 },
    { q: 'What does HTTP status 404 mean?', opts: ['Server Error', 'Unauthorized', 'Not Found', 'Bad Request'], answer: 2 },
    { q: 'Which sorting algorithm has O(n log n) average case?', opts: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort'], answer: 2 },
    { q: 'What is Git?', opts: ['A text editor', 'A version control system', 'A programming language', 'An OS'], answer: 1 },
    { q: 'What does CSS stand for?', opts: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Syntax', 'Coded Style Systems'], answer: 1 },
  ],
};

function generateQuizQuestions(enrolledCourses) {
  const questions = [];

  if (!enrolledCourses || enrolledCourses.length === 0) {
    // No enrollments — give general questions
    const general = [...FALLBACK_QUESTIONS.general].sort(() => Math.random() - 0.5);
    return general.slice(0, 5).map((q, i) => ({ ...q, id: i, course: 'General Knowledge' }));
  }

  if (enrolledCourses.length === 1) {
    // Single enrollment — 5 questions from that course
    const slug = enrolledCourses[0].slug || 'general';
    const bank = FALLBACK_QUESTIONS[slug] || FALLBACK_QUESTIONS.general;
    const shuffled = [...bank].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5).map((q, i) => ({ ...q, id: i, course: enrolledCourses[0].title || slug }));
  }

  // Multiple enrollments — 2 questions per course (max 10)
  enrolledCourses.slice(0, 5).forEach((course, ci) => {
    const slug = course.slug || 'general';
    const bank = FALLBACK_QUESTIONS[slug] || FALLBACK_QUESTIONS.general;
    const shuffled = [...bank].sort(() => Math.random() - 0.5);
    shuffled.slice(0, 2).forEach((q, qi) => {
      questions.push({ ...q, id: ci * 10 + qi, course: course.title || slug });
    });
  });

  return questions.slice(0, 10);
}

// ─── QUIZ CARD ──────────────────────────────────────────────
function QuizQuestion({ question, index, total, onAnswer, answered, selectedIdx, timeLeft }) {
  const isCorrect = answered && selectedIdx === question.answer;
  const isWrong   = answered && selectedIdx !== question.answer;

  return (
    <div className="arena-card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-mono text-xs font-bold">
            {index + 1}
          </span>
          <div>
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Question {index + 1} of {total}</span>
            <p className="font-mono text-xs text-slate-400">{question.course}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
          timeLeft <= 10 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-600'
        }`}>
          <Icons.Clock size={12} />
          <span className="font-mono text-xs font-bold">{timeLeft}s</span>
        </div>
      </div>

      {/* Question */}
      <h3 className="font-display font-bold text-base text-slate-900 leading-relaxed">{question.q}</h3>

      {/* Options */}
      <div className="space-y-2">
        {question.opts.map((opt, i) => {
          let style = 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50';
          if (answered) {
            if (i === question.answer) style = 'border-green-400 bg-green-50 text-green-700';
            else if (i === selectedIdx && i !== question.answer) style = 'border-red-400 bg-red-50 text-red-600';
            else style = 'border-slate-200 bg-slate-50 text-slate-400';
          }

          return (
            <button
              key={i}
              onClick={() => !answered && onAnswer(i)}
              disabled={answered}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${style}`}
            >
              <span className={`w-7 h-7 rounded-full border flex-shrink-0 flex items-center justify-center font-mono text-xs font-bold ${
                answered && i === question.answer ? 'border-green-400 bg-green-100 text-green-600' :
                answered && i === selectedIdx ? 'border-red-400 bg-red-100 text-red-500' :
                'border-slate-300 text-slate-500'
              }`}>
                {answered && i === question.answer ? '✓' : answered && i === selectedIdx ? '✗' : String.fromCharCode(65 + i)}
              </span>
              <span className="font-body text-sm">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {isCorrect
            ? <><Icons.Check size={14} className="text-green-600" /><span className="font-mono text-xs text-green-700 font-bold">Correct! +20 XP</span></>
            : <><Icons.X size={14} className="text-red-500" /><span className="font-mono text-xs text-red-600 font-bold">Wrong! The correct answer is {String.fromCharCode(65 + question.answer)}</span></>
          }
        </div>
      )}
    </div>
  );
}

// ─── RESULTS SCREEN ─────────────────────────────────────────
function QuizResults({ score, total, xpEarned, onRetry }) {
  const pct = Math.round((score / total) * 100);
  const grade = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good job!' : pct >= 40 ? 'Keep practicing!' : 'Try again!';
  const gradeColor = pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-blue-600' : pct >= 40 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="arena-card p-8 max-w-md mx-auto text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-600/15 border border-blue-600/20 flex items-center justify-center mx-auto">
        <Icons.Target size={28} className="text-blue-600" />
      </div>
      <div>
        <h2 className={`font-display font-black text-2xl ${gradeColor}`}>{grade}</h2>
        <p className="font-mono text-xs text-slate-500 mt-1">Daily Quiz Complete</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="arena-card p-3">
          <div className="font-display font-bold text-xl text-slate-900">{score}/{total}</div>
          <div className="font-mono text-xs text-slate-500">Correct</div>
        </div>
        <div className="arena-card p-3">
          <div className="font-display font-bold text-xl text-blue-700">{pct}%</div>
          <div className="font-mono text-xs text-slate-500">Accuracy</div>
        </div>
        <div className="arena-card p-3">
          <div className="font-display font-bold text-xl text-green-600">+{xpEarned}</div>
          <div className="font-mono text-xs text-slate-500">XP Earned</div>
        </div>
      </div>
      <button onClick={onRetry} className="btn-primary w-full py-3 text-sm">
        <Icons.ArrowRight size={14} /> Try Again Tomorrow
      </button>
    </div>
  );
}

// ─── MAIN QUEST PAGE ────────────────────────────────────────
export default function QuestPage() {
  const [loading, setLoading]         = useState(true);
  const [questions, setQuestions]     = useState([]);
  const [currentQ, setCurrentQ]       = useState(0);
  const [answers, setAnswers]         = useState({});
  const [timeLeft, setTimeLeft]       = useState(30);
  const [quizDone, setQuizDone]       = useState(false);
  const [history, setHistory]         = useState(null);
  const [enrolledCourses, setEnrolled]= useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch enrolled courses
        let courses = [];
        try {
          const r = await api.get('/courses/my-enrollments');
          courses = (r.data.enrollments || []).map(e => e.course).filter(Boolean);
        } catch { /* ignore */ }
        setEnrolled(courses);

        // Generate quiz
        const qs = generateQuizQuestions(courses);
        setQuestions(qs);

        // Fetch quiz history
        try {
          const h = await api.get('/quests/history');
          setHistory(h.data);
        } catch { /* ignore */ }
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, []);

  // Timer
  useEffect(() => {
    if (quizDone || questions.length === 0) return;
    if (answers[currentQ] != null) return; // Already answered

    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Auto-answer wrong on timeout
          setAnswers(a => ({ ...a, [currentQ]: -1 }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentQ, quizDone, questions.length]);

  const handleAnswer = (optIdx) => {
    clearInterval(timerRef.current);
    setAnswers(a => ({ ...a, [currentQ]: optIdx }));

    // Auto-advance after 1.5s
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(c => c + 1);
      } else {
        setQuizDone(true);
        // Try to report to server
        const score = questions.filter((q, i) => answers[i] === q.answer || (i === currentQ && optIdx === q.answer)).length;
        api.post('/quests/progress', { type: 'QUIZ_PASS', increment: score }).catch(() => {});
      }
    }, 1500);
  };

  const score    = questions.filter((q, i) => answers[i] === q.answer).length;
  const xpEarned = score * 20;

  if (loading) return (
    <div className="flex justify-center py-24"><Spinner size={24} className="text-blue-700" /></div>
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-display font-black text-2xl mb-1">Daily Quiz</h1>
        <p className="font-mono text-xs text-slate-500">
          // {format(new Date(), 'EEEE, MMMM d')} · Test your knowledge daily
        </p>
      </div>

      {/* Stats header */}
      <div className="grid grid-cols-3 gap-4">
        <div className="arena-card p-4 text-center">
          <div className="font-display font-bold text-xl text-slate-900">{questions.length}</div>
          <div className="font-mono text-xs text-slate-500 mt-1">Questions</div>
        </div>
        <div className="arena-card p-4 text-center">
          <div className="font-display font-bold text-xl text-blue-700">+{questions.length * 20}</div>
          <div className="font-mono text-xs text-slate-500 mt-1">Max XP</div>
        </div>
        <div className="arena-card p-4 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Icons.Fire size={16} className="text-orange-400" />
            <div className="font-display font-bold text-xl text-orange-400">{history?.questStreak || 0}</div>
          </div>
          <div className="font-mono text-xs text-slate-500 mt-1">Streak</div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5">
        {questions.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
            answers[i] != null
              ? answers[i] === questions[i].answer ? 'bg-green-400' : 'bg-red-400'
              : i === currentQ ? 'bg-blue-600' : 'bg-slate-200'
          }`} />
        ))}
      </div>

      {/* Quiz or Results */}
      {quizDone ? (
        <QuizResults score={score} total={questions.length} xpEarned={xpEarned} onRetry={() => window.location.reload()} />
      ) : questions.length > 0 ? (
        <QuizQuestion
          question={questions[currentQ]}
          index={currentQ}
          total={questions.length}
          onAnswer={handleAnswer}
          answered={answers[currentQ] != null}
          selectedIdx={answers[currentQ]}
          timeLeft={timeLeft}
        />
      ) : (
        <div className="arena-card p-12 text-center">
          <Icons.Target size={28} className="text-slate-300 mx-auto mb-3" />
          <p className="font-mono text-sm text-slate-500">No quiz available today. Enroll in courses to unlock daily quizzes.</p>
        </div>
      )}

      {/* History */}
      {(history?.completions?.length > 0) && (
        <div className="arena-card overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Recent Activity</span>
            <span className="font-mono text-xs text-blue-700">+{history.totalXP || 0} total XP</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
            {history.completions.slice(0, 10).map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-5 py-2.5">
                <Icons.Target size={12} className="text-slate-400 flex-shrink-0" />
                <span className="font-mono text-xs text-slate-600 flex-1">{c.quest?.title || 'Quiz'}</span>
                <span className="font-mono text-xs text-slate-400">
                  {c.completedAt ? format(new Date(c.completedAt), 'MMM d') : ''}
                </span>
                <span className="font-mono text-xs text-blue-700">+{c.xpAwarded}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
