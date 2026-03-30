const systemDesignMastery = {
  course: {
    title: 'System Design: Scalability Architect',
    slug: 'system-design-mastery',
    description: 'Learn to design distributed, highly available, and massively scalable systems. From CAP Theorem to Load Balancing, Database Sharding, and Microservices architecture.',
    categorySlug: 'system-design',
    difficulty: 'ADVANCED',
    xpReward: 3000,
    duration: 1200,
    order: 3
  },
  lessons: [
    {
      title: 'CAP Theorem & Distributed Databases',
      content: `## ⚖️ Designing for Failure

In the world of distributed systems, networks fail. Servers crash. Datacenters lose power. When building systems like Amazon or Netflix, you cannot rely on perfect hardware. You rely on software architecture.

### The CAP Theorem

Proposed by Eric Brewer, it states a distributed data store can only simultaneously provide **two** out of the following three guarantees:

1. **Consistency (C):** Every read receives the most recent write, or an error. If a user updates their profile picture, do all subsequent requests worldwide see the new picture instantly?
2. **Availability (A):** Every request receives a (non-error) response, without the guarantee that it contains the most recent write. (The system stays up).
3. **Partition Tolerance (P):** The system continues to operate despite an arbitrary number of messages being dropped or delayed by the network between nodes.

> [!WARNING]
> Because network partitions (P) are an unavoidable reality of distributed systems (switches fail, cables break), a distributed system MUST choose to be **Partition Tolerant**. Thus, we are mathematically forced to trade off between **Consistency** and **Availability** (CP vs AP).

### AP Systems
Cassandra, DynamoDB, Riak. They prioritize keeping the database online to accept writes (Availability), but might serve stale data (Eventual Consistency).

### CP Systems
MongoDB, HBase, Redis, Zookeeper. They prioritize strong consistency. If the network partitions, the system will reject writes or reads (Availability drop) until consensus is restored to prevent data corruption.

### Interactive Practice
You are designing a **Financial Ledger (Banking)** system. Should it be AP or CP? Why?
Consider if the network drops between ATMs: Should you allow the withdrawal (A) but risk an overdraft? Or reject the transaction (C) to ensure the balance is perfectly tracked?`,
      codeStarter: `/* 
  System Design doesn't execute code directly like algorithms do. 
  Instead, sketch out your decisions below!
*/

const system_requirements = {
  type: "Banking Ledger",
  goal: "Prevent negative balances at all costs",
  availability_sla: 99.9,
  consistency_sla: 100
};

function analyze_tradeoff() {
  if (system_requirements.consistency_sla === 100) {
    console.log("CP System Chosen: We will REJECT transactions if the network splits, guaranteeing no overdrafts.");
  } else {
    console.log("AP System Chosen: We will ACCEPT transactions to maximize revenue, resolving conflicts later.");
  }
}

analyze_tradeoff();`,
      quiz: {
        questions: [
          {
            question: "Why must distributed systems over the internet inherently support Partition Tolerance (P)?",
            options: ["Because partition tolerance makes databases 10x faster", "Because network failures (dropped packets, severed cables) are unavoidable physically", "Because it is required by the SQL standard", "Because Eric Brewer mandated it"],
            correctIndex: 1,
            explanation: "In real distributed systems, packets are dropped and routers fail. You have no structural control over preventing network partitions, making Partition Tolerance a mandatory requirement."
          },
          {
            question: "An E-Commerce shopping cart should prioritize which trait?",
            options: ["Consistency over Availability (CP) - Users shouldn't buy items out of stock", "Availability over Consistency (AP) - Never stop a user from adding to cart; reconcile inventory later", "Neither, use a massive Monolith", "Security"],
            correctIndex: 1,
            explanation: "Amazon famously designed Dynamo (an AP system) because if a user cannot add an item to their cart, Amazon loses money permanently. Resolving inventory conflicts later is cheaper than downtime."
          }
        ]
      }
    },
    {
      title: 'Load Balancing & Horizontal Scaling',
      content: `## ⚖️ Traffic Growth

When your application goes viral, a single web server (Vertical Scaling) will quickly hit its upper limits of RAM and CPU.

### Horizontal Scaling
Instead of buying a bigger server, we buy **many smaller servers**. But how do 10,000 incoming user requests get distributed among 5 identical backend servers?

### The Load Balancer (LB)
A Load Balancer is a reverse proxy (like Nginx, HAProxy, or AWS ALB) that sits in front of your servers and routes traffic according to an algorithm:

1. **Round Robin:** Requests are routed sequentially (Server 1, Server 2, Server 3, Server 1...). Good for stateless, identical requests.
2. **Least Connections:** Routes the new request to the server with the fewest active connections. Best if requests take varying amounts of time (like video rendering).
3. **Consistent Hashing / IP Hash:** Routes the same user (based on IP or Session ID) to the exact same server consistently. Used when servers hold stateful session data in memory.

### Stateful vs Stateless
If a user logs in on Server A, and the next request is routed to Server B, they will be asked to log in again!

> [!TIP]
> **Stateless Backend:** To fix this, NEVER store sessions in the local server's memory. Instead, place a shared **Redis Distributed Cache** behind the servers. All servers verify JWT tokens or query Redis, making your architecture 100% horizontally scalable.

### Interactive Practice
Simulate a Round Robin algorithm routing requests into an array of servers.`,
      codeStarter: `class RoundRobinLoadBalancer {
  constructor(servers) {
    this.servers = servers;
    this.currentIndex = 0;
  }

  routeRequest(req) {
    if (this.servers.length === 0) return null;
    
    // Pick the current server
    const target = this.servers[this.currentIndex];
    console.log("Routing request '" + req + "' to " + target);
    
    // Shift index to the next server, wrap around using modulo
    this.currentIndex = (this.currentIndex + 1) % this.servers.length;
    return target;
  }
}

const lb = new RoundRobinLoadBalancer(["Server-A", "Server-B", "Server-C"]);

lb.routeRequest("User1 Login");
lb.routeRequest("User2 Checkout");
lb.routeRequest("User3 ViewItem");
lb.routeRequest("User4 Settings"); # Loops back to A!`,
      quiz: {
        questions: [
          {
            question: "What is a major downside of using IP Hash routing to maintain user sessions locally on servers?",
            options: ["If a server crashes, all users pinned to that server lose their active sessions", "It consumes too much bandwidth", "It requires 10x the CPU power", "It prevents Round Robin"],
            correctIndex: 0,
            explanation: "If you store HTTP sessions in memory and route via IP Hash, a crashed server wipes out all those active sessions. Storing state in Redis (Stateless architecture) is preferred."
          }
        ]
      }
    }
  ]
};

module.exports = { systemDesignMastery };
