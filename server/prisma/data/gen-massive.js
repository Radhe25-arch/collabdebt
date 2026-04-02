const domains = {
  'javascript': 'Advanced Frontend & Browser Internals',
  'python': 'Data Science, Backend & AI',
  'web-dev': 'Modern Framework Architecture (React, Next, Vue)',
  'devops': 'Cloud, Docker, K8s & Infrastructure',
  'systems': 'High-Performance Rust, Go & Kernel Dev',
  'system-design': 'Distributed Architectures at Scale',
  'ai-ml': 'LLMs, Neural Networks & MLOps',
  'cybersecurity': 'Pentesting, AppSec & Cryptography',
  'blockchain': 'Ethereum, Solidity & ZK-Proofs',
  'mobile-dev': 'Native & Cross-platform engineering',
  'data-science': 'Big Data, Analytics, and Visualization',
  'backend-dev': 'Node, Java, C++, and API Design'
};

const categories = Object.keys(domains);
const courses = [];
const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

for (let i = 0; i < 250; i++) {
  const catSlug = categories[i % categories.length];
  const baseName = domains[catSlug].split(' (')[0].split(' & ')[0].split(', ')[0];
  const idInCat = Math.floor(i / categories.length) + 1;
  const title = `${baseName} Masterclass: Track ${idInCat}`;
  const courseSlug = `${catSlug}-elite-${idInCat}`;
  
  courses.push({
    course: {
      title,
      slug: courseSlug,
      description: `Elite architect-grade track for ${baseName}. Level ${idInCat} depth covering advanced patterns, performance, and enterprise scalability.`,
      categorySlug: catSlug,
      difficulty: levels[idInCat % 3],
      xpReward: 1000 + (idInCat * 100),
      duration: 300 + (idInCat * 20),
      order: idInCat
    },
    lessons: [
      {
        title: 'Core Architecture Deep-Dive',
        content: `## Technical Foundations\n\nWelcome to the expert-level ${title}. We begin by analyzing the fundamental architectural patterns used in high-performance production systems.`,
        codeStarter: `// Expert level ${catSlug} initialization\nfunction init() {\n  console.log("System Ready");\n}`
      },
      {
        title: 'Security & Enterprise Performance',
        content: `## Engineering Excellence\n\nIn this phase, we look at the security implications and performance bottlenecks at the V8 engine and OS level.`,
      },
      {
        title: 'Production Lifecycle & Scaling',
        content: `## Global Scale\n\nFinal module: Deploying ${baseName} at scale. Distributed systems, caching strategies, and zero-downtime migrations.`,
      }
    ]
  });
}

const fs = require('fs');
const content = `const massiveCourses = ${JSON.stringify(courses, null, 2)};\n\nmodule.exports = { massiveCourses };`;
fs.writeFileSync('massive-courses.js', content);
console.log('✅ Generated 250 expert courses.');
