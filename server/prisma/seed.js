const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORIES = [
  // Programming & Markup Languages
  { name: 'JavaScript', slug: 'javascript', description: 'The language of the web', iconName: 'javascript', order: 1 },
  { name: 'TypeScript', slug: 'typescript', description: 'JavaScript with superpowers', iconName: 'typescript', order: 2 },
  { name: 'Python', slug: 'python', description: 'Simple, powerful, versatile', iconName: 'python', order: 3 },
  { name: 'HTML', slug: 'html', description: 'Structure of the web', iconName: 'html', order: 4 },
  { name: 'CSS', slug: 'css', description: 'Style the web', iconName: 'css', order: 5 },
  { name: 'Java', slug: 'java', description: 'Write once, run anywhere', iconName: 'java', order: 6 },
  { name: 'C++', slug: 'cpp', description: 'Performance and power', iconName: 'cpp', order: 7 },
  { name: 'C', slug: 'c', description: 'The foundation of modern computing', iconName: 'c', order: 8 },
  { name: 'C#', slug: 'csharp', description: 'Microsoft\'s modern language', iconName: 'csharp', order: 9 },
  { name: 'Go', slug: 'go', description: 'Simple, fast, reliable', iconName: 'go', order: 10 },
  { name: 'Rust', slug: 'rust', description: 'Systems programming without fear', iconName: 'rust', order: 11 },
  { name: 'Kotlin', slug: 'kotlin', description: 'Modern Android development', iconName: 'kotlin', order: 12 },
  { name: 'Swift', slug: 'swift', description: 'Build apps for Apple platforms', iconName: 'swift', order: 13 },
  { name: 'PHP', slug: 'php', description: 'Server-side web development', iconName: 'php', order: 14 },
  { name: 'Ruby', slug: 'ruby', description: 'Developer happiness first', iconName: 'ruby', order: 15 },
  { name: 'Dart', slug: 'dart', description: 'Build beautiful Flutter apps', iconName: 'dart', order: 16 },
  { name: 'Bash', slug: 'bash', description: 'Automate everything', iconName: 'bash', order: 17 },
  { name: 'SQL', slug: 'sql', description: 'Master databases', iconName: 'sql', order: 18 },
  // Domain Paths
  { name: 'Web Development', slug: 'web-dev', description: 'Build the modern web', iconName: 'web', order: 19 },
  { name: 'Data Science & ML', slug: 'data-science', description: 'Turn data into insights', iconName: 'data', order: 20 },
  { name: 'DevOps & Cloud', slug: 'devops', description: 'Ship faster, scale better', iconName: 'devops', order: 21 },
  { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Protect the digital world', iconName: 'security', order: 22 },
  { name: 'Game Development', slug: 'game-dev', description: 'Build games people love', iconName: 'game', order: 23 },
  { name: 'System Design', slug: 'system-design', description: 'Architect scalable systems', iconName: 'system', order: 24 },
  { name: 'Blockchain', slug: 'blockchain', description: 'Decentralized future', iconName: 'blockchain', order: 25 },
  { name: 'AI & Prompt Engineering', slug: 'ai-ml', description: 'Build with AI', iconName: 'ai', order: 26 },
];

const COURSES = [
  // JavaScript
  { title: 'JavaScript: Zero to Hero', slug: 'javascript-beginner', description: 'Start from absolute scratch. Learn variables, loops, arrays, and basic logic. Perfect for absolute beginners.', difficulty: 'BEGINNER', xpReward: 500, duration: 120, categorySlug: 'javascript', order: 1 },
  { title: 'JavaScript: Data & DOM', slug: 'javascript-intermediate', description: 'Master DOM manipulation, events, asynchronous code, and external APIs.', difficulty: 'INTERMEDIATE', xpReward: 750, duration: 180, categorySlug: 'javascript', order: 2 },
  { title: 'JavaScript: Advanced Architect', slug: 'javascript-advanced', description: 'Deep dive into closures, prototypes, event loops, and robust design patterns.', difficulty: 'ADVANCED', xpReward: 1000, duration: 240, categorySlug: 'javascript', order: 3 },
  // Python
  { title: 'Python: Zero to Hero', slug: 'python-beginner', description: 'No prior coding experience needed. Master print statements, variables, conditions, and basic logic.', difficulty: 'BEGINNER', xpReward: 500, duration: 120, categorySlug: 'python', order: 1 },
  { title: 'Python: Data Structures', slug: 'python-intermediate', description: 'Learn lists, dictionaries, tuples, sets, and functional programming concepts.', difficulty: 'INTERMEDIATE', xpReward: 750, duration: 180, categorySlug: 'python', order: 2 },
  { title: 'Python: Advanced Architect', slug: 'python-advanced', description: 'Object-Oriented Programming (OOP), decorators, generators, and async Python.', difficulty: 'ADVANCED', xpReward: 1000, duration: 240, categorySlug: 'python', order: 3 },
  // HTML
  { title: 'HTML: Zero to Hero', slug: 'html-beginner', description: 'Learn the basic building blocks of every website on the internet. Start coding your first webpage.', difficulty: 'BEGINNER', xpReward: 300, duration: 60, categorySlug: 'html', order: 1 },
  { title: 'HTML: Semantic Web', slug: 'html-intermediate', description: 'Master semantic tags, accessibility (a11y), and forms.', difficulty: 'INTERMEDIATE', xpReward: 500, duration: 90, categorySlug: 'html', order: 2 },
  { title: 'HTML: Advanced SEO & Meta', slug: 'html-advanced', description: 'Deep dive into SEO, meta tags, Open Graph, and optimizing performance.', difficulty: 'ADVANCED', xpReward: 700, duration: 120, categorySlug: 'html', order: 3 },
  // CSS
  { title: 'CSS: Zero to Hero', slug: 'css-beginner', description: 'Style your boring HTML pages with colors, fonts, margins, and borders.', difficulty: 'BEGINNER', xpReward: 300, duration: 80, categorySlug: 'css', order: 1 },
  { title: 'CSS: Flexbox & Grid Mastery', slug: 'css-intermediate', description: 'Master modern layouts natively with Flexbox and CSS Grid.', difficulty: 'INTERMEDIATE', xpReward: 600, duration: 150, categorySlug: 'css', order: 2 },
  { title: 'CSS: UI/UX Animations', slug: 'css-advanced', description: 'Create stunning 3D transforms, keyframe animations, and responsive architectures.', difficulty: 'ADVANCED', xpReward: 900, duration: 200, categorySlug: 'css', order: 3 },
  // Java
  { title: 'Java: Zero to Hero', slug: 'java-beginner', description: 'Start your enterprise journey. Learn Java syntax, types, and basic loops.', difficulty: 'BEGINNER', xpReward: 500, duration: 140, categorySlug: 'java', order: 1 },
  { title: 'Java: Object Oriented Mastery', slug: 'java-intermediate', description: 'Classes, Objects, Inheritance, Polymorphism, and Interfaces.', difficulty: 'INTERMEDIATE', xpReward: 800, duration: 200, categorySlug: 'java', order: 2 },
  { title: 'Java: Advanced Architect', slug: 'java-advanced', description: 'Generics, Collections, Streams API, and multithreading.', difficulty: 'ADVANCED', xpReward: 1100, duration: 260, categorySlug: 'java', order: 3 },
  // C++
  { title: 'C++: Zero to Hero', slug: 'cpp-beginner', description: 'Learn the core of high-performance coding. Syntax, variables, loops from 0.', difficulty: 'BEGINNER', xpReward: 500, duration: 140, categorySlug: 'cpp', order: 1 },
  { title: 'C++: Pointers & Memory', slug: 'cpp-intermediate', description: 'Master manual memory management, pointers, and references.', difficulty: 'INTERMEDIATE', xpReward: 800, duration: 200, categorySlug: 'cpp', order: 2 },
  { title: 'C++: Advanced Architect', slug: 'cpp-advanced', description: 'STL (Standard Template Library), algorithms, and advanced OOP features.', difficulty: 'ADVANCED', xpReward: 1200, duration: 300, categorySlug: 'cpp', order: 3 },
  // Web Dev (Domain)
  { title: 'Frontend Mastery Path', slug: 'web-frontend', description: 'Learn React, state management, and building interactive user interfaces.', difficulty: 'BEGINNER', xpReward: 700, duration: 150, categorySlug: 'web-dev', order: 1 },
  { title: 'Backend Mastery Path', slug: 'web-backend', description: 'Master Node.js, Express, databases, and APIs.', difficulty: 'INTERMEDIATE', xpReward: 1000, duration: 200, categorySlug: 'web-dev', order: 2 },
  { title: 'Full-Stack Architect', slug: 'web-fullstack', description: 'Combine Frontend, Backend, and DevOps to ship production apps.', difficulty: 'ADVANCED', xpReward: 1500, duration: 350, categorySlug: 'web-dev', order: 3 },
  // AI & ML (Domain)
  { title: 'Prompt Engineering 101', slug: 'ai-prompt-engineering', description: 'Learn to write effective prompts to command ChatGPT, Claude, and Gemini.', difficulty: 'BEGINNER', xpReward: 400, duration: 60, categorySlug: 'ai-ml', order: 1 },
  { title: 'Build AI Apps with APIs', slug: 'ai-apps', description: 'Integrate LLMs into your own web applications using OpenAI, Anthropic APIs.', difficulty: 'INTERMEDIATE', xpReward: 800, duration: 150, categorySlug: 'ai-ml', order: 2 },
  { title: 'AI: Advanced Architect', slug: 'ai-advanced', description: 'Fine-tuning models, RAG (Retrieval-Augmented Generation), and AI Agents.', difficulty: 'ADVANCED', xpReward: 1500, duration: 300, categorySlug: 'ai-ml', order: 3 }
];

async function main() {
  console.log('🌱 Seeding SkillForge database...');

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, iconName: cat.iconName, order: cat.order },
      create: cat,
    });
  }
  console.log(`✅ ${CATEGORIES.length} categories seeded`);

  let count = 0;
  for (const course of COURSES) {
    const { categorySlug, ...data } = course;
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) { console.warn(`⚠️  Category not found: ${categorySlug}`); continue; }
    const dbCourse = await prisma.course.upsert({
      where: { slug: course.slug },
      update: { ...data, categoryId: category.id, isPublished: true },
      create: { ...data, categoryId: category.id, isPublished: true },
    });

    // Generate 5 syllabus lessons per course so it's fully playable
    const lessonTitles = [
      "Introduction & Setup",
      "Core Concepts & Fundamentals",
      "Deep Dive & Architecture",
      "Real-World Patterns",
      "Final Project & Review"
    ];

    for (let i = 0; i < lessonTitles.length; i++) {
        const title = lessonTitles[i];
        const lslug = `${dbCourse.slug}-lesson-${i+1}`;
        await prisma.lesson.upsert({
           where: { courseId_slug: { courseId: dbCourse.id, slug: lslug } },
           update: { title, order: i+1, content: `## ${title}\n\nWelcome to ${title} for **${dbCourse.title}**. This module covers everything you need to know to progress to the next level.\n\n### Instructions\nRead through the concepts and complete the interactive exercises available in the embedded editor!`, xpReward: 100, duration: 15 },
           create: { title, slug: lslug, order: i+1, courseId: dbCourse.id, content: `## ${title}\n\nWelcome to ${title} for **${dbCourse.title}**. This module covers everything you need to know to progress to the next level.\n\n### Instructions\nRead through the concepts and complete the interactive exercises available in the embedded editor!`, xpReward: 100, duration: 15 },
        });
    }

    count++;
  }
  console.log(`✅ ${count} courses seeded`);
  console.log('🎉 Done!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
