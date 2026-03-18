const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');

// AI Mentor — server-side proxy for code mentorship
// In production, replace with actual LLM API call (OpenAI, Claude, etc.)

const SYSTEM_PROMPT = `You are CodeArena's AI Mentor — a senior software engineer and expert coding teacher.

Your job is to help developers learn programming through:
- Explaining concepts clearly with examples
- Reviewing and improving code with specific, actionable feedback  
- Debugging help with step-by-step reasoning
- Interview prep with realistic problem walkthroughs
- Recommending what to learn next based on context

Rules:
- Always use code blocks with syntax highlighting
- Be concise but thorough — no fluff
- Give specific line references when reviewing code
- Never just give the answer to practice problems — guide the thinking
- Speak like a senior engineer, not a textbook
- If asked about something off-topic, redirect to coding/CS topics`;

async function getSession(req, res, next) {
  try {
    const sessions = await prisma.mentorSession.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      select: { id: true, topic: true, updatedAt: true, messages: true },
    });
    res.json({ sessions });
  } catch (err) { next(err); }
}

async function createSession(req, res, next) {
  try {
    const { topic } = req.body;
    const session = await prisma.mentorSession.create({
      data: {
        userId: req.user.id,
        topic: topic || 'General',
        messages: [],
      },
    });
    res.status(201).json({ session });
  } catch (err) { next(err); }
}

async function sendMessage(req, res, next) {
  try {
    const { sessionId, message, code } = req.body;
    if (!message?.trim()) throw new AppError('Message required', 400);

    // Load session
    const session = await prisma.mentorSession.findUnique({
      where: { id: sessionId },
    });
    if (!session || session.userId !== req.user.id) {
      throw new AppError('Session not found', 404);
    }

    const messages = Array.isArray(session.messages) ? session.messages : [];

    // Build user message
    const userContent = code
      ? `${message}\n\n\`\`\`\n${code}\n\`\`\``
      : message;

    const newMessages = [
      ...messages,
      { role: 'user', content: userContent, timestamp: new Date().toISOString() },
    ];

    // In production: call your LLM API here
    // For now, generate a smart contextual response
    const aiResponse = generateMentorResponse(message, code, messages);

    newMessages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
    });

    // Update session
    await prisma.mentorSession.update({
      where: { id: sessionId },
      data: {
        messages: newMessages,
        topic: session.topic || extractTopic(message),
      },
    });

    res.json({
      response: aiResponse,
      sessionId,
    });
  } catch (err) { next(err); }
}

async function deleteSession(req, res, next) {
  try {
    await prisma.mentorSession.deleteMany({
      where: { id: req.params.id, userId: req.user.id },
    });
    res.json({ message: 'Session deleted' });
  } catch (err) { next(err); }
}

// ─── SMART RESPONSE GENERATOR ─────────────────────────────
// Replace with actual LLM API call in production

function generateMentorResponse(message, code, history) {
  const msg = message.toLowerCase();

  if (code) {
    return reviewCode(code, message);
  }

  if (msg.includes('big o') || msg.includes('complexity') || msg.includes('time complexity')) {
    return `**Time Complexity Analysis**

Big O notation describes the upper bound of how an algorithm's runtime scales with input size \`n\`.

The most common complexities from fastest to slowest:

\`\`\`
O(1)       → Constant    — array[index], hashmap lookup
O(log n)   → Logarithmic — binary search
O(n)       → Linear      — single loop
O(n log n) → Quasilinear — merge sort, heapsort
O(n²)      → Quadratic   — nested loops
O(2ⁿ)      → Exponential — recursive fibonacci
\`\`\`

**Key rules:**
1. Drop constants: \`O(3n)\` → \`O(n)\`
2. Drop lower-order terms: \`O(n² + n)\` → \`O(n²)\`
3. Different inputs = different variables: two arrays of sizes \`a\` and \`b\` → \`O(a + b)\`

What specific algorithm or code do you want me to analyze?`;
  }

  if (msg.includes('closure') || msg.includes('closures')) {
    return `**Closures in JavaScript**

A closure is a function that "remembers" variables from its outer scope even after that scope has finished executing.

\`\`\`javascript
function makeCounter(start = 0) {
  let count = start; // this variable is "closed over"

  return {
    increment: () => ++count,
    decrement: () => --count,
    value:     () => count,
  };
}

const counter = makeCounter(10);
counter.increment(); // 11
counter.increment(); // 12
counter.value();     // 12

// 'count' is inaccessible from outside — true encapsulation
\`\`\`

**Why closures matter:**
- Data privacy (no \`class\` needed)
- Factory functions
- Memoization
- Event handlers that "remember" context

\`\`\`javascript
// Common pitfall — loop variable capture
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // prints 3,3,3 ← bug!
}

// Fix with let (block scope) or IIFE
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // prints 0,1,2 ✓
}
\`\`\`

Want me to walk through a more complex closure example or explain the scope chain in detail?`;
  }

  if (msg.includes('promise') || msg.includes('async') || msg.includes('await')) {
    return `**Async/Await & Promises**

Promises represent eventual values. Async/await is syntactic sugar that makes promise code look synchronous.

\`\`\`javascript
// Promise chain (old style)
fetchUser(id)
  .then(user => fetchPosts(user.id))
  .then(posts => render(posts))
  .catch(err => console.error(err));

// Async/await (modern, much cleaner)
async function loadUserPosts(id) {
  try {
    const user  = await fetchUser(id);
    const posts = await fetchPosts(user.id);
    render(posts);
  } catch (err) {
    console.error('Failed:', err.message);
  }
}
\`\`\`

**Parallel vs Sequential**

\`\`\`javascript
// Sequential — each waits for the previous (slow)
const a = await fetch('/api/a');
const b = await fetch('/api/b');

// Parallel — both fire at once (fast)
const [a, b] = await Promise.all([
  fetch('/api/a'),
  fetch('/api/b'),
]);
\`\`\`

**Error handling patterns:**

\`\`\`javascript
// Pattern 1: try/catch
async function safe() {
  try { return await riskyOp(); }
  catch (e) { return null; }
}

// Pattern 2: .catch() fallback
const result = await riskyOp().catch(() => null);
\`\`\`

What specific async pattern are you working with?`;
  }

  if (msg.includes('array') && (msg.includes('method') || msg.includes('map') || msg.includes('filter') || msg.includes('reduce'))) {
    return `**Essential Array Methods**

\`\`\`javascript
const nums = [1, 2, 3, 4, 5];

// .map() — transform each element, returns NEW array
const doubled = nums.map(n => n * 2);
// [2, 4, 6, 8, 10]

// .filter() — keep elements matching condition
const evens = nums.filter(n => n % 2 === 0);
// [2, 4]

// .reduce() — fold array into single value
const sum = nums.reduce((acc, n) => acc + n, 0);
// 15

// .find() — first match or undefined
const firstBig = nums.find(n => n > 3);
// 4

// .some() / .every() — boolean checks
nums.some(n => n > 4);   // true (5 > 4)
nums.every(n => n > 0);  // true (all positive)

// .flat() / .flatMap() — handle nested arrays
[[1,2],[3,4]].flat();              // [1, 2, 3, 4]
nums.flatMap(n => [n, n * 2]);     // [1,2, 2,4, 3,6, 4,8, 5,10]

// Chaining — the real power
const result = nums
  .filter(n => n % 2 !== 0)   // [1, 3, 5]
  .map(n => n ** 2)             // [1, 9, 25]
  .reduce((a, n) => a + n, 0);  // 35
\`\`\`

Which method do you want to practice?`;
  }

  if (msg.includes('recursion') || msg.includes('recursive')) {
    return `**Recursion — Think in Base Cases**

Every recursive function needs two things:
1. **Base case** — when to stop
2. **Recursive case** — call itself with smaller input

\`\`\`javascript
// Classic: factorial
function factorial(n) {
  if (n <= 1) return 1;       // base case
  return n * factorial(n - 1); // recursive case
}

// factorial(4) = 4 * factorial(3)
//              = 4 * 3 * factorial(2)
//              = 4 * 3 * 2 * factorial(1)
//              = 4 * 3 * 2 * 1 = 24

// Tree traversal — where recursion shines
function sumTree(node) {
  if (!node) return 0;                          // base case
  return node.val + sumTree(node.left) + sumTree(node.right);
}
\`\`\`

**Watch out for stack overflow:**

\`\`\`javascript
// Bad — no base case
function infinite(n) { return infinite(n + 1); } // 💥

// Fix with memoization for expensive recursion
const memo = {};
function fib(n) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  return memo[n] = fib(n-1) + fib(n-2);
}
\`\`\`

Want me to walk through a specific recursive problem?`;
  }

  if (msg.includes('debug') || msg.includes('error') || msg.includes('not working') || msg.includes("doesn't work")) {
    return `**Debugging Methodology**

Follow this systematic approach:

**1. Read the error message carefully**
\`\`\`
TypeError: Cannot read properties of undefined (reading 'map')
         ↑ The VALUE is undefined, not the key 'map'
\`\`\`
This means the variable before \`.map()\` is \`undefined\` — check where it's set.

**2. Isolate with console.log**
\`\`\`javascript
function process(data) {
  console.log('INPUT:', data);          // ← check what's coming in
  const result = transform(data);
  console.log('AFTER TRANSFORM:', result); // ← check intermediate state
  return result;
}
\`\`\`

**3. Use the browser debugger**
\`\`\`javascript
debugger; // Pause execution here, inspect all variables
\`\`\`

**4. Binary search your code**
Comment out half the logic. If error disappears, the bug is in the removed half. Keep halving until you find it.

**5. Rubber duck debugging**
Explain your code out loud line-by-line. You'll often spot the issue yourself.

Paste your code and error message and I'll help debug it specifically.`;
  }

  // Default helpful response
  return `I'm here to help you level up as a developer. I can assist with:

- **Code review** — paste your code and I'll give specific feedback
- **Concept explanations** — closures, promises, Big O, recursion, OOP, etc.
- **Debugging** — share your error and code
- **DSA problems** — walkthroughs for arrays, trees, graphs, DP
- **System design** — architecture patterns, databases, APIs
- **Interview prep** — common questions with optimal solutions

What are you working on? The more specific your question, the better I can help.

Try: _"Explain how the event loop works"_ or _"Review this function: [paste code]"_`;
}

function reviewCode(code, message) {
  const lines = code.split('\n').length;
  const hasConsoleLog = code.includes('console.log');
  const hasVarKeyword = /\bvar\b/.test(code);
  const hasMagicNumbers = /[^a-zA-Z]([2-9]|[1-9]\d+)[^a-zA-Z\d]/.test(code);
  const hasTryCatch = code.includes('try') && code.includes('catch');
  const hasComments = code.includes('//') || code.includes('/*');

  const issues = [];
  const good = [];

  if (hasVarKeyword) issues.push('Replace `var` with `const` or `let` — `var` has function scope which causes subtle bugs');
  if (hasConsoleLog && lines > 10) issues.push('Remove `console.log` statements before committing to production');
  if (hasMagicNumbers) issues.push('Extract magic numbers into named constants: `const MAX_RETRIES = 3` instead of bare `3`');
  if (!hasTryCatch && (code.includes('fetch') || code.includes('await'))) {
    issues.push('Wrap async operations in try/catch — unhandled rejections crash your app');
  }
  if (!hasComments && lines > 15) issues.push('Add comments for non-obvious logic — your future self will thank you');

  if (!hasVarKeyword && code.includes('const') || code.includes('let')) good.push('Good use of `const`/`let` for variable declarations');
  if (hasTryCatch) good.push('Good error handling with try/catch');
  if (hasComments) good.push('Good code documentation with comments');

  let response = `**Code Review (${lines} lines)**\n\n`;

  if (good.length) {
    response += `**What's good:**\n${good.map(g => `- ${g}`).join('\n')}\n\n`;
  }

  if (issues.length) {
    response += `**Issues to fix:**\n${issues.map(i => `- ${i}`).join('\n')}\n\n`;
  } else {
    response += `**No major issues found.** The code looks clean.\n\n`;
  }

  response += `**General tips for this code:**\n`;
  response += `- Consider edge cases: what happens with empty input, null, or unexpected types?\n`;
  response += `- Think about time complexity — can any loops be simplified?\n`;
  response += `- Write a unit test for the main logic path\n\n`;
  response += `Want me to suggest a refactored version or explain any specific part?`;

  return response;
}

function extractTopic(message) {
  const keywords = ['javascript', 'python', 'react', 'node', 'css', 'html', 'sql', 'dsa', 'algorithm', 'recursion', 'async', 'promise', 'closure', 'array', 'object'];
  for (const kw of keywords) {
    if (message.toLowerCase().includes(kw)) return kw.charAt(0).toUpperCase() + kw.slice(1);
  }
  return 'General';
}

module.exports = { getSession, createSession, sendMessage, deleteSession };
