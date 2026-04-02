/**
 * SkillForge — Specialized & Functional Languages Library (Foundations to Expert)
 * 
 * Sources & Inspirations:
 * - SQL: "SQL Performance Explained" (Markus Winand)
 * - Assembly: "Programming from the Ground Up" (Jonathan Bartlett)
 * - Haskell: "Learn You a Haskell for Great Good!" (Miran Lipovača)
 * - Elixir: "Programming Elixir" (Dave Thomas)
 */

const specializedLanguagesMastery = [
  // --- SQL PROGRAMMING ---
  {
    course: {
      title: "SQL Mastery: Database Engineering",
      slug: "sql-mastery-db",
      description: "Beyond CRUD. Master Indexing, Query Optimization, and ACID. Build massive-scale data systems using PostgreSQL and others.",
      categorySlug: "backend-dev",
      difficulty: "ADVANCED",
      xpReward: 1400,
      duration: 450,
      order: 5
    },
    lessons: [
      {
        title: "Indexing & Query Execution Plans",
        content: `## ⚡ The Speed of SQL
        
        Indexes are NOT magic. They are B-Tree (or Hash) data structures stored on disk. 
        
        ### EXPLAIN ANALYZE
        The most important tool in an expert's belt. It tells you exactly how the database engine is planning to fetch your data. Look for **Index Scans** (good) and avoid **Sequential Scans** (bad) on large tables.`,
        codeStarter: `// SQL Optimization Example (PostgreSQL)
        
-- 1. Explaining a slow query
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'elite@dev.com';

-- 2. Creating an index to fix it
CREATE INDEX idx_users_email ON users(email);`
      }
    ]
  },

  // --- ASSEMBLY ---
  {
    course: {
      title: "Assembly: Thinking in CPU Cycles",
      slug: "assembly-mastery",
      description: "Master x86_64 and ARM. The ultimate foundational course for reverse engineering, kernels, and embedded systems.",
      categorySlug: "systems",
      difficulty: "ADVANCED",
      xpReward: 1600,
      duration: 600,
      order: 4
    },
    lessons: [
      {
        title: "Registers & The Instruction Set",
        content: `## 💻 The Metal
        
        Assembly is the closest you can get to the hardware while still writing code. You don't have variables; you have **Registers** (RAX, RBX, RCX, etc. on x86).
        
        ### The Instruction Flow
        1. \`mov\`: Copy data.
        2. \`add\`: Math.
        3. \`jmp\`: Control flow (loops and if-statements).
        4. \`syscall\`: Asking the Kernel to do something like print to the screen or read a file.`,
        codeStarter: `; x86_64 Assembly (NASM)
section .text
global _start

_start:
    mov rax, 60      ; system call for exit
    mov rdi, 0       ; exit code 0
    syscall          ; invoke the kernel`
      }
    ]
  },

  // --- HASKELL ---
  {
    course: {
      title: "Haskell: Pure Functional Mastery",
      slug: "haskell-mastery-foundations",
      description: "Master Monads, Functors, and Types. Learn the language that's driving modern formal verification and finance systems.",
      categorySlug: "systems",
      difficulty: "ADVANCED",
      xpReward: 1500,
      duration: 520,
      order: 5
    },
    lessons: [
      {
        title: "Purity & Immense Safety",
        content: `## 💠 Mathematical Purity
        
        In Haskell, functions are **Pure**. They cannot have side effects. They don't change global variables, they don't print to screens—they just take an input and return an output.
        
        ### The Monad: Managing the World
        How do we do impure things (like I/O)? We use the **IO Monad**. It wraps the "world-changing" actions in a type-safe container.`,
        codeStarter: `factorial :: Integer -> Integer
factorial 0 = 1
factorial n = n * factorial (n - 1)

main = print (factorial 5)`
      }
    ]
  },

  // --- ELIXIR ---
  {
    course: {
      title: "Elixir: Distributed Actor Systems",
      slug: "elixir-mastery-distributed",
      description: "Master the BEAM (Erlang VM). Build massively fault-tolerant systems with zero-downtime using the Actor Model.",
      categorySlug: "backend-dev",
      difficulty: "ADVANCED",
      xpReward: 1500,
      duration: 500,
      order: 6
    },
    lessons: [
      {
        title: "The Actor Model & OTP",
        content: `## 🎭 Lightweight Processes
        
        In Elixir, everything is a **Process**. These are NOT OS threads; millions can run concurrently on a single CPU.
        
        ### "Let it Crash"
        The BEAM philosophy is that hardware/network fails will happen. Instead of defensive programming (try/catch everywhere), we use **Supervisors** that automatically restart failed actors.`,
        codeStarter: `defmodule Math do
  def sum(a, b), do: a + b
end

IO.puts Math.sum(40, 2) # 42`
      }
    ]
  }
];

module.exports = { specializedLanguagesMastery };
