# SkillForge — Complete API Documentation

Base URL: `http://localhost:4000/api`  
Auth: `Authorization: Bearer <accessToken>` header  
Refresh: HTTP-only cookie `refreshToken`

---

## Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Create account. Body: `{ email, password, fullName, username, role, ageGroup, interests[] }` |
| POST | `/auth/login` | No | Login. Body: `{ email, password }`. Returns `accessToken` + sets refresh cookie |
| POST | `/auth/logout` | No | Clear refresh cookie |
| POST | `/auth/refresh` | Cookie | Rotate tokens. Returns new `accessToken` |
| POST | `/auth/forgot-password` | No | Send OTP to email. Body: `{ email }` |
| POST | `/auth/reset-password` | No | Body: `{ email, otp, newPassword }` |
| GET | `/auth/google` | No | Redirect to Google OAuth |
| GET | `/auth/google/callback` | No | OAuth callback — redirects to `CLIENT_URL/auth/callback?token=...` |
| GET | `/auth/me` | Yes | Get current user with interests and badges |

---

## Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/me/stats` | Yes | Full stats: user, enrollments, badges, tournament history, activity logs, skill map |
| GET | `/users/:username` | Optional | Public profile |
| PUT | `/users/me` | Yes | Update `{ fullName, bio, avatarUrl }` |
| POST | `/users/:id/follow` | Yes | Follow a user |
| DELETE | `/users/:id/follow` | Yes | Unfollow a user |

---

## Courses

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/courses` | Optional | List courses. Query: `?category=slug&difficulty=BEGINNER&search=text&page=1&limit=20` |
| GET | `/courses/categories` | No | All categories with course counts |
| GET | `/courses/:id` | Optional | Course detail with lessons list. `:id` can be slug or UUID |
| POST | `/courses/:id/enroll` | Yes | Enroll in course |

---

## Lessons

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/lessons/:id` | Optional | Lesson with content and quiz (correct answers stripped). `:id` can be slug |
| POST | `/lessons/:id/complete` | Yes | Mark lesson complete, award XP, update course progress |
| POST | `/lessons/:id/quiz` | Yes | Submit quiz. Body: `{ answers: [0,2,1,...] }` (indices). Returns score, results, XP |

---

## Leaderboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/leaderboard/global` | Optional | All-time XP ranking. Query: `?page=1&limit=50` |
| GET | `/leaderboard/weekly` | Optional | XP earned in the last 7 days |
| GET | `/leaderboard/category/:slug` | Optional | Top learners in a category by courses completed |
| GET | `/leaderboard/friends` | Yes | Leaderboard among followed users + self |

---

## Tournaments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tournaments` | Optional | All tournaments. Query: `?status=ACTIVE` |
| GET | `/tournaments/current` | Optional | Active tournament + user entry status |
| GET | `/tournaments/:id` | Optional | Tournament detail |
| POST | `/tournaments/:id/join` | Yes | Join a tournament (free, awards +50 XP) |
| GET | `/tournaments/:id/scoreboard` | Optional | Top 100 entries sorted by score |
| POST | `/tournaments/:id/submit` | Yes | Submit result. Body: `{ code, language, score, timeTaken }` |

---

## 1v1 Battles

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/battles` | Yes | My battle history (last 20) |
| POST | `/battles` | Yes | Challenge someone. Body: `{ challengedUsername, problemId?, timeLimit? }` |
| GET | `/battles/:id` | Yes | Battle detail with submissions and report |
| POST | `/battles/:id/respond` | Yes | Accept/decline. Body: `{ accept: true/false }` |
| POST | `/battles/:id/submit` | Yes | Submit solution. Body: `{ code, language, passed, total, timeTaken }` |
| POST | `/battles/:id/complete` | Yes | Force complete (time expired) |

---

## Daily Quests

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/quests` | Yes | Today's 3 quests with user progress |
| POST | `/quests/progress` | Yes | Increment progress. Body: `{ type: 'LESSON_COMPLETE', increment: 1 }` |
| GET | `/quests/history` | Yes | Completed quest history + total XP + quest streak |

---

## Portfolio

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/portfolio/me` | Yes | My portfolio with projects |
| PUT | `/portfolio/me` | Yes | Update settings: `{ githubUsername, bio, skills, socialLinks, themeColor }` |
| GET | `/portfolio/me/readme` | Yes | Generate README markdown from SkillForge stats |
| POST | `/portfolio/me/push-github` | Yes | Push README to GitHub. Body: `{ token: 'ghp_...', repoName? }` |
| POST | `/portfolio/me/projects` | Yes | Add project: `{ title, description, language, code, tags, repoUrl, liveUrl, featured }` |
| GET | `/portfolio/user/:userId` | No | Public portfolio |

---

## AI Mentor

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/mentor` | Yes | My mentor sessions |
| POST | `/mentor/sessions` | Yes | Create new session. Body: `{ topic? }` |
| POST | `/mentor/sessions/:sessionId/message` | Yes | Send message. Body: `{ message, code? }` |
| DELETE | `/mentor/sessions/:id` | Yes | Delete session |

---

## Code Rooms

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/rooms` | Optional | List public rooms |
| POST | `/rooms` | Yes | Create room: `{ name, language, isPublic, maxUsers }` |
| GET | `/rooms/:id` | Optional | Room detail with participants |
| POST | `/rooms/:id/join` | Yes | Join room |
| PUT | `/rooms/:id/code` | Yes | Update code: `{ code?, language? }` |
| DELETE | `/rooms/:id/leave` | Yes | Leave room |

---

## Badges

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/badges` | No | All badges with rarity |
| GET | `/badges/user/:id` | No | Badges earned by a user |

---

## Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | Yes | My notifications (last 30) + unread count |
| PATCH | `/notifications/read-all` | Yes | Mark all as read |
| PATCH | `/notifications/:id/read` | Yes | Mark one as read |

---

## Skill DNA

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/skills/me` | Yes | Computed skill scores per category with weak/strong topics |

---

## Admin (ADMIN role required)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/stats` | Admin | Platform stats: users, courses, learning, tournaments, battles |
| GET | `/admin/users` | Admin | User list. Query: `?search=text&role=ADMIN&page=1` |
| PATCH | `/admin/users/:id/toggle` | Admin | Activate/suspend user |
| GET | `/admin/courses` | Admin | All courses with stats |
| PATCH | `/admin/courses/:id/toggle` | Admin | Publish/unpublish course |
| POST | `/admin/tournaments` | Admin | Create tournament: `{ title, type, startsAt, endsAt, xpBonus, description }` |
| GET | `/admin/hall-of-fame` | Admin | All time top 3 per week |

---

## Error Format

All errors return:
```json
{
  "error": "Human readable message"
}
```

Common status codes:
- `400` Bad request / validation failed
- `401` Unauthenticated
- `403` Forbidden (wrong role or not your resource)
- `404` Not found
- `409` Conflict (already exists)
- `410` Gone (expired)
- `500` Server error

---

## XP Awards Reference

| Action | XP |
|--------|-----|
| Account created (welcome) | +100 |
| Lesson complete | +50 (lesson.xpReward) |
| Quiz pass (≥70%) | +25 (50% of lesson XP) |
| Tournament join | +50 |
| Tournament submission | score × 0.5 |
| Battle win | +300 |
| Battle draw | +150 |
| Battle participation | +50 |
| Quest complete | +50–350 |
| 7-day streak | +200 |
| 30-day streak | +1000 |
| Course completion | course.xpReward |

---

## Level Thresholds

| Level | Name | XP Required |
|-------|------|-------------|
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
