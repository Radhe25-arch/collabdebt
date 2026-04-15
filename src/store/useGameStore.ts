import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Quest {
  id: string;
  title: string;
  progress: number;
  total: number;
  xp: number;
  done: boolean;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  totalXp: number;
  rank: number;
  elo: number;
  coursesCompleted: number;
}

export interface CourseProgress {
  completedLessons: number[];
  lastAccessed: number; // timestamp
}

interface GameState {
  stats: UserStats;
  quests: Quest[];
  courseProgress: Record<string, CourseProgress>;
  addXP: (amount: number) => void;
  completeQuest: (id: string) => void;
  completeLesson: (courseId: string, lessonId: number, xp: number) => void;
  updateStats: (updates: Partial<UserStats>) => void;
  updateElo: (delta: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      stats: {
        xp: 12450,
        level: 42,
        streak: 14,
        totalXp: 12450,
        rank: 1024,
        elo: 1842,
        coursesCompleted: 8,
      },
      quests: [
        { id: '1', title: 'Complete 2 Lessons', progress: 1, total: 2, xp: 50, done: false },
        { id: '2', title: 'Win a Battle', progress: 0, total: 1, xp: 100, done: false },
        { id: '3', title: 'Help in Forum', progress: 3, total: 3, xp: 75, done: true },
        { id: '4', title: 'Run 5 Code Challenges', progress: 4, total: 5, xp: 60, done: false },
      ],
      courseProgress: {},
      addXP: (amount) =>
        set((state) => {
          const newXp = state.stats.xp + amount;
          const xpToNextLevel = state.stats.level * 1000;
          
          if (newXp >= xpToNextLevel) {
            return {
              stats: {
                ...state.stats,
                xp: newXp - xpToNextLevel,
                level: state.stats.level + 1,
                totalXp: state.stats.totalXp + amount,
              },
            };
          }
          return {
            stats: {
              ...state.stats,
              xp: newXp,
              totalXp: state.stats.totalXp + amount,
            },
          };
        }),
      completeQuest: (id) =>
        set((state) => {
          const quest = state.quests.find((q) => q.id === id);
          if (quest && !quest.done) {
            const updatedQuests = state.quests.map((q) =>
              q.id === id ? { ...q, progress: q.total, done: true } : q
            );
            
            // Reusing logic from addXP here for simplicity in one set call
            const newXp = state.stats.xp + quest.xp;
            const xpToNextLevel = state.stats.level * 1000;
            let finalXp = newXp;
            let finalLevel = state.stats.level;
            if (newXp >= xpToNextLevel) {
              finalXp -= xpToNextLevel;
              finalLevel += 1;
            }

            return {
              quests: updatedQuests,
              stats: {
                ...state.stats,
                xp: finalXp,
                level: finalLevel,
                totalXp: state.stats.totalXp + quest.xp,
              },
            };
          }
          return state;
        }),
      completeLesson: (courseId, lessonId, xp) =>
        set((state) => {
          const currentProgress = state.courseProgress[courseId] || { completedLessons: [], lastAccessed: 0 };
          
          // Don't award XP twice for the same lesson
          if (currentProgress.completedLessons.includes(lessonId)) {
            return {
              courseProgress: {
                ...state.courseProgress,
                [courseId]: { ...currentProgress, lastAccessed: Date.now() }
              }
            };
          }

          const newCompleted = [...currentProgress.completedLessons, lessonId];
          const newXp = state.stats.xp + xp;
          const xpToNextLevel = state.stats.level * 1000;
          let finalXp = newXp;
          let finalLevel = state.stats.level;
          if (newXp >= xpToNextLevel) {
            finalXp -= xpToNextLevel;
            finalLevel += 1;
          }

          return {
            courseProgress: {
              ...state.courseProgress,
              [courseId]: { completedLessons: newCompleted, lastAccessed: Date.now() }
            },
            stats: {
              ...state.stats,
              xp: finalXp,
              level: finalLevel,
              totalXp: state.stats.totalXp + xp,
            }
          };
        }),
      updateStats: (updates) =>
        set((state) => ({
          stats: { ...state.stats, ...updates },
        })),
      updateElo: (delta) =>
        set((state) => ({
          stats: { ...state.stats, elo: state.stats.elo + delta },
        })),
    }),
    {
      name: 'skillforge-storage-v2', // bumped version to clear old schema
    }
  )
);
