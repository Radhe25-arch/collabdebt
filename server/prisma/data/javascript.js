/**
 * SkillForge — JavaScript Master Library (Foundations to Architect)
 */

const javascriptTracks = [
  {
    course: {
      title: 'JavaScript Foundations: Level 1',
      slug: 'javascript-foundations-level-1',
      description: 'The definitive start for a JavaScript elite. Learn Variables, Scopes, Closures, and basic DOM manipulation from a senior engineering perspective.',
      categorySlug: 'javascript',
      difficulty: 'BEGINNER',
      xpReward: 800,
      duration: 240,
      order: 1
    },
    lessons: [
      {
        title: 'Types & Variables: The Deep Truth',
        content: `## 🏗️ Building Blocks
        
        JavaScript is dynamically typed, but that doesn't mean types don't exist. Understanding the 7 primitive types and the Reference type (Object) is the difference between a bug-prone dev and a master.
        
        ### Primitives vs Objects
        Primitives are passed by **Value**. Objects are passed by **Reference**.`,
        codeStarter: `let a = 10;
let b = a;
b = 20;
console.log(a); // 10 (Value copy)

let obj1 = { name: "Alice" };
let obj2 = obj1;
obj2.name = "Bob";
console.log(obj1.name); // "Bob" (Reference copy)`
      }
    ]
  },
  {
    course: {
      title: 'JavaScript: Performance & Elite Architecture',
      slug: 'javascript-mastery-elite',
      description: 'Master JavaScript from its foundations to advanced enterprise architecture. This track covers the Event Loop, Async patterns, Prototypes, and modern ES6+ capabilities deeply.',
      categorySlug: 'javascript',
      difficulty: 'ADVANCED',
      xpReward: 1500,
      duration: 600,
      order: 2
    },
    lessons: [
      {
        title: 'Execution Context & The Call Stack',
        content: `## 🌐 The Underlying Mechanics
        
        Before typing a simple variable, an expert must understand *where* code runs. The **V8 Engine** (or Spidermonkey) works using an **Execution Context** and a **Call Stack**. Every time you execute a JS file, a **Global Execution Context (GEC)** is created.`,
        codeStarter: `let expertName = "Senior Developer";
console.log("Memory Phase complete. Value:", expertName);

function stackTraceTrace() {
  console.log("Function pushed to stack!");
}
stackTraceTrace();`
      }
    ]
  }
];

module.exports = { javascriptTracks };
