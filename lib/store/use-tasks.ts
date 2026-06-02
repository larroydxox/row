import { create } from 'zustand'
import { mockTasks, Task } from '../data/mock-tasks'

interface TasksState {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id'>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  updateTask: (id: string, updates: Partial<Task>) => void
}

export const useTasks = create<TasksState>((set) => ({
  tasks: mockTasks,
  addTask: (task) =>
    set((s) => ({
      tasks: [...s.tasks, { ...task, id: crypto.randomUUID() }],
    })),
  toggleTask: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    })),
  deleteTask: (id) =>
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
}))
