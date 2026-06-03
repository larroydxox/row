import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Priority = 'high' | 'medium' | 'low'
export type TaskDate = 'today' | 'tomorrow' | 'week' | 'someday'

export interface Task {
  id: string
  title: string
  done: boolean
  priority: Priority
  tag: string
  date: TaskDate
  createdAt: string
}

export interface MonthGoal {
  id: string
  text: string
  done: boolean
}

interface TasksStore {
  tasks: Task[]
  monthGoals: MonthGoal[]
  streak: number
  lastCompletedDate: string | null
  addTask: (title: string, priority?: Priority, tag?: string, date?: TaskDate) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  addMonthGoal: (text: string) => void
  toggleMonthGoal: (id: string) => void
  deleteMonthGoal: (id: string) => void
}

export const useTasksStore = create<TasksStore>()(persist(
  (set, get) => ({
    tasks: [],
    monthGoals: [],
    streak: 0,
    lastCompletedDate: null,

    addTask: (title, priority = 'medium', tag = 'pessoal', date = 'today') =>
      set((s) => ({
        tasks: [...s.tasks, {
          id: crypto.randomUUID(),
          title, done: false,
          priority: priority ?? 'medium',
          tag: tag ?? 'pessoal',
          date: date ?? 'today',
          createdAt: new Date().toISOString(),
        }],
      })),

    toggleTask: (id) => {
      set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t) }))
      const today = new Date().toDateString()
      const { lastCompletedDate, streak } = get()
      if (lastCompletedDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        set({
          streak: lastCompletedDate === yesterday ? streak + 1 : 1,
          lastCompletedDate: today,
        })
      }
    },

    deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

    updateTask: (id, updates) =>
      set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, ...updates } : t) })),

    addMonthGoal: (text) =>
      set((s) => ({ monthGoals: [...s.monthGoals, { id: crypto.randomUUID(), text, done: false }] })),

    toggleMonthGoal: (id) =>
      set((s) => ({ monthGoals: s.monthGoals.map((g) => g.id === id ? { ...g, done: !g.done } : g) })),

    deleteMonthGoal: (id) =>
      set((s) => ({ monthGoals: s.monthGoals.filter((g) => g.id !== id) })),
  }),
  { name: 'valios-tasks' }
))

// Retrocompatibilidade
export const useTasks = useTasksStore
