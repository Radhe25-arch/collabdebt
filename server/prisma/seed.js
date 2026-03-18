const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORIES = [
  // ── Programming Languages ──────────────────────────────
  { name: 'JavaScript',  slug: 'javascript',  description: 'The language of the web',            iconName: 'javascript', order: 1  },
  { name: 'TypeScript',  slug: 'typescript',  description: 'JavaScript with superpowers',         iconName: 'typescript', order: 2  },
  { name: 'Python',      slug: 'python',      description: 'Simple, powerful, versatile',         iconName: 'python',     order: 3  },
  { name: 'Java',        slug: 'java',        description: 'Write once, run anywhere',             iconName: 'java',       order: 4  },
  { name: 'C++',         slug: 'cpp',         description: 'Performance and power',               iconName: 'cpp',        order: 5  },
  { name: 'C',           slug: 'c',           description: 'Foundation of modern computing',      iconName: 'c',          order: 6  },
  { name: 'C#',          slug: 'csharp',      description: "Microsoft's modern language",         iconName: 'csharp',     order: 7  },
  { name: 'Go',          slug: 'go',          description: 'Simple, fast, reliable',              iconName: 'go',         order: 8  },
  { name: 'Rust',        slug: 'rust',        description: 'Systems programming without fear',    iconName: 'rust',       order: 9  },
  { name: 'Kotlin',      slug: 'kotlin',      description: 'Modern Android development',          iconName: 'kotlin',     order: 10 },
  { name: 'Swift',       slug: 'swift',       description: 'Build apps for Apple platforms',      iconName: 'swift',      order: 11 },
  { name: 'PHP',         slug: 'php',         description: 'Server-side web development',         iconName: 'php',        order: 12 },
  { name: 'Ruby',        slug: 'ruby',        description: 'Developer happiness first',           iconName: 'ruby',       order: 13 },
  { name: 'Dart',        slug: 'dart',        description: 'Build beautiful Flutter apps',        iconName: 'dart',       order: 14 },
  { name: 'Bash',        slug: 'bash',        description: 'Automate everything',                 iconName: 'bash',       order: 15 },
  { name: 'SQL',         slug: 'sql',         description: 'Master databases',                    iconName: 'sql',        order: 16 },
  { name: 'R',           slug: 'r-lang',      description: 'Statistical computing & data',        iconName: 'r',          order: 17 },
  { name: 'Scala',       slug: 'scala',       description: 'Functional + OOP on the JVM',         iconName: 'scala',      order: 18 },
  // ── Tech Fields ────────────────────────────────────────
  { name: 'Web Development',        slug: 'web-dev',          description: 'Build the modern web',               iconName: 'web',       order: 20 },
  { name: 'Mobile Development',     slug: 'mobile-dev',       description: 'iOS and Android apps',               iconName: 'mobile',    order: 21 },
  { name: 'Data Science & ML',      slug: 'data-science',     description: 'Turn data into insights',            iconName: 'data',      order: 22 },
  { name: 'DevOps & Cloud',         slug: 'devops',           description: 'Ship faster, scale better',          iconName: 'devops',    order: 23 },
  { name: 'Cybersecurity',          slug: 'cybersecurity',    description: 'Protect the digital world',          iconName: 'security',  order: 24 },
  { name: 'Game Development',       slug: 'game-dev',         description: 'Build games people love',            iconName: 'game',      order: 25 },
  { name: 'System Design',          slug: 'system-design',    description: 'Architect scalable systems',         iconName: 'system',    order: 26 },
  { name: 'Blockchain & Web3',      slug: 'blockchain',       description: 'Decentralized future',               iconName: 'blockchain', order: 27 },
  { name: 'AI & Prompt Engineering',slug: 'ai-ml',            description: 'Build with AI',                      iconName: 'ai',        order: 28 },
  { name: 'Data Structures & Algo', slug: 'dsa',              description: 'Crack any coding interview',         iconName: 'dsa',       order: 29 },
  { name: 'Cloud Computing',        slug: 'cloud',            description: 'AWS, Azure, GCP mastery',            iconName: 'cloud',     order: 30 },
  { name: 'Digital Marketing',      slug: 'digital-marketing',description: 'Grow businesses online',             iconName: 'marketing', order: 31 },
  { name: 'UI/UX Design',           slug: 'ui-ux',            description: 'Design products people love',        iconName: 'design',    order: 32 },
  { name: 'Product Management',     slug: 'product-mgmt',     description: 'Build products that matter',         iconName: 'product',   order: 33 },
  { name: 'Interview Prep',         slug: 'interview-prep',   description: 'Land your dream job',                iconName: 'interview', order: 34 },
  { name: 'Open Source',            slug: 'open-source',      description: 'Contribute to the world',            iconName: 'opensource', order: 35 },
  { name: 'IT Support',             slug: 'it-support',       description: 'Google IT Support curriculum',       iconName: 'it',        order: 36 },
  { name: 'Data Analytics',         slug: 'data-analytics',   description: 'Google Data Analytics curriculum',   iconName: 'analytics', order: 37 },
  { name: 'Project Management',     slug: 'project-mgmt',     description: 'Google Project Management curriculum',iconName: 'pm',       order: 38 },
  { name: 'Azure & Microsoft',      slug: 'azure',            description: 'Microsoft Azure & .NET ecosystem',   iconName: 'azure',     order: 39 },
  { name: 'Android Development',    slug: 'android',          description: 'Build Android apps professionally',  iconName: 'android',   order: 40 },
  { name: 'API Development',        slug: 'api-dev',          description: 'Design and build great APIs',        iconName: 'api',       order: 41 },
  { name: 'Testing & QA',           slug: 'testing',          description: 'Ship bug-free software',             iconName: 'testing',   order: 42 },
  { name: 'Computer Science',       slug: 'cs-fundamentals',  description: 'Core CS concepts everyone needs',    iconName: 'cs',        order: 43 },
];

const COURSES = [
  // ── JavaScript ────────────────────────────────────────
  { title: 'JavaScript Fundamentals',        slug: 'js-fundamentals',     description: 'Variables, functions, loops — the core of JS from scratch.',    difficulty: 'BEGINNER',      xpReward: 500,  duration: 120, categorySlug: 'javascript',  order: 1 },
  { title: 'JavaScript DOM & Events',        slug: 'js-dom',              description: 'Manipulate web pages dynamically. Click, hover, scroll — all of it.', difficulty: 'INTERMEDIATE',  xpReward: 600,  duration: 90,  categorySlug: 'javascript',  order: 2 },
  { title: 'Async JavaScript',               slug: 'js-async',            description: 'Promises, async/await, and the event loop — demystified.',       difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 100, categorySlug: 'javascript',  order: 3 },
  { title: 'JavaScript Advanced Patterns',   slug: 'js-advanced',         description: 'Closures, prototypes, design patterns and performance tricks.',   difficulty: 'ADVANCED',      xpReward: 900,  duration: 150, categorySlug: 'javascript',  order: 4 },
  { title: 'JavaScript Testing',             slug: 'js-testing',          description: 'Write rock-solid tests with Jest and Testing Library.',           difficulty: 'INTERMEDIATE',  xpReward: 600,  duration: 80,  categorySlug: 'javascript',  order: 5 },
  // ── TypeScript ────────────────────────────────────────
  { title: 'TypeScript Basics',              slug: 'ts-basics',           description: 'Add types to your JavaScript. Catch bugs before they ship.',      difficulty: 'BEGINNER',      xpReward: 500,  duration: 90,  categorySlug: 'typescript',  order: 1 },
  { title: 'TypeScript Deep Dive',           slug: 'ts-deep-dive',        description: 'Generics, utility types, advanced patterns in TypeScript.',       difficulty: 'ADVANCED',      xpReward: 800,  duration: 120, categorySlug: 'typescript',  order: 2 },
  { title: 'TypeScript with React',          slug: 'ts-react',            description: 'Build type-safe React apps — fewer bugs, better DX.',             difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 110, categorySlug: 'typescript',  order: 3 },
  // ── Python ────────────────────────────────────────────
  { title: 'Python for Beginners',           slug: 'py-beginners',        description: 'Start coding with Python — the most beginner-friendly language.', difficulty: 'BEGINNER',      xpReward: 500,  duration: 120, categorySlug: 'python',      order: 1 },
  { title: 'Python Data Structures',         slug: 'py-data-structures',  description: 'Lists, dicts, sets, tuples — and when to use which.',             difficulty: 'INTERMEDIATE',  xpReward: 600,  duration: 90,  categorySlug: 'python',      order: 2 },
  { title: 'Python for Automation',          slug: 'py-automation',       description: 'Automate boring tasks — files, emails, web scraping.',            difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 100, categorySlug: 'python',      order: 3 },
  { title: 'Python OOP',                     slug: 'py-oop',              description: 'Classes, inheritance, design patterns in Python.',                difficulty: 'INTERMEDIATE',  xpReward: 650,  duration: 90,  categorySlug: 'python',      order: 4 },
  { title: 'Python Advanced',                slug: 'py-advanced',         description: 'Decorators, generators, metaclasses and more.',                   difficulty: 'ADVANCED',      xpReward: 900,  duration: 150, categorySlug: 'python',      order: 5 },
  { title: 'Python for Data Science',        slug: 'py-data-science',     description: 'NumPy, Pandas, Matplotlib — the data science trio.',              difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 130, categorySlug: 'python',      order: 6 },
  // ── Java ──────────────────────────────────────────────
  { title: 'Java Fundamentals',              slug: 'java-fundamentals',   description: 'OOP, classes, the Java ecosystem — built from zero.',             difficulty: 'BEGINNER',      xpReward: 500,  duration: 130, categorySlug: 'java',        order: 1 },
  { title: 'Java Collections & Generics',    slug: 'java-collections',    description: "Master Java's powerful collection framework.",                    difficulty: 'INTERMEDIATE',  xpReward: 650,  duration: 100, categorySlug: 'java',        order: 2 },
  { title: 'Java Multithreading',            slug: 'java-threads',        description: 'Concurrency, threads, and parallel programming in Java.',         difficulty: 'ADVANCED',      xpReward: 850,  duration: 120, categorySlug: 'java',        order: 3 },
  { title: 'Spring Boot REST APIs',          slug: 'java-spring-boot',    description: 'Build production-grade REST APIs with Spring Boot.',              difficulty: 'ADVANCED',      xpReward: 900,  duration: 180, categorySlug: 'java',        order: 4 },
  // ── C++ ───────────────────────────────────────────────
  { title: 'C++ Fundamentals',               slug: 'cpp-fundamentals',    description: 'Pointers, memory management, OOP — the C++ essentials.',         difficulty: 'BEGINNER',      xpReward: 600,  duration: 140, categorySlug: 'cpp',         order: 1 },
  { title: 'C++ STL & Algorithms',           slug: 'cpp-stl',             description: 'Master the Standard Template Library for competitive coding.',    difficulty: 'INTERMEDIATE',  xpReward: 800,  duration: 120, categorySlug: 'cpp',         order: 2 },
  { title: 'C++ System Programming',         slug: 'cpp-systems',         description: 'Memory models, OS interfaces, performance-critical code.',        difficulty: 'ADVANCED',      xpReward: 950,  duration: 160, categorySlug: 'cpp',         order: 3 },
  // ── C ─────────────────────────────────────────────────
  { title: 'C Programming Basics',           slug: 'c-basics',            description: 'The foundation of all programming — learn C from scratch.',      difficulty: 'BEGINNER',      xpReward: 600,  duration: 130, categorySlug: 'c',           order: 1 },
  { title: 'C Pointers & Memory',            slug: 'c-pointers',          description: 'Conquer pointers, memory allocation, and low-level thinking.',   difficulty: 'INTERMEDIATE',  xpReward: 750,  duration: 110, categorySlug: 'c',           order: 2 },
  // ── C# ────────────────────────────────────────────────
  { title: 'C# Fundamentals',                slug: 'cs-fundamentals-lang',description: "Microsoft's elegant language for apps, games, and the web.",      difficulty: 'BEGINNER',      xpReward: 500,  duration: 120, categorySlug: 'csharp',      order: 1 },
  { title: 'C# .NET Development',            slug: 'cs-dotnet',           description: 'Build enterprise apps with the .NET ecosystem.',                  difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 150, categorySlug: 'csharp',      order: 2 },
  { title: 'C# for Unity Game Dev',          slug: 'cs-unity',            description: 'Use C# to build real games in Unity.',                           difficulty: 'INTERMEDIATE',  xpReward: 750,  duration: 140, categorySlug: 'csharp',      order: 3 },
  // ── Go ────────────────────────────────────────────────
  { title: 'Go Fundamentals',                slug: 'go-fundamentals',     description: "Google's language for fast, reliable backend services.",          difficulty: 'BEGINNER',      xpReward: 600,  duration: 110, categorySlug: 'go',          order: 1 },
  { title: 'Go REST APIs',                   slug: 'go-apis',             description: 'Build blazing-fast REST APIs with Go and Gin.',                   difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 120, categorySlug: 'go',          order: 2 },
  { title: 'Go Concurrency',                 slug: 'go-concurrency',      description: "Goroutines, channels, and Go's legendary concurrency model.",     difficulty: 'ADVANCED',      xpReward: 900,  duration: 130, categorySlug: 'go',          order: 3 },
  // ── Rust ──────────────────────────────────────────────
  { title: 'Rust Basics',                    slug: 'rust-basics',         description: 'Memory safety without garbage collection.',                       difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 150, categorySlug: 'rust',        order: 1 },
  { title: 'Rust Systems Programming',       slug: 'rust-systems',        description: 'Build OS tools, CLI apps, and high-perf systems in Rust.',        difficulty: 'ADVANCED',      xpReward: 950,  duration: 170, categorySlug: 'rust',        order: 2 },
  // ── Kotlin ────────────────────────────────────────────
  { title: 'Kotlin Fundamentals',            slug: 'kotlin-fundamentals', description: 'Modern, concise, and safe — learn Kotlin from scratch.',         difficulty: 'BEGINNER',      xpReward: 550,  duration: 110, categorySlug: 'kotlin',      order: 1 },
  { title: 'Android with Kotlin',            slug: 'kotlin-android',      description: 'Build production Android apps with Kotlin.',                      difficulty: 'INTERMEDIATE',  xpReward: 750,  duration: 160, categorySlug: 'kotlin',      order: 2 },
  // ── Swift ─────────────────────────────────────────────
  { title: 'Swift Fundamentals',             slug: 'swift-fundamentals',  description: "Apple's fast and expressive language — from zero to confident.",  difficulty: 'BEGINNER',      xpReward: 550,  duration: 110, categorySlug: 'swift',       order: 1 },
  { title: 'iOS App Development',            slug: 'swift-ios',           description: 'Build iPhone and iPad apps with SwiftUI.',                        difficulty: 'INTERMEDIATE',  xpReward: 800,  duration: 170, categorySlug: 'swift',       order: 2 },
  // ── PHP ───────────────────────────────────────────────
  { title: 'PHP Fundamentals',               slug: 'php-fundamentals',    description: 'Server-side scripting — the backbone of 80% of the web.',        difficulty: 'BEGINNER',      xpReward: 500,  duration: 100, categorySlug: 'php',         order: 1 },
  { title: 'PHP Laravel',                    slug: 'php-laravel',         description: 'Build full-stack web apps with the most popular PHP framework.',  difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 150, categorySlug: 'php',         order: 2 },
  // ── Ruby ──────────────────────────────────────────────
  { title: 'Ruby Basics',                    slug: 'ruby-basics',         description: 'Elegant, readable, fun — Ruby the way it was meant to be.',      difficulty: 'BEGINNER',      xpReward: 500,  duration: 100, categorySlug: 'ruby',        order: 1 },
  { title: 'Ruby on Rails',                  slug: 'ruby-rails',          description: 'Build full-stack web apps at startup speed with Rails.',          difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 150, categorySlug: 'ruby',        order: 2 },
  // ── Dart ──────────────────────────────────────────────
  { title: 'Dart Basics',                    slug: 'dart-basics',         description: "Google's language for cross-platform development.",               difficulty: 'BEGINNER',      xpReward: 500,  duration: 90,  categorySlug: 'dart',        order: 1 },
  { title: 'Flutter Development',            slug: 'dart-flutter',        description: 'Build iOS and Android apps from one codebase.',                   difficulty: 'INTERMEDIATE',  xpReward: 800,  duration: 160, categorySlug: 'dart',        order: 2 },
  // ── Bash ──────────────────────────────────────────────
  { title: 'Bash Scripting Basics',          slug: 'bash-basics',         description: 'Automate Linux tasks — scripts that do the work for you.',       difficulty: 'BEGINNER',      xpReward: 400,  duration: 80,  categorySlug: 'bash',        order: 1 },
  { title: 'Advanced Shell Scripting',       slug: 'bash-advanced',       description: 'Pipelines, process management, and pro-level shell techniques.', difficulty: 'ADVANCED',      xpReward: 700,  duration: 100, categorySlug: 'bash',        order: 2 },
  // ── SQL ───────────────────────────────────────────────
  { title: 'SQL Fundamentals',               slug: 'sql-fundamentals',    description: 'Query databases like a pro — SELECT, JOIN, GROUP BY and more.',  difficulty: 'BEGINNER',      xpReward: 500,  duration: 100, categorySlug: 'sql',         order: 1 },
  { title: 'Advanced SQL',                   slug: 'sql-advanced',        description: 'Window functions, CTEs, indexes, query optimization.',            difficulty: 'ADVANCED',      xpReward: 800,  duration: 120, categorySlug: 'sql',         order: 2 },
  { title: 'PostgreSQL Mastery',             slug: 'sql-postgres',        description: 'Production PostgreSQL — performance, security, administration.',  difficulty: 'ADVANCED',      xpReward: 850,  duration: 130, categorySlug: 'sql',         order: 3 },
  // ── R ─────────────────────────────────────────────────
  { title: 'R for Data Analysis',            slug: 'r-data-analysis',     description: 'Statistical computing and data visualization with R.',            difficulty: 'INTERMEDIATE',  xpReward: 600,  duration: 110, categorySlug: 'r-lang',      order: 1 },
  // ── Scala ─────────────────────────────────────────────
  { title: 'Scala Fundamentals',             slug: 'scala-fundamentals',  description: 'Functional programming on the JVM — powerful and elegant.',      difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 130, categorySlug: 'scala',       order: 1 },
  // ── Web Development ───────────────────────────────────
  { title: 'HTML & CSS Basics',              slug: 'html-css-basics',     description: 'Your first step to building websites — structure and style.',     difficulty: 'BEGINNER',      xpReward: 400,  duration: 80,  categorySlug: 'web-dev',     order: 1 },
  { title: 'Responsive Web Design',          slug: 'responsive-design',   description: 'Build websites that look great on every screen.',                 difficulty: 'BEGINNER',      xpReward: 450,  duration: 70,  categorySlug: 'web-dev',     order: 2 },
  { title: 'React Fundamentals',             slug: 'react-fundamentals',  description: "Build interactive UIs with the world's most popular UI library.", difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 150, categorySlug: 'web-dev',     order: 3 },
  { title: 'Next.js Full Stack',             slug: 'nextjs-fullstack',    description: 'SSR, SSG, API routes — build production apps with Next.js.',     difficulty: 'ADVANCED',      xpReward: 900,  duration: 180, categorySlug: 'web-dev',     order: 4 },
  { title: 'Node.js & Express',             slug: 'nodejs-backend',      description: 'Build REST APIs with Node.js — fast and scalable.',              difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 140, categorySlug: 'web-dev',     order: 5 },
  { title: 'GraphQL APIs',                   slug: 'graphql-apis',        description: 'Build flexible, efficient APIs with GraphQL.',                    difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 120, categorySlug: 'web-dev',     order: 6 },
  { title: 'Vue.js Development',             slug: 'vuejs-dev',           description: 'The progressive JavaScript framework — simple and powerful.',     difficulty: 'INTERMEDIATE',  xpReward: 650,  duration: 130, categorySlug: 'web-dev',     order: 7 },
  { title: 'Full Stack Development',         slug: 'fullstack-dev',       description: 'Frontend + backend + database = complete web developer.',         difficulty: 'ADVANCED',      xpReward: 1000, duration: 200, categorySlug: 'web-dev',     order: 8 },
  // ── Mobile Dev ────────────────────────────────────────
  { title: 'React Native Basics',            slug: 'react-native-basics', description: 'Build iOS and Android apps with JavaScript.',                     difficulty: 'INTERMEDIATE',  xpReward: 750,  duration: 150, categorySlug: 'mobile-dev',  order: 1 },
  { title: 'Flutter & Dart',                 slug: 'flutter-dart',        description: "Google's UI toolkit for beautiful cross-platform apps.",          difficulty: 'INTERMEDIATE',  xpReward: 800,  duration: 160, categorySlug: 'mobile-dev',  order: 2 },
  // ── Data Science & ML ─────────────────────────────────
  { title: 'Data Science Fundamentals',      slug: 'ds-fundamentals',     description: 'The complete data science workflow — from raw data to insights.', difficulty: 'BEGINNER',      xpReward: 550,  duration: 120, categorySlug: 'data-science', order: 1 },
  { title: 'Machine Learning Basics',        slug: 'ml-basics',           description: 'Supervised learning, regression, classification — from scratch.', difficulty: 'INTERMEDIATE',  xpReward: 800,  duration: 180, categorySlug: 'data-science', order: 2 },
  { title: 'Deep Learning & Neural Nets',    slug: 'deep-learning',       description: 'Build neural networks with TensorFlow and PyTorch.',              difficulty: 'ADVANCED',      xpReward: 1000, duration: 200, categorySlug: 'data-science', order: 3 },
  { title: 'Natural Language Processing',    slug: 'nlp-basics',          description: 'Teach machines to understand human language.',                    difficulty: 'ADVANCED',      xpReward: 900,  duration: 170, categorySlug: 'data-science', order: 4 },
  // ── DevOps & Cloud ────────────────────────────────────
  { title: 'Linux Fundamentals',             slug: 'linux-basics',        description: 'Navigate and manage Linux systems with confidence.',              difficulty: 'BEGINNER',      xpReward: 500,  duration: 100, categorySlug: 'devops',      order: 1 },
  { title: 'Docker & Containers',            slug: 'docker-basics',       description: 'Containerize your apps — build, ship, run anywhere.',            difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 120, categorySlug: 'devops',      order: 2 },
  { title: 'Kubernetes',                     slug: 'kubernetes-basics',   description: 'Orchestrate containers at scale with Kubernetes.',                difficulty: 'ADVANCED',      xpReward: 900,  duration: 150, categorySlug: 'devops',      order: 3 },
  { title: 'CI/CD Pipelines',                slug: 'cicd-pipelines',      description: 'Automate your software delivery with GitHub Actions and more.',   difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 110, categorySlug: 'devops',      order: 4 },
  { title: 'Infrastructure as Code',         slug: 'terraform-iac',       description: 'Manage infrastructure with Terraform and Ansible.',               difficulty: 'ADVANCED',      xpReward: 850,  duration: 140, categorySlug: 'devops',      order: 5 },
  // ── Cybersecurity ─────────────────────────────────────
  { title: 'Cybersecurity Fundamentals',     slug: 'cybersec-basics',     description: 'Network security, threats, defenses — the essentials.',          difficulty: 'BEGINNER',      xpReward: 500,  duration: 100, categorySlug: 'cybersecurity', order: 1 },
  { title: 'Ethical Hacking',                slug: 'ethical-hacking',     description: 'Think like a hacker to defend like a pro.',                      difficulty: 'ADVANCED',      xpReward: 900,  duration: 180, categorySlug: 'cybersecurity', order: 2 },
  { title: 'Network Security',               slug: 'network-security',    description: 'Firewalls, VPNs, intrusion detection — complete network defense.', difficulty: 'INTERMEDIATE', xpReward: 750,  duration: 130, categorySlug: 'cybersecurity', order: 3 },
  { title: 'Web Application Security',       slug: 'web-security',        description: 'OWASP Top 10, SQL injection, XSS, CSRF — and how to fix them.',   difficulty: 'INTERMEDIATE',  xpReward: 750,  duration: 120, categorySlug: 'cybersecurity', order: 4 },
  // ── Game Dev ──────────────────────────────────────────
  { title: 'Game Dev with Unity',            slug: 'unity-basics',        description: 'Build 2D and 3D games with Unity and C#.',                       difficulty: 'BEGINNER',      xpReward: 600,  duration: 150, categorySlug: 'game-dev',    order: 1 },
  { title: 'Unreal Engine Basics',           slug: 'unreal-basics',       description: 'Create stunning games with Unreal Engine 5.',                    difficulty: 'INTERMEDIATE',  xpReward: 800,  duration: 170, categorySlug: 'game-dev',    order: 2 },
  { title: 'Game Design Principles',         slug: 'game-design',         description: 'Core mechanics, level design, player psychology.',               difficulty: 'BEGINNER',      xpReward: 500,  duration: 90,  categorySlug: 'game-dev',    order: 3 },
  // ── System Design ─────────────────────────────────────
  { title: 'System Design Basics',           slug: 'system-design-basics',description: 'Scalability, load balancing, caching — the fundamentals.',       difficulty: 'INTERMEDIATE',  xpReward: 800,  duration: 150, categorySlug: 'system-design', order: 1 },
  { title: 'Advanced System Design',         slug: 'system-design-adv',   description: 'Design Twitter, Netflix, Uber — at massive scale.',              difficulty: 'ADVANCED',      xpReward: 1000, duration: 200, categorySlug: 'system-design', order: 2 },
  { title: 'Microservices Architecture',     slug: 'microservices',       description: 'Break monoliths, build resilient distributed systems.',           difficulty: 'ADVANCED',      xpReward: 950,  duration: 180, categorySlug: 'system-design', order: 3 },
  // ── Blockchain ────────────────────────────────────────
  { title: 'Blockchain Fundamentals',        slug: 'blockchain-basics',   description: 'How blockchain works — consensus, crypto, DeFi explained.',      difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 120, categorySlug: 'blockchain',  order: 1 },
  { title: 'Solidity & Smart Contracts',     slug: 'solidity-basics',     description: 'Write and deploy smart contracts on Ethereum.',                   difficulty: 'ADVANCED',      xpReward: 900,  duration: 150, categorySlug: 'blockchain',  order: 2 },
  // ── AI & Prompt Engineering ───────────────────────────
  { title: 'Intro to AI',                    slug: 'ai-intro',            description: 'How AI works — no math degree required.',                        difficulty: 'BEGINNER',      xpReward: 400,  duration: 70,  categorySlug: 'ai-ml',       order: 1 },
  { title: 'Prompt Engineering',             slug: 'prompt-engineering',  description: 'Get 10x more from ChatGPT, Claude, and Gemini.',                 difficulty: 'BEGINNER',      xpReward: 450,  duration: 80,  categorySlug: 'ai-ml',       order: 2 },
  { title: 'Build AI Apps',                  slug: 'ai-apps',             description: 'Integrate OpenAI, Claude, Gemini APIs into real products.',      difficulty: 'INTERMEDIATE',  xpReward: 750,  duration: 140, categorySlug: 'ai-ml',       order: 3 },
  { title: 'LLMs & Fine-tuning',             slug: 'llm-fine-tuning',     description: 'Understand and fine-tune large language models.',                 difficulty: 'ADVANCED',      xpReward: 950,  duration: 180, categorySlug: 'ai-ml',       order: 4 },
  // ── DSA ───────────────────────────────────────────────
  { title: 'Data Structures Basics',         slug: 'dsa-basics',          description: 'Arrays, linked lists, stacks, queues — the building blocks.',    difficulty: 'BEGINNER',      xpReward: 600,  duration: 130, categorySlug: 'dsa',         order: 1 },
  { title: 'Algorithms & Complexity',        slug: 'dsa-algorithms',      description: 'Sorting, searching, Big O — master algorithmic thinking.',       difficulty: 'INTERMEDIATE',  xpReward: 800,  duration: 160, categorySlug: 'dsa',         order: 2 },
  { title: 'Advanced DSA',                   slug: 'dsa-advanced',        description: 'Trees, graphs, dynamic programming — crack FAANG interviews.',   difficulty: 'ADVANCED',      xpReward: 1000, duration: 200, categorySlug: 'dsa',         order: 3 },
  { title: 'Competitive Programming',        slug: 'competitive-prog',    description: 'From Codeforces beginner to Div. 2 specialist.',                 difficulty: 'ADVANCED',      xpReward: 1000, duration: 200, categorySlug: 'dsa',         order: 4 },
  // ── Cloud Computing ───────────────────────────────────
  { title: 'Cloud Computing Basics',         slug: 'cloud-basics',        description: 'IaaS, PaaS, SaaS — how the cloud actually works.',               difficulty: 'BEGINNER',      xpReward: 500,  duration: 90,  categorySlug: 'cloud',       order: 1 },
  { title: 'AWS Cloud Essentials',           slug: 'aws-essentials',      description: 'EC2, S3, Lambda — deploy and scale on Amazon Web Services.',     difficulty: 'INTERMEDIATE',  xpReward: 800,  duration: 150, categorySlug: 'cloud',       order: 2 },
  { title: 'AWS Solutions Architect',        slug: 'aws-architect',       description: 'Design resilient, high-availability systems on AWS.',             difficulty: 'ADVANCED',      xpReward: 1000, duration: 200, categorySlug: 'cloud',       order: 3 },
  { title: 'Google Cloud Platform',          slug: 'gcp-essentials',      description: 'GCP core services — Compute, Storage, BigQuery.',                difficulty: 'INTERMEDIATE',  xpReward: 800,  duration: 150, categorySlug: 'cloud',       order: 4 },
  { title: 'Azure Fundamentals',             slug: 'azure-fundamentals',  description: 'AZ-900 prep — Microsoft Azure from scratch.',                    difficulty: 'BEGINNER',      xpReward: 600,  duration: 110, categorySlug: 'cloud',       order: 5 },
  // ── Digital Marketing ─────────────────────────────────
  { title: 'Digital Marketing Basics',       slug: 'digital-mkt-basics',  description: 'SEO, SEM, social media — the complete digital toolkit.',         difficulty: 'BEGINNER',      xpReward: 450,  duration: 90,  categorySlug: 'digital-marketing', order: 1 },
  { title: 'Google Ads Mastery',             slug: 'google-ads',          description: 'Run profitable Google Search and Display campaigns.',             difficulty: 'INTERMEDIATE',  xpReward: 650,  duration: 120, categorySlug: 'digital-marketing', order: 2 },
  { title: 'Meta Ads & Facebook Marketing', slug: 'meta-ads',            description: 'Target, convert, scale with Facebook and Instagram ads.',         difficulty: 'INTERMEDIATE',  xpReward: 650,  duration: 110, categorySlug: 'digital-marketing', order: 3 },
  { title: 'SEO Fundamentals',               slug: 'seo-fundamentals',    description: 'Rank on Google — on-page, off-page, technical SEO.',             difficulty: 'BEGINNER',      xpReward: 500,  duration: 90,  categorySlug: 'digital-marketing', order: 4 },
  { title: 'Content Marketing',              slug: 'content-marketing',   description: 'Create content that attracts, converts, and retains.',            difficulty: 'BEGINNER',      xpReward: 450,  duration: 80,  categorySlug: 'digital-marketing', order: 5 },
  { title: 'Email Marketing',                slug: 'email-marketing',     description: 'Build lists, write emails, drive revenue.',                      difficulty: 'BEGINNER',      xpReward: 400,  duration: 70,  categorySlug: 'digital-marketing', order: 6 },
  // ── UI/UX ─────────────────────────────────────────────
  { title: 'UI/UX Design Fundamentals',      slug: 'uiux-fundamentals',   description: 'Design thinking, user research, wireframing — from scratch.',    difficulty: 'BEGINNER',      xpReward: 500,  duration: 100, categorySlug: 'ui-ux',       order: 1 },
  { title: 'Figma Mastery',                  slug: 'figma-mastery',       description: 'Go from blank canvas to pixel-perfect product designs.',          difficulty: 'INTERMEDIATE',  xpReward: 650,  duration: 120, categorySlug: 'ui-ux',       order: 2 },
  { title: 'User Research Methods',          slug: 'user-research',       description: 'Interviews, surveys, usability testing — know your users.',       difficulty: 'INTERMEDIATE',  xpReward: 600,  duration: 100, categorySlug: 'ui-ux',       order: 3 },
  // ── Product Management ────────────────────────────────
  { title: 'Product Management Basics',      slug: 'pm-basics',           description: 'Discovery, roadmaps, prioritization — the PM playbook.',         difficulty: 'BEGINNER',      xpReward: 500,  duration: 100, categorySlug: 'product-mgmt', order: 1 },
  { title: 'Agile & Scrum',                  slug: 'agile-scrum',         description: 'Ship faster with Agile methodologies and Scrum framework.',       difficulty: 'BEGINNER',      xpReward: 450,  duration: 80,  categorySlug: 'product-mgmt', order: 2 },
  { title: 'Product Analytics',             slug: 'product-analytics',   description: 'Data-driven decisions — metrics, funnels, retention analysis.',   difficulty: 'INTERMEDIATE',  xpReward: 650,  duration: 110, categorySlug: 'product-mgmt', order: 3 },
  // ── Interview Prep ────────────────────────────────────
  { title: 'Coding Interview Prep',          slug: 'coding-interview',    description: 'LeetCode patterns, problem-solving strategies, mock interviews.', difficulty: 'INTERMEDIATE',  xpReward: 800,  duration: 160, categorySlug: 'interview-prep', order: 1 },
  { title: 'System Design Interview',        slug: 'sd-interview',        description: "Ace system design rounds at FAANG and top startups.",             difficulty: 'ADVANCED',      xpReward: 900,  duration: 150, categorySlug: 'interview-prep', order: 2 },
  { title: 'Behavioral Interview',           slug: 'behavioral-interview',description: 'STAR method, common questions, storytelling for tech jobs.',      difficulty: 'BEGINNER',      xpReward: 400,  duration: 60,  categorySlug: 'interview-prep', order: 3 },
  { title: 'Resume & LinkedIn',              slug: 'resume-linkedin',     description: 'Stand out — write a resume that gets you interviews.',            difficulty: 'BEGINNER',      xpReward: 350,  duration: 50,  categorySlug: 'interview-prep', order: 4 },
  // ── IT Support ────────────────────────────────────────
  { title: 'IT Support Fundamentals',        slug: 'it-support-basics',   description: 'Google IT Support curriculum — networking, OS, security.',       difficulty: 'BEGINNER',      xpReward: 500,  duration: 120, categorySlug: 'it-support',  order: 1 },
  { title: 'Networking Basics',              slug: 'networking-basics',   description: 'TCP/IP, DNS, HTTP — how the internet actually works.',            difficulty: 'BEGINNER',      xpReward: 500,  duration: 100, categorySlug: 'it-support',  order: 2 },
  { title: 'Operating Systems',              slug: 'os-basics',           description: 'Processes, memory, file systems — OS internals explained.',       difficulty: 'INTERMEDIATE',  xpReward: 650,  duration: 120, categorySlug: 'it-support',  order: 3 },
  // ── Data Analytics ────────────────────────────────────
  { title: 'Data Analytics Basics',          slug: 'analytics-basics',    description: 'Google Data Analytics curriculum — collect, clean, analyze.',    difficulty: 'BEGINNER',      xpReward: 500,  duration: 110, categorySlug: 'data-analytics', order: 1 },
  { title: 'Power BI',                       slug: 'power-bi',            description: 'Microsoft Power BI — build dashboards that drive decisions.',     difficulty: 'INTERMEDIATE',  xpReward: 650,  duration: 120, categorySlug: 'data-analytics', order: 2 },
  { title: 'Tableau',                        slug: 'tableau-basics',      description: 'Data visualization that tells stories.',                          difficulty: 'INTERMEDIATE',  xpReward: 650,  duration: 110, categorySlug: 'data-analytics', order: 3 },
  { title: 'Excel for Data Analysis',        slug: 'excel-data',          description: 'Pivot tables, VLOOKUP, Power Query — Excel like a data analyst.', difficulty: 'BEGINNER',      xpReward: 450,  duration: 80,  categorySlug: 'data-analytics', order: 4 },
  // ── Project Management ────────────────────────────────
  { title: 'Project Management Basics',      slug: 'pm-google',           description: 'Google PM curriculum — initiate, plan, execute, close.',         difficulty: 'BEGINNER',      xpReward: 500,  duration: 100, categorySlug: 'project-mgmt', order: 1 },
  { title: 'PMP Exam Prep',                  slug: 'pmp-prep',            description: 'Prepare for the Project Management Professional certification.',   difficulty: 'ADVANCED',      xpReward: 800,  duration: 150, categorySlug: 'project-mgmt', order: 2 },
  // ── Azure & Microsoft ─────────────────────────────────
  { title: 'Azure Fundamentals (AZ-900)',    slug: 'az-900',              description: 'Microsoft Azure from zero — cloud concepts, core services.',     difficulty: 'BEGINNER',      xpReward: 600,  duration: 110, categorySlug: 'azure',       order: 1 },
  { title: 'Azure Developer (AZ-204)',       slug: 'az-204',              description: 'Build Azure apps — Functions, Storage, Cosmos DB.',               difficulty: 'ADVANCED',      xpReward: 900,  duration: 170, categorySlug: 'azure',       order: 2 },
  { title: 'Microsoft Power Platform',       slug: 'ms-power-platform',   description: 'Power Apps, Power Automate — no-code automation for business.',  difficulty: 'BEGINNER',      xpReward: 500,  duration: 90,  categorySlug: 'azure',       order: 3 },
  { title: 'GitHub Foundations',             slug: 'github-foundations',  description: 'Git, GitHub, collaboration — essential for every developer.',     difficulty: 'BEGINNER',      xpReward: 450,  duration: 80,  categorySlug: 'azure',       order: 4 },
  // ── Android Dev ───────────────────────────────────────
  { title: 'Android Development Basics',     slug: 'android-basics',      description: 'Activities, layouts, intents — build your first Android app.',   difficulty: 'BEGINNER',      xpReward: 600,  duration: 140, categorySlug: 'android',     order: 1 },
  { title: 'Android Jetpack Compose',        slug: 'android-compose',     description: "Google's modern UI toolkit for Android — declarative and fast.",  difficulty: 'INTERMEDIATE',  xpReward: 800,  duration: 160, categorySlug: 'android',     order: 2 },
  // ── API Development ───────────────────────────────────
  { title: 'REST API Design',                slug: 'rest-api-design',     description: 'Design APIs developers love — principles, patterns, best practices.', difficulty: 'INTERMEDIATE', xpReward: 650, duration: 100, categorySlug: 'api-dev', order: 1 },
  { title: 'API Security',                   slug: 'api-security',        description: 'Auth, rate limiting, OWASP API Top 10 — secure your APIs.',       difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 110, categorySlug: 'api-dev',     order: 2 },
  // ── Testing & QA ──────────────────────────────────────
  { title: 'Software Testing Basics',        slug: 'testing-basics',      description: 'Unit, integration, E2E testing — ship with confidence.',         difficulty: 'BEGINNER',      xpReward: 500,  duration: 90,  categorySlug: 'testing',     order: 1 },
  { title: 'Selenium & Test Automation',     slug: 'selenium-automation', description: 'Automate browser testing with Selenium and Playwright.',          difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 120, categorySlug: 'testing',     order: 2 },
  // ── CS Fundamentals ───────────────────────────────────
  { title: 'Computer Science Basics',        slug: 'cs-basics',           description: 'How computers work — from transistors to software.',              difficulty: 'BEGINNER',      xpReward: 500,  duration: 100, categorySlug: 'cs-fundamentals', order: 1 },
  { title: 'Operating System Concepts',      slug: 'os-concepts',         description: 'Processes, threads, memory management, file systems.',            difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 130, categorySlug: 'cs-fundamentals', order: 2 },
  { title: 'Computer Networks',              slug: 'computer-networks',   description: 'OSI model, TCP/IP, HTTP, DNS — networking from first principles.', difficulty: 'INTERMEDIATE',  xpReward: 700,  duration: 130, categorySlug: 'cs-fundamentals', order: 3 },
  { title: 'Open Source Contribution',       slug: 'open-source-contrib', description: 'Git workflow, PRs, issues — your first open source contribution.', difficulty: 'BEGINNER',     xpReward: 500,  duration: 80,  categorySlug: 'open-source', order: 1 },
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
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: { ...data, categoryId: category.id, isPublished: true },
      create: { ...data, categoryId: category.id, isPublished: true },
    });
    count++;
  }
  console.log(`✅ ${count} courses seeded`);
  console.log('🎉 Done!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
