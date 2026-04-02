const rustMastery = {
  course: {
    title: 'Rust: Safe & Secure Systems Engineering',
    slug: 'rust-mastery',
    description: 'Master the principles of memory safety without Garbage Collection. Learn Ownership, Borrowing, Lifetimes, and Fearless Concurrency.',
    categorySlug: 'systems',
    difficulty: 'ADVANCED',
    xpReward: 3000,
    duration: 1200,
    order: 1
  },
  lessons: [
    {
      title: 'Ownership & Borrowing: No GC Required',
      content: `## 🦀 The Memory Safety Revolution

In languages like C++, you must manually allocate and free memory. If you forget, your app leaks. If you free it twice, it crashes. In Java, a Garbage Collector (GC) handles it, but it adds latency and "stops the world" pauses.

**Rust** uses a third way: **Ownership**.

### The Three Rules of Ownership
1. Each value in Rust has a variable that's called its **owner**.
2. There can only be **one owner** at a time.
3. When the owner goes out of scope, the value will be **dropped** (cleared from memory).

### Borrowing (References)
Instead of taking ownership, you can **borrow** a value using references (\`&\`).
- **Immutable Borrow (\`&T\`):** You can read the data, but not change it. You can have infinite immutable borrows!
- **Mutable Borrow (\`&mut T\`):** You can change the data. You can have **only one** mutable borrow at a time.

> [!IMPORTANT]
> **Data Race Prevention:** Rust prevents data races at compile time! You cannot have a mutable borrow if an immutable borrow is already active. This ensures the data doesn't change while someone else is reading it.`,
      codeStarter: `/* 
  Rust Ownership Practice 
  Correct the code below to allow multiple 
  reads followed by a single write!
*/

fn main() {
    let mut s = String::from("Rust");

    let r1 = &s; // Immutable borrow 1
    let r2 = &s; // Immutable borrow 2
    println!("Reading: {}, {}", r1, r2);
    
    // ERROR: cannot borrow 's' as mutable because it is 
    // also borrowed as immutable above.
    
    // To Fix: Move the println! ABOVE the mutable borrow 
    // or let r1 and r2 go out of scope.
    
    let r3 = &mut s; // Mutable borrow
    r3.push_str(" is amazing!");
    println!("Final: {}", r3);
}`,
      quiz: {
        questions: [
          {
            question: "What happens to a value in Rust when its owner goes out of scope?",
            options: ["The Garbage Collector eventually finds it", "It stays in memory until the program ends", "The 'drop' function is called and memory is immediately freed", "It is moved to the Heap"],
            correctIndex: 2,
            explanation: "Rust uses lexical scope to determine when memory should be freed, providing deterministic management without a GC."
          },
          {
            question: "How many 'Mutable' references can you have for a single piece of data at once?",
            options: ["Infinite", "Zero", "Exactly one", "Two"],
            correctIndex: 2,
            explanation: "To prevent multiple people from writing to the same memory simultaneously (Data Races), Rust limits you to exactly one mutable reference."
          }
        ]
      }
    }
  ]
};

const goMastery = {
  course: {
    title: 'Go: High-Performance Concurrent Systems',
    slug: 'go-mastery',
    description: 'Learn the language behind Docker and Kubernetes. Master Goroutines, Channels, Interfaces, and the principles of Pragmatic Software Design.',
    categorySlug: 'systems',
    difficulty: 'INTERMEDIATE',
    xpReward: 2500,
    duration: 800,
    order: 2
  },
  lessons: [
    {
      title: 'Goroutines & Fearless Concurrency',
      content: `## 🚀 Scaling to Millions

Go was built at Google to solve a massive problem: how to handle millions of simultaneous requests efficiently. The answer is **Goroutines**.

### What is a Goroutine?
A goroutine is a lightweight thread managed by the Go runtime (not the OS). 
- OS threads take **MBs** of stack space.
- Goroutines start with only **KBs**.
- You can run **hundreds of thousands** of goroutines on a single machine!

### Channels: Communicating between Threads
The golden rule of Go concurrency:
> "Do not communicate by sharing memory; instead, share memory by communicating."

Channels allow you to pass data safely between goroutines without needing complex mutexes or locks.

\`\`\`go
ch := make(chan string)

go func() {
    ch <- "Task Complete!" // Send to channel
}()

msg := <-ch // Receive from channel (blocks until data is ready)
\`\`\`

> [!TIP]
> **Blocking Behavior:** Reading from an empty channel (or writing to a full one) will **block** the goroutine. This is a built-in synchronization mechanism that makes code extremely readable!`,
      codeStarter: `/* 
  Go Concurrency Practice 
  Simulate a worker pool where 1 worker 
  processes 3 tasks via a channel!
*/

package main

import "fmt"

func main() {
    tasks := make(chan int, 3)
    
    // 1. Send 3 tasks into the channel
    tasks <- 101
    tasks <- 102
    tasks <- 103
    
    close(tasks) // Close the channel when done sending
    
    // 2. Range over the results to process them
    for t := range tasks {
        fmt.Println("Processing task ID:", t)
    }
}`,
      quiz: {
        questions: [
          {
            question: "Why are Goroutines better than standard OS Threads for high-scale apps?",
            options: ["They are faster to type", "They have a much smaller initial stack size (KBs vs MBs), allowing for millions to run concurrently", "They automatically use the GPU", "They don't require the CPU"],
            correctIndex: 1,
            explanation: "Because Goroutines are 'Green Threads' managed in user-space, they are incredibly cheap to create and switch between."
          }
        ]
      }
    }
  ]
};

module.exports = { rustMastery, goMastery };
