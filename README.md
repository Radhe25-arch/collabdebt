# CollabDebt 🚀

**Engineering Intelligence Platform** — Detect, quantify, and fix technical debt together.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
# or
pnpm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Set up Supabase
1. Go to [supabase.com](https://supabase.com) → New Project → name: `collabdebt`
2. Go to **SQL Editor** → paste `supabase/migrations/001_init.sql` → Run
3. Go to **Settings → API** → copy Project URL + anon key + service role key
4. Go to **Authentication → Providers** → enable Google + GitHub
5. Set **Site URL**: `https://collabdebt.com` (or `http://localhost:3000` for dev)
6. Add **Redirect URL**: `http://localhost:3000/api/auth/callback`

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | dashboard.razorpay.com → API Keys |
| `RAZORPAY_KEY_SECRET` | dashboard.razorpay.com → API Keys |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay → Webhooks |
| `RESEND_API_KEY` | resend.com → API Keys |
| `EMAIL_FROM` | `collabdebt@gmail.com` or your verified domain |

---

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Auth**: Supabase Auth (Google + GitHub + Email)
- **Database**: Supabase PostgreSQL
- **Real-time**: Supabase Realtime (collab sessions)
- **AI**: Anthropic Claude API (claude-sonnet-4)
- **Email**: Resend.com
- **Payments**: Razorpay
- **Code Editor**: Monaco Editor (@monaco-editor/react)
- **Hosting**: Vercel

---

## Test Account (Full Access)

For testing all features without payment:
```
Email:    test@collabdebt.dev
Password: CollabTest@2024
Plan:     Enterprise (all features unlocked)
```

---

## Deploy to Vercel

```bash
# Push to GitHub first
git init && git add . && git commit -m "feat: initial collabdebt"
git remote add origin https://github.com/YOUR_USERNAME/collabdebt.git
git push -u origin main
```

1. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
2. Add all environment variables from `.env.local`
3. Deploy — done!

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              ← Landing page
│   ├── auth/                 ← Login, signup, verify, reset
│   ├── dashboard/            ← All 9 dashboard pages
│   └── api/                  ← All API routes
├── components/
│   ├── ui/                   ← Reusable components
│   └── onboarding/           ← First-time guide
├── lib/
│   ├── supabase/             ← client.ts + server.ts
│   ├── mock-data.ts          ← Dev data
│   └── ai/                   ← Claude API utilities
└── types/
    └── index.ts              ← All TypeScript types
```

---

## Support

support.collabdebt.com
# collabdebt
