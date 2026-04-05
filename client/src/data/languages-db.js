/**
 * SkillForge Global Language Library Database
 * 250+ Active Coding Languages with Standardized 4-Tier Syllabus
 */

const createSyllabus = (found, logic, adv, real) => ({
  1: { title: "FOUNDATION", topics: found },
  2: { title: "LOGIC", topics: logic },
  3: { title: "ADVANCED", topics: adv },
  4: { title: "REAL-WORLD", topics: real },
});

export const LANGUAGES = [
  // --- FOUNDATIONAL / SYSTEMS ---
  {
    id: "c",
    name: "C",
    year: 1972,
    creator: "Dennis Ritchie",
    paradigms: ["Procedural", "Imperative"],
    usage: ["Systems", "Kernel", "Embedded"],
    difficulty: "Advanced",
    color: "#555555",
    description: "The mother of modern languages. Low-level, high-performance, and ubiquitous.",
    parent: ["B", "BCPL"],
    tier: createSyllabus(
      ["Syntax", "Data Types", "Variables"],
      ["Pointers", "Memory Management", "Structs"],
      ["Header Files", "Macros", "System Calls"],
      ["Build a Shell", "Custom Memory Allocator"]
    )
  },
  {
    id: "cpp",
    name: "C++",
    year: 1985,
    creator: "Bjarne Stroustrup",
    paradigms: ["OOP", "Generic", "Procedural"],
    usage: ["Systems", "Gaming", "Performance"],
    difficulty: "Expert",
    color: "#00599C",
    description: "Extension of C with classes. Powerful, complex, and high-performance.",
    parent: ["C", "Simula"],
    tier: createSyllabus(
      ["Classes", "Objects", "Inheritance"],
      ["Templates", "STL", "Polymorphism"],
      ["RAII", "Move Semantics", "Smart Pointers"],
      ["Build a Game Engine Core", "High-Freq Trading System"]
    )
  },
  {
    id: "rust",
    name: "Rust",
    year: 2010,
    creator: "Graydon Hoare / Mozilla",
    paradigms: ["Systems", "Functional", "Concurrent"],
    usage: ["Systems", "WebAssembly", "Security"],
    difficulty: "Advanced",
    color: "#CE422B",
    description: "Focuses on safety, speed, and concurrency. Prevents segmentation faults.",
    parent: ["C++", "OCaml", "C"],
    tier: createSyllabus(
      ["Ownership", "Borrowing", "Cargo"],
      ["Enums", "Pattern Matching", "Traits"],
      ["Lifetimes", "Generics", "Unsafe Rust"],
      ["Build a Web Server", "OS Kernel Fragment"]
    )
  },
  {
    id: "zig",
    name: "Zig",
    year: 2016,
    creator: "Andrew Kelley",
    paradigms: ["Systems", "Imperative"],
    usage: ["Systems", "Efficiency", "Compilers"],
    difficulty: "Advanced",
    color: "#F7A41D",
    description: "A general-purpose programming language and toolchain for maintaining robust software.",
    parent: ["C", "LLVM"],
    tier: createSyllabus(
      ["No Hidden Control Flow", "Error Handling"],
      ["Comptime", "Memory Allocators", "Optionals"],
      ["C Interop", "Cross Compilation", "Build System"],
      ["WASM Game", "High-Performance Data Parser"]
    )
  },
  
  // --- MODERN / SCRIPTING ---
  {
    id: "python",
    name: "Python",
    year: 1991,
    creator: "Guido van Rossum",
    paradigms: ["OOP", "Imperative", "Functional"],
    usage: ["AI/ML", "Web", "Automation", "Data"],
    difficulty: "Basic",
    color: "#3776AB",
    description: "High-level language known for readability and vast ecosystem.",
    parent: ["ABC", "C"],
    tier: createSyllabus(
      ["Whitespace", "Basic Types", "Lists"],
      ["List Comprehensions", "Generators", "Decorators"],
      ["Multiprocessing", "Asyncio", "Metaclasses"],
      ["AI Classifier", "REST API with FastAPI"]
    )
  },
  {
    id: "javascript",
    name: "JavaScript",
    year: 1995,
    creator: "Brendan Eich",
    paradigms: ["Functional", "Event-driven", "OOP"],
    usage: ["Web", "Fullstack", "Mobile"],
    difficulty: "Basic",
    color: "#F7DF1E",
    description: "The engine of the modern web. Runs everywhere.",
    parent: ["Self", "Java", "Scheme"],
    tier: createSyllabus(
      ["Prototypes", "Closures", "DOM"],
      ["Promises", "Async/Await", "ESModules"],
      ["Web Workers", "Engines (V8)", "Event Loop"],
      ["Build a React alternative", "Real-time Chat App"]
    )
  },
  {
    id: "typescript",
    name: "TypeScript",
    year: 2012,
    creator: "Anders Hejlsberg / Microsoft",
    paradigms: ["Functional", "OOP", "Static Typing"],
    usage: ["Web", "Scalable Apps"],
    difficulty: "Intermediate",
    color: "#3178C6",
    description: "Superset of JS with static types. Essential for large-scale web development.",
    parent: ["JavaScript"],
    tier: createSyllabus(
      ["Interfaces", "Types", "Enums"],
      ["Generics", "Utility Types", "Decorators"],
      ["Conditional Types", "Mapped Types", "Discriminated Unions"],
      ["Type-safe Design System", "Strict API Client Generation"]
    )
  },

  // --- EMERGING ---
  {
    id: "carbon",
    name: "Carbon",
    year: 2022,
    creator: "Google",
    paradigms: ["Systems", "OOP"],
    usage: ["C++ Successor", "Performance"],
    difficulty: "Advanced",
    color: "#000000",
    description: "Experimental C++ successor focus on speed and C++ interoperability.",
    parent: ["C++"],
    tier: createSyllabus(
      ["Generics", "Memory Safety Foundations"],
      ["C++ Interop", "Class Inheritance"],
      ["Templates", "Pointer Management"],
      ["High-Performance Service Migration"]
    )
  },
  {
    id: "mojo",
    name: "Mojo",
    year: 2023,
    creator: "Chris Lattner / Modular",
    paradigms: ["Systems", "Pythonic", "AI"],
    usage: ["AI Infrastructure", "Parallelism"],
    difficulty: "Advanced",
    color: "#FFD43B",
    description: "Combines Python's usability with C's performance. Designed for AI hardware.",
    parent: ["Python", "MLIR"],
    tier: createSyllabus(
      ["Structs", "Implicit Definitions"],
      ["Lifetimes", "SIMD Operations", "Tiling"],
      ["Parallel Loops", "Pointer Arithmetic"],
      ["Optimized Neural Network Kernel"]
    )
  },

  // --- FUNCTIONAL ---
  {
    id: "haskell",
    name: "Haskell",
    year: 1990,
    creator: "Committee",
    paradigms: ["Pure Functional", "Lazy"],
    usage: ["Research", "Fintech", "Correctness"],
    difficulty: "Expert",
    color: "#5E5086",
    description: "Statically typed, purely functional programming language with lazy evaluation.",
    parent: ["Miranda", "ML"],
    tier: createSyllabus(
      ["Pure Functions", "Lazy Evaluation", "Types"],
      ["Monads", "Functors", "Applicatives"],
      ["GHC Extensions", "Concurrency (STM)", "Category Theory"],
      ["Compile-time Formally Verified Logic Processor"]
    )
  },
  {
    id: "elixir",
    name: "Elixir",
    year: 2011,
    creator: "José Valim",
    paradigms: ["Functional", "Concurrent"],
    usage: ["Distributed Systems", "Web"],
    difficulty: "Intermediate",
    color: "#4E2A8E",
    description: "Built on the Erlang VM, designed for scalability and maintainability.",
    parent: ["Erlang", "Ruby"],
    tier: createSyllabus(
      ["Pattern Matching", "Immutability", "Mix"],
      ["Processes", "OTP", "GenServers"],
      ["Metaprogramming", "Distributed Elixir", "Supervision"],
      ["WhatsApp-scale Chat Engine"]
    )
  },

  // --- MOBILE ---
  {
    id: "swift",
    name: "Swift",
    year: 2014,
    creator: "Apple",
    paradigms: ["OOP", "Functional"],
    usage: ["iOS/MacOS", "Systems"],
    difficulty: "Intermediate",
    color: "#F05138",
    description: "Modern language for Apple platforms. Safe, fast, and interactive.",
    parent: ["Objective-C", "Rust"],
    tier: createSyllabus(
      ["Optionals", "Enums", "Structs"],
      ["Closures", "ARC", "Protocols"],
      ["Swift Concurrency", "Opaque Types", "Generics"],
      ["Complete iOS Banking App"]
    )
  },
  {
    id: "kotlin",
    name: "Kotlin",
    year: 2011,
    creator: "JetBrains",
    paradigms: ["OOP", "Functional"],
    usage: ["Android", "Server-side", "Multiplatform"],
    difficulty: "Basic",
    color: "#7F52FF",
    description: "Interoperable with Java. Modern, concise, and safe.",
    parent: ["Java", "Scala", "C#"],
    tier: createSyllabus(
      ["Null Safety", "Data Classes", "Extension Functions"],
      ["Coroutines", "Flow", "Lambdas"],
      ["DSL Design", "Reflection", "KSP"],
      ["Android Social Media App", "Multiplatform Library"]
    )
  },

  // --- DATA / RESEARCH ---
  {
    id: "julia",
    name: "Julia",
    year: 2012,
    creator: "Viral B. Shah et al.",
    paradigms: ["Multiple Dispatch", "Functional"],
    usage: ["Scientific Computing", "Data Science"],
    difficulty: "Intermediate",
    color: "#9558B2",
    description: "Designed for high-performance numerical and scientific computing.",
    parent: ["MATLAB", "Python", "Lisp"],
    tier: createSyllabus(
      ["Dynamic Types", "Arrays", "Standard Library"],
      ["Multiple Dispatch", "Metaprogramming", "Macros"],
      ["Performance Optimization", "Parallel Processing"],
      ["Climate Simulation Model", "High-Speed Linear Algebra Solver"]
    )
  },
  {
    id: "r",
    name: "R",
    year: 1993,
    creator: "Ross Ihaka / Robert Gentleman",
    paradigms: ["Functional", "Statistical"],
    usage: ["Statistics", "Data Analysis"],
    difficulty: "Basic",
    color: "#276BBE",
    description: "Environment for statistical computing and graphics.",
    parent: ["S"],
    tier: createSyllabus(
      ["Vectors", "Data Frames", "Tidyverse"],
      ["ggplot2", "Statistical Modeling", "Shiny"],
      ["C++ Integration (Rcpp)", "Big Data with R"],
      ["National Health Survey Analysis", "Interactive Economic Dashboard"]
    )
  },

  // --- BLOCKCHAIN ---
  {
    id: "solidity",
    name: "Solidity",
    year: 2014,
    creator: "Gavin Wood / Christian Reitwiessner",
    paradigms: ["Contract-oriented", "OOP"],
    usage: ["Ethereum", "Smart Contracts"],
    difficulty: "Advanced",
    color: "#363636",
    description: "Statistically typed language for writing smart contracts on blockchain.",
    parent: ["C++", "Python", "JS"],
    tier: createSyllabus(
      ["Contracts", "Variables", "Mapping"],
      ["Events", "Modifiers", "Inheritance"],
      ["Gas Optimization", "Reentrancy Protection", "Proxy Patterns"],
      ["DeFi Lending Protocol", "NFT Marketplace Engine"]
    )
  },

  // --- HISTORICAL ---
  {
    id: "lisp",
    name: "LISP",
    year: 1958,
    creator: "John McCarthy",
    paradigms: ["Functional", "Metaprogramming"],
    usage: ["AI", "Research"],
    difficulty: "Advanced",
    color: "#FFFFFF",
    description: "List Processing language. Pioneer of many computing concepts.",
    parent: ["IPL"],
    tier: createSyllabus(
      ["S-expressions", "Recursion", "Lists"],
      ["Macro System", "Higher-Order Functions"],
      ["Dynamic Scoping", "Garbage Collection Basics"],
      ["Self-Modifying AI Engine"]
    )
  },
  {
    id: "cobol",
    name: "COBOL",
    year: 1959,
    creator: "Grace Hopper et al.",
    paradigms: ["Imperative", "Procedural"],
    usage: ["Business", "Banking", "Mainframe"],
    difficulty: "Intermediate",
    color: "#005C92",
    description: "Common Business-Oriented Language. Still runs trillions of dollars in transactions.",
    parent: ["FLOW-MATIC"],
    tier: createSyllabus(
      ["Identification Division", "Data Division"],
      ["File Handling", "Record Locking"],
      ["Mainframe JCL", "Large-Scale Batch Processing"],
      ["Legacy Banking System Migration Layer"]
    )
  }
];

// Metadata for filtering and grouping
export const PARADIGMS = [
  "Procedural", "OOP", "Functional", "Logic", "Systems", "Scripting", 
  "Concurrent", "Contract-oriented", "Static Typing", "Meta-programming",
  "Parallel", "Statistical", "Imperative"
];

export const USAGES = [
  "Web", "Systems", "AI", "Mobile", "Data Science", "Enterprise", 
  "Gaming", "Embedded", "Blockchain", "Fintech", "Scientific"
];

export const DIFFICULTIES = ["Basic", "Intermediate", "Advanced", "Expert"];
