import { create } from 'zustand'
import { mockFinance } from '../data/mock-finance'

type Item = { id: string; name: string; value: number }
type Category = {
  id: string
  name: string
  icon: string
  color: string
  items: Item[]
}

interface FinanceState {
  total: number
  categories: Category[]
  updateItem: (catId: string, itemId: string, value: number) => void
  addItem: (catId: string, name: string) => void
  removeItem: (catId: string, itemId: string) => void
}

const initialCategories: Category[] = mockFinance.categories.map((c, ci) => ({
  id: `cat-${ci}`,
  name: c.name,
  icon: c.icon,
  color: c.color,
  items: c.items.map((item, ii) => ({ id: `item-${ci}-${ii}`, name: item.name, value: item.value })),
}))

function calcTotal(cats: Category[]) {
  return cats.reduce((sum, c) => sum + c.items.reduce((s, i) => s + i.value, 0), 0)
}

export const useFinance = create<FinanceState>((set) => ({
  total: mockFinance.total,
  categories: initialCategories,

  updateItem: (catId, itemId, value) =>
    set((s) => {
      const cats = s.categories.map((c) =>
        c.id !== catId ? c : { ...c, items: c.items.map((i) => (i.id !== itemId ? i : { ...i, value })) }
      )
      return { categories: cats, total: calcTotal(cats) }
    }),

  addItem: (catId, name) =>
    set((s) => {
      const cats = s.categories.map((c) =>
        c.id !== catId ? c : { ...c, items: [...c.items, { id: crypto.randomUUID(), name, value: 0 }] }
      )
      return { categories: cats }
    }),

  removeItem: (catId, itemId) =>
    set((s) => {
      const cats = s.categories.map((c) =>
        c.id !== catId ? c : { ...c, items: c.items.filter((i) => i.id !== itemId) }
      )
      return { categories: cats, total: calcTotal(cats) }
    }),
}))
