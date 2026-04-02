/**
 * SkillForge — Web & Mobile Languages Library (Foundations to Expert)
 * 
 * Sources & Inspirations:
 * - C#: "C# in Depth" (Jon Skeet) & "Adaptive Code via C#" (Gary McLean Hall)
 * - Ruby: "The Well-Grounded Rubyist" (David A. Black)
 * - Swift/Kotlin: Official Apple & JetBrains documentation
 */

const webMobileLanguagesMastery = [
  // --- C# PROGRAMMING ---
  {
    course: {
      title: "C#: Modern Enterprise Engineering",
      slug: "csharp-mastery-enterprise",
      description: "Master .NET 8, LINQ, Async/Await, and CLR internals. Build massive distributed systems with Microsoft's flagship language.",
      categorySlug: "backend-dev",
      difficulty: "ADVANCED",
      xpReward: 1400,
      duration: 480,
      order: 3
    },
    lessons: [
      {
        title: "LINQ: Language Integrated Query",
        content: `## 🧪 Fluent Functional Programming
        
        LINQ allows you to query data collections as if you were writing SQL, but with full compile-time safety. 
        
        ### Method Syntax vs. Query Syntax
        1. **Method Syntax:** Using Extension Methods (\`.Where()\`, \`.Select()\`).
        2. **Query Syntax:** Using the SQL-like \`from ... where ... select\` keywords.
        
        ### Key Concept: Deferred Execution
        LINQ queries are NOT executed when they are created, but only when you iterate over the results. This allows for massive performance optimizations!`,
        codeStarter: `// LINQ: Filter and Transform
using System;
using System.Collections.Generic;
using System.Linq;

public class Program {
    public static void main() {
        var numbers = new List<int> { 1, 2, 3, 4, 5, 6 };
        
        // Find even numbers and square them
        var result = numbers.Where(n => n % 2 == 0)
                            .Select(n => n * n);
                            
        foreach(var n in result) Console.WriteLine(n);
    }
}`
      }
    ]
  },

  // --- RUBY PROGRAMMING ---
  {
    course: {
      title: "Ruby: The Art of Metaprogramming",
      slug: "ruby-mastery-metaprogramming",
      description: "Master Ruby, Rails, and DSL creation. Learn the dynamic power that makes Ruby the language of choice for massive startups.",
      categorySlug: "backend-dev",
      difficulty: "INTERMEDIATE",
      xpReward: 1200,
      duration: 350,
      order: 4
    },
    lessons: [
      {
        title: "Everything is an Object",
        content: `## 💎 Pure OOP
        
        In Ruby, literally everything is an object. Even a literal number like \`5\` is an object with methods like \`.next\` or \`.times\`. 
        
        ### Metaprogramming
        Ruby allows code to write code. You can modify classes at runtime (**Monkey Patching**) or use \`method_missing\` to handle calls that aren't defined!`,
        codeStarter: `5.times { puts "Hello from Ruby!" }

# Metaprogramming example
class String
  def whisper
    self.downcase + "..."
  end
end

puts "I AM SHOUTING".whisper`
      }
    ]
  },

  // --- SWIFT PROGRAMMING ---
  {
    course: {
      title: "Swift: Professional iOS Architect",
      slug: "swift-mastery-ios",
      description: "From Swift Basics to SwiftUI and ARC (Automatic Reference Counting). Build world-class Apple ecosystem apps.",
      categorySlug: "mobile-dev",
      difficulty: "ADVANCED",
      xpReward: 1500,
      duration: 550,
      order: 1
    },
    lessons: [
      {
        title: "ARC & Memory Management",
        content: `## ⚙️ How Swift Manages Memory
        
        Swift uses **Automatic Reference Counting (ARC)**. It counts how many "owners" an object has. When the count drops to zero, the object is immediately deallocated.
        
        ### Strong vs. Weak References
        To avoid **Retain Cycles** (two objects holding each other forever), we use \`weak\` or \`unowned\` keywords. This is critical for iOS performance.`,
        codeStarter: `class User {
    let name: String
    init(name: String) { self.name = name }
    deinit { print("\\(name) is being deinitialized") }
}

var user: User? = User(name: "Alice")
user = nil // "Alice is being deinitialized" will print!`
      }
    ]
  },

  // --- KOTLIN PROGRAMMING ---
  {
    course: {
      title: "Kotlin: Modern Android & JVM",
      slug: "kotlin-mastery-android",
      description: "The successor to Java for Android and Backend. Learn Null Safety, Coroutines, and extension functions.",
      categorySlug: "mobile-dev",
      difficulty: "INTERMEDIATE",
      xpReward: 1300,
      duration: 380,
      order: 2
    },
    lessons: [
      {
        title: "Null Safety: The Billion Dollar Mistake",
        content: `## 🚫 Safe by Default
        
        Kotlin is designed to eliminate \`NullPointerException\` bugs. By default, variables cannot be null.
        
        ### The Nullable Type (\`T?\`)
        If you want a variable to allow null, you must explicitly mark it with a \`?\`. You then use the **Safe Call operator (\`?.\`)** to access its members!`,
        codeStarter: `fun main() {
    var name: String = "Alice"
    // name = null // Compiler Error!
    
    var nullableName: String? = null
    println(nullableName?.length) // Safely prints 'null' without crashing
}`
      }
    ]
  },

  // --- DART PROGRAMMING ---
  {
    course: {
      title: "Dart & Flutter: Cross-Platform Mastery",
      slug: "dart-mastery-flutter",
      description: "Master Dart's isolate-based concurrency and Flutter's widget architecture for high-performance apps.",
      categorySlug: "mobile-dev",
      difficulty: "BEGINNER",
      xpReward: 1100,
      duration: 300,
      order: 3
    },
    lessons: [
      {
        title: "The Reactive UI Model",
        content: `## ⚛️ Widgets & Composition
        
        In Flutter/Dart, the UI is a tree of widgets. Everything from alignment to colors is a widget. 
        
        ### Stateless vs Stateful
        - **Stateless:** The UI is static.
        - **Stateful:** The UI can rebuild when data changes!`,
        codeStarter: `import 'package:flutter/material.dart';

void main() {
  runApp(
    Center(
      child: Text('Hello, World!', textDirection: TextDirection.ltr),
    ),
  );
}`
      }
    ]
  }
];

module.exports = { webMobileLanguagesMastery };
