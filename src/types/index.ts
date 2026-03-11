// ── USER & AUTH ──────────────────────────────────────────────────────────────
export type UserPlan = 'free' | 'pro' | 'team' | 'enterprise'
export type UserRole = 'developer' | 'manager' | 'viewer'

export interface User {
  id: string
  email: string
  name: string
  username?: string
  bio?: string
  gender?: string
  user_code: string // CD#XXXX
  plan: UserPlan
  role: UserRole
  workspace_id?: string
  avatar_url?: string
  onboarding_done: boolean
  created_at: string
  last_seen: string
}

// ── WORKSPACE ────────────────────────────────────────────────────────────────
export interface Workspace {
  id: string
  name: string
  owner_id: string
  invite_code: string
  plan: UserPlan
  created_at: string
}

// ── REPO ─────────────────────────────────────────────────────────────────────
export type RepoProvider = 'github' | 'gitlab' | 'bitbucket'

export interface Repo {
  id: string
  workspace_id: string
  name: string
  provider: RepoProvider
  full_name: string
  url: string
  default_branch: string
  webhook_id?: string
  health_score: number // 0-100
  last_scanned?: string
  access_token?: string
}

// ── DEBT ─────────────────────────────────────────────────────────────────────
export type DebtType = 'todo' | 'deprecated' | 'complexity' | 'duplicate' | 'dead_code' | 'security' | 'performance'
export type DebtSeverity = 'critical' | 'high' | 'medium' | 'low'
export type DebtStatus = 'identified' | 'planned' | 'in_progress' | 'fixed'

export interface DebtItem {
  id: string
  repo_id: string
  title: string
  description: string
  file_path: string
  line_start: number
  line_end: number
  type: DebtType
  severity: DebtSeverity
  status: DebtStatus
  cost_usd: number
  fix_days: number
  votes: number
  assigned_to?: string
  pr_url?: string
  fixed_at?: string
  sprint_id?: string
  created_by: 'scanner' | 'manual'
  created_at: string
  // joined
  repo?: Repo
  assignee?: User
}

// ── COLLAB ───────────────────────────────────────────────────────────────────
export interface CollabSession {
  id: string
  token: string
  host_id: string
  workspace_id: string
  repo_id?: string
  file_path: string
  active: boolean
  participants: string[]
  created_at: string
  ended_at?: string
  // joined
  host?: User
}

export interface CollabCursor {
  userId: string
  name: string
  color: string
  line: number
  column: number
}

export type CollabEventType = 'join' | 'leave' | 'edit' | 'cursor' | 'chat' | 'inspect'

export interface CollabEvent {
  type: CollabEventType
  userId: string
  name?: string
  delta?: unknown
  cursor?: CollabCursor
  message?: string
  silent?: boolean
}

// ── AI ───────────────────────────────────────────────────────────────────────
export interface AIUsage {
  id: string
  user_id: string
  date: string
  minutes_used: number
  tokens_used: number
  updated_at: string
}

export interface AIExplanation {
  debt_id: string
  explanation: string
  cost_usd: number
  fix_days: number
  severity: DebtSeverity
}

export interface AISprintRecommendation {
  sprint_percentage: number
  items: DebtItem[]
  velocity_gain: number
  total_savings: number
  reasoning: string
}

// ── SPRINT ───────────────────────────────────────────────────────────────────
export type SprintStatus = 'active' | 'completed' | 'planned'

export interface Sprint {
  id: string
  workspace_id: string
  name: string
  start_date: string
  end_date: string
  status: SprintStatus
  ai_recommendation?: string
  created_at: string
}

// ── PAYMENTS ─────────────────────────────────────────────────────────────────
export type PaymentStatus = 'pending' | 'success' | 'failed'
export type BillingCycle = 'monthly' | 'yearly'

export interface Payment {
  id: string
  user_id: string
  plan: UserPlan
  billing: BillingCycle
  amount: number
  currency: 'USD' | 'INR'
  razorpay_order_id?: string
  razorpay_payment_id?: string
  status: PaymentStatus
  created_at: string
}

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export type NotificationType = 'debt_alert' | 'payment' | 'connection' | 'sprint'

export interface AppNotification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  link?: string
  created_at: string
}

// ── MESSAGES ─────────────────────────────────────────────────────────────────
export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read_at?: string
  created_at: string
  sender?: User
}

// ── CONNECTIONS ──────────────────────────────────────────────────────────────
export type ConnectionStatus = 'pending' | 'accepted' | 'blocked'

export interface Connection {
  id: string
  requester_id: string
  receiver_id: string
  status: ConnectionStatus
  created_at: string
}

// ── ANALYTICS ────────────────────────────────────────────────────────────────
export interface WeeklyStats {
  week: string
  added: number
  fixed: number
}

export interface ModuleDebt {
  module: string
  items: number
  cost: number
}

export interface TeamMember extends User {
  items_fixed: number
  items_created: number
  last_activity?: string
  current_file?: string
  online: boolean
}

// ── PRICING ──────────────────────────────────────────────────────────────────
export interface PricingPlan {
  id: UserPlan
  name: string
  price_monthly: number
  price_yearly: number
  features: string[]
  limits: {
    repos: number | 'unlimited'
    members: number | 'unlimited'
    debt_items: number | 'unlimited'
    ai_hours: number | 'unlimited'
  }
  popular?: boolean
  cta: string
}

// ── TECH PROFILE (CollabConnect™) ─────────────────────────────────────────
export type ExperienceLevel = 'student' | 'junior' | 'mid' | 'senior' | 'staff' | 'founder'
export type Availability = 'full_time' | 'part_time' | 'weekends' | 'not_available'

export type TechRole =
  | 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'devops'
  | 'data_engineer' | 'ml_engineer' | 'data_scientist' | 'security'
  | 'qa' | 'architect' | 'manager' | 'product' | 'designer'
  | 'blockchain' | 'embedded'

export type CollabGoal =
  | 'fix_debt' | 'find_collab' | 'hire' | 'freelance'
  | 'opensource' | 'learn' | 'mentor'

// Extended User with tech profile
export interface UserWithProfile extends User {
  tech_roles?: TechRole[]
  experience_level?: ExperienceLevel
  skills?: string[]
  collab_goals?: CollabGoal[]
  open_to_work?: boolean
  availability?: Availability
  github_url?: string
  portfolio_url?: string
  linkedin_url?: string
  hourly_rate?: number
}

// ── PROJECT COLLABS ───────────────────────────────────────────────────────
export type ProjectCollabStatus = 'open' | 'in_progress' | 'completed' | 'closed'

export interface ProjectCollab {
  id: string
  title: string
  description?: string
  owner_id: string
  tech_stack: string[]
  roles_needed: TechRole[]
  status: ProjectCollabStatus
  max_members: number
  is_paid: boolean
  created_at: string
  // joined
  owner?: UserWithProfile
  members?: UserWithProfile[]
}
