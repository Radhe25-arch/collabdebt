/**
 * SkillForge — Domain Architecture Library (Elite Architect Tracks)
 * 
 * Sources & Inspirations:
 * - System Design: "Designing Data-Intensive Applications" (Martin Kleppmann)
 * - Cloud Architecture: "Well-Architected Framework" (AWS/Azure/GCP)
 * - Security: "The Web Application Hacker's Handbook" (Dafydd Stuttard)
 * - AI Architecture: "Machine Learning Engineering" (Andriy Burkov)
 */

const domainArchitectureMastery = [
  // --- SYSTEM DESIGN ---
  {
    course: {
      title: "System Design: Large-Scale Distributed Architectures",
      slug: "system-design-elite-mastery",
      description: "Master the patterns that power Google, Netflix, and Amazon. Learn Replication, Partitioning, Consistency (CAP Theorem), and Consensus.",
      categorySlug: "system-design",
      difficulty: "ADVANCED",
      xpReward: 2000,
      duration: 720,
      order: 1
    },
    lessons: [
      {
        title: "The CAP Theorem & Eventual Consistency",
        content: `## 🏗️ Scaling Databases
        
        The **CAP Theorem** (Consistency, Availability, Partition Tolerance) states that in a distributed system, you can only have two of the three. 
        
        ### Choice 1: CP (Consistency & Partition Tolerance)
        Systems like HBase or MongoDB (in primary mode) that prioritize accurate data over absolute availability.
        
        ### Choice 2: AP (Availability & Partition Tolerance)
        Systems like Cassandra or DynamoDB that use **Eventual Consistency**—the data might be stale for a few milliseconds, but the system never goes down!`,
        codeStarter: `// Distributed Systems Logic
// Predict the result of a read after a write in an 'Eventually Consistent' DB
function readAfterWrite() {
    let db = { data: "old", replica: "old" };
    db.data = "new"; // Write to Primary
    
    // Read from Replica immediately
    console.log("Replica value:", db.replica); // Predict: "old"
}`
      }
    ]
  },

  // --- CLOUD & DEVOPS ---
  {
    course: {
      title: "Cloud & Infrastructure: Well-Architected Framework",
      slug: "cloud-devops-elite",
      description: "Beyond simple hosting. Master Kubernetes (K8s), Terraform (IaC), and the 5 Pillars of Cloud Excellence.",
      categorySlug: "devops",
      difficulty: "ADVANCED",
      xpReward: 1800,
      duration: 650,
      order: 1
    },
    lessons: [
      {
        title: "Infrastructure as Code (IaC) with Terraform",
        content: `## 📜 Reproducible Infrastructure
        
        Experts never click in a Cloud Console. They write code that defines their infrastructure. 
        
        ### The State File (.tfstate)
        Terraform keeps a record of exactly what's actually running in the cloud. When you change your code, it performs a **Plan** to see what needs to be added, destroyed, or modified.`,
        codeStarter: `# Terraform DSL (HCL)
resource "aws_instance" "app_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}`
      }
    ]
  },

  // --- SECURITY ENGINEERING ---
  {
    course: {
      title: "Security Engineering: Offensive & Defensive",
      slug: "security-elite-mastery",
      description: "Master the OWASP Top 10, Cryptography, and Zero-Trust architecture. Think like a hacker to build like an architect.",
      categorySlug: "cybersecurity",
      difficulty: "ADVANCED",
      xpReward: 1900,
      duration: 680,
      order: 1
    },
    lessons: [
      {
        title: "The OWASP Top 10: Injections & Broken Auth",
        content: `## 🛡️ Defending the Architecture
        
        The most common vulnerabilities are **Injections** (SQLi, Command Injection) and **Broken Access Control**.
        
        ### Prepared Statements
        Never, ever concatenate strings into SQL queries. Use parameterized queries so the database engine treats user input as data, not as code.`,
        codeStarter: `// VULNERABLE: Direct concatenation
// query = "SELECT * FROM users WHERE id = " + userInput;

// SECURE: Parameterized Query
// query = "SELECT * FROM users WHERE id = $1";
// client.query(query, [userInput]);`
      }
    ]
  },

  // --- AI & MACHINE LEARNING ---
  {
    course: {
      title: "AI & ML Architecture: Building Intelligent Systems",
      slug: "ai-ml-elite-architecture",
      description: "Master MLOps, Neural Networks, and LLM orchestration. Build production-ready AI applications at scale.",
      categorySlug: "ai-ml",
      difficulty: "ADVANCED",
      xpReward: 2000,
      duration: 750,
      order: 1
    },
    lessons: [
      {
        title: "Neural Networks: Backpropagation & Optimization",
        content: `## 🧠 Deep Learning Foundations
        
        A Neural Network is a series of mathematical functions (layers) that transform input data into predictions. 
        
        ### Backpropagation
        The process of calculating the "error" of a prediction and sending it backward through the network to update weights via **Gradient Descent**.`,
        codeStarter: `// Simple Neural Network (Conceptual)
class Neuron {
  constructor(weights) { this.weights = weights; }
  activate(inputs) {
    // Sigmoid or ReLU function
    return inputs.reduce((sum, val, i) => sum + val * this.weights[i], 0);
  }
}`
      }
    ]
  }
];

module.exports = { domainArchitectureMastery };
