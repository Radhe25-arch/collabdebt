import { useState, useEffect, useRef } from 'react';
import { ProgressBar, BadgeTag, Spinner } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// ─── MASSIVE QUESTION BANK (100+ questions) ─────────────────
const QUESTION_BANK = [
  // ── JavaScript (20) ──
  { q: 'What does `typeof null` return in JavaScript?', opts: ['null', 'undefined', 'object', 'boolean'], answer: 2, cat: 'javascript' },
  { q: 'Which method converts JSON string to a JS object?', opts: ['JSON.stringify()', 'JSON.parse()', 'JSON.convert()', 'JSON.toObject()'], answer: 1, cat: 'javascript' },
  { q: 'What is the output of `[] + []`?', opts: ['[]', '0', '""', 'undefined'], answer: 2, cat: 'javascript' },
  { q: 'Which keyword declares a block-scoped variable?', opts: ['var', 'let', 'function', 'global'], answer: 1, cat: 'javascript' },
  { q: 'What does `===` check in JavaScript?', opts: ['Value only', 'Type only', 'Value and type', 'Reference'], answer: 2, cat: 'javascript' },
  { q: 'What is a closure in JavaScript?', opts: ['A function with access to its outer scope', 'A way to close a file', 'A loop construct', 'A class method'], answer: 0, cat: 'javascript' },
  { q: 'Which array method does NOT mutate the original?', opts: ['push', 'splice', 'map', 'sort'], answer: 2, cat: 'javascript' },
  { q: 'What does `NaN === NaN` return?', opts: ['true', 'false', 'undefined', 'Error'], answer: 1, cat: 'javascript' },
  { q: 'What is the event loop responsible for?', opts: ['Rendering HTML', 'Managing async callbacks', 'Compiling JS', 'Memory allocation'], answer: 1, cat: 'javascript' },
  { q: 'Which is NOT a primitive type in JS?', opts: ['string', 'boolean', 'object', 'symbol'], answer: 2, cat: 'javascript' },
  { q: 'What does `Array.isArray([])` return?', opts: ['false', 'true', 'undefined', 'null'], answer: 1, cat: 'javascript' },
  { q: 'What is hoisting in JavaScript?', opts: ['Moving declarations to the top', 'Hosting a website', 'A sorting algorithm', 'Error handling'], answer: 0, cat: 'javascript' },
  { q: 'What does `Promise.all()` do?', opts: ['Runs promises sequentially', 'Waits for all promises to resolve', 'Cancels all promises', 'Returns the first resolved'], answer: 1, cat: 'javascript' },
  { q: 'Which method removes the last element of an array?', opts: ['shift()', 'pop()', 'splice()', 'slice()'], answer: 1, cat: 'javascript' },
  { q: 'What is `this` in an arrow function?', opts: ['The calling object', 'The global object', 'Inherited from parent scope', 'undefined always'], answer: 2, cat: 'javascript' },
  { q: 'What does the spread operator `...` do?', opts: ['Loops through arrays', 'Expands iterable elements', 'Deletes properties', 'Creates a new scope'], answer: 1, cat: 'javascript' },
  { q: 'What is optional chaining `?.` used for?', opts: ['Async operations', 'Safe property access', 'Type checking', 'Error throwing'], answer: 1, cat: 'javascript' },
  { q: 'Which method finds the first matching element?', opts: ['filter()', 'find()', 'indexOf()', 'includes()'], answer: 1, cat: 'javascript' },
  { q: 'What does `Object.freeze()` do?', opts: ['Deletes an object', 'Prevents modification', 'Deep clones', 'Converts to string'], answer: 1, cat: 'javascript' },
  { q: 'What is destructuring in JavaScript?', opts: ['Breaking code into modules', 'Extracting values from objects/arrays', 'Deleting variables', 'Error handling'], answer: 1, cat: 'javascript' },

  // ── Python (20) ──
  { q: 'What is the output of `type([])` in Python?', opts: ['list', "<class 'list'>", 'array', 'tuple'], answer: 1, cat: 'python' },
  { q: 'Which keyword is used for anonymous functions?', opts: ['def', 'lambda', 'func', 'anon'], answer: 1, cat: 'python' },
  { q: 'What does `len("hello")` return?', opts: ['4', '5', '6', 'Error'], answer: 1, cat: 'python' },
  { q: 'Which data structure is immutable in Python?', opts: ['list', 'dict', 'set', 'tuple'], answer: 3, cat: 'python' },
  { q: 'How do you start a comment in Python?', opts: ['//', '#', '/*', '--'], answer: 1, cat: 'python' },
  { q: 'What does `range(5)` generate?', opts: ['1 to 5', '0 to 5', '0 to 4', '1 to 4'], answer: 2, cat: 'python' },
  { q: 'Which method adds an element to a list?', opts: ['add()', 'append()', 'push()', 'insert_end()'], answer: 1, cat: 'python' },
  { q: 'What is a decorator in Python?', opts: ['A design pattern', 'A function modifier', 'A class attribute', 'A loop type'], answer: 1, cat: 'python' },
  { q: 'What does `**kwargs` represent?', opts: ['Positional args', 'Keyword arguments dict', 'A special class', 'Error handling'], answer: 1, cat: 'python' },
  { q: 'What is a list comprehension?', opts: ['A way to sort lists', 'A concise way to create lists', 'A built-in function', 'A debugging tool'], answer: 1, cat: 'python' },
  { q: 'What does `pip` do in Python?', opts: ['Compiles code', 'Manages packages', 'Runs tests', 'Formats code'], answer: 1, cat: 'python' },
  { q: 'Which statement handles exceptions?', opts: ['if/else', 'try/except', 'for/while', 'def/return'], answer: 1, cat: 'python' },
  { q: 'What is `self` in Python classes?', opts: ['A global variable', 'Reference to current instance', 'A static method', 'A built-in function'], answer: 1, cat: 'python' },
  { q: 'How do you create a virtual environment?', opts: ['pip install venv', 'python -m venv', 'python --venv', 'create venv'], answer: 1, cat: 'python' },
  { q: 'What does `strip()` do to a string?', opts: ['Splits it', 'Removes whitespace from edges', 'Converts to uppercase', 'Reverses it'], answer: 1, cat: 'python' },
  { q: 'What is the `__init__` method?', opts: ['Destructor', 'Constructor', 'Static method', 'Class method'], answer: 1, cat: 'python' },
  { q: 'Which is faster for lookups: list or set?', opts: ['list', 'set', 'Same speed', 'Depends on size'], answer: 1, cat: 'python' },
  { q: 'What does `enumerate()` return?', opts: ['Only values', 'Only indices', 'Index-value pairs', 'A new list'], answer: 2, cat: 'python' },
  { q: 'What is a generator in Python?', opts: ['A class that creates objects', 'A function that yields values lazily', 'A type of loop', 'A sorting algorithm'], answer: 1, cat: 'python' },
  { q: 'What does `is` check vs `==`?', opts: ['Same value', 'Same identity (memory)', 'Same type', 'Same length'], answer: 1, cat: 'python' },

  // ── Data Structures & Algorithms (20) ──
  { q: 'What is the time complexity of binary search?', opts: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 1, cat: 'dsa' },
  { q: 'Which data structure uses FIFO?', opts: ['Stack', 'Queue', 'Tree', 'Graph'], answer: 1, cat: 'dsa' },
  { q: 'Which sorting algorithm has O(n log n) average?', opts: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort'], answer: 2, cat: 'dsa' },
  { q: 'What is the worst-case of quicksort?', opts: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 2, cat: 'dsa' },
  { q: 'Which data structure uses LIFO?', opts: ['Queue', 'Stack', 'Linked List', 'Hash Map'], answer: 1, cat: 'dsa' },
  { q: 'What is a hash collision?', opts: ['Two keys map to same index', 'A key is missing', 'Array overflow', 'Memory leak'], answer: 0, cat: 'dsa' },
  { q: 'What is BFS used for in graphs?', opts: ['Finding shortest path', 'Sorting nodes', 'Finding cycles only', 'Compressing data'], answer: 0, cat: 'dsa' },
  { q: 'What is Big O notation?', opts: ['Exact runtime', 'Upper bound of growth rate', 'Memory usage', 'Bug count'], answer: 1, cat: 'dsa' },
  { q: 'What is a balanced binary tree?', opts: ['All leaves at same level', 'Height diff of subtrees ≤ 1', 'Has equal nodes', 'A complete tree'], answer: 1, cat: 'dsa' },
  { q: 'What data structure does recursion use internally?', opts: ['Queue', 'Stack (call stack)', 'Hash Map', 'Linked List'], answer: 1, cat: 'dsa' },
  { q: 'What is dynamic programming?', opts: ['Using RAM only', 'Solving subproblems and caching results', 'A type of loop', 'Object-oriented design'], answer: 1, cat: 'dsa' },
  { q: 'Time complexity of inserting at head of linked list?', opts: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], answer: 1, cat: 'dsa' },
  { q: 'Which traversal gives sorted order in BST?', opts: ['Preorder', 'Inorder', 'Postorder', 'Level order'], answer: 1, cat: 'dsa' },
  { q: 'What is a heap used for?', opts: ['Sorting', 'Priority queue', 'Graph traversal', 'String matching'], answer: 1, cat: 'dsa' },
  { q: 'What is the space complexity of merge sort?', opts: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2, cat: 'dsa' },
  { q: 'What is memoization?', opts: ['Sorting technique', 'Caching computed results', 'Memory allocation', 'A data structure'], answer: 1, cat: 'dsa' },
  { q: 'Which algorithm finds shortest path in weighted graphs?', opts: ['BFS', 'DFS', "Dijkstra's", 'Bubble Sort'], answer: 2, cat: 'dsa' },
  { q: 'What is a trie used for?', opts: ['Number sorting', 'Prefix/string search', 'Graph traversal', 'Image processing'], answer: 1, cat: 'dsa' },
  { q: 'What is the amortized time for ArrayList add?', opts: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], answer: 1, cat: 'dsa' },
  { q: 'What is topological sort used for?', opts: ['Sorting numbers', 'Ordering dependencies (DAG)', 'Binary search', 'String matching'], answer: 1, cat: 'dsa' },

  // ── Web Development (15) ──
  { q: 'What does CSS stand for?', opts: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Syntax', 'Coded Style Systems'], answer: 1, cat: 'web' },
  { q: 'What does HTTP 404 mean?', opts: ['Server Error', 'Unauthorized', 'Not Found', 'Bad Request'], answer: 2, cat: 'web' },
  { q: 'What is REST?', opts: ['A programming language', 'An architectural style for APIs', 'A database', 'A framework'], answer: 1, cat: 'web' },
  { q: 'What does CORS stand for?', opts: ['Cross-Origin Resource Sharing', 'Central Origin Request System', 'Client Object Relay Service', 'Cross-Object Resource Standard'], answer: 0, cat: 'web' },
  { q: 'What is the DOM?', opts: ['A database', 'Document Object Model', 'A CSS property', 'A JS framework'], answer: 1, cat: 'web' },
  { q: 'What is localStorage used for?', opts: ['Server-side storage', 'Client-side persistent storage', 'Database queries', 'Cookie management'], answer: 1, cat: 'web' },
  { q: 'Which HTTP method is idempotent?', opts: ['POST', 'GET', 'PATCH', 'None of them'], answer: 1, cat: 'web' },
  { q: 'What does SSH stand for?', opts: ['Simple Shell Host', 'Secure Shell', 'System Socket Handler', 'Server Side HTTP'], answer: 1, cat: 'web' },
  { q: 'What is a CDN?', opts: ['Coded Data Network', 'Content Delivery Network', 'Central Domain Node', 'Client Data Node'], answer: 1, cat: 'web' },
  { q: 'What is JWT used for?', opts: ['Styling', 'Authentication tokens', 'Database queries', 'Image compression'], answer: 1, cat: 'web' },
  { q: 'What is a SPA?', opts: ['Server Page App', 'Single Page Application', 'Simple Protocol API', 'Secure Page Access'], answer: 1, cat: 'web' },
  { q: 'What does API stand for?', opts: ['Application Programming Interface', 'Applied Program Integration', 'Auto Program Interface', 'App Process Integration'], answer: 0, cat: 'web' },
  { q: 'What is WebSocket used for?', opts: ['Styling pages', 'Real-time bidirectional communication', 'Database access', 'Image loading'], answer: 1, cat: 'web' },
  { q: 'What is SSR?', opts: ['Simple Server Routing', 'Server-Side Rendering', 'Secure Socket Relay', 'Static Site Resource'], answer: 1, cat: 'web' },
  { q: 'What is a webhook?', opts: ['A JS hook', 'An HTTP callback to a URL', 'A CSS selector', 'A database trigger'], answer: 1, cat: 'web' },

  // ── SQL & Databases (10) ──
  { q: 'What does SQL stand for?', opts: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'System Query Language'], answer: 0, cat: 'sql' },
  { q: 'Which JOIN returns all rows from both tables?', opts: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN', 'RIGHT JOIN'], answer: 2, cat: 'sql' },
  { q: 'What is a primary key?', opts: ['Any column', 'Unique identifier for rows', 'A foreign reference', 'An index'], answer: 1, cat: 'sql' },
  { q: 'What does ACID stand for in databases?', opts: ['Atomicity Consistency Isolation Durability', 'All Concurrent Independent Data', 'Async Cached Indexed Data', 'Auto Commit Insert Delete'], answer: 0, cat: 'sql' },
  { q: 'What is normalization?', opts: ['Deleting duplicates', 'Organizing data to reduce redundancy', 'Encrypting data', 'Indexing tables'], answer: 1, cat: 'sql' },
  { q: 'What does GROUP BY do?', opts: ['Sorts rows', 'Groups rows for aggregate functions', 'Joins tables', 'Filters rows'], answer: 1, cat: 'sql' },
  { q: 'What is an index in a database?', opts: ['A primary key', 'A data structure for faster lookups', 'A table name', 'A foreign key'], answer: 1, cat: 'sql' },
  { q: 'What is a foreign key?', opts: ['A unique constraint', 'A reference to another table primary key', 'An auto-increment field', 'A table alias'], answer: 1, cat: 'sql' },
  { q: 'What does HAVING clause do?', opts: ['Filters before grouping', 'Filters after grouping', 'Sorts results', 'Joins tables'], answer: 1, cat: 'sql' },
  { q: 'What is a transaction in databases?', opts: ['A single query', 'A unit of work that is atomic', 'A table type', 'A connection pool'], answer: 1, cat: 'sql' },

  // ── General CS (15) ──
  { q: 'What is Git?', opts: ['A text editor', 'A version control system', 'A programming language', 'An OS'], answer: 1, cat: 'general' },
  { q: 'What is OOP?', opts: ['Object-Oriented Programming', 'Open Online Platform', 'Ordered Operation Process', 'Output Object Protocol'], answer: 0, cat: 'general' },
  { q: 'What is polymorphism?', opts: ['Multiple inheritance', 'Objects taking many forms', 'A type of loop', 'A design pattern'], answer: 1, cat: 'general' },
  { q: 'What is encapsulation?', opts: ['Hiding internal details', 'Inheriting methods', 'Creating objects', 'Sorting data'], answer: 0, cat: 'general' },
  { q: 'What is a race condition?', opts: ['A fast algorithm', 'Unpredictable behavior from concurrent access', 'A sorting error', 'A memory leak'], answer: 1, cat: 'general' },
  { q: 'What does DRY stand for?', opts: ['Do Repeat Yourself', "Don't Repeat Yourself", 'Data Rendering Yield', 'Dynamic Runtime Yield'], answer: 1, cat: 'general' },
  { q: 'What is CI/CD?', opts: ['Code Integration/Code Delivery', 'Continuous Integration/Continuous Deployment', 'Central Infrastructure/Core Design', 'Compiled Interface/Custom Debug'], answer: 1, cat: 'general' },
  { q: 'What is a deadlock?', opts: ['A crashed program', 'Two processes waiting for each other forever', 'A memory overflow', 'A syntax error'], answer: 1, cat: 'general' },
  { q: 'What is the SOLID principle S?', opts: ['Single Responsibility', 'Simple Design', 'Sorted Logic', 'System Security'], answer: 0, cat: 'general' },
  { q: 'What is a microservice?', opts: ['A small function', 'An independently deployable service', 'A lightweight library', 'A debugging tool'], answer: 1, cat: 'general' },
  { q: 'What is TCP vs UDP?', opts: ['Both unreliable', 'TCP is reliable, UDP is faster', 'UDP is reliable, TCP is faster', 'They are identical'], answer: 1, cat: 'general' },
  { q: 'What is Docker?', opts: ['A programming language', 'A containerization platform', 'A database', 'A web server'], answer: 1, cat: 'general' },
  { q: 'What is agile development?', opts: ['Writing code fast', 'Iterative development with feedback loops', 'A programming language', 'A testing framework'], answer: 1, cat: 'general' },
  { q: 'What is abstraction in programming?', opts: ['Making code longer', 'Hiding complexity behind simple interfaces', 'Debugging code', 'A sorting technique'], answer: 1, cat: 'general' },
  { q: 'What is a design pattern?', opts: ['A CSS layout', 'A reusable solution to common problems', 'A testing method', 'A database schema'], answer: 1, cat: 'general' },

  // ── React (10) ──
  { q: 'What is the virtual DOM in React?', opts: ['A real DOM copy', 'A lightweight JS representation of the DOM', 'A CSS framework', 'A server component'], answer: 1, cat: 'react' },
  { q: 'What does `useState` return?', opts: ['A value', 'A function', 'A [value, setter] pair', 'An object'], answer: 2, cat: 'react' },
  { q: 'What is `useEffect` used for?', opts: ['State management', 'Side effects in components', 'Styling', 'Routing'], answer: 1, cat: 'react' },
  { q: 'What is a React key prop for?', opts: ['Styling', 'Helping React identify list items', 'Authentication', 'Routing'], answer: 1, cat: 'react' },
  { q: 'What is JSX?', opts: ['A new language', 'JavaScript XML syntax extension', 'A CSS preprocessor', 'A testing tool'], answer: 1, cat: 'react' },
  { q: 'What is props drilling?', opts: ['A testing method', 'Passing props through many layers', 'A build tool', 'Server rendering'], answer: 1, cat: 'react' },
  { q: 'What is `useRef` used for?', opts: ['State updates', 'Persisting values without re-render', 'Routing', 'API calls'], answer: 1, cat: 'react' },
  { q: 'What is React.memo for?', opts: ['State management', 'Memoizing to prevent unnecessary re-renders', 'Routing', 'Error handling'], answer: 1, cat: 'react' },
  { q: 'What is context in React?', opts: ['A CSS feature', 'A way to share data without props drilling', 'A testing util', 'A build tool'], answer: 1, cat: 'react' },
  { q: 'What triggers a React re-render?', opts: ['CSS change', 'State or props change', 'Console.log', 'Variable declaration'], answer: 1, cat: 'react' },
];

// ─── DATE-SEEDED RANDOM (same questions all day, changes at midnight) ──
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getTodaySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function getUsedQuestionIds() {
  try {
    return JSON.parse(localStorage.getItem('quiz-used-ids') || '[]');
  } catch { return []; }
}

function saveUsedQuestionIds(ids) {
  try {
    // Keep only last 200 to avoid infinite growth
    localStorage.setItem('quiz-used-ids', JSON.stringify(ids.slice(-200)));
  } catch {}
}

function getLastQuizDate() {
  try { return localStorage.getItem('quiz-last-date') || ''; } catch { return ''; }
}

function setLastQuizDate(date) {
  try { localStorage.setItem('quiz-last-date', date); } catch {}
}

function generateDailyQuiz(enrolledCourses) {
  const todaySeed = getTodaySeed();
  const todayStr = new Date().toISOString().slice(0, 10);
  const usedIds = getUsedQuestionIds();

  // Map enrolled course slugs to question categories
  const enrolledCats = new Set();
  (enrolledCourses || []).forEach(c => {
    const slug = (c.slug || c.category?.slug || '').toLowerCase();
    if (slug.includes('javascript') || slug.includes('js')) enrolledCats.add('javascript');
    if (slug.includes('python')) enrolledCats.add('python');
    if (slug.includes('react')) enrolledCats.add('react');
    if (slug.includes('sql') || slug.includes('database')) enrolledCats.add('sql');
    if (slug.includes('web') || slug.includes('html') || slug.includes('css')) enrolledCats.add('web');
    if (slug.includes('dsa') || slug.includes('data-structure') || slug.includes('algorithm')) enrolledCats.add('dsa');
  });

  // If no specific categories, use all
  const cats = enrolledCats.size > 0 ? enrolledCats : new Set(['javascript', 'python', 'dsa', 'web', 'general', 'sql', 'react']);

  // Filter to relevant categories and exclude recently used
  let available = QUESTION_BANK
    .map((q, i) => ({ ...q, _idx: i }))
    .filter(q => cats.has(q.cat))
    .filter(q => !usedIds.includes(q._idx));

  // If too few available (all used), reset used IDs for these categories
  if (available.length < 5) {
    const catUsed = usedIds.filter(id => cats.has(QUESTION_BANK[id]?.cat));
    const newUsed = usedIds.filter(id => !cats.has(QUESTION_BANK[id]?.cat));
    saveUsedQuestionIds(newUsed);
    available = QUESTION_BANK
      .map((q, i) => ({ ...q, _idx: i }))
      .filter(q => cats.has(q.cat));
  }

  // Seed-based shuffle so same questions for entire day
  const shuffled = [...available].sort((a, b) => {
    const ra = seededRandom(todaySeed + a._idx);
    const rb = seededRandom(todaySeed + b._idx);
    return ra - rb;
  });

  // Pick questions based on enrollment count
  let count = 5;
  if (enrolledCourses && enrolledCourses.length > 1) {
    count = Math.min(enrolledCourses.length * 2, 10);
  }

  const picked = shuffled.slice(0, count);
  return picked.map((q, i) => ({
    id: i,
    _bankIdx: q._idx,
    q: q.q,
    opts: q.opts,
    answer: q.answer,
    course: q.cat.charAt(0).toUpperCase() + q.cat.slice(1),
  }));
}

// ─── QUIZ QUESTION COMPONENT ────────────────────────────────
function QuizQuestion({ question, index, total, onAnswer, answered, selectedIdx, timeLeft }) {
  const isCorrect = answered && selectedIdx === question.answer;

  return (
    <div className="sf-card p-6 space-y-5">
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

      <h3 className="font-display font-bold text-base text-slate-900 leading-relaxed">{question.q}</h3>

      <div className="space-y-2">
        {question.opts.map((opt, i) => {
          let style = 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50';
          if (answered) {
            if (i === question.answer) style = 'border-green-400 bg-green-50 text-green-700';
            else if (i === selectedIdx && i !== question.answer) style = 'border-red-400 bg-red-50 text-red-600';
            else style = 'border-slate-200 bg-slate-50 text-slate-400';
          }
          return (
            <button key={i} onClick={() => !answered && onAnswer(i)} disabled={answered}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${style}`}>
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

      {answered && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {isCorrect
            ? <><Icons.Check size={14} className="text-green-600" /><span className="font-mono text-xs text-green-700 font-bold">Correct! +20 XP earned</span></>
            : <><Icons.X size={14} className="text-red-500" /><span className="font-mono text-xs text-red-600 font-bold">Wrong! Correct: {String.fromCharCode(65 + question.answer)}</span></>
          }
        </div>
      )}
    </div>
  );
}

// ─── RESULTS SCREEN ─────────────────────────────────────────
function QuizResults({ score, total, xpEarned, alreadyDone }) {
  const pct = Math.round((score / total) * 100);
  const grade = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good job!' : pct >= 40 ? 'Keep practicing!' : 'Try again!';
  const gradeColor = pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-blue-600' : pct >= 40 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="sf-card p-8 max-w-md mx-auto text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-600/15 border border-blue-600/20 flex items-center justify-center mx-auto">
        <Icons.Target size={28} className="text-blue-600" />
      </div>
      <div>
        <h2 className={`font-display font-black text-2xl ${gradeColor}`}>{grade}</h2>
        <p className="font-mono text-xs text-slate-500 mt-1">Daily Quiz Complete</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="sf-card p-3">
          <div className="font-display font-bold text-xl text-slate-900">{score}/{total}</div>
          <div className="font-mono text-xs text-slate-500">Correct</div>
        </div>
        <div className="sf-card p-3">
          <div className="font-display font-bold text-xl text-blue-700">{pct}%</div>
          <div className="font-mono text-xs text-slate-500">Accuracy</div>
        </div>
        <div className="sf-card p-3">
          <div className="font-display font-bold text-xl text-green-600">+{xpEarned}</div>
          <div className="font-mono text-xs text-slate-500">XP Earned</div>
        </div>
      </div>
      {alreadyDone ? (
        <p className="font-mono text-xs text-slate-500">You've already completed today's quiz. Come back tomorrow for new questions!</p>
      ) : (
        <p className="font-mono text-xs text-slate-500">Come back tomorrow for new questions!</p>
      )}
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
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [history, setHistory]         = useState(null);
  const [score, setScore]             = useState(0);
  const [totalXPEarned, setTotalXP]   = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const todayStr = new Date().toISOString().slice(0, 10);
        const lastDate = getLastQuizDate();

        // Check if already completed today
        if (lastDate === todayStr) {
          // Show results from today
          try {
            const savedScore = parseInt(localStorage.getItem('quiz-today-score') || '0');
            const savedTotal = parseInt(localStorage.getItem('quiz-today-total') || '5');
            setScore(savedScore);
            setTotalXP(savedScore * 20);
            setQuizDone(true);
            setAlreadyDone(true);
            setQuestions(Array(savedTotal).fill(null)); // placeholder for count
          } catch {}
        }

        // Fetch enrolled courses
        let courses = [];
        try {
          const r = await api.get('/courses/my-enrollments');
          courses = (r.data.enrollments || []).map(e => e.course).filter(Boolean);
        } catch {}

        if (!alreadyDone) {
          const qs = generateDailyQuiz(courses);
          setQuestions(qs);
        }

        // Fetch history
        try {
          const h = await api.get('/quests/history');
          setHistory(h.data);
        } catch {}
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  // Timer per question
  useEffect(() => {
    if (quizDone || alreadyDone || questions.length === 0) return;
    if (answers[currentQ] != null) return;

    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(-1); // timeout = wrong
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentQ, quizDone, alreadyDone, questions.length]);

  const handleAnswer = (optIdx) => {
    clearInterval(timerRef.current);
    const question = questions[currentQ];
    const isCorrect = optIdx === question.answer;

    setAnswers(a => ({ ...a, [currentQ]: optIdx }));

    // Award XP immediately per correct answer
    if (isCorrect) {
      setScore(s => s + 1);
      setTotalXP(x => x + 20);
      toast.success('+20 XP!', { duration: 1500, icon: '⚡' });
      // Report to server immediately
      api.post('/quests/progress', { type: 'QUIZ_PASS', increment: 1 }).catch(() => {});
    }

    // Auto-advance after 1.5s
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(c => c + 1);
      } else {
        // Quiz complete!
        setQuizDone(true);
        const todayStr = new Date().toISOString().slice(0, 10);
        setLastQuizDate(todayStr);

        // Save used question IDs so they don't repeat
        const usedIds = getUsedQuestionIds();
        const newUsed = [...usedIds, ...questions.map(q => q._bankIdx).filter(Boolean)];
        saveUsedQuestionIds(newUsed);

        // Save today's score
        const finalScore = isCorrect ? score + 1 : score;
        try {
          localStorage.setItem('quiz-today-score', String(finalScore));
          localStorage.setItem('quiz-today-total', String(questions.length));
        } catch {}
      }
    }, 1500);
  };

  if (loading) return (
    <div className="flex justify-center py-24"><Spinner size={24} className="text-blue-700" /></div>
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-display font-black text-2xl mb-1">Daily Quiz</h1>
        <p className="font-mono text-xs text-slate-500">
          // {format(new Date(), 'EEEE, MMMM d')} · New questions every day · Never repeats
        </p>
      </div>

      {/* Stats header */}
      <div className="grid grid-cols-3 gap-4">
        <div className="sf-card p-4 text-center">
          <div className="font-display font-bold text-xl text-slate-900">{questions.length}</div>
          <div className="font-mono text-xs text-slate-500 mt-1">Questions</div>
        </div>
        <div className="sf-card p-4 text-center">
          <div className="font-display font-bold text-xl text-blue-700">20 XP</div>
          <div className="font-mono text-xs text-slate-500 mt-1">Per Correct</div>
        </div>
        <div className="sf-card p-4 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Icons.Fire size={16} className="text-orange-400" />
            <div className="font-display font-bold text-xl text-orange-400">{history?.questStreak || 0}</div>
          </div>
          <div className="font-mono text-xs text-slate-500 mt-1">Streak</div>
        </div>
      </div>

      {/* Progress dots */}
      {!alreadyDone && questions.length > 0 && (
        <div className="flex items-center gap-1.5">
          {questions.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
              answers[i] != null
                ? answers[i] === questions[i]?.answer ? 'bg-green-400' : 'bg-red-400'
                : i === currentQ ? 'bg-blue-600' : 'bg-slate-200'
            }`} />
          ))}
        </div>
      )}

      {/* Quiz or Results */}
      {quizDone || alreadyDone ? (
        <QuizResults
          score={score}
          total={questions.length}
          xpEarned={totalXPEarned}
          alreadyDone={alreadyDone}
        />
      ) : questions.length > 0 && questions[currentQ] ? (
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
        <div className="sf-card p-12 text-center">
          <Icons.Target size={28} className="text-slate-300 mx-auto mb-3" />
          <p className="font-mono text-sm text-slate-500">No quiz available today. Enroll in courses to unlock daily quizzes.</p>
        </div>
      )}

      {/* History */}
      {(history?.completions?.length > 0) && (
        <div className="sf-card overflow-hidden">
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
