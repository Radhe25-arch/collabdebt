const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORIES = [
  // Programming Languages
  { name: 'JavaScript', slug: 'javascript', description: 'The language of the web', iconName: 'javascript', order: 1 },
  { name: 'TypeScript', slug: 'typescript', description: 'JavaScript with superpowers', iconName: 'typescript', order: 2 },
  { name: 'Python', slug: 'python', description: 'Simple, powerful, versatile', iconName: 'python', order: 3 },
  { name: 'Java', slug: 'java', description: 'Write once, run anywhere', iconName: 'java', order: 4 },
  { name: 'C++', slug: 'cpp', description: 'Performance and power', iconName: 'cpp', order: 5 },
  { name: 'C', slug: 'c', description: 'The foundation of modern computing', iconName: 'c', order: 6 },
  { name: 'C#', slug: 'csharp', description: 'Microsoft\'s modern language', iconName: 'csharp', order: 7 },
  { name: 'Go', slug: 'go', description: 'Simple, fast, reliable', iconName: 'go', order: 8 },
  { name: 'Rust', slug: 'rust', description: 'Systems programming without fear', iconName: 'rust', order: 9 },
  { name: 'Kotlin', slug: 'kotlin', description: 'Modern Android development', iconName: 'kotlin', order: 10 },
  { name: 'Swift', slug: 'swift', description: 'Build apps for Apple platforms', iconName: 'swift', order: 11 },
  { name: 'PHP', slug: 'php', description: 'Server-side web development', iconName: 'php', order: 12 },
  { name: 'Ruby', slug: 'ruby', description: 'Developer happiness first', iconName: 'ruby', order: 13 },
  { name: 'Dart', slug: 'dart', description: 'Build beautiful Flutter apps', iconName: 'dart', order: 14 },
  { name: 'Bash', slug: 'bash', description: 'Automate everything', iconName: 'bash', order: 15 },
  { name: 'SQL', slug: 'sql', description: 'Master databases', iconName: 'sql', order: 16 },
  // Tech Fields
  { name: 'Web Development', slug: 'web-dev', description: 'Build the modern web', iconName: 'web', order: 17 },
  { name: 'Data Science & ML', slug: 'data-science', description: 'Turn data into insights', iconName: 'data', order: 18 },
  { name: 'DevOps & Cloud', slug: 'devops', description: 'Ship faster, scale better', iconName: 'devops', order: 19 },
  { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Protect the digital world', iconName: 'security', order: 20 },
  { name: 'Game Development', slug: 'game-dev', description: 'Build games people love', iconName: 'game', order: 21 },
  { name: 'System Design', slug: 'system-design', description: 'Architect scalable systems', iconName: 'system', order: 22 },
  { name: 'Blockchain', slug: 'blockchain', description: 'Decentralized future', iconName: 'blockchain', order: 23 },
  { name: 'AI & Prompt Engineering', slug: 'ai-ml', description: 'Build with AI', iconName: 'ai', order: 24 },
];

const COURSES = [
  // JavaScript
  { title: 'JavaScript Fundamentals', slug: 'javascript-fundamentals', description: 'Learn variables, functions, loops and the core of JS from scratch.', difficulty: 'BEGINNER', xpReward: 500, duration: 120, categorySlug: 'javascript', order: 1 },
  { title: 'JavaScript DOM & Events', slug: 'javascript-dom', description: 'Manipulate web pages dynamically with DOM APIs and event handling.', difficulty: 'INTERMEDIATE', xpReward: 600, duration: 90, categorySlug: 'javascript', order: 2 },
  { title: 'Async JavaScript', slug: 'javascript-async', description: 'Master Promises, async/await, and the event loop.', difficulty: 'INTERMEDIATE', xpReward: 700, duration: 100, categorySlug: 'javascript', order: 3 },
  { title: 'JavaScript Advanced Patterns', slug: 'javascript-advanced', description: 'Closures, prototypes, design patterns and performance.', difficulty: 'ADVANCED', xpReward: 900, duration: 150, categorySlug: 'javascript', order: 4 },
  // TypeScript
  { title: 'TypeScript Basics', slug: 'typescript-basics', description: 'Add types to your JavaScript and catch bugs before they happen.', difficulty: 'BEGINNER', xpReward: 500, duration: 90, categorySlug: 'typescript', order: 1 },
  { title: 'TypeScript with React', slug: 'typescript-react', description: 'Build type-safe React apps with TypeScript.', difficulty: 'INTERMEDIATE', xpReward: 700, duration: 120, categorySlug: 'typescript', order: 2 },
  // Python
  { title: 'Python for Beginners', slug: 'python-beginners', description: 'Start coding with Python — the most beginner-friendly language.', difficulty: 'BEGINNER', xpReward: 500, duration: 120, categorySlug: 'python', order: 1 },
  { title: 'Python Data Structures', slug: 'python-data-structures', description: 'Lists, dicts, sets, tuples and when to use each.', difficulty: 'INTERMEDIATE', xpReward: 600, duration: 90, categorySlug: 'python', order: 2 },
  { title: 'Python for Automation', slug: 'python-automation', description: 'Automate boring tasks with Python scripts.', difficulty: 'INTERMEDIATE', xpReward: 700, duration: 100, categorySlug: 'python', order: 3 },
  { title: 'Python Advanced', slug: 'python-advanced', description: 'Decorators, generators, metaclasses and more.', difficulty: 'ADVANCED', xpReward: 900, duration: 150, categorySlug: 'python', order: 4 },
  // Java
  { title: 'Java Fundamentals', slug: 'java-fundamentals', description: 'OOP, classes, and the Java ecosystem from scratch.', difficulty: 'BEGINNER', xpReward: 500, duration: 130, categorySlug: 'java', order: 1 },
  { title: 'Java Collections & Generics', slug: 'java-collections', description: 'Master Java\'s powerful collection framework.', difficulty: 'INTERMEDIATE', xpReward: 650, duration: 100, categorySlug: 'java', order: 2 },
  { title: 'Java Spring Boot', slug: 'java-spring-boot', description: 'Build production REST APIs with Spring Boot.', difficulty: 'ADVANCED', xpReward: 900, duration: 180, categorySlug: 'java', order: 3 },
  // C++
  { title: 'C++ Fundamentals', slug: 'cpp-fundamentals', description: 'Pointers, memory management, and OOP in C++.', difficulty: 'BEGINNER', xpReward: 600, duration: 140, categorySlug: 'cpp', order: 1 },
  { title: 'C++ STL & Algorithms', slug: 'cpp-stl', description: 'Master the Standard Template Library for competitive coding.', difficulty: 'INTERMEDIATE', xpReward: 800, duration: 120, categorySlug: 'cpp', order: 2 },
  // C
  { title: 'C Programming Basics', slug: 'c-basics', description: 'The foundation of all programming — learn C from scratch.', difficulty: 'BEGINNER', xpReward: 600, duration: 130, categorySlug: 'c', order: 1 },
  // C#
  { title: 'C# Fundamentals', slug: 'csharp-fundamentals', description: 'Microsoft\'s elegant language for building Windows and web apps.', difficulty: 'BEGINNER', xpReward: 500, duration: 120, categorySlug: 'csharp', order: 1 },
  { title: 'C# .NET Development', slug: 'csharp-dotnet', description: 'Build enterprise apps with .NET framework.', difficulty: 'INTERMEDIATE', xpReward: 700, duration: 150, categorySlug: 'csharp', order: 2 },
  // Go
  { title: 'Go Fundamentals', slug: 'go-fundamentals', description: 'Google\'s language for building fast, reliable software.', difficulty: 'BEGINNER', xpReward: 600, duration: 110, categorySlug: 'go', order: 1 },
  { title: 'Go Concurrency', slug: 'go-concurrency', description: 'Goroutines, channels, and Go\'s concurrency model.', difficulty: 'ADVANCED', xpReward: 900, duration: 130, categorySlug: 'go', order: 2 },
  // Rust
  { title: 'Rust Basics', slug: 'rust-basics', description: 'Memory safety without garbage collection.', difficulty: 'INTERMEDIATE', xpReward: 700, duration: 150, categorySlug: 'rust', order: 1 },
  // Kotlin
  { title: 'Kotlin for Android', slug: 'kotlin-android', description: 'Build Android apps with modern Kotlin.', difficulty: 'BEGINNER', xpReward: 600, duration: 140, categorySlug: 'kotlin', order: 1 },
  // Swift
  { title: 'Swift for iOS', slug: 'swift-ios', description: 'Build iPhone and iPad apps with Swift.', difficulty: 'BEGINNER', xpReward: 600, duration: 140, categorySlug: 'swift', order: 1 },
  // PHP
  { title: 'PHP Fundamentals', slug: 'php-fundamentals', description: 'Server-side scripting for web development.', difficulty: 'BEGINNER', xpReward: 500, duration: 100, categorySlug: 'php', order: 1 },
  { title: 'PHP Laravel', slug: 'php-laravel', description: 'Build web apps with the most popular PHP framework.', difficulty: 'INTERMEDIATE', xpReward: 700, duration: 150, categorySlug: 'php', order: 2 },
  // Ruby
  { title: 'Ruby Basics', slug: 'ruby-basics', description: 'Elegant scripting language loved by developers.', difficulty: 'BEGINNER', xpReward: 500, duration: 100, categorySlug: 'ruby', order: 1 },
  { title: 'Ruby on Rails', slug: 'ruby-rails', description: 'Build full-stack web apps rapidly with Rails.', difficulty: 'INTERMEDIATE', xpReward: 700, duration: 150, categorySlug: 'ruby', order: 2 },
  // Dart
  { title: 'Dart & Flutter Basics', slug: 'dart-flutter', description: 'Cross-platform mobile development with Flutter.', difficulty: 'BEGINNER', xpReward: 600, duration: 130, categorySlug: 'dart', order: 1 },
  // Bash
  { title: 'Bash Scripting Basics', slug: 'bash-basics', description: 'Automate Linux tasks with shell scripts.', difficulty: 'BEGINNER', xpReward: 400, duration: 80, categorySlug: 'bash', order: 1 },
  // SQL
  { title: 'SQL Fundamentals', slug: 'sql-fundamentals', description: 'Query databases like a pro with SQL.', difficulty: 'BEGINNER', xpReward: 500, duration: 100, categorySlug: 'sql', order: 1 },
  { title: 'Advanced SQL', slug: 'sql-advanced', description: 'Window functions, CTEs, and query optimization.', difficulty: 'ADVANCED', xpReward: 800, duration: 120, categorySlug: 'sql', order: 2 },
  // Web Dev
  { title: 'HTML & CSS Basics', slug: 'html-css-basics', description: 'Build your first web pages with HTML and CSS.', difficulty: 'BEGINNER', xpReward: 400, duration: 80, categorySlug: 'web-dev', order: 1 },
  { title: 'React Fundamentals', slug: 'react-fundamentals', description: 'Build interactive UIs with the world\'s most popular frontend library.', difficulty: 'INTERMEDIATE', xpReward: 700, duration: 150, categorySlug: 'web-dev', order: 2 },
  { title: 'Node.js Backend', slug: 'nodejs-backend', description: 'Build REST APIs with Node.js and Express.', difficulty: 'INTERMEDIATE', xpReward: 700, duration: 140, categorySlug: 'web-dev', order: 3 },
  { title: 'Full Stack Development', slug: 'fullstack-dev', description: 'Combine frontend and backend into complete web applications.', difficulty: 'ADVANCED', xpReward: 1000, duration: 200, categorySlug: 'web-dev', order: 4 },
  // Data Science
  { title: 'Data Science with Python', slug: 'data-science-python', description: 'Numpy, Pandas, Matplotlib — the data science trio.', difficulty: 'INTERMEDIATE', xpReward: 700, duration: 150, categorySlug: 'data-science', order: 1 },
  { title: 'Machine Learning Basics', slug: 'ml-basics', description: 'Supervised learning, regression, classification from scratch.', difficulty: 'INTERMEDIATE', xpReward: 800, duration: 180, categorySlug: 'data-science', order: 2 },
  { title: 'Deep Learning & Neural Networks', slug: 'deep-learning', description: 'Build neural networks with TensorFlow and PyTorch.', difficulty: 'ADVANCED', xpReward: 1000, duration: 200, categorySlug: 'data-science', order: 3 },
  // DevOps
  { title: 'Linux Fundamentals', slug: 'linux-basics', description: 'Navigate and manage Linux systems confidently.', difficulty: 'BEGINNER', xpReward: 500, duration: 100, categorySlug: 'devops', order: 1 },
  { title: 'Docker & Containers', slug: 'docker-basics', description: 'Containerize your apps with Docker.', difficulty: 'INTERMEDIATE', xpReward: 700, duration: 120, categorySlug: 'devops', order: 2 },
  { title: 'AWS Cloud Essentials', slug: 'aws-essentials', description: 'Deploy and manage apps on Amazon Web Services.', difficulty: 'INTERMEDIATE', xpReward: 800, duration: 150, categorySlug: 'devops', order: 3 },
  // Cybersecurity
  { title: 'Cybersecurity Fundamentals', slug: 'cybersecurity-basics', description: 'Network security, threats, and defense basics.', difficulty: 'BEGINNER', xpReward: 500, duration: 100, categorySlug: 'cybersecurity', order: 1 },
  { title: 'Ethical Hacking', slug: 'ethical-hacking', description: 'Learn to think like a hacker to defend better.', difficulty: 'ADVANCED', xpReward: 900, duration: 180, categorySlug: 'cybersecurity', order: 2 },
  // Game Dev
  { title: 'Game Dev with Unity', slug: 'unity-basics', description: 'Build 2D and 3D games with Unity and C#.', difficulty: 'BEGINNER', xpReward: 600, duration: 150, categorySlug: 'game-dev', order: 1 },
  // System Design
  { title: 'System Design Basics', slug: 'system-design-basics', description: 'Scalability, load balancing, caching — the fundamentals.', difficulty: 'INTERMEDIATE', xpReward: 800, duration: 150, categorySlug: 'system-design', order: 1 },
  { title: 'Advanced System Design', slug: 'system-design-advanced', description: 'Design Twitter, Netflix, Uber at scale.', difficulty: 'ADVANCED', xpReward: 1000, duration: 200, categorySlug: 'system-design', order: 2 },
  // Blockchain
  { title: 'Blockchain Fundamentals', slug: 'blockchain-basics', description: 'How blockchain works — consensus, cryptography, DeFi.', difficulty: 'INTERMEDIATE', xpReward: 700, duration: 120, categorySlug: 'blockchain', order: 1 },
  // AI
  { title: 'AI & Prompt Engineering', slug: 'ai-prompt-engineering', description: 'Build powerful AI apps and master prompting techniques.', difficulty: 'BEGINNER', xpReward: 500, duration: 90, categorySlug: 'ai-ml', order: 1 },
  { title: 'Build AI Apps with APIs', slug: 'ai-apps', description: 'Integrate OpenAI, Claude, and other AI APIs into real products.', difficulty: 'INTERMEDIATE', xpReward: 700, duration: 130, categorySlug: 'ai-ml', order: 2 },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Seed categories
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, iconName: cat.iconName, order: cat.order },
      create: cat,
    });
  }
  console.log(`✅ ${CATEGORIES.length} categories seeded`);

  // Seed courses
  let courseCount = 0;
  for (const course of COURSES) {
    const { categorySlug, ...courseData } = course;
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) { console.warn(`Category not found: ${categorySlug}`); continue; }
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: { ...courseData, categoryId: category.id, isPublished: true },
      create: { ...courseData, categoryId: category.id, isPublished: true },
    });
    courseCount++;
  }
  console.log(`✅ ${courseCount} courses seeded`);
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
