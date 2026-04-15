import { Cpu, Code2, Zap, BookOpen, Star, Clock } from 'lucide-react';
import React from 'react';

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed?: boolean;
  content: string;
  code: string;
  quiz: {
    question: string;
    options: string[];
    correct: number;
  } | null;
}

export interface Course {
  id: string;
  title: string;
  domain: string;
  level: string;
  rating: number;
  students: string;
  duration: string;
  tags: string[];
  color: string;
  border: string;
  icon: any; // React component
  totalLessons: number;
  xpReward: number;
  lessons: Lesson[];
}

export const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "Advanced Rust Concurrency",
    domain: "Systems",
    level: "Advanced",
    rating: 4.9,
    students: "12k",
    duration: "8h",
    tags: ["Rust", "Systems"],
    color: "from-orange-500/20 to-red-500/5",
    border: "border-orange-500/20",
    icon: Code2,
    totalLessons: 3,
    xpReward: 50,
    lessons: [
      {
        id: 1, title: 'Ownership & Borrow Checker', duration: '18 min',
        content: `# Ownership & the Borrow Checker\n\nRust's ownership model is its most distinctive feature. It eliminates entire classes of bugs at compile time with **zero runtime cost**.\n\n## The Three Rules\n\n1. Each value has exactly one **owner**.\n2. When the owner goes out of scope, the value is **dropped**.\n3. There can only be **one mutable reference** OR **any number of immutable references** at a time — never both simultaneously.`,
        code: `fn main() {\n    let s1 = String::from("hello");\n    let s2 = &s1;\n    println!("s1: {}, s2: {}", s1, s2);\n}`,
        quiz: {
          question: 'What does Rust do when an owner goes out of scope?',
          options: ['Calls garbage collector', 'Drops the value (frees memory)', 'Sets to null', 'Throws an exception'],
          correct: 1,
        }
      },
      {
        id: 2, title: 'Arc & Mutex for Shared State', duration: '22 min',
        content: `# Arc<Mutex<T>> — Thread-Safe Shared State\n\n\`Arc\` (Atomic Reference Count) allows **multiple ownership** across threads. \`Mutex\` ensures **exclusive access** when mutating.`,
        code: `use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn main() {\n    let counter = Arc::new(Mutex::new(0));\n    let c = Arc::clone(&counter);\n    thread::spawn(move || {\n        *c.lock().unwrap() += 1;\n    }).join().unwrap();\n    println!("Result: {}", *counter.lock().unwrap());\n}`,
        quiz: {
          question: 'Why do we need Arc instead of just Mutex?',
          options: ['Arc provides locking', 'Mutex alone cannot be shared across threads', 'Arc is faster', 'Mutex uses too much memory'],
          correct: 1,
        }
      },
      {
        id: 3, title: 'Channels & Message Passing', duration: '25 min',
        content: `# Channels: "Do not share memory; instead, communicate."\n\nRust's channels follow Go's philosophy. \`mpsc\` = **Multiple Producer, Single Consumer**.`,
        code: `use std::sync::mpsc;\nuse std::thread;\n\nfn main() {\n    let (tx, rx) = mpsc::channel();\n    thread::spawn(move || {\n        tx.send("ping").unwrap();\n    });\n    println!("Got: {}", rx.recv().unwrap());\n}`,
        quiz: {
          question: 'What does mpsc stand for?',
          options: ['Multi-process single-core', 'Multiple producer, single consumer', 'Memory-protected shared cache', 'Mutex-protected shared channel'],
          correct: 1,
        }
      }
    ]
  },
  {
    id: "2",
    title: "Microservices with Go",
    domain: "Architecture",
    level: "Intermediate",
    rating: 4.8,
    students: "8.5k",
    duration: "12h",
    tags: ["Go", "Backend"],
    color: "from-blue-500/20 to-cyan-500/5",
    border: "border-blue-500/20",
    icon: Zap,
    totalLessons: 2,
    xpReward: 50,
    lessons: [
      {
        id: 1, title: 'Goroutines & Concurrency', duration: '15 min',
        content: `# Goroutines\n\nGoroutines are lightweight threads managed by the Go runtime. They are much cheaper than OS threads.`,
        code: `package main\nimport "fmt"\n\nfunction main() {\n    go fmt.Println("hello from goroutine")\n    fmt.Println("hello from main")\n}`,
        quiz: {
          question: 'What keyword starts a goroutine?',
          options: ['async', 'thread', 'go', 'spawn'],
          correct: 2,
        }
      },
      {
        id: 2, title: 'Interfaces in Go', duration: '20 min',
        content: `# Interfaces\n\nGo interfaces are implemented implicitly. A type implements an interface by implementing its methods.`,
        code: `type Reader interface {\n    Read(b []byte) (n int, err error)\n}`,
        quiz: {
          question: 'How are interfaces implemented in Go?',
          options: ['Explicitly with implements', 'Implicitly by meeting the signature', 'Using the interface keyword on the struct', 'They are not supported'],
          correct: 1,
        }
      }
    ]
  }
];

export const LEADERBOARD_TOP = [
  { rank: 1, name: 'alex_code', xp: 98240, avatar: 'alex' },
  { rank: 2, name: 'priya_dev', xp: 94180, avatar: 'priya' },
  { rank: 3, name: 'kenji_sys', xp: 91330, avatar: 'kenji' },
];

export const UPCOMING_EVENTS = [
  { title: 'Weekly Algorithm Battle', time: 'Today, 8:00 PM', accent: '#ef4444', type: 'Battle' },
  { title: 'System Design AMA', time: 'Tomorrow, 2:00 PM', accent: '#6366f1', type: 'Live' },
  { title: 'Rust Workshop Series', time: 'Fri, 6:00 PM', accent: '#f97316', type: 'Course' },
];
