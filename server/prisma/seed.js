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
  { name: 'R', slug: 'r', description: 'Statistical computing', iconName: 'r', order: 103 },
  { name: 'Julia', slug: 'julia', description: 'High-performance science', iconName: 'julia', order: 104 },
  { name: 'Scala', slug: 'scala', description: 'Functional & Object-Oriented', iconName: 'scala', order: 105 },
  { name: 'Elixir', slug: 'elixir', description: 'Reliable, scalable, concurrent', iconName: 'elixir', order: 106 },
  { name: 'Haskell', slug: 'haskell', description: 'Purely functional', iconName: 'haskell', order: 107 },
  { name: 'Lua', slug: 'lua', description: 'Embedded scripting', iconName: 'lua', order: 108 },
  { name: 'Perl', slug: 'perl', description: 'The Swiss Army knife', iconName: 'perl', order: 109 },
  { name: 'Fortran', slug: 'fortran', description: 'High-performance engineering', iconName: 'fortran', order: 110 },
  { name: 'COBOL', slug: 'cobol', description: 'Business critical legacy', iconName: 'cobol', order: 111 },
  { name: 'Clojure', slug: 'clojure', description: 'Modern Lisp on the JVM', iconName: 'clojure', order: 112 },
  { name: 'Erlang', slug: 'erlang', description: 'Massive concurrency', iconName: 'erlang', order: 113 },
  { name: 'Prolog', slug: 'prolog', description: 'Logic programming', iconName: 'prolog', order: 114 },
  { name: 'F#', slug: 'fsharp', description: 'Functional-first .NET', iconName: 'fsharp', order: 115 },
  { name: 'OCaml', slug: 'ocaml', description: 'Speed and safety', iconName: 'ocaml', order: 116 },
  // Domain Architectures (100+)
  { name: 'Web Development', slug: 'web-dev', description: 'Build the modern web', iconName: 'web', order: 19 },
  { name: 'Data Science & ML', slug: 'data-science', description: 'Turn data into insights', iconName: 'data', order: 20 },
  { name: 'DevOps & Cloud', slug: 'devops', description: 'Ship faster, scale better', iconName: 'devops', order: 21 },
  { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Protect the digital world', iconName: 'security', order: 22 },
  { name: 'Game Development', slug: 'game-dev', description: 'Build games people love', iconName: 'game', order: 23 },
  { name: 'System Design', slug: 'system-design', description: 'Architect scalable systems', iconName: 'system', order: 24 },
  { name: 'Blockchain', slug: 'blockchain', description: 'Decentralized future', iconName: 'blockchain', order: 25 },
  { name: 'AI & Prompt Engineering', slug: 'ai-ml', description: 'Build with AI', iconName: 'ai', order: 26 },
  { name: 'Microservices Architecture', slug: 'microservices', description: 'Scale with small services', iconName: 'system', order: 27 },
  { name: 'Event-Driven Architecture', slug: 'event-driven', description: 'React to real-time events', iconName: 'zap', order: 28 },
  { name: 'Serverless Computing', slug: 'serverless', description: 'Focus on code, not servers', iconName: 'cloud', order: 29 },
  { name: 'Edge Computing', slug: 'edge-computing', description: 'Compute closer to users', iconName: 'globe', order: 30 },
  { name: 'Cloud-Native Development', slug: 'cloud-native', description: 'Built for the cloud', iconName: 'cloud', order: 31 },
  { name: 'RESTful API Design', slug: 'rest-api', description: 'Design clean APIs', iconName: 'code', order: 32 },
  { name: 'GraphQL Architecture', slug: 'graphql', description: 'Modern data fetching', iconName: 'code', order: 33 },
  { name: 'gRPC & Protobuf', slug: 'grpc', description: 'High-performance RPC', iconName: 'zap', order: 34 },
  { name: 'Message Queues', slug: 'message-queues', description: 'Async communication', iconName: 'system', order: 35 },
  { name: 'Database Sharding', slug: 'db-sharding', description: 'Scale your data', iconName: 'database', order: 36 },
  { name: 'CDN Strategies', slug: 'cdn-strategies', description: 'Deliver content fast', iconName: 'globe', order: 37 },
  { name: 'Infrastructure as Code', slug: 'iac', description: 'Terraform & Ansible', iconName: 'settings', order: 38 },
  { name: 'Kubernetes Orchestration', slug: 'kubernetes', description: 'Manage containers at scale', iconName: 'devops', order: 39 },
  { name: 'Docker Containerization', slug: 'docker', description: 'Standardize environments', iconName: 'box', order: 40 },
  { name: 'Redis Caching Patterns', slug: 'redis-cache', description: 'Boost performance', iconName: 'zap', order: 41 },
  { name: 'Elasticsearch Mastery', slug: 'elasticsearch', description: 'Powerful search engines', iconName: 'search', order: 42 },
  { name: 'WebSockets & Real-time', slug: 'websockets', description: 'Live communication', iconName: 'zap', order: 43 },
  { name: 'Zero Trust Architecture', slug: 'zero-trust', description: 'Never trust, always verify', iconName: 'shield', order: 44 },
  { name: 'Penetration Testing', slug: 'pentesting', description: 'Ethical hacking basics', iconName: 'shield', order: 45 },
  { name: 'Bioinformatics', slug: 'bioinformatics', description: 'Biology meet CS', iconName: 'dna', order: 46 },
  { name: 'Computational Finance', slug: 'comp-finance', description: 'Algorithms in finance', iconName: 'trending-up', order: 47 },
  { name: 'Autonomous Vehicles', slug: 'autonomous-vehicles', description: 'Code for self-driving', iconName: 'target', order: 48 },
  { name: 'Robotics & ROS', slug: 'robotics', description: 'Build robot brains', iconName: 'settings', order: 49 },
  { name: 'Embedded Systems', slug: 'embedded', description: 'Hardware level coding', iconName: 'cpu', order: 50 },
  { name: 'RTOS Design', slug: 'rtos', description: 'Real-time operating systems', iconName: 'cpu', order: 51 },
  { name: 'FPGA & Verilog', slug: 'fpga', description: 'Programmable hardware', iconName: 'cpu', order: 52 },
  { name: 'Quantum Algorithms', slug: 'quantum', description: 'Computing with qubits', iconName: 'zap', order: 53 },
  { name: 'AR/VR/XR Development', slug: 'ar-vr', description: 'Virtual worlds', iconName: 'play', order: 54 },
  { name: 'Smart Contract Auditing', slug: 'smart-contracts', description: 'Secure the blockchain', iconName: 'shield', order: 55 },
  { name: 'DeFi Protocols', slug: 'defi', description: 'Decentralized finance', iconName: 'blockchain', order: 56 },
  { name: 'NFT Marketplaces', slug: 'nft-tech', description: 'Digital ownership mechanics', iconName: 'blockchain', order: 57 },
  { name: 'Clean Architecture', slug: 'clean-arch', description: 'Robust software design', iconName: 'book', order: 58 },
  { name: 'Domain-Driven Design', slug: 'ddd', description: 'Master complex domains', iconName: 'book', order: 59 },
  { name: 'SRE Practices', slug: 'sre', description: 'Reliability at scale', iconName: 'settings', order: 60 },
  { name: 'MLOps Architectures', slug: 'mlops', description: 'Production AI pipelines', iconName: 'ai', order: 61 },
  { name: 'Data Engineering', slug: 'data-engineering', description: 'ETL and data lakes', iconName: 'data', order: 62 },
  { name: 'Vector Databases', slug: 'vector-db', description: 'RAG and AI memory', iconName: 'database', order: 63 },
  { name: 'Audio Engineering', slug: 'audio-tech', description: 'Digital signal processing', iconName: 'music', order: 64 },
  { name: 'High-Frequency Trading', slug: 'hft', description: 'Millisecond speed systems', iconName: 'zap', order: 65 },
  { name: '6G Wireless Networks', slug: 'wireless-next', description: 'The future of connectivity', iconName: 'globe', order: 66 },
  { name: 'Cyber-Physical Systems', slug: 'cps', description: 'Digital-Physical integration', iconName: 'settings', order: 67 },
  { name: 'GovTech Infrastructure', slug: 'govtech', description: 'Digital public goods', iconName: 'shield', order: 68 },
  { name: 'Carbon Tracking Tech', slug: 'sustaintech', description: 'Tech for sustainability', iconName: 'leaf', order: 69 },
  { name: 'EdTech Architectures', slug: 'edtech', description: 'Scale learning platforms', iconName: 'book', order: 70 },
  { name: 'Metaverse Engineering', slug: 'metaverse', description: 'Digital world foundations', iconName: 'play', order: 71 },
  { name: 'Private Blockchains', slug: 'private-bc', description: 'Enterprise ledger tech', iconName: 'blockchain', order: 72 },
  { name: 'P2P Netorking', slug: 'p2p', description: 'Decentralized networking', iconName: 'globe', order: 73 },
  { name: 'Distributed Hash Tables', slug: 'dht', description: 'Storage at scale', iconName: 'database', order: 74 },
  { name: 'CRDTs & Synergy', slug: 'crdts', description: 'Collaborative architectures', iconName: 'zap', order: 75 },
  { name: 'Onion Architecture', slug: 'onion-arch', description: 'Layered design patterns', iconName: 'book', order: 76 },
  { name: 'Hexagonal Design', slug: 'hexagonal', description: 'Ports and adapters', iconName: 'book', order: 77 },
  { name: 'SaaS Multi-tenancy', slug: 'multi-tenant', description: 'Build enterprise SaaS', iconName: 'system', order: 78 },
  { name: 'Fintech Security', slug: 'fintech-sec', description: 'Secure financial data', iconName: 'shield', order: 79 },
  { name: 'SpaceTech & Orbitals', slug: 'spacetech', description: 'Software for satellites', iconName: 'target', order: 80 },
  { name: 'Digital Twin Systems', slug: 'digital-twins', description: 'Simulate the real world', iconName: 'settings', order: 81 },
  { name: 'Quantum Cryptography', slug: 'quantum-sec', description: 'Post-quantum security', iconName: 'shield', order: 82 },
  { name: 'Web3 Identity (DID)', slug: 'did', description: 'Decentralized identity', iconName: 'blockchain', order: 83 },
  { name: 'Graph Data Mastery', slug: 'graph-db', description: 'Understand relationships', iconName: 'database', order: 84 },
  { name: 'Time-Series Analysis', slug: 'timeseries-db', description: 'Master temporal data', iconName: 'trending-up', order: 85 },
  { name: 'Semantic Search', slug: 'semantic-search', description: 'AI powered indexing', iconName: 'search', order: 86 },
  { name: 'Ray Tracing Tech', slug: 'raytracing', description: 'Graphics architecture', iconName: 'play', order: 87 },
  { name: 'Low-Latency Streaming', slug: 'streaming-tech', description: 'Video at speed', iconName: 'play', order: 88 },
  { name: 'E-commerce Scaling', slug: 'ecom-scale', description: 'Handle millions of carts', iconName: 'system', order: 89 },
  { name: 'Heathcare HL7/FHIR', slug: 'healthtech', description: 'Digital health standards', iconName: 'shield', order: 90 },
  { name: 'Functional Programming', slug: 'functional', description: 'Immutability and purity', iconName: 'code', order: 91 },
  { name: 'Reactive Programming', slug: 'reactive', description: 'Streams and signals', iconName: 'zap', order: 92 },
  { name: 'Compiler Design', slug: 'compilers', description: 'Build your own language', iconName: 'code', order: 93 },
  { name: 'OS Internals', slug: 'os-internals', description: 'Kernel and memory', iconName: 'cpu', order: 94 },
  { name: 'Network Protocols', slug: 'networking', description: 'TCP/IP and BGP', iconName: 'globe', order: 95 },
  { name: 'Distributed Systems', slug: 'distributed', description: 'Scale across nodes', iconName: 'system', order: 96 },
  { name: 'Observability & APM', slug: 'observability', description: 'Trace and monitor', iconName: 'search', order: 97 },
  { name: 'Identity Management', slug: 'iam', description: 'Auth at scale', iconName: 'shield', order: 98 },
  { name: 'Content Strategy Tech', slug: 'content-tech', description: 'Headless CMS design', iconName: 'book', order: 99 },
  { name: 'LegalTech Automation', slug: 'legaltech', description: 'Smart legal systems', iconName: 'shield', order: 100 },
  { name: 'Agile Engineering', slug: 'agile-eng', description: 'Dev workflow excellence', iconName: 'settings', order: 101 },
  { name: 'High-Availability', slug: 'high-availability', description: 'Zero downtime systems', iconName: 'zap', order: 102 },
];

const COURSES = [
  // ── JavaScript ─────────────────────────────────────────
  { title: 'JavaScript: Zero to Hero', slug: 'javascript-beginner', description: 'Start from absolute scratch. Learn variables, loops, arrays, and basic logic.', difficulty: 'BEGINNER', xpReward: 500, duration: 120, categorySlug: 'javascript', order: 1 },
  { title: 'JavaScript: Data & DOM', slug: 'javascript-intermediate', description: 'Master DOM manipulation, events, asynchronous code, and external APIs.', difficulty: 'INTERMEDIATE', xpReward: 750, duration: 180, categorySlug: 'javascript', order: 2 },
  { title: 'JavaScript: Advanced Architect', slug: 'javascript-advanced', description: 'Deep dive into closures, prototypes, event loops, and robust design patterns.', difficulty: 'ADVANCED', xpReward: 1000, duration: 240, categorySlug: 'javascript', order: 3 },
  // ── TypeScript ──────────────────────────────────────────
  { title: 'TypeScript: Zero to Hero', slug: 'typescript-beginner', description: 'Learn TypeScript from scratch — types, interfaces, and type safety fundamentals.', difficulty: 'BEGINNER', xpReward: 500, duration: 120, categorySlug: 'typescript', order: 1 },
  { title: 'TypeScript: Generics & Patterns', slug: 'typescript-intermediate', description: 'Master generics, utility types, mapped types, and advanced type inference.', difficulty: 'INTERMEDIATE', xpReward: 750, duration: 180, categorySlug: 'typescript', order: 2 },
  { title: 'TypeScript: Advanced Architect', slug: 'typescript-advanced', description: 'Conditional types, template literals, decorators, and enterprise-scale architecture.', difficulty: 'ADVANCED', xpReward: 1000, duration: 240, categorySlug: 'typescript', order: 3 },
  // ── Python ─────────────────────────────────────────────
  { title: 'Python: Zero to Hero', slug: 'python-beginner', description: 'No prior coding needed. Master print, variables, conditions, and basic logic.', difficulty: 'BEGINNER', xpReward: 500, duration: 120, categorySlug: 'python', order: 1 },
  { title: 'Python: Data Structures', slug: 'python-intermediate', description: 'Lists, dictionaries, tuples, sets, and functional programming concepts.', difficulty: 'INTERMEDIATE', xpReward: 750, duration: 180, categorySlug: 'python', order: 2 },
  { title: 'Python: Advanced Architect', slug: 'python-advanced', description: 'OOP, decorators, generators, async Python, and metaprogramming.', difficulty: 'ADVANCED', xpReward: 1000, duration: 240, categorySlug: 'python', order: 3 },
  // ── HTML ────────────────────────────────────────────────
  { title: 'HTML: Zero to Hero', slug: 'html-beginner', description: 'Learn the building blocks of every website. Start coding your first webpage.', difficulty: 'BEGINNER', xpReward: 300, duration: 60, categorySlug: 'html', order: 1 },
  { title: 'HTML: Semantic Web', slug: 'html-intermediate', description: 'Master semantic tags, accessibility (a11y), and forms.', difficulty: 'INTERMEDIATE', xpReward: 500, duration: 90, categorySlug: 'html', order: 2 },
  { title: 'HTML: Advanced SEO & Meta', slug: 'html-advanced', description: 'Deep dive into SEO, meta tags, Open Graph, and performance optimization.', difficulty: 'ADVANCED', xpReward: 700, duration: 120, categorySlug: 'html', order: 3 },
  // ── CSS ─────────────────────────────────────────────────
  { title: 'CSS: Zero to Hero', slug: 'css-beginner', description: 'Style HTML pages with colors, fonts, margins, and borders.', difficulty: 'BEGINNER', xpReward: 300, duration: 80, categorySlug: 'css', order: 1 },
  { title: 'CSS: Flexbox & Grid Mastery', slug: 'css-intermediate', description: 'Master modern layouts natively with Flexbox and CSS Grid.', difficulty: 'INTERMEDIATE', xpReward: 600, duration: 150, categorySlug: 'css', order: 2 },
  { title: 'CSS: UI/UX Animations', slug: 'css-advanced', description: 'Create stunning 3D transforms, keyframe animations, and responsive architectures.', difficulty: 'ADVANCED', xpReward: 900, duration: 200, categorySlug: 'css', order: 3 },
  // ── Java ────────────────────────────────────────────────
  { title: 'Java: Zero to Hero', slug: 'java-beginner', description: 'Start your enterprise journey. Learn Java syntax, types, and basic loops.', difficulty: 'BEGINNER', xpReward: 500, duration: 140, categorySlug: 'java', order: 1 },
  { title: 'Java: Object Oriented Mastery', slug: 'java-intermediate', description: 'Classes, Objects, Inheritance, Polymorphism, and Interfaces.', difficulty: 'INTERMEDIATE', xpReward: 800, duration: 200, categorySlug: 'java', order: 2 },
  { title: 'Java: Advanced Architect', slug: 'java-advanced', description: 'Generics, Collections, Streams API, and multithreading.', difficulty: 'ADVANCED', xpReward: 1100, duration: 260, categorySlug: 'java', order: 3 },
  // ── C++ ─────────────────────────────────────────────────
  { title: 'C++: Zero to Hero', slug: 'cpp-beginner', description: 'Learn the core of high-performance coding. Syntax, variables, loops.', difficulty: 'BEGINNER', xpReward: 500, duration: 140, categorySlug: 'cpp', order: 1 },
  { title: 'C++: Pointers & Memory', slug: 'cpp-intermediate', description: 'Master manual memory management, pointers, and references.', difficulty: 'INTERMEDIATE', xpReward: 800, duration: 200, categorySlug: 'cpp', order: 2 },
  { title: 'C++: Advanced Architect', slug: 'cpp-advanced', description: 'STL, algorithms, and advanced OOP features.', difficulty: 'ADVANCED', xpReward: 1200, duration: 300, categorySlug: 'cpp', order: 3 },
  // ── C ───────────────────────────────────────────────────
  { title: 'C: Zero to Hero', slug: 'c-beginner', description: 'The foundation of computing. Learn syntax, data types, and control flow.', difficulty: 'BEGINNER', xpReward: 500, duration: 140, categorySlug: 'c', order: 1 },
  { title: 'C: Pointers & Structs', slug: 'c-intermediate', description: 'Master pointers, memory allocation, structs, and file I/O.', difficulty: 'INTERMEDIATE', xpReward: 800, duration: 200, categorySlug: 'c', order: 2 },
  { title: 'C: Systems Programming', slug: 'c-advanced', description: 'Build system-level software, understand OS internals, and network sockets.', difficulty: 'ADVANCED', xpReward: 1200, duration: 280, categorySlug: 'c', order: 3 },
  // ── C# ──────────────────────────────────────────────────
  { title: 'C#: Zero to Hero', slug: 'csharp-beginner', description: 'Microsoft\'s modern language. Learn syntax, types, and basic OOP.', difficulty: 'BEGINNER', xpReward: 500, duration: 130, categorySlug: 'csharp', order: 1 },
  { title: 'C#: LINQ & Async', slug: 'csharp-intermediate', description: 'Master LINQ, async/await, delegates, and events.', difficulty: 'INTERMEDIATE', xpReward: 800, duration: 200, categorySlug: 'csharp', order: 2 },
  { title: 'C#: .NET Architecture', slug: 'csharp-advanced', description: 'Build production .NET apps with dependency injection, EF Core, and APIs.', difficulty: 'ADVANCED', xpReward: 1100, duration: 260, categorySlug: 'csharp', order: 3 },
  // ── Go ──────────────────────────────────────────────────
  { title: 'Go: Zero to Hero', slug: 'go-beginner', description: 'Learn Go from scratch — goroutines, channels, and simple concurrency.', difficulty: 'BEGINNER', xpReward: 500, duration: 120, categorySlug: 'go', order: 1 },
  { title: 'Go: Concurrency Mastery', slug: 'go-intermediate', description: 'Advanced goroutines, mutexes, WaitGroups, and real-world patterns.', difficulty: 'INTERMEDIATE', xpReward: 800, duration: 180, categorySlug: 'go', order: 2 },
  { title: 'Go: Microservices Architect', slug: 'go-advanced', description: 'Build production microservices with gRPC, Docker, and cloud-native Go.', difficulty: 'ADVANCED', xpReward: 1200, duration: 280, categorySlug: 'go', order: 3 },
  // ── Rust ────────────────────────────────────────────────
  { title: 'Rust: Zero to Hero', slug: 'rust-beginner', description: 'Learn ownership, borrowing, and memory safety from the ground up.', difficulty: 'BEGINNER', xpReward: 600, duration: 150, categorySlug: 'rust', order: 1 },
  { title: 'Rust: Lifetimes & Traits', slug: 'rust-intermediate', description: 'Master lifetimes, trait bounds, enums, and pattern matching.', difficulty: 'INTERMEDIATE', xpReward: 900, duration: 220, categorySlug: 'rust', order: 2 },
  { title: 'Rust: Systems Architect', slug: 'rust-advanced', description: 'Async Rust, unsafe code, FFI, and building high-performance systems.', difficulty: 'ADVANCED', xpReward: 1300, duration: 300, categorySlug: 'rust', order: 3 },
  // ── Kotlin ──────────────────────────────────────────────
  { title: 'Kotlin: Zero to Hero', slug: 'kotlin-beginner', description: 'Modern Android language. Learn null safety, data classes, and lambdas.', difficulty: 'BEGINNER', xpReward: 500, duration: 120, categorySlug: 'kotlin', order: 1 },
  { title: 'Kotlin: Coroutines & Flows', slug: 'kotlin-intermediate', description: 'Master Kotlin coroutines, Flow, and Jetpack Compose basics.', difficulty: 'INTERMEDIATE', xpReward: 800, duration: 200, categorySlug: 'kotlin', order: 2 },
  { title: 'Kotlin: Android Architect', slug: 'kotlin-advanced', description: 'MVVM, Room, Retrofit, and building production Android apps.', difficulty: 'ADVANCED', xpReward: 1100, duration: 260, categorySlug: 'kotlin', order: 3 },
  // ── Swift ───────────────────────────────────────────────
  { title: 'Swift: Zero to Hero', slug: 'swift-beginner', description: 'Build Apple apps from scratch. Learn Swift basics, optionals, and closures.', difficulty: 'BEGINNER', xpReward: 500, duration: 120, categorySlug: 'swift', order: 1 },
  { title: 'Swift: UIKit & SwiftUI', slug: 'swift-intermediate', description: 'Master UIKit fundamentals and SwiftUI declarative patterns.', difficulty: 'INTERMEDIATE', xpReward: 800, duration: 200, categorySlug: 'swift', order: 2 },
  { title: 'Swift: iOS Architect', slug: 'swift-advanced', description: 'CoreData, Combine, MVVM-C, and App Store deployment.', difficulty: 'ADVANCED', xpReward: 1100, duration: 260, categorySlug: 'swift', order: 3 },
  // ── PHP ─────────────────────────────────────────────────
  { title: 'PHP: Zero to Hero', slug: 'php-beginner', description: '80% of the web runs on PHP. Learn syntax, arrays, and basic web forms.', difficulty: 'BEGINNER', xpReward: 400, duration: 100, categorySlug: 'php', order: 1 },
  { title: 'PHP: Laravel Essentials', slug: 'php-intermediate', description: 'Master the Laravel framework — routing, Eloquent ORM, middleware.', difficulty: 'INTERMEDIATE', xpReward: 700, duration: 180, categorySlug: 'php', order: 2 },
  { title: 'PHP: API & Architecture', slug: 'php-advanced', description: 'Build REST APIs, implement design patterns, and scale PHP apps.', difficulty: 'ADVANCED', xpReward: 1000, duration: 240, categorySlug: 'php', order: 3 },
  // ── Ruby ────────────────────────────────────────────────
  { title: 'Ruby: Zero to Hero', slug: 'ruby-beginner', description: 'Developer happiness first. Learn Ruby syntax, blocks, and iterators.', difficulty: 'BEGINNER', xpReward: 400, duration: 100, categorySlug: 'ruby', order: 1 },
  { title: 'Ruby: Rails Mastery', slug: 'ruby-intermediate', description: 'Master Ruby on Rails — MVC, ActiveRecord, and RESTful routes.', difficulty: 'INTERMEDIATE', xpReward: 750, duration: 180, categorySlug: 'ruby', order: 2 },
  { title: 'Ruby: Production Architect', slug: 'ruby-advanced', description: 'Background jobs, caching, testing, and scaling Rails applications.', difficulty: 'ADVANCED', xpReward: 1000, duration: 240, categorySlug: 'ruby', order: 3 },
  // ── Dart ────────────────────────────────────────────────
  { title: 'Dart: Zero to Hero', slug: 'dart-beginner', description: 'The language behind Flutter. Learn syntax, types, and async basics.', difficulty: 'BEGINNER', xpReward: 400, duration: 100, categorySlug: 'dart', order: 1 },
  { title: 'Dart: Flutter Essentials', slug: 'dart-intermediate', description: 'Build beautiful cross-platform apps with widgets, state, and navigation.', difficulty: 'INTERMEDIATE', xpReward: 750, duration: 180, categorySlug: 'dart', order: 2 },
  { title: 'Dart: Flutter Architect', slug: 'dart-advanced', description: 'Riverpod, animations, platform channels, and production deployment.', difficulty: 'ADVANCED', xpReward: 1100, duration: 260, categorySlug: 'dart', order: 3 },
  // ── Bash ────────────────────────────────────────────────
  { title: 'Bash: Zero to Hero', slug: 'bash-beginner', description: 'Automate everything. Learn shell commands, pipes, and basic scripting.', difficulty: 'BEGINNER', xpReward: 300, duration: 80, categorySlug: 'bash', order: 1 },
  { title: 'Bash: Scripting Mastery', slug: 'bash-intermediate', description: 'Functions, loops, regex, sed, awk, and process management.', difficulty: 'INTERMEDIATE', xpReward: 600, duration: 140, categorySlug: 'bash', order: 2 },
  { title: 'Bash: DevOps Automation', slug: 'bash-advanced', description: 'CI/CD scripts, cron jobs, system administration, and deployment pipelines.', difficulty: 'ADVANCED', xpReward: 900, duration: 200, categorySlug: 'bash', order: 3 },
  // ── SQL ─────────────────────────────────────────────────
  { title: 'SQL: Zero to Hero', slug: 'sql-beginner', description: 'Every app needs a database. Learn SELECT, INSERT, UPDATE, DELETE.', difficulty: 'BEGINNER', xpReward: 400, duration: 90, categorySlug: 'sql', order: 1 },
  { title: 'SQL: Joins & Subqueries', slug: 'sql-intermediate', description: 'Master JOINs, subqueries, aggregations, and indexing strategies.', difficulty: 'INTERMEDIATE', xpReward: 700, duration: 160, categorySlug: 'sql', order: 2 },
  { title: 'SQL: Database Architect', slug: 'sql-advanced', description: 'Database design, normalization, stored procedures, and query optimization.', difficulty: 'ADVANCED', xpReward: 1000, duration: 220, categorySlug: 'sql', order: 3 },
  // ── Web Development (Domain) ───────────────────────────
  { title: 'Frontend Mastery Path', slug: 'web-frontend', description: 'Learn React, state management, and building interactive user interfaces.', difficulty: 'BEGINNER', xpReward: 700, duration: 150, categorySlug: 'web-dev', order: 1 },
  { title: 'Backend Mastery Path', slug: 'web-backend', description: 'Master Node.js, Express, databases, and APIs.', difficulty: 'INTERMEDIATE', xpReward: 1000, duration: 200, categorySlug: 'web-dev', order: 2 },
  { title: 'Full-Stack Architect', slug: 'web-fullstack', description: 'Combine Frontend, Backend, and DevOps to ship production apps.', difficulty: 'ADVANCED', xpReward: 1500, duration: 350, categorySlug: 'web-dev', order: 3 },
  // ── Data Science & ML (Domain) ─────────────────────────
  { title: 'Data Science: Foundations', slug: 'ds-beginner', description: 'Learn NumPy, Pandas, and data visualization with Matplotlib.', difficulty: 'BEGINNER', xpReward: 600, duration: 140, categorySlug: 'data-science', order: 1 },
  { title: 'Machine Learning Essentials', slug: 'ds-intermediate', description: 'Regression, classification, decision trees, and scikit-learn.', difficulty: 'INTERMEDIATE', xpReward: 900, duration: 220, categorySlug: 'data-science', order: 2 },
  { title: 'Deep Learning Architect', slug: 'ds-advanced', description: 'Neural networks, CNNs, RNNs, transformers, and TensorFlow/PyTorch.', difficulty: 'ADVANCED', xpReward: 1400, duration: 320, categorySlug: 'data-science', order: 3 },
  // ── DevOps & Cloud (Domain) ────────────────────────────
  { title: 'DevOps: Foundations', slug: 'devops-beginner', description: 'Learn Linux, Git, CI/CD basics, and the DevOps mindset.', difficulty: 'BEGINNER', xpReward: 500, duration: 120, categorySlug: 'devops', order: 1 },
  { title: 'Docker & Kubernetes', slug: 'devops-intermediate', description: 'Containerize apps, orchestrate with K8s, and cloud deployments.', difficulty: 'INTERMEDIATE', xpReward: 900, duration: 200, categorySlug: 'devops', order: 2 },
  { title: 'Cloud Architecture', slug: 'devops-advanced', description: 'AWS/GCP/Azure, Terraform, monitoring, and production SRE practices.', difficulty: 'ADVANCED', xpReward: 1300, duration: 300, categorySlug: 'devops', order: 3 },
  // ── Cybersecurity (Domain) ─────────────────────────────
  { title: 'Cybersecurity: Foundations', slug: 'cyber-beginner', description: 'Learn networking basics, CIA triad, and common vulnerabilities.', difficulty: 'BEGINNER', xpReward: 500, duration: 120, categorySlug: 'cybersecurity', order: 1 },
  { title: 'Ethical Hacking & Pentesting', slug: 'cyber-intermediate', description: 'OWASP Top 10, Burp Suite, Nmap, and penetration testing methodology.', difficulty: 'INTERMEDIATE', xpReward: 900, duration: 220, categorySlug: 'cybersecurity', order: 2 },
  { title: 'Security Architect', slug: 'cyber-advanced', description: 'Threat modeling, incident response, SOC operations, and compliance.', difficulty: 'ADVANCED', xpReward: 1300, duration: 300, categorySlug: 'cybersecurity', order: 3 },
  // ── Game Development (Domain) ──────────────────────────
  { title: 'Game Dev: Foundations', slug: 'game-beginner', description: 'Learn game loops, sprites, collision detection, and basic 2D games.', difficulty: 'BEGINNER', xpReward: 500, duration: 120, categorySlug: 'game-dev', order: 1 },
  { title: 'Unity & C# Game Dev', slug: 'game-intermediate', description: 'Build 3D games with Unity, physics engines, and UI systems.', difficulty: 'INTERMEDIATE', xpReward: 900, duration: 220, categorySlug: 'game-dev', order: 2 },
  { title: 'Game Architecture', slug: 'game-advanced', description: 'Multiplayer, networking, shaders, and publishing to Steam/consoles.', difficulty: 'ADVANCED', xpReward: 1300, duration: 300, categorySlug: 'game-dev', order: 3 },
  // ── System Design (Domain) ─────────────────────────────
  { title: 'System Design: Foundations', slug: 'sysdesign-beginner', description: 'Learn CAP theorem, load balancing, and basic distributed architectures.', difficulty: 'BEGINNER', xpReward: 600, duration: 120, categorySlug: 'system-design', order: 1 },
  { title: 'Scalable Systems', slug: 'sysdesign-intermediate', description: 'Design URL shorteners, chat apps, and notification systems at scale.', difficulty: 'INTERMEDIATE', xpReward: 1000, duration: 220, categorySlug: 'system-design', order: 2 },
  { title: 'System Design: Expert', slug: 'sysdesign-advanced', description: 'Design YouTube, Twitter, and Uber-scale systems for interviews.', difficulty: 'ADVANCED', xpReward: 1500, duration: 300, categorySlug: 'system-design', order: 3 },
  // ── Blockchain & Web3 (Domain) ─────────────────────────
  { title: 'Blockchain: Foundations', slug: 'blockchain-beginner', description: 'Understand blockchain, consensus mechanisms, and crypto fundamentals.', difficulty: 'BEGINNER', xpReward: 500, duration: 100, categorySlug: 'blockchain', order: 1 },
  { title: 'Solidity & Smart Contracts', slug: 'blockchain-intermediate', description: 'Write Solidity, deploy to Ethereum, and build DApps with Hardhat.', difficulty: 'INTERMEDIATE', xpReward: 900, duration: 200, categorySlug: 'blockchain', order: 2 },
  { title: 'Web3 Architect', slug: 'blockchain-advanced', description: 'DeFi protocols, NFT marketplaces, cross-chain bridges, and auditing.', difficulty: 'ADVANCED', xpReward: 1300, duration: 280, categorySlug: 'blockchain', order: 3 },
  // ── AI & Prompt Engineering (Domain) ───────────────────
  { title: 'Prompt Engineering 101', slug: 'ai-prompt-engineering', description: 'Write effective prompts to command ChatGPT, Claude, and Gemini.', difficulty: 'BEGINNER', xpReward: 400, duration: 60, categorySlug: 'ai-ml', order: 1 },
  { title: 'Build AI Apps with APIs', slug: 'ai-apps', description: 'Integrate LLMs into web applications using OpenAI, Anthropic APIs.', difficulty: 'INTERMEDIATE', xpReward: 800, duration: 150, categorySlug: 'ai-ml', order: 2 },
  { title: 'AI: Advanced Architect', slug: 'ai-advanced', description: 'Fine-tuning models, RAG, AI Agents, and production AI pipelines.', difficulty: 'ADVANCED', xpReward: 1500, duration: 300, categorySlug: 'ai-ml', order: 3 },
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

  // Ensure every category has at least one foundations course
  const existingCategorySlugs = new Set(COURSES.map(c => c.categorySlug));
  const generatedCourses = [];
  
  for (const cat of CATEGORIES) {
    if (!existingCategorySlugs.has(cat.slug)) {
      generatedCourses.push({
        title: `${cat.name}: Foundations`,
        slug: `${cat.slug}-foundations`,
        description: `Master the essential principles and modern architecture of ${cat.name}.`,
        difficulty: 'BEGINNER',
        xpReward: 500,
        duration: 120,
        categorySlug: cat.slug,
        order: 1
      });
    }
  }

  const allCourses = [...COURSES, ...generatedCourses];
  let count = 0;
  
  for (const course of allCourses) {
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
