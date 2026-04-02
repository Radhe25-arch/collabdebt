const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { expertCourses } = require('./data/index.js');

async function main() {
  console.log('🌱 Wiping old data to ensure clean high-quality catalog...');

  // Extremely destructive: wipe related curriculum data to start fresh.
  // Warning: in production, you wouldn't do this, but for this specific request
  // we are enforcing a high-quality clean slate.
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();

  console.log('✨ Data wiped. Seeding high-quality expert courses...');

  const necessaryCategories = [
    { name: 'JavaScript', slug: 'javascript', description: 'The language of the web', iconName: 'Code', order: 1 },
    { name: 'Python', slug: 'python', description: 'Data Science & Backend', iconName: 'Code', order: 2 },
    { name: 'Frontend', slug: 'web-dev', description: 'Master modern library and framework architecture', iconName: 'Globe', order: 3 },
    { name: 'Cloud & DevOps', slug: 'devops', description: 'Docker, AWS, and Infrastructure as Code', iconName: 'Settings', order: 4 },
    { name: 'Systems Programming', slug: 'systems', description: 'High-performance Go and Memory-safe Rust', iconName: 'Terminal', order: 5 },
    { name: 'System Design', slug: 'system-design', description: 'Architect massively scalable systems', iconName: 'Code', order: 6 },
    { name: 'AI & Machine Learning', slug: 'ai-ml', description: 'LLMs, Neural Networks, and MLOps', iconName: 'Target', order: 7 },
    { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Pentesting, AppSec, and Cryptography', iconName: 'Shield', order: 8 },
    { name: 'Blockchain', slug: 'blockchain', description: 'Ethereum, Solidity, and ZK-Proofs', iconName: 'Code', order: 9 },
    { name: 'Mobile Development', slug: 'mobile-dev', description: 'Native & Cross-platform engineering', iconName: 'Play', order: 10 },
    { name: 'Data Science', slug: 'data-science', description: 'Big Data, Analytics, and Visualization', iconName: 'TrendingUp', order: 11 },
    { name: 'Backend Development', slug: 'backend-dev', description: 'Node, Java, C++, and API Design', iconName: 'Terminal', order: 12 }
  ];

  for (const cat of necessaryCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, iconName: cat.iconName, order: cat.order },
      create: cat,
    });
  }

  let courseCount = 0;
  let lessonCount = 0;

  for (const bundle of expertCourses) {
    const { course, lessons } = bundle;
    
    const category = await prisma.category.findUnique({ where: { slug: course.categorySlug } });
    if (!category) {
      console.warn(`⚠️ Category not found: ${course.categorySlug}`);
      continue;
    }

    // Create the Course
    const dbCourse = await prisma.course.create({
      data: {
        title: course.title,
        slug: course.slug,
        description: course.description,
        difficulty: course.difficulty,
        xpReward: course.xpReward,
        duration: course.duration,
        order: course.order,
        isPublished: true,
        categoryId: category.id,
      }
    });

    courseCount++;

    // Create Lessons
    for (let i = 0; i < lessons.length; i++) {
      const lessonData = lessons[i];
      const lessonSlug = `${dbCourse.slug}-lesson-${i + 1}`;

      const dbLesson = await prisma.lesson.create({
        data: {
          title: lessonData.title,
          slug: lessonSlug,
          courseId: dbCourse.id,
          content: lessonData.content,
          codeStarter: lessonData.codeStarter || null,
          order: i + 1,
          xpReward: 200,
          duration: 30
        }
      });

      lessonCount++;

      // Create Quiz if exists
      if (lessonData.quiz && lessonData.quiz.questions && lessonData.quiz.questions.length > 0) {
        const dbQuiz = await prisma.quiz.create({
          data: { lessonId: dbLesson.id }
        });

        for (let qIdx = 0; qIdx < lessonData.quiz.questions.length; qIdx++) {
          const q = lessonData.quiz.questions[qIdx];
          await prisma.quizQuestion.create({
            data: {
              quizId: dbQuiz.id,
              question: q.question,
              options: q.options,
              correctIndex: q.correctIndex,
              explanation: q.explanation || null,
              order: qIdx
            }
          });
        }
      }
    }
  }

  console.log(`✅ ${courseCount} Expert Courses created`);
  console.log(`✅ ${lessonCount} Deep Technical Lessons created`);
  console.log('🎉 Seeding complete. The rubbish has been removed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
