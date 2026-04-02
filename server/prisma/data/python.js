/**
 * SkillForge — Python Master Library (Foundations to Architect)
 */

const pythonTracks = [
  {
    course: {
      title: 'Python Foundations: Level 1',
      slug: 'python-foundations-level-1',
      description: 'The definitive start for a Python elite. Learn Variables, Scopes, Closures, and basic data manipulation from a senior engineering perspective.',
      categorySlug: 'python',
      difficulty: 'BEGINNER',
      xpReward: 800,
      duration: 240,
      order: 1
    },
    lessons: [
      {
        title: 'Types & Variables: The Deep Truth',
        content: `## 🏗️ Building Blocks
        
        Python is a dynamically typed language. This doesn't mean types don't exist. It just means the **variable** doesn't have a type, but the **value** it points to does. 
        
        ### Integers vs Strings
        In Python, you can't just add a string and an integer together. This is different from JavaScript!`,
        codeStarter: `a = 10
b = "20"
# print(a + b) # This would throw a TypeError!
print(a + int(b)) # Explicit conversion is key in Python.`
      }
    ]
  },
  {
    course: {
      title: 'Python: Modern Architecture & Masterclass',
      slug: 'python-mastery-elite',
      description: 'Master Python from its foundations to advanced enterprise architecture. This track covers the Decorators, Generators, Metaprogramming and modern Python patterns.',
      categorySlug: 'python',
      difficulty: 'ADVANCED',
      xpReward: 1500,
      duration: 600,
      order: 2
    },
    lessons: [
      {
        title: 'The Pythonic Way: Lists & Dictionaries',
        content: `## 🐍 List Comprehensions & Advanced Dicts
        
        A "Pythonic" developer writes clear, robust code using the language's native paradigms. Using List Comprehensions instead of loops is the mark of a master.`,
        codeStarter: `usernames = ["Alice", "Bob", "Charlie", "Alan", "Brandon", "Catherine"]
grouped = {}

for name in usernames:
    grouped.setdefault(name[0], []).append(name)
    
print(grouped)`
      }
    ]
  }
];

module.exports = { pythonTracks };
