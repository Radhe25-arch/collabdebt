# SkillForge — Full-Stack Gamified Coding Platform

> Free. Forever. No paywalls. No ads. Pure code.

**11,359 lines of production code across 77 files.**

## What's Built

### 19 Frontend Pages
| Page | Description |
|------|-------------|
| Landing | Full marketing page with stats ticker, leaderboard preview, tournament info |
| Login | Terminal-aesthetic auth with Google OAuth |
| Register | 3-step signup: credentials → profile → interests |
| Dashboard | XP bar, stats, activity heatmap, widgets, leaderboard preview |
| Courses | Search + filter grid of all 127 courses |
| Course | Curriculum view with enroll + progress tracking |
| Lesson | Markdown content + code editor + quiz modal |
| Leaderboard | Global / weekly / category / friends tabs with podium |
| Tournaments | Card grid with live/upcoming/ended filters |
| Tournament | Live scoreboard polling, join + submit |
| 1v1 Battles | Challenge system with live timer, code editor, full report card |
| Battles List | History, win rate, challenge modal |
| Daily Quests | 3 daily quests with progress, XP rewards, quest streak |
| Portfolio | README auto-generator + GitHub push via PAT |
| AI Mentor | Chat interface with code review, session history |
| Code Rooms | Create / join collaborative coding sessions |
| Profile | Skill radar chart, badges, heatmap, course history |
| Admin Panel | Platform stats, user/course management, Hall of Fame |
| Settings | Profile update, account info |

### Backend: 16 API Route Groups, 60+ Endpoints
- Auth (register, login, refresh, logout, OAuth, password reset)
- Users (profile, stats, follow/unfollow)
- Courses + Lessons (enroll, progress, complete, quiz submit)
- Leaderboard (global, weekly, category, friends — Redis cached)
- Tournaments (CRUD, join, submit, live scoreboard)
- 1v1 Battles (challenge, respond, submit, auto-complete, report card)
- Daily Quests (generate, track progress, history)
- Portfolio (generate README, push to GitHub API)
- AI Mentor (chat sessions, code review)
- Code Rooms (create, join, real-time code sync)
- Badges, Notifications, Admin, Skill DNA

### Database: 33 Models, 9 Enums
User, Course, Lesson, Quiz, Tournament, Battle, BattleReport, DailyQuest, Portfolio, MentorSession, CodeRoom, SkillDNA, HallOfFame, XPTransaction, ActivityLog — all with full relations.

### Automation
- Weekly leaderboard reset + Hall of Fame archival (Monday 00:00 UTC)
- Tournament auto-creation (every Monday)
- Streak reminders via email (daily 09:00 UTC)
- Weekly summary emails (Sunday 23:00 UTC)

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Node.js 20 + Express.js |
| Database | PostgreSQL 16 + Prisma ORM |
| Cache | Redis 7 |
| Auth | JWT (access + refresh tokens, httpOnly cookies) + Google OAuth 2.0 |
| Email | Nodemailer (SMTP) |
| Jobs | node-cron |
| Deploy | Vercel (frontend) + Railway/Render (backend + DB) |

---

## Quick Start

### Prerequisites
- Node.js >= 18
- Docker (recommended) OR PostgreSQL 16 + Redis 7 installed locally

### Option A — Docker (Recommended, one command)

```bash
unzip codearena-fullstack.zip && cd codearena

# Copy and edit environment variables
cp server/.env.example server/.env
# Edit server/.env: set JWT secrets, optional Google OAuth + SMTP

# Start everything
docker-compose up -d

# Seed the database
docker exec codearena_server node prisma/seed.js
```

Access: http://localhost:5173

### Option B — Local Development

```bash
unzip codearena-fullstack.zip && cd codearena

# Install all dependencies
npm run install:all

# Configure server
cp server/.env.example server/.env
# Edit server/.env — set DATABASE_URL, JWT secrets, etc.

# Run database migrations + seed
npm run db:migrate
npm run db:seed

# Start both servers (concurrently)
npm run dev
```

**Frontend:** http://localhost:5173  
**Backend API:** http://localhost:4000  
**API Health:** http://localhost:4000/health

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@codearena.dev | Admin@SkillForge1 |
| Student | demo@codearena.dev | Demo@Arena1 |

---

## Environment Variables

See `server/.env.example` for the full list. Required to run:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/codearena
JWT_ACCESS_SECRET=<32+ char random string>
JWT_REFRESH_SECRET=<32+ char random string>
```

Optional (needed for full features):

```env
# Google OAuth (for Sign in with Google)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Email (for password reset + weekly summaries)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
```

---

## Deploy to Production

### Frontend → Vercel
```bash
cd client
npm run build
vercel --prod
```
Set environment variable in Vercel: `VITE_API_URL=https://your-api.railway.app`

### Backend → Railway
```bash
railway login && railway init
railway add postgresql
railway add redis
railway variables set JWT_ACCESS_SECRET=... JWT_REFRESH_SECRET=...
railway up
```

---

## Project Structure

```
codearena/
├── client/                          # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx                  # Router with all 19 routes
│   │   ├── main.jsx
│   │   ├── assets/icons/index.jsx   # 35+ custom SVG icons
│   │   ├── components/
│   │   │   ├── ui/index.jsx         # Button, Input, Modal, XPBar, Avatar, etc.
│   │   │   └── layout/AppLayout.jsx # Sidebar + topbar + notifications
│   │   ├── hooks/index.js           # useAuth, useDebounce, useCountdown, etc.
│   │   ├── lib/api.js               # Axios + auto token refresh
│   │   ├── pages/                   # 19 page components
│   │   ├── store/index.js           # Zustand (auth + UI)
│   │   └── styles/globals.css       # Design system CSS variables + classes
│   ├── tailwind.config.js
│   ├── vite.config.js               # Path alias @/ → src/
│   └── package.json
│
└── server/                          # Express backend
    ├── prisma/
    │   ├── schema.prisma            # 33 models, 9 enums
    │   └── seed.js                  # Categories, courses, lessons, quizzes, users
    ├── src/
    │   ├── index.js                 # App entry, all middleware + routes
    │   ├── config/
    │   │   ├── db.js                # Prisma client singleton
    │   │   ├── redis.js             # Redis client + cache helpers
    │   │   └── passport.js          # Google OAuth strategy
    │   ├── middleware/
    │   │   ├── auth.js              # JWT authenticate / requireAdmin / optionalAuth
    │   │   └── errorHandler.js
    │   ├── controllers/             # 9 controllers
    │   ├── routes/                  # 11 route files
    │   └── utils/
    │       ├── xp.js                # XP engine: 10 levels, awardXP()
    │       ├── jwt.js               # Sign/verify access+refresh tokens
    │       ├── email.js             # Password reset, streak, weekly summary
    │       ├── cronJobs.js          # Weekly reset, reminders, summaries
    │       ├── logger.js            # Winston
    │       └── AppError.js          # Custom operational error class
    ├── .env.example
    ├── Dockerfile
    └── package.json
```

---

## API Reference

Full endpoint documentation: **`API.md`**

Quick overview:
- `POST /api/auth/register` — create account
- `POST /api/auth/login` — get tokens
- `GET  /api/courses` — list courses (filter: category, difficulty, search)
- `POST /api/battles` — challenge a user by username
- `GET  /api/leaderboard/global` — top users by XP
- `GET  /api/quests` — today's 3 daily quests
- `GET  /api/portfolio/me/readme` — auto-generate GitHub README
- `POST /api/mentor/sessions/:id/message` — chat with AI mentor

---

## XP & Leveling

| Level | Name | XP |
|-------|------|----|
| 1 | Beginner | 0 |
| 2 | Apprentice | 500 |
| 3 | Coder | 1,200 |
| 4 | Developer | 2,500 |
| 5 | Senior Dev | 4,500 |
| 6 | Architect | 7,500 |
| 7 | Pro | 12,000 |
| 8 | Expert | 18,000 |
| 9 | Master | 26,000 |
| 10 | Legend | 36,000 |

XP sources: lesson complete (+50), quiz pass (+25), tournament join (+50), battle win (+300), daily quest (+50–350), 7-day streak (+200), 30-day streak (+1000).
