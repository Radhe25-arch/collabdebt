// Backfill script: finds ALL courses with 0 lessons and generates 5 lessons each
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Finding courses with 0 lessons...');
  
  const allCourses = await prisma.course.findMany({
    include: { _count: { select: { lessons: true } } },
  });

  const empty = allCourses.filter(c => c._count.lessons === 0);
  console.log(`Found ${empty.length} courses with 0 lessons (out of ${allCourses.length} total).`);

  if (empty.length === 0) {
    console.log('✅ All courses already have lessons!');
    return;
  }

  const LESSON_TEMPLATES = [
    { title: 'Introduction & Setup', content: '## Introduction & Setup\n\nWelcome! In this lesson, you will learn the fundamental setup and core concepts needed to get started.\n\n### What You Will Learn\n- Environment setup and tooling\n- Basic syntax and structure\n- Your first hands-on exercise\n\n### Getting Started\nFollow along with the examples below and try them in the embedded editor.' },
    { title: 'Core Concepts & Fundamentals', content: '## Core Concepts & Fundamentals\n\nNow that you have the basics down, let\'s dive deeper into the essential building blocks.\n\n### Topics Covered\n- Data types and variables\n- Control flow and logic\n- Functions and modularity\n\n### Practice Exercise\nComplete the exercises in the code editor to reinforce what you\'ve learned.' },
    { title: 'Working with Data', content: '## Working with Data\n\nData is at the heart of every program. In this lesson you will learn how to store, transform, and manipulate data effectively.\n\n### Topics Covered\n- Collections and data structures\n- Iteration patterns\n- Input and output operations\n\n### Hands-On Challenge\nBuild a small data processing tool using what you\'ve learned.' },
    { title: 'Real-World Patterns', content: '## Real-World Patterns\n\nLearn the design patterns and best practices used by professional developers in production code.\n\n### Topics Covered\n- Error handling and edge cases\n- Code organization and architecture\n- Performance considerations\n\n### Project\nApply these patterns to refactor and improve a real codebase.' },
    { title: 'Final Project & Review', content: '## Final Project & Review\n\nCongratulations on making it this far! In this final lesson, you will build a complete project that ties everything together.\n\n### Your Mission\n- Build a complete, working project from scratch\n- Apply all concepts learned in previous lessons\n- Submit your solution for review\n\n### What\'s Next?\nAfter completing this course, explore the next difficulty level to keep growing!' },
  ];

  let filled = 0;
  for (const course of empty) {
    for (let i = 0; i < LESSON_TEMPLATES.length; i++) {
      const t = LESSON_TEMPLATES[i];
      const lslug = `${course.slug}-lesson-${i + 1}`;
      await prisma.lesson.upsert({
        where: { courseId_slug: { courseId: course.id, slug: lslug } },
        update: { title: t.title, order: i + 1, content: t.content, xpReward: 100, duration: 15 },
        create: { title: t.title, slug: lslug, order: i + 1, courseId: course.id, content: t.content, xpReward: 100, duration: 15 },
      });
    }
    filled++;
    console.log(`  ✅ ${course.title} → 5 lessons added`);
  }

  console.log(`\n🎉 Backfilled ${filled} courses with ${filled * 5} total lessons!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
