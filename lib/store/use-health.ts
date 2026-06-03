import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WaterLog { id: string; amount: number; time: string }
export interface GymSession { id: string; date: string; type: string; exercises: unknown[] }

interface HealthStore {
  waterLog: WaterLog[]
  gymSessions: GymSession[]
  addWater: (amount: number) => void
  removeWaterEntry: (id: string) => void
  addGymSession: (type: string) => void
  toggleGymStatus: () => void  // retrocompat
  getTodayWater: () => number
  getTodaySession: () => GymSession | undefined
}

export const useHealthStore = create<HealthStore>()(persist(
  (set, get) => ({
    waterLog: [],
    gymSessions: [],

    addWater: (amount) =>
      set((s) => ({
        waterLog: [...s.waterLog, { id: crypto.randomUUID(), amount, time: new Date().toISOString() }],
      })),

    removeWaterEntry: (id) =>
      set((s) => ({ waterLog: s.waterLog.filter((l) => l.id !== id) })),

    addGymSession: (type) =>
      set((s) => ({
        gymSessions: [...s.gymSessions, { id: crypto.randomUUID(), date: new Date().toDateString(), type, exercises: [] }],
      })),

    toggleGymStatus: () => {
      const today = new Date().toDateString()
      const existing = get().gymSessions.find((s) => s.date === today)
      if (existing) {
        set((s) => ({ gymSessions: s.gymSessions.filter((x) => x.id !== existing.id) }))
      } else {
        get().addGymSession('Treino')
      }
    },

    getTodayWater: () => {
      const today = new Date().toDateString()
      return get().waterLog
        .filter((l) => new Date(l.time).toDateString() === today)
        .reduce((a, l) => a + l.amount, 0)
    },

    getTodaySession: () => {
      const today = new Date().toDateString()
      return get().gymSessions.find((s) => s.date === today)
    },
  }),
  { name: 'valios-health' }
))

// Retrocompatibilidade: expõe um shape similar ao antigo useHealth para componentes legados
export const useHealth = (selector: (s: { health: ReturnType<typeof buildLegacyHealth> }) => unknown) => {
  const store = useHealthStore()
  return selector({ health: buildLegacyHealth(store) })
}

function buildLegacyHealth(store: ReturnType<typeof useHealthStore.getState>) {
  const todayStr = new Date().toDateString()
  const todayLog = store.waterLog.filter((l) => new Date(l.time).toDateString() === todayStr)
  const consumed = todayLog.reduce((a, l) => a + l.amount, 0)
  const session  = store.gymSessions.find((s) => s.date === todayStr)
  return {
    water: { consumed, goal: 2000, log: todayLog, streak: 0, weeklyData: [] },
    food:  { kcalGoal: 2000, kcalConsumed: 0, macros: {}, meals: [], weeklyKcal: [] },
    gym:   { today: { status: session ? 'done' : 'pending', type: session?.type ?? 'Treino', exercises: [] }, history: [] },
  }
}
