/**
 * SkillForge — Core Programming Languages Library (Foundations to Expert)
 * 
 * Sources & Inspirations:
 * - C: "The C Programming Language" (K&R)
 * - C++: "The C++ Programming Language" (Bjarne Stroustrup) & "Effective C++" (Scott Meyers)
 * - Rust: "The Rust Programming Language" (Steve Klabnik)
 * - Go: "The Go Programming Language" (Alan Donovan)
 * - Java: "Effective Java" (Joshua Bloch)
 */

const coreLanguagesMastery = [
  // --- C PROGRAMMING ---
  {
    course: {
      title: "C Mastery: Foundational System Programming",
      slug: "c-mastery-foundations",
      description: "The complete guide to C. Learn pointer arithmetic, memory management, and structured programming from the ground up, inspired by K&R.",
      categorySlug: "systems",
      difficulty: "BEGINNER",
      xpReward: 1200,
      duration: 360,
      order: 1
    },
    lessons: [
      {
        title: "Pointers & Memory Addresses",
        content: `## 🔍 Thinking in Memory
        
        In C, you don't just work with variables; you work with the **CPU's memory addresses**. A pointer is a variable that stores the address of another variable.
        
        ### Pointer Operators
        1. \`&\` (Address-of operator): Returns the memory address.
        2. \`*\` (Dereference operator): Accesses the value at the address.
        
        ### Key Concept: The Stack vs The Heap
        C gives you direct control. Regional variables live on the **Stack** (fast, automatic), while manually allocated memory (malloc) lives on the **Heap** (flexible, manual).`,
        codeStarter: `// Pointer Arithmetic Basics
#include <stdio.h>

int main() {
    int x = 42;
    int *p = &x; // p stores address of x
    
    printf("Value: %d\\n", *p); // Access value via pointer
    return 0;
}`
      },
      {
        title: "Manual Memory Management: malloc & free",
        content: `## 🏗️ Building on the Heap
        
        Unlike Java or Python, C has no Garbage Collector. If you want memory that survives the end of a function, you must ask the OS for it using \`malloc()\`.
        
        > [!WARNING]
        > **Memory Leaks:** For every \`malloc()\`, there must be exactly one \`free()\`. If you lose the pointer, you lose the memory until the process terminates.`
      }
    ]
  },
  
  // --- C++ PROGRAMMING ---
  {
    course: {
      title: "C++ Masterclass: Object-Oriented Systems",
      slug: "cpp-mastery-oop",
      description: "Master Modern C++ (C++20). Deep dive into RAII, Smart Pointers, Templates, and the Standard Template Library (STL).",
      categorySlug: "systems",
      difficulty: "INTERMEDIATE",
      xpReward: 1300,
      duration: 400,
      order: 2
    },
    lessons: [
      {
        title: "RAII: Resource Acquisition Is Initialization",
        content: `## 🛡️ The Core Philosophy of C++
        
        RAII is the most important concept in C++. It means that the lifecycle of a resource (memory, file handles, mutexes) is tied to the lifecycle of an object.
        
        When the object goes out of scope, its **Destructor** automatically releases the resource. This prevents leaks and ensures exception safety.`,
        codeStarter: `// Smart Pointers: The modern way to RAII
#include <iostream>
#include <memory>

class Resource {
public:
    Resource() { std::cout << "Acquired\\n"; }
    ~Resource() { std::cout << "Released\\n"; }
};

int main() {
    {
        std::unique_ptr<Resource> res = std::make_unique<Resource>();
        // Memory released automatically here!
    }
    return 0;
}`
      }
    ]
  },

  // --- RUST PROGRAMMING ---
  {
    course: {
      title: "Rust: Memory Safety Without Garbage Collection",
      slug: "rust-mastery-safety",
      description: "Learn the Borrow Checker, Ownership, and Enums. The language that's redefining systems programming.",
      categorySlug: "systems",
      difficulty: "ADVANCED",
      xpReward: 1500,
      duration: 450,
      order: 3
    },
    lessons: [
      {
        title: "The Ownership Model",
        content: `## 🏷️ Ownership, Borrowing, and Lifetimes
        
        Rust's killer feature is **Ownership**. It guarantees memory safety at compile time!
        
        ### Rules of Ownership
        1. Each value has a variable called its **owner**.
        2. There can only be **one owner** at a time.
        3. When the owner goes out of scope, the value will be dropped.
        
        ### Borrowing
        You can pass a reference (\`&T\`) instead of moving the value. This is called **Borrowing**.`,
        codeStarter: `fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 is MOVED to s2. s1 is no longer valid.
    
    // println!("{}", s1); // This would crash the compiler!
    println!("{}", s2);
}`
      }
    ]
  },

  // --- GO PROGRAMMING ---
  {
    course: {
      title: "Go: High-Concurrency & Microservices",
      slug: "go-mastery-concurrency",
      description: "Designed for web-scale. Master Goroutines, Channels, and Interface-based design for massive scalability.",
      categorySlug: "backend-dev",
      difficulty: "INTERMEDIATE",
      xpReward: 1200,
      duration: 320,
      order: 1
    },
    lessons: [
      {
        title: "Goroutines & Channels",
        content: `## 🚀 Simple Parallelism
        
        Go's secret sauce is the **Goroutine**. It's a lightweight thread managed by the Go runtime, not the OS.
        
        ### Channels: Communication over Sharing
        "Do not communicate by sharing memory; instead, share memory by communicating." Channels allow goroutines to pass data safely without locks.`,
        codeStarter: `package main
import "fmt"

func sayHello(c chan string) {
    c <- "Hello from Goroutine!"
}

func main() {
    c := make(chan string)
    go sayHello(c)
    
    msg := <-c
    fmt.Println(msg)
}`
      }
    ]
  },

  // --- JAVA PROGRAMMING ---
  {
    course: {
      title: "Java: Enterprise Design Patterns",
      slug: "java-mastery-enterprise",
      description: "Master Modern Java (JDK 21+). From JVM internals to Spring Boot and Microservices architecture.",
      categorySlug: "backend-dev",
      difficulty: "ADVANCED",
      xpReward: 1400,
      duration: 500,
      order: 2
    },
    lessons: [
      {
        title: "The JVM & JIT Compilation",
        content: `## ☕ Write Once, Run Anywhere
        
        Java code compiles to **Bytecode**, which the **Java Virtual Machine (JVM)** executes. 
        
        ### JIT (Just-In-Time)
        The JVM identifies "hot" code and compiles it directly to machine code during execution, often making it as fast as C++.`,
        codeStarter: `// Modern Java: Records & Sealed Classes
public record User(String name, int age) {}

public class Main {
    public static void main(String[] args) {
        User user = new User("Alice", 30);
        System.out.println(user.name());
    }
}`
      }
    ]
  }
];

module.exports = { coreLanguagesMastery };
