# CodeArena: Complete Product & Technical Documentation

## 1. Executive Summary & Product Vision
**CodeArena** is a premium, gamified developer learning platform designed to bridge the gap between theoretical learning and practical coding proficiency. Inspired by modern, dark-themed SaaS aesthetics (e.g., Linear, Stripe), the platform combines structured curriculum with high-stakes competitive programming, AI-powered mentorship, and seamless portfolio generation. 

The primary vision is to create an engaging ecosystem where students, beginners, and professionals can learn programming languages, compete in live battles, collaborate in real-time, and showcase their skills to potential employers.

---

## 2. Core Features & Value Proposition

### 🎓 Interactive Curriculum & Courses
- **Structured Learning:** Courses are grouped by categories (e.g., Web Dev, DSA, Python).
- **Gamified Progression:** Each course contains lessons and quizzes. Completing lessons awards XP, unlocking new levels and badges.
- **Progress Tracking:** Granular progress tracking (0-100%) with visual indicators and lesson completion checkboxes.

### ⚔️ 1v1 Code Battles
- **Real-Time Competition:** Users can challenge each other in live coding battles.
- **Match Configurations:** Includes custom or system-generated problems, configurable time limits, and language selection.
- **Code Execution:** Live evaluation of code against test cases (measuring execution time, memory usage, and test accuracy).
- **Post-Battle Reports:** AI-generated analysis of the match detailing strengths and weaknesses of both players.

### 🏆 Tournaments & Hall of Fame
- **Global Events:** Time-boxed tournaments (Coding Challenges, Quiz Battles, Speed Courses) with massive XP bonuses.
- **Leaderboards:** Real-time global ranking system tracking the top players. Weekly "Hall of Fame" induction for the top 3 users.

### 🤖 AI Code Mentor & Skill DNA
- **Personalized Mentorship:** Built-in AI chat sessions linked to user accounts to debug code and explain concepts.
- **Skill DNA System:** A complex analytics engine tracking the user's proficiency across different categories, identifying strong/weak topics and overall learning trends.

### 🤝 Collaborative Code Rooms
- **Real-time collaboration:** Temporary or public rooms where up to 4 users can write code simultaneously.
- **Shared Context:** Real-time cursor tracking and shared execution state.

### 📁 Automated GitHub Portfolios
- **Instant Resumes:** The platform automatically syncs course completions and battle solutions to a customized, hosted portfolio.
- **Custom Domains:** Users can attach custom domains and select theme colors for their developer profile.

### 📅 Daily Quests & Streaks
- **Engagement Loop:** Users are given daily quests (e.g., complete 2 lessons, win 1 battle, solve 1 code challenge).
- **Streak Maintenance:** Consecutive daily logins build a streak multiplier.

---

## 3. Technical Architecture & Tech Stack

### Frontend Architecture
- **Framework:** React.js (via Vite)
- **Routing:** React Router v6
- **State Management:** Zustand (for Auth and Global App State)
- **Styling:** Tailwind CSS (Custom Design System with colors like `arena-bg3`, `arena-teal`, `arena-purple`).
- **Icons:** Lucide-React
- **UI Components:** Glassmorphic cards, custom XP Bars, heatmaps, interactive widgets.

### Backend Architecture
- **Runtime:** Node.js with Express.js
- **Database:** PostgreSQL (Hosted on Supabase/AWS)
- **ORM:** Prisma
- **Code Execution Environment:** Secure, isolated sandboxes/containers for running user-submitted code in real-time during battles and tournaments.
- **Authentication:** JWT-based flow with refresh tokens.

---

## 4. Database Schema Breakdown (Prisma)

The application relies on a robust relational database with over 20 tables:

1. **User Management (`User`, `Follow`):** Tracks basic auth, roles (STUDENT, ADMIN), total XP, streaks, and gamification metadata. Includes social following mechanics.
2. **Education Engine (`Course`, `Lesson`, `Quiz`, `Enrollment`):** Handles curriculum relationships. Courses contain Lessons; Lessons can have Quizzes attached.
3. **Gamification (`Badge`, `DailyQuest`, `XPTransaction`):** A ledger-style transactional table tracks exactly *why* a user earned XP to prevent cheating and power the activity heatmap.
4. **Competitive Engine (`Battle`, `Tournament`):** Complex state machines tracking challenges from `PENDING` -> `CONFIGURING` -> `ACTIVE` -> `COMPLETED`.
5. **Collaboration (`CodeRoom`):** Manages websocket session metadata and participants.
6. **Portfolio (`Portfolio`, `PortfolioProject`):** Links CodeArena users directly to their GitHub identities and synced repositories.

---

## 5. User Journey & Flow

1. **Onboarding:** User signs up, selects interests (Web Dev, AI/ML), and inputs their current skill level.
2. **Dashboard Overview:** User lands on the Dashboard showing their current specific `Daily Quests`, an `Active Tournament` widget, their `Activity Heatmap`, and `Pending Challenges`.
3. **Learning Loop:** User navigates to a `Course`, completes a Markdown-based lesson, solves an interactive coding component or quiz, and earns XP.
4. **Competitive Loop:** User joins a live 1v1 Battle, solves a Data Structures problem faster than their opponent, and steals rank/XP.
5. **Portfolio Sync:** The winning battle solution is automatically pushed to their connected GitHub Portfolio.

---

## 6. Design System & Aesthetics
CodeArena distances itself from generic learning platforms by utilizing an extreme, premium, "developer-tooling" aesthetic:
- **Colors:** Deep blacks/dark grays paired with neon teals and purples.
- **Typography:** Heavy use of Monospace fonts (`font-mono`) for labels, stats, numbers, and code, paired with Display fonts (`font-display`) for large structural headings.
- **Density:** High-density dashboards akin to AWS, Vercel, or airplane cockpits. Information rich, visually structured.

---
*Generated by AI for the CodeArena Development Team.*
