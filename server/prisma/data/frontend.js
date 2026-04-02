const reactMastery = {
  course: {
    title: 'React: Enterprise Component Architecture',
    slug: 'react-mastery',
    description: 'Master the internal mechanics of React. From the Fiber Reconciler to Custom Hooks, Performance Optimization, and Global State Management.',
    categorySlug: 'web-dev',
    difficulty: 'ADVANCED',
    xpReward: 2500,
    duration: 1000,
    order: 1
  },
  lessons: [
    {
      title: 'The Fiber Reconciler: Under the Hood',
      content: `## 🔍 Beyond the Virtual DOM

Most developers know about the Virtual DOM, but experts understand **React Fiber**. Fiber is the engine that allows React to pause, prioritize, and resume rendering work.

### Conciliation vs Rendering
- **Conciliation:** The process of comparing two trees to see what changed (The "Diffing" algorithm).
- **Rendering:** The actual painting of those changes to the Host (the Browser DOM).

### Key Features of Fiber
1. **Incremental Rendering:** React can split rendering work into chunks and spread them over multiple frames.
2. **Priority:** User interactions (like typing) get higher priority than background data fetches.
3. **Double Buffering:** React builds a "work-in-progress" tree in the background and swaps it with the "current" tree only when it is complete, avoiding partial UI flickering.

> [!TIP]
> **Key Prop Matters:** This is why the \`key\` prop is critical for lists. It's the unique ID React uses to track which Fiber node belongs to which piece of data!`,
      codeStarter: `/* 
  React Rendering Logic Practice 
  Explain the order of execution for a 
  nested component lifecycle!
*/

function Parent() {
  console.log("Parent: render start");
  
  useEffect(() => {
    console.log("Parent: effect run");
  }, []);

  return <Child />;
}

function Child() {
  console.log("Child: render start");
  
  useEffect(() => {
    console.log("Child: effect run");
  }, []);

  return <div>Fiber Demo</div>;
}

// Predicted Log Order:
// 1. Parent: render start
// 2. Child: render start
// 3. Child: effect run
// 4. Parent: effect run`,
      quiz: {
        questions: [
          {
            question: "Why does React Fiber prefer 'Incremental Rendering'?",
            options: ["To make the code shorter", "To avoid blocking the main thread during heavy UI updates (keeping the UI responsive)", "To use GPU acceleration", "To prevent memory leaks"],
            correctIndex: 1,
            explanation: "By breaking work into chunks, Fiber ensures that urgent tasks (like user input) can interrupt a long rendering process."
          }
        ]
      }
    },
    {
      title: 'Custom Hooks & Logic Reuse',
      content: `## 🧩 Modularizing Complexity

Hooks are not just a way to use state in functional components; they are the ultimate tool for **logic encapsulation**.

### Composition over Inheritance
Instead of wrapping components in "Higher Order Components" (HOCs) or using "Render Props", we use **Custom Hooks**. This allows us to share stateful logic without changing the component hierarchy.

### Rules of Hooks
1. **Only call at the top level:** No loops, conditions, or nested functions.
2. **Only call in React functions:** (or other Hooks).

### Example: \`useDebounce\`
Avoid triggering expensive searches on every single keystroke.
\`\`\`javascript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler); // Cleanup!
  }, [value, delay]);

  return debouncedValue;
}
\`\`\`

> [!IMPORTANT]
> **The Cleanup Function:** Always return a cleanup function from \`useEffect\` if you use intervals or timers. Failure to do so leads to "phantom" state updates and memory leaks!`,
      codeStarter: `// Implement a useGeolocation hook 
// 1. Track { lat, lng } state
// 2. Use navigator.geolocation.getCurrentPosition
// 3. Update state on success

function useGeolocation() {
  const [position, setPosition] = useState({ lat: null, lng: null });

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    });
  }, []);

  return position;
}`,
      quiz: {
        questions: [
          {
            question: "What is the primary role of the 'cleanup function' in a React useEffect?",
            options: ["To delete the component from memory", "To cancel pending network requests or timers before the component reruns or unmounts", "To reset the component's state to zero", "To trigger a re-render"],
            correctIndex: 1,
            explanation: "The cleanup function prevents 'memory leaks' and race conditions by stopping asynchronous tasks that are no longer relevant."
          }
        ]
      }
    }
  ]
};

const nextjsMastery = {
  course: {
    title: 'Next.js: Full-Stack Enterprise Architecture',
    slug: 'nextjs-mastery',
    description: 'Learn to build production-ready applications with the Next.js App Router. Master Server Components, Streaming, Interceptors, and ISR.',
    categorySlug: 'web-dev',
    difficulty: 'ADVANCED',
    xpReward: 3000,
    duration: 1200,
    order: 2
  },
  lessons: [
    {
      title: 'React Server Components (RSC)',
      content: `## 🚀 Rethinking the Client

Server Components are the biggest shift in the React ecosystem in years. They allow you to write components that **only execute on the server**.

### Why RSC?
1. **Zero Bundle Size:** The code for Server Components never reaches the browser. It stays on the server.
2. **Direct Backend Access:** You can query your database (Postgres, MongoDB) directly inside the component!
3. **No Waterfalls:** Fetching data on the server reduces round-trips from the client.

### Client vs Server
- **Server (Default):** Great for SEO, data fetching, and large packages (like \`date-fns\`).
- **Client (\`'use client'\`):** Required only if you need Interactivity (state, effects) or Browser APIs (window, localStorage).

> [!IMPORTANT]
> **Security:** Because Server Components run on the server, you can safely use database credentials and API keys without exposing them to the URL bar!`,
      codeStarter: `// A Next.js 14 Server Component
// Imagine we're using Prisma directly here.

import { prisma } from "@/lib/db";

export default async function UserProfile({ id }) {
  // Direct DB Access! No API route needed.
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) return <div>User not found</div>;

  return (
    <div className="p-8 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold">{user.username}</h1>
      <p className="text-slate-500">Level: {user.level}</p>
    </div>
  );
}`,
      quiz: {
        questions: [
          {
            question: "Which of the following is ONLY possible in a 'use client' component?",
            options: ["Direct Database Query", "Using the useState hook", "Fenced CSS styling", "Exporting a default function"],
            correctIndex: 1,
            explanation: "Interactive state (`useState`, `useEffect`) requires the client-side React runtime to be active, which only happens in 'Client Components'."
          }
        ]
      }
    }
  ]
};

module.exports = { reactMastery, nextjsMastery };
