import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ConfigStore {
  userName: string
  waterGoal: number
  kcalGoal: number
  currency: 'BRL'
  setUserName: (n: string) => void
  setWaterGoal: (n: number) => void
  setKcalGoal: (n: number) => void
}

export const useConfigStore = create<ConfigStore>()(persist(
  (set) => ({
    userName: '',
    waterGoal: 2000,
    kcalGoal: 2000,
    currency: 'BRL',
    setUserName: (n) => set({ userName: n }),
    setWaterGoal: (n) => set({ waterGoal: n }),
    setKcalGoal: (n) => set({ kcalGoal: n }),
  }),
  { name: 'valios-config' }
))
