const pythonMastery = {
  course: {
    title: 'Python: Data Science to System Design',
    slug: 'python-mastery',
    description: 'A deep dive into Pythonic architecture, Data Structures, Decorators, Generators, and its applications in Data Science and Backend architecture.',
    categorySlug: 'python',
    difficulty: 'INTERMEDIATE',
    xpReward: 2000,
    duration: 800,
    order: 2
  },
  lessons: [
    {
      title: 'The Pythonic Way: Lists & Dictionaries',
      content: `## 🐍 List Comprehensions & Advanced Dicts

A "Pythonic" developer writes clear, robust, code using the language's native paradigms. The easiest way to spot a beginner is analyzing how they iterate and generate collections.

### Traditional Loop vs Comprehension
Instead of declaring an empty list and appending values conditionally, **List Comprehensions** execute everything elegantly on standard C-optimized bytecode.

\`\`\`python
# Beginner Python
evens = []
for i in range(10):
    if i % 2 == 0:
        evens.append(i * i)

# Pythonic Approach
evens = [x * x for x in range(10) if x % 2 == 0]
\`\`\`

Not only is it 2-3x faster, but it instantly communicates your intent to other engineers reviewing the PR.

### Dictionary Methods (.get and .setdefault)
Stop using \`dict[key]\` if you aren't absolutely sure the key exists. It throws a fatal \`KeyError\`.
Instead, use \`.get(key, default_value)\` for safe lookups, or \`.setdefault(key, default_value)\` to automatically populate missing data structures.

> [!TIP]
> **Performance Hit:** Over-relying on \`try/except KeyError:\` isn't necessarily un-Pythonic (the "Easier to Ask for Forgiveness than Permission" EAFP rule), but for simple dictionary lookups, \`.get()\` is vastly superior.

### Interactive Practice
You are building an analytics tracker. Group a list of usernames by their first letter using a standard Python dictionary in the most efficient way possible.`,
      codeStarter: `usernames = ["Alice", "Bob", "Charlie", "Alan", "Brandon", "Catherine"]

grouped = {}

for name in usernames:
    # 1. Provide a default empty list if the first letter isn't found
    # 2. Append the name
    
    first_letter = name[0]
    grouped.setdefault(first_letter, []).append(name)
    
print("Grouped Dictionary:")
print(grouped)`,
      quiz: {
        questions: [
          {
            question: "Why is a List Comprehension faster than a traditional for-loop with .append()?",
            options: ["It executes asynchronously in a Background Thread", "It relies on highly-optimized C code internally, avoiding the overhead of repeatedly calling the .append() method in Python", "It runs entirely on the GPU", "It avoids parsing local variables"],
            correctIndex: 1,
            explanation: "Python evaluates list comprehensions on optimized C-level iterators inside the standard library, whereas for-loops invoke Python frame objects for every iteration step."
          },
          {
            question: "Instead of throwing a KeyError, what does dict.get(key) return if the key doesn't exist?",
            options: ["0 or False depending on the Type", "A SystemExit Exception", "None (or your specified default value)", "An empty String"],
            correctIndex: 2,
            explanation: "By default, `.get()` safely returns `None`. You can override it by passing a second argument: `dict.get(key, 'default')`."
          }
        ]
      }
    },
    {
      title: 'Generators & Yield Statements',
      content: `## ⚡ The Memory Saver: Generators

What happens when you need to process a 10 GB log file? If you read the entire file into a massive list, you will consume 10 GB of RAM. The server crashes (OOM Killed).

### The Solution: Generators (\`yield\`)
Instead of calculating and returning an entire list at once, a **generator function** pauses execution using the \`yield\` keyword. It computes the result exactly *one element at a time* as requested by the consumer (lazy evaluation).

\`\`\`python
def fibonacci(limit):
    a, b = 0, 1
    for _ in range(limit):
        yield a
        a, b = b, a + b
\`\`\`

When you call \`fibonacci(1000000)\`, it doesn't return an infinite array. It returns a tiny Generator Object. You must use \`next()\` or a \`for-in\` loop to squeeze the exact next value out of it slowly!

### Interactive Practice
Implement a log file reader simulation! We've provided an infinite stream of random logs. Use \`yield\` to process only 5 logs cleanly without filling up memory!`,
      codeStarter: `import random

# Simulating an infinite system
def infinite_network_logs():
    while True:
        status = random.choice(["INFO", "WARNING", "ERROR (Critical)"])
        yield f"[SERVER] Incoming Hit -> Status: {status}"

# Instantiate the generator
stream = infinite_network_logs()

print("Fetching first 5 logs asynchronously:")
for i in range(5):
    # Process EXACTLY one log using next()
    current_log = next(stream)
    print(current_log)

print("\\nMemory saved!")`,
      quiz: {
        questions: [
          {
            question: "What is the primary architectural advantage of using `yield` for immense datasets?",
            options: ["It runs faster due to multithreading loops", "It processes items lazily, avoiding allocating memory for the entire dataset at once", "It encrypts data before execution", "It automatically caches the result securely"],
            correctIndex: 1,
            explanation: "Generators pause local state and wait for the consumer to ask for the next value. The RAM usage drops from O(N) to O(1) in many cases."
          }
        ]
      }
    },
    {
      title: 'Decorators & Metaprogramming',
      content: `## 🎩 The Decorator Pattern

A **Decorator** is a function that takes another function as an argument, extends its behavior, and returns a new function—without explicitly modifying the original source code!

This is heavily used in frameworks like Django (\`@login_required\`) and Flask (\`@app.route\`) for routing, logging, calculating metrics, and authentication.

### Wrapper Functions
Decorators wrap logic. Because functions are First Class objects in Python, you can write a closure that executes code *before and after* the wrapped function!

\`\`\`python
import time

def timer_decorator(func):
    def wrapper(*args, **kwargs):
      start_time = time.time()
      result = func(*args, **kwargs) # Execute original function
      end_time = time.time()
      print(f"Executed in {end_time - start_time} seconds")
      return result
    return wrapper

@timer_decorator
def heavy_computation():
    pass # Some massive ML task
\`\`\`

> [!TIP]
> **Arguments Issue:** If your original function accepts arguments, your inner \`wrapper()\` must accept \`*args, **kwargs\` and pass them safely down to \`func(*args, **kwargs)\`.

### Interactive Practice
Build a simple Analytics decorator. It should print out "ANALYTICS: User called function [X]" before executing the actual logic!`,
      codeStarter: `def track_analytics(func):
    # This acts as the replacement logic
    def wrapper(*args, **kwargs):
        print(f"ANALYTICS: Dispatching to \\{func.__name__}...")
        # Actually execute the original logic
        return func(*args, **kwargs)
        
    return wrapper

# Let's wrap the function cleanly using syntax sugar
@track_analytics
def purchase_item(item_name, price):
    print(f"Completed purchase of \\{item_name} for $\\{price}")
    return price

total = purchase_item("Mechanical Keyboard", 150.00)
print("Final value returned:", total)`,
      quiz: {
        questions: [
          {
            question: "Why does the `wrapper` function usually define parameters as `*args, **kwargs`?",
            options: ["To prevent the inner logic from failing", "To capture an infinite amount of keyword dictionaries", "To safely forward any arbitrary arguments down to the original base function regardless of its signature", "To enforce strict static typing in Python"],
            correctIndex: 2,
            explanation: "Since decorators are generic, the wrapper must be capable of receiving and forwarding ANY positional or keyword argument string the underlying function expects."
          }
        ]
      }
    }
  ]
};

module.exports = { pythonMastery };
