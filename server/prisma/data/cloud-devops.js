const dockerMastery = {
  course: {
    title: 'Docker & Kubernetes: Container Architect',
    slug: 'docker-kubernetes',
    description: 'Master the art of containerization and orchestration. Learn to build, deploy, and scale enterprise applications using Docker and Kubernetes.',
    categorySlug: 'devops',
    difficulty: 'INTERMEDIATE',
    xpReward: 2500,
    duration: 900,
    order: 1
  },
  lessons: [
    {
      title: 'The Anatomy of a Container',
      content: `## 📦 Containers vs Virtual Machines

In the old days, we used Virtual Machines (VMs). A VM includes a full Guest OS, making it heavy (GBs) and slow to boot. **Containers** share the host's OS kernel, making them lightweight (MBs) and near-instant to start.

### Docker Image Layers
Every Docker image is made of **read-only layers**. When you run a container, Docker adds a thin **writable layer** on top.
- This is why pulling an image is fast if you already have the base layers.
- This is why containers are immutable—any changes to tiles inside are lost when the container is deleted!

### The Dockerfile
Think of a Dockerfile as a "recipe" for your infrastructure.
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
\`\`\`

> [!IMPORTANT]
> **Optimization:** Always put \`COPY package.json\` and \`RUN npm install\` *before* \`COPY . .\`. This allows Docker to cache the "install" layer, so it only re-runs if your dependencies change, not every time you edit a single line of code!`,
      codeStarter: `# Create a optimized Dockerfile for a Python API
# 1. Start from python:3.9-slim
# 2. Set WORKDIR to /code
# 3. Copy requirements.txt
# 4. Run pip install
# 5. Copy the rest of the app

FROM python:3.9-slim
WORKDIR /code
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]`,
      quiz: {
        questions: [
          {
            question: "Why are Docker containers faster to boot than Virtual Machines?",
            options: ["They use better hardware", "They share the Host OS Kernel instead of loading a full Guest OS", "They run in the cloud", "They bypass the CPU"],
            correctIndex: 1,
            explanation: "By sharing the host kernel, containers avoid the overhead of booting a full operating system for every instance."
          }
        ]
      }
    },
    {
      title: 'Container Networking & Ports',
      content: `## 🌐 Bridging the Gap

By default, an application running inside a container is isolated. It cannot be reached by the outside world unless you explicitly **publish** its ports.

### Port Mapping
When you run \`-p 8080:3000\`, you are telling Docker:
"Take any traffic hitting the **Host Machine** on port 8080 and forward it to the **Container** on port 3000."

### Docker Networks
Containers can talk to each other without exposing ports to the public internet using **Docker Networks**. 
- Common types: \`bridge\` (default), \`host\`, and \`none\`.
- In a \`bridge\` network, containers can reach each other by **service name** (e.g., your app connects to \`db:5432\` instead of an IP).

> [!TIP]
> **Security:** Only expose the ports that users actually need to hit (like port 80 for a web server). Internal services like databases should stay hidden inside a private Docker Network.`,
      codeStarter: `# Using Docker Compose to link a Web App and a Database
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:3000"
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret`,
      quiz: {
        questions: [
          {
            question: "In the command `docker run -p 5000:80 myapp`, which port is the Host port?",
            options: ["80", "5000", "Both", "Neither"],
            correctIndex: 1,
            explanation: "The syntax is `HOST_PORT:CONTAINER_PORT`. Thus, 5000 is the port on your physical machine."
          }
        ]
      }
    }
  ]
};

const awsArchitecture = {
  course: {
    title: 'AWS: Cloud Architecture Specialist',
    slug: 'aws-cloud-specialist',
    description: 'Master the core services of Amazon Web Services. Learn to architect secure, scalable, and highly available systems using EC2, S3, IAM, and Lambda.',
    categorySlug: 'devops',
    difficulty: 'ADVANCED',
    xpReward: 3500,
    duration: 1500,
    order: 2
  },
  lessons: [
    {
      title: 'The Shared Responsibility Model',
      content: `## 🛡️ Who handles security?

In AWS, security is a **Shared Responsibility**.
1. **Security OF the Cloud:** AWS handles the physical datacenters, the hardware, and the virtualization layer.
2. **Security IN the Cloud:** YOU handle the firewall rules (Security Groups), patching the Guest OS, and encrypting your data.

### Identity & Access Management (IAM)
The #1 rule in Cloud: **The Principle of Least Privilege**.
- Never use your **Root User** for daily tasks.
- Create **IAM Users** for people.
- Create **IAM Roles** for services (e.g., an EC2 instance needs a role to talk to S3).

> [!WARNING]
> **Secret Leak:** Never hardcode AWS Access Keys in your code. If you push those to GitHub, bots will steal them within seconds and start mining crypto on your bill! Use **IAM Roles** instead.`,
      codeStarter: `/* 
  AWS Architecture Practice 
  Sketch a secure S3 bucket policy that only allows 
  your specific EC2 Role to read objects.
*/

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::1234567890:role/WebServerRole" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-secure-bucket/*"
    }
  ]
}`,
      quiz: {
        questions: [
          {
            question: "According to the Shared Responsibility Model, who is responsible for patching the Operating System on an EC2 instance?",
            options: ["AWS", "The Customer (You)", "Intel", "Microsoft"],
            correctIndex: 1,
            explanation: "AWS provides the 'hardware' and virtualization, but once an EC2 instance is created, the customer is responsible for the OS security and patches."
          }
        ]
      }
    }
  ]
};

module.exports = { dockerMastery, awsArchitecture };
