import { create } from 'zustand'
import { mockHealth } from '../data/mock-health'

interface HealthState {
  health: typeof mockHealth
  addWater: (ml: number) => void
  removeWaterEntry: (idx: number) => void
  toggleGymStatus: () => void
}

export const useHealth = create<HealthState>((set) => ({
  health: mockHealth,
  addWater: (ml) =>
    set((s) => {
      const now = new Date()
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      return {
        health: {
          ...s.health,
          water: {
            ...s.health.water,
            consumed: s.health.water.consumed + ml,
            log: [...s.health.water.log, { time, amount: ml }],
          },
        },
      }
    }),
  removeWaterEntry: (idx) =>
    set((s) => {
      const entry = s.health.water.log[idx]
      return {
        health: {
          ...s.health,
          water: {
            ...s.health.water,
            consumed: Math.max(0, s.health.water.consumed - entry.amount),
            log: s.health.water.log.filter((_, i) => i !== idx),
          },
        },
      }
    }),
  toggleGymStatus: () =>
    set((s) => ({
      health: {
        ...s.health,
        gym: {
          ...s.health.gym,
          today: {
            ...s.health.gym.today,
            status:
              s.health.gym.today.status === 'done'
                ? 'pending'
                : 'done',
          },
        },
      },
    })),
}))
