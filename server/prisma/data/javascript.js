const javascriptMastery = {
  course: {
    title: 'JavaScript: Zero to Expert Architect',
    slug: 'javascript-mastery',
    description: 'Master JavaScript from its foundations to advanced enterprise architecture. This track covers the Event Loop, Async patterns, Prototypes, and modern ES6+ capabilities deeply.',
    categorySlug: 'javascript',
    difficulty: 'ADVANCED',
    xpReward: 1500,
    duration: 600,
    order: 1
  },
  lessons: [
    {
      title: 'Execution Context & The Call Stack',
      content: `## 🌐 The Underlying Mechanics

Before typing a simple variable, an expert must understand *where* code runs. The **V8 Engine** (or Spidermonkey) works using an **Execution Context** and a **Call Stack**.

Every time you execute a JS file, a **Global Execution Context (GEC)** is created. Whenever you invoke a function, a brand new **Function Execution Context (FEC)** is pushed onto the Call Stack.

### Two Phases of Execution

1. **Memory Creation Phase (Hoisting):** JS allocates memory for variables and functions *before* executing a single line of code. Variables declared with \`var\` are initialized to \`undefined\`, while \`let\` and \`const\` enter the Temporal Dead Zone (TDZ).
2. **Execution Phase:** JS executes the code line-by-line, assigning values and invoking functions.

### Interactive Practice
Run the code snippet in your environment. Watch what happens when you attempt to access variables before initialization. Replace \`let\` with \`var\` and re-run it—observe the \`undefined\` behavior instead of the reference error!

> [!TIP]
> **Pro Tip:** Never use \`var\` in modern code to avoid unexpected hoisting behaviors. Stick exclusively to \`const\` (by default) and \`let\` (when reassignment is guaranteed).`,
      codeStarter: `/* 
  Uncomment the console.log below to see the Temporal Dead Zone (TDZ) in action.
  Then, change 'let' to 'var' and watch the error disappear (replaced by 'undefined').
*/

// console.log(expertName); 

let expertName = "Senior Developer";
console.log("Memory Phase complete. Value:", expertName);

function stackTraceTrace() {
  console.log("Function pushed to stack!");
}

stackTraceTrace();`,
      quiz: {
        questions: [
          {
            question: "What happens when you access a `let` variable before its declaration?",
            options: ["It returns undefined", "It throws a ReferenceError (Temporal Dead Zone)", "It is hoisted safely", "It throws a TypeError"],
            correctIndex: 1,
            explanation: "`let` and `const` variables are hoisted but reside in the Temporal Dead Zone until initialized, causing a ReferenceError if accessed early."
          },
          {
            question: "Which phase allocates memory for variables before code execution?",
            options: ["The Execution Phase", "The Garbage Collection Phase", "The Memory Creation Phase", "The Call Stack Phase"],
            correctIndex: 2,
            explanation: "In the memory creation phase, JS parses the AST and allocates memory spaces for all declarations (hoisting)."
          }
        ]
      }
    },
    {
      title: 'Closures & Scope Chains',
      content: `## 🔗 The Secret Weapon: Closures

A **closure** is simply a function that remembers its outer variables, even after the outer function has finished executing and was popped off the call stack!

In JavaScript, functions are first-class citizens. When a function is created, it retains a hidden link (\`[[Environment]]\`) to the variables of its parent scope. This allows for powerful patterns like **data privacy**, **currying**, and **memoization**.

### Data Privacy Example
Instead of exposing private data on an object, we use closures.

\`\`\`javascript
function createBank(initial) {
  let balance = initial; // Private variable!
  
  return {
    deposit: (amount) => balance += amount,
    getBalance: () => balance
  };
}
\`\`\`

Nobody can directly access \`balance\`. They must use the explicit methods returned! This is exactly how expert engineers build secure modules.

### Interactive Practice
Implement a counter using closures in the interactive editor that tracks clicks securely without polluting the global namespace!`,
      codeStarter: `// Implement a secure counter function

function createSecureCounter() {
  // 1. Declare a private counter variable here
  let count = 0;
  
  // 2. Return an object with two methods: increment() and get()
  return {
    increment: () => {
      count++;
      return count;
    },
    get: () => count
  };
}

const myCounter = createSecureCounter();
console.log(myCounter.increment()); // Expected: 1
console.log(myCounter.increment()); // Expected: 2
console.log(myCounter.get()); // Expected: 2

// Try to access count directly—it's impossible!
console.log(myCounter.count); // undefined`,
      quiz: {
        questions: [
          {
            question: "What is a major architectural benefit of closures in JS?",
            options: ["Speeding up Loops", "Emulating Data Privacy using private variables", "Avoiding the Call Stack completely", "Garbage collection evasion"],
            correctIndex: 1,
            explanation: "Closures allow us to keep variables private from the global scope, essentially encapsulating state."
          }
        ]
      }
    },
    {
      title: 'The Event Loop & Asynchronous JS',
      content: `## 🔄 Single-Threaded, Yet Concurrent

JavaScript runs on a **Single Thread**. It can only execute one thing at a time. But how do we fetch data from networks without freezing the entire application? 

Enter the **Event Loop**, **Web APIs**, the **Macrotask Queue**, and the **Microtask Queue**.

### The Flow of Async Activity
1. Code enters the **Call Stack**.
2. If it's standard JS (e.g. \`console.log\`), it executes immediately.
3. If it's async (e.g. \`setTimeout\`, \`fetch\`), JS offloads it to the **Browser Web APIs**.
4. When the API finishes, the callback goes to a Queue:
   - **Promises / Async Await** go to the **Microtask Queue**.
   - **setTimeout / DOM Events** go to the **Macrotask Queue**.
5. The **Event Loop** constantly checks: *Is the Call Stack empty?* If yes, it moves tasks from the Microtask Queue first, then the Macrotask Queue into the stack.

> [!IMPORTANT]
> **Rule of Thumb:** Microtasks (Promises) **ALWAYS** have higher priority than Macrotasks (\`setTimeout\`). If a Promise resolves, it jumps the line!

### Interactive Practice
Observe the order of execution in the console below. It is the absolute classic interview question designed to test your mastery of Event Loop priority!`,
      codeStarter: `console.log("1. Start script");

setTimeout(() => {
  console.log("4. Macrotask executed (setTimeout)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask executed (Promise)");
});

console.log("2. End script");

/* 
  Before running, predict the order of logs! 
  Will '3' run before '4' even though setTimeout is 0ms? 
  Run it to find out!
*/`,
      quiz: {
        questions: [
          {
            question: "Which queue has strict priority in the Event Loop?",
            options: ["The Macrotask Queue (setTimeout)", "The Call Stack Queue", "The Microtask Queue (Promises)", "The Render Queue"],
            correctIndex: 2,
            explanation: "The Event Loop will always drain the Microtask queue completely before looking at the Macrotask queue."
          },
          {
            question: "What happens if you trigger an infinite loop of Microtasks?",
            options: ["The browser crashes / UI freezes", "It automatically offloads to a Web Worker", "It throws a Stack Overflow", "The Event Loop balances it fairly with Macrotasks"],
            correctIndex: 0,
            explanation: "Since the Event Loop MUST finish all Microtasks before returning to the UI render phase or Macrotasks, an infinite loop of Promises will hang the browser entirely!"
          }
        ]
      }
    },
    {
      title: 'Prototypes & Object-Oriented JS',
      content: `## 🧬 Prototypal Inheritance

Forget Classes for a moment. Under the hood, JavaScript does not have traditional classes like Java or C++. It uses **Prototypes**.

Every object in JavaScript has an internal property called \`[[Prototype]]\` (often accessible via \`__proto__\`). When you try to access a property on an object, JS checks the object first. If it can't find it, it follows the \`__proto__\` chain up to the parent!

### The ES6 Class Sugar
When you write \`class Car {}\`, you are simply writing syntactic sugar. 

\`\`\`javascript
class User {
  constructor(name) {
    this.name = name; // Attached directly to the instance
  }
  
  login() {
    // Attached to User.prototype
    console.log("Logged in");
  }
}
\`\`\`

Methods defined inside classes do NOT get copied to every instance. They sit efficiently on the shared prototype in memory!

### Interactive Practice
Let's build a classical inheritance chain using clean ES6 Classes. Notice how the \`super()\` keyword works to initialize the parent's properties!`,
      codeStarter: `class Engineer {
  constructor(name) {
    this.name = name;
  }

  code() {
    console.log(this.name + " is writing system architecture...");
  }
}

class BackendEngineer extends Engineer {
  constructor(name, database) {
    super(name); // Call the parent constructor!
    this.database = database;
  }

  query() {
    console.log("SELECT * FROM " + this.database + " LIMIT 1;");
  }
}

const alice = new BackendEngineer("Alice", "PostgreSQL");
alice.code(); // Inherited from Engineer
alice.query(); // Specific to BackendEngineer`,
      quiz: {
        questions: [
          {
            question: "When a method is defined inside an ES6 class body (not in the constructor), where is it stored?",
            options: ["Copied completely onto every created instance", "Attached directly to the global window object", "Stored on the class Prototype, shared among all instances", "Stored in the Lexical Environment"],
            correctIndex: 2,
            explanation: "To save memory, methods are attached to the Prototype object. All instances simply point a reference up to this prototype."
          }
        ]
      }
    }
  ]
};

module.exports = { javascriptMastery };
