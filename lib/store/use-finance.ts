import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FinanceItem { id: string; name: string; value: number }
export interface FinanceCategory { id: string; name: string; color: string; icon: string; items: FinanceItem[] }
export interface FinanceEntry { date: string; total: number }

interface FinanceStore {
  categories: FinanceCategory[]
  history: FinanceEntry[]
  addItem: (categoryId: string, name: string, value: number) => void
  updateItem: (categoryId: string, itemId: string, value: number) => void
  deleteItem: (categoryId: string, itemId: string) => void
  removeItem: (categoryId: string, itemId: string) => void  // alias deleteItem
  addHistoryEntry: () => void
}

export const useFinanceStore = create<FinanceStore>()(persist(
  (set, get) => ({
    categories: [
      { id: 'bank',   name: 'Contas Bancárias',     color: '#3b82f6', icon: 'landmark',    items: [] },
      { id: 'stocks', name: 'Ações & Investimentos', color: '#00ff88', icon: 'trending-up', items: [] },
      { id: 'crypto', name: 'Crypto',                color: '#f59e0b', icon: 'coins',       items: [] },
      { id: 'other',  name: 'Outros Ativos',         color: '#8b5cf6', icon: 'package',     items: [] },
    ],
    history: [],

    addItem: (catId, name, value) =>
      set((s) => ({
        categories: s.categories.map((c) =>
          c.id !== catId ? c : { ...c, items: [...c.items, { id: crypto.randomUUID(), name, value }] }
        ),
      })),

    updateItem: (catId, itemId, value) =>
      set((s) => ({
        categories: s.categories.map((c) =>
          c.id !== catId ? c : { ...c, items: c.items.map((i) => i.id !== itemId ? i : { ...i, value }) }
        ),
      })),

    deleteItem: (catId, itemId) =>
      set((s) => ({
        categories: s.categories.map((c) =>
          c.id !== catId ? c : { ...c, items: c.items.filter((i) => i.id !== itemId) }
        ),
      })),

    removeItem: (catId, itemId) => get().deleteItem(catId, itemId),

    addHistoryEntry: () => {
      const total = get().categories.reduce((acc, c) => acc + c.items.reduce((a, i) => a + i.value, 0), 0)
      set((s) => ({ history: [...s.history, { date: new Date().toISOString(), total }] }))
    },
  }),
  { name: 'valios-finance' }
))

// Retrocompatibilidade
export const useFinance = useFinanceStore
