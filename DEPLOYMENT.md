# SkillForge — Deployment Guide

## What You Need (Inputs Checklist)

### Mandatory
| Input | Where to Get | Cost |
|-------|-------------|------|
| `DATABASE_URL` | PostgreSQL connection string | Free tier available |
| `JWT_ACCESS_SECRET` | Generate locally: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` | Free |
| `JWT_REFRESH_SECRET` | Same command, run again | Free |

### Recommended
| Input | Where to Get | Cost |
|-------|-------------|------|
| `SMTP_*` vars | Gmail App Password or Resend.com | Free |
| `GOOGLE_CLIENT_ID/SECRET` | console.cloud.google.com | Free |

---

## Option 1 — Supabase + Railway + Vercel (Recommended)

### Step 1 — Supabase (Database)
1. Go to [supabase.com](https://supabase.com) → New Project
2. Settings → Database → **Connection string** → copy both:
   - **Pooler URI** → `DATABASE_URL` in your `.env`
   - **Direct connection** → `DIRECT_URL` in your `.env`
3. That's it — Prisma handles the schema

### Step 2 — Upstash Redis (Cache)
1. Go to [upstash.com](https://upstash.com) → Create Database → Redis
2. Region: same as your Supabase region
3. Copy **Redis URL** → `REDIS_URL` in your `.env`

### Step 3 — Deploy Backend to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Set environment variables
railway variables set DATABASE_URL="postgresql://..."
railway variables set DIRECT_URL="postgresql://..."
railway variables set REDIS_URL="rediss://..."
railway variables set JWT_ACCESS_SECRET="your_64_char_hex"
railway variables set JWT_REFRESH_SECRET="your_64_char_hex"
railway variables set CLIENT_URL="https://your-app.vercel.app"
railway variables set NODE_ENV="production"
# Optional:
railway variables set GOOGLE_CLIENT_ID="..."
railway variables set GOOGLE_CLIENT_SECRET="..."
railway variables set SMTP_HOST="smtp.gmail.com"
railway variables set SMTP_PORT="587"
railway variables set SMTP_USER="your@gmail.com"
railway variables set SMTP_PASS="your_app_password"
railway variables set EMAIL_FROM="SkillForge <noreply@yourdomain.com>"

# Run migrations
railway run npx prisma migrate deploy
railway run node prisma/seed.js
```

### Step 4 — Deploy Frontend to Vercel
```bash
# In client/ directory
# Set environment variable in Vercel dashboard:
# VITE_API_URL = https://your-railway-app.railway.app

cd client
npm run build
vercel --prod
```

Update `GOOGLE_CALLBACK_URL` to: `https://your-railway-app.railway.app/api/auth/google/callback`

---

## Option 2 — Docker (Local / VPS)

```bash
# 1. Clone and configure
cp server/.env.example server/.env
# Edit server/.env — fill in DATABASE_URL, JWT secrets at minimum

# 2. Start everything
docker-compose up -d

# 3. Run migrations and seed
docker exec skillforge_server npx prisma migrate deploy
docker exec skillforge_server node prisma/seed.js

# 4. Access
# Frontend: http://localhost:5173
# Backend:  http://localhost:4000
```

---

## Generating JWT Secrets

Run this in your terminal to generate secure secrets:

```bash
node -e "
const crypto = require('crypto');
console.log('JWT_ACCESS_SECRET=' + crypto.randomBytes(64).toString('hex'));
console.log('JWT_REFRESH_SECRET=' + crypto.randomBytes(64).toString('hex'));
"
```

---

## Setting Up Gmail SMTP

1. Enable 2-Factor Authentication on your Gmail account
2. Go to: **Google Account → Security → 2-Step Verification → App passwords**
3. Select app: **Mail** / device: **Other (SkillForge)**
4. Copy the 16-character password → use as `SMTP_PASS`
5. Use your full Gmail address as `SMTP_USER`

**Or use Resend (easier):**
1. Sign up at [resend.com](https://resend.com)
2. API Keys → Create Key → copy it
3. Set: `SMTP_HOST=smtp.resend.com`, `SMTP_USER=resend`, `SMTP_PASS=re_xxxxx`

---

## Setting Up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project (or select existing)
3. APIs & Services → **OAuth consent screen** → External → Fill basic info
4. APIs & Services → **Credentials** → Create → OAuth 2.0 Client ID
5. Application type: **Web application**
6. Authorized redirect URIs: `https://your-api.railway.app/api/auth/google/callback`
7. Copy **Client ID** and **Client Secret** to `.env`

---

## Test Credentials (from seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@skillforge.dev | Admin@SkillForge1 |
| Student | demo@skillforge.dev | Demo@Arena1 |

---

## Minimum Viable Deploy

For the fastest possible production deploy with zero cost:

```
DATABASE_URL   → Supabase free tier (500MB)
REDIS_URL      → Upstash free tier (10k commands/day)
JWT_*_SECRET   → Generated locally
SMTP_*         → Gmail with App Password
GOOGLE_*       → Optional (disables Google login if omitted)
```

All free. All production-ready.
