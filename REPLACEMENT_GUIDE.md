# Replacement & Deployment Guide - CollabDebt Migration

Follow these steps to replace your existing repository code with the updated, real-time Supabase-backed version.

## Phase 1: Preparation
1. **Backup Your Files**: Before replacing anything, ensure you have a backup of your current `src` directory.
2. **Environment Variables**: Ensure your `.env.local` contains the following:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (required for Admin API)
   ```

## Phase 2: File Replacement
Replace the following files in your project with the versions provided:

### Core Logic & Store
- `src/store/useStore.ts`: Updated with Supabase mutation functions.
- `src/providers/DataProvider.tsx`: New component for global data hydration.
- `src/app/layout.tsx`: Updated to wrap children with `<DataProvider>`.

### Dashboard Pages
- `src/app/dashboard/page.tsx`: Main overview with live stats.
- `src/app/dashboard/debt-board/page.tsx`: Interactive board with mutations.
- `src/app/dashboard/analytics/page.tsx`: Advanced charts with derived data.
- `src/app/dashboard/team/page.tsx`: Live fleet member tracker.
- `src/app/dashboard/repos/page.tsx`: Dynamic repository health scan.
- `src/app/dashboard/sprints/page.tsx`: Temporal cycle tracking.
- `src/app/dashboard/manager/page.tsx`: ROI metrics and silent inspect.

### Global Components
- `src/app/dashboard/layout.tsx`: Updated sidebar with live badges and core status.

### New API Routes
- `src/app/api/email/admin-summary/route.ts`: New Admin Summary reporting endpoint.

## Phase 3: Dependencies
Ensure you have the latest dependencies installed:
```bash
npm install @supabase/supabase-js recharts framer-motion lucide-react zustand
```

## Phase 4: Final Verification
1. Run `npm run dev` to start the local server.
2. Navigate to `/dashboard` and verify that data is fetching from Supabase.
3. Test a status update on the **Debt Space** page to ensure mutations are working.
4. Check the **Command View** (if you have manager role) for cost-impact reports.

---
**Note:** If you encounter any UI regressions, check that your `index.css` contains the premium "antigravity" design tokens implemented in the previous phase.
