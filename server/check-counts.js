const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const [courses, lessons, categories] = await Promise.all([
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.category.count()
  ]);
  console.log(`Summary: ${categories} categories, ${courses} courses, ${lessons} lessons`);
  process.exit(0);
}

main().catch(console.error);
