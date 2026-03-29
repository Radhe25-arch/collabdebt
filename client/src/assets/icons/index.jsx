// Centralized SVG icon set for SkillForge — no emoji, pure vectors
// Usage: <Icon.Home size={18} className="text-ink-secondary" />

const Icon = ({ d, size = 18, className = '', strokeWidth = 1.5, fill = 'none', ...rest }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill={fill} stroke="currentColor" strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round"
    className={className} {...rest}
  >
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

// Navigation
export const HomeIcon       = (p) => <Icon {...p} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" />;
export const CoursesIcon    = (p) => <Icon {...p} d={["M4 19.5A2.5 2.5 0 016.5 17H20","M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"]} />;
export const TrophyIcon     = (p) => <Icon {...p} d={["M6 9H4.5a2.5 2.5 0 010-5H6","M18 9h1.5a2.5 2.5 0 000-5H18","M4 22h16","M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22","M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22","M18 2H6v7a6 6 0 0012 0V2z"]} />;
export const LeaderboardIcon= (p) => <Icon {...p} d="M18 20V10 M12 20V4 M6 20v-6" />;
export const TournamentIcon = (p) => <Icon {...p} d={["M8 6h13","M8 12h13","M8 18h13","M3 6h.01","M3 12h.01","M3 18h.01"]} />;
export const ProfileIcon    = (p) => <Icon {...p} d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"]} />;
export const SettingsIcon   = (p) => <Icon {...p} d={["M12 15a3 3 0 100-6 3 3 0 000 6z","M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"]} />;
export const AdminIcon      = (p) => <Icon {...p} d={["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"]} />;
export const BellIcon       = (p) => <Icon {...p} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0" />;

// Actions
export const PlusIcon       = (p) => <Icon {...p} d="M12 5v14 M5 12h14" />;
export const SearchIcon     = (p) => <Icon {...p} d={["M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"]} />;
export const ChevronRight   = (p) => <Icon {...p} d="M9 18l6-6-6-6" />;
export const ChevronDown    = (p) => <Icon {...p} d="M6 9l6 6 6-6" />;
export const ChevronLeft    = (p) => <Icon {...p} d="M15 18l-6-6 6-6" />;
export const ArrowRight     = (p) => <Icon {...p} d="M5 12h14 M12 5l7 7-7 7" />;
export const ArrowLeft      = (p) => <Icon {...p} d="M19 12H5 M12 19l-7-7 7-7" />;
export const XIcon          = (p) => <Icon {...p} d="M18 6L6 18 M6 6l12 12" />;
export const CheckIcon      = (p) => <Icon {...p} d="M20 6L9 17l-5-5" />;
export const CopyIcon       = (p) => <Icon {...p} d={["M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2z","M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"]} />;
export const ExternalLink   = (p) => <Icon {...p} d={["M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6","M15 3h6v6","M10 14L21 3"]} />;
export const LogOutIcon     = (p) => <Icon {...p} d={["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"]} />;
export const MenuIcon       = (p) => <Icon {...p} d="M3 12h18 M3 6h18 M3 18h18" />;
export const SidebarIcon    = (p) => <Icon {...p} d={["M3 3h18v18H3z","M9 3v18"]} />;

// Gamification
export const ZapIcon        = (p) => <Icon {...p} fill="currentColor" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
export const StarIcon       = (p) => <Icon {...p} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
export const FireIcon       = (p) => <Icon {...p} d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />;
export const ShieldIcon     = (p) => <Icon {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
export const AwardIcon      = (p) => <Icon {...p} d={["M12 15a7 7 0 100-14 7 7 0 000 14z","M8.21 13.89L7 23l5-3 5 3-1.21-9.12"]} />;
export const TargetIcon     = (p) => <Icon {...p} d={["M12 22a10 10 0 100-20 10 10 0 000 20z","M12 18a6 6 0 100-12 6 6 0 000 12z","M12 14a2 2 0 100-4 2 2 0 000 4z"]} />;
export const TrendingUpIcon = (p) => <Icon {...p} d="M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6" />;

// Content
export const CodeIcon       = (p) => <Icon {...p} d="M16 18l6-6-6-6 M8 6l-6 6 6 6" />;
export const TerminalIcon   = (p) => <Icon {...p} d={["M4 17l6-6-6-6","M12 19h8"]} />;
export const PlayIcon       = (p) => <Icon {...p} fill="currentColor" d="M5 3l14 9-14 9V3z" />;
export const BookIcon       = (p) => <Icon {...p} d={["M4 19.5A2.5 2.5 0 016.5 17H20","M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"]} />;
export const VideoIcon      = (p) => <Icon {...p} d={["M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z","M9.75 15.02L15.5 12l-5.75-3.02v6.04z"]} />;
export const ClockIcon      = (p) => <Icon {...p} d={["M12 22a10 10 0 100-20 10 10 0 000 20z","M12 6v6l4 2"]} />;
export const CalendarIcon   = (p) => <Icon {...p} d={["M8 7V3 M16 7V3 M3 11h18","M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"]} />;
export const UsersIcon      = (p) => <Icon {...p} d={["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M9 11a4 4 0 100-8 4 4 0 000 8z","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75"]} />;
export const GlobeIcon      = (p) => <Icon {...p} d={["M12 22a10 10 0 100-20 10 10 0 000 20z","M2 12h20","M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"]} />;
export const MessageSquareIcon = (p) => <Icon {...p} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />;
export const UserIcon          = (p) => <Icon {...p} d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"]} />;
export const UserPlusIcon      = (p) => <Icon {...p} d={["M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M9 11a4 4 0 100-8 4 4 0 000 8z","M19 8v6","M16 11h6"]} />;
export const KeyboardIcon      = (p) => <Icon {...p} d={["M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6z","M6 10h.01 M10 10h.01 M14 10h.01 M18 10h.01 M8 14h8"]} />;

export default {
  Home: HomeIcon, Courses: CoursesIcon, Trophy: TrophyIcon,
  Leaderboard: LeaderboardIcon, Tournament: TournamentIcon,
  Profile: ProfileIcon, Settings: SettingsIcon, Admin: AdminIcon,
  Bell: BellIcon, Plus: PlusIcon, Search: SearchIcon,
  ChevronRight, ChevronDown, ChevronLeft,
  ArrowRight, ArrowLeft, X: XIcon, XIcon, Check: CheckIcon,
  Copy: CopyIcon, ExternalLink, LogOut: LogOutIcon,
  Menu: MenuIcon, Sidebar: SidebarIcon,
  Zap: ZapIcon, Star: StarIcon, Fire: FireIcon,
  Shield: ShieldIcon, Award: AwardIcon, Target: TargetIcon,
  TrendingUp: TrendingUpIcon,
  Code: CodeIcon, Terminal: TerminalIcon, Play: PlayIcon,
  Book: BookIcon, Video: VideoIcon, Clock: ClockIcon,
  Calendar: CalendarIcon, Users: UsersIcon, Globe: GlobeIcon,
  MessageSquare: MessageSquareIcon, User: UserIcon, UserPlus: UserPlusIcon,
  Keyboard: KeyboardIcon,
};
