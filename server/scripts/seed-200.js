const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const rawTopics = [
  'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Rust', 'TypeScript', 'Scala', 'Dart', 'R', 'Lua', 'Perl', 'Haskell', 'Closure', 'Elixir', 'Objective-C', 'Assembly', 'F#', 'Erlang', 'Julia', 'Fortran', 'COBOL', 'Lisp', 'Prolog', 'VB.NET', 'Pascal', 'Ada', 'Smalltalk', 'ABAP', 'Dart', 'Apex', 'Scratch', 'Groovy', 'MATLAB', 'SAS', 'LabVIEW', 'VBA', 'Kotlin', 'Hack', 'Delphi',
  'React', 'Angular', 'Vue', 'Svelte', 'Ember', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel', 'Symfony', 'Ruby on Rails', 'Express', 'NestJS', 'Next.js', 'Nuxt', 'Gatsby', 'Remix', 'SolidJS', 'ASP.NET', 'Blazor', 'Xamarim', 'Flutter', 'React Native', 'Ionic', 'Cordova',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'Linux Administration', 'Network Security', 'Ethical Hacking', 'Cryptography', 'Blockchain', 'Smart Contracts', 'Solidity', 'Web3', 'Ethereum', 'Bitcoin', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'TensorFlow', 'PyTorch', 'Data Structures', 'Algorithms', 'Microservices', 'GraphQL', 'REST APIs', 'gRPC', 'WebSockets', 'Redis', 'MongoDB', 'PostgreSQL', 'MySQL', 'Cassandra', 'DynamoDB', 'Neo4j', 'Elasticsearch', 'Kafka', 'RabbitMQ', 'Nginx', 'Apache', 'HAProxy', 'Prometheus', 'Grafana', 'ELK Stack', 'Data Engineering', 'Spark', 'Hadoop', 'Snowflake', 'BigQuery', 'Tableau', 'PowerBI', 'Excel Mastery', 'Vim', 'Tmux', 'Bash Scripting', 'PowerShell', 'Windows Server', 'Active Directory', 'ITIL', 'CompTIA A+', 'Network+', 'Security+', 'CISSP', 'CEH', 'UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects', 'Blender', 'Unity', 'Unreal Engine', 'Godot', 'Cocos2d', 'Agile', 'Scrum', 'Jira', 'Confluence',
  'Prompt Engineering', 'GenAI Architectures', 'RAG Design', 'Vector Databases', 'Pinecone', 'LangChain', 'OpenAI Integration', 'Hugging Face Ops', 'Stable Diffusion Automation'
];
const topicsSet = [...new Set(rawTopics)]; // remove dupes

const courses = topicsSet.map((topic, index) => ({
    title: topic + ' Mastery',
    slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `Master ${topic} from absolute basics to advanced enterprise architecture. Dive deeply into core mechanics, real-world patterns, and massive-scale engineering.`,
    categorySlug: index % 5 === 0 ? 'system-design' : (index % 2 === 0 ? 'python' : 'javascript') 
}));

async function main() {
  console.log('🌱 Mass Seeding ' + courses.length + ' High-Quality JIT Courses...');
  
  const categoryMap = {};
  const categories = await prisma.category.findMany();
  for (const c of categories) categoryMap[c.slug] = c.id;

  const defaultCategoryId = categories[0].id; // Fallback

  let courseCount = 0;
  for (const course of courses) {
    if (courseCount % 25 === 0) console.log(`Seeding progress: ${courseCount} / ${courses.length}`);
    const catId = categoryMap[course.categorySlug] || defaultCategoryId;
    
    // Create the course shell
    const dbCourse = await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: {
        title: course.title,
        slug: course.slug,
        description: course.description,
        difficulty: 'INTERMEDIATE',
        xpReward: 1000,
        duration: 500,
        isPublished: true,
        categoryId: catId,
      }
    });

    // We generate 5 empty lessons to trigger JIT API Calls on demand
    const lessonTitles = [
      "Introduction & Core Syntax",
      "Memory & Advanced Constructs",
      "Architecture & Best Practices",
      "Scaling & Optimization",
      "Production Deployment Strategies"
    ];

    for (let i = 0; i < lessonTitles.length; i++) {
        await prisma.lesson.upsert({
            where: { courseId_slug: { courseId: dbCourse.id, slug: `${dbCourse.slug}-lesson-${i+1}` } },
            update: {},
            create: {
                title: lessonTitles[i],
                slug: `${dbCourse.slug}-lesson-${i+1}`,
                courseId: dbCourse.id,
                content: '', // IMPORTANT: This empty string triggers the Groq AI JIT generator seamlessly!
                codeStarter: '',
                order: i + 1,
                xpReward: 150,
                duration: 20
            }
        });
    }
    courseCount++;
  }
  console.log('✅ Successfully seeded ' + courses.length + ' JIT courses.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
