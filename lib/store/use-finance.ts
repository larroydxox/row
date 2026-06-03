import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── tipos base ────────────────────────────────────────────────────────────────
export interface FinanceItem { id: string; name: string; value: number }
export interface FinanceCategory { id: string; name: string; color: string; icon: string; items: FinanceItem[] }
export interface FinanceEntry { date: string; total: number }

// ── novos tipos ───────────────────────────────────────────────────────────────
export interface DayEntry {
  id: string
  date: string                   // 'YYYY-MM-DD'
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string               // 'cartão' | 'salário' | 'freelance' | 'compra' | 'outro'
}

export interface CardExpense {
  id: string
  description: string
  amount: number
  date: string
  installments: number           // 1 = à vista
  currentInstallment: number
}

export interface Card {
  id: string
  name: string
  lastDigits: string
  limit: number
  closingDay: number
  dueDay: number
  color: string
  currentBill: number
  expenses: CardExpense[]
}

export interface Debt {
  id: string
  name: string
  amount: number
  dueDay: number
  type: 'fixed' | 'variable'
  category: string               // 'moradia' | 'assinatura' | 'empréstimo' | 'escola' | 'saúde' | 'outro'
  color: string
  paid: boolean
  notes: string
}

// ── store ─────────────────────────────────────────────────────────────────────
interface FinanceStore {
  // patrimônio
  categories: FinanceCategory[]
  history: FinanceEntry[]
  addItem: (categoryId: string, name: string, value: number) => void
  updateItem: (categoryId: string, itemId: string, value: number) => void
  deleteItem: (categoryId: string, itemId: string) => void
  removeItem: (categoryId: string, itemId: string) => void
  addHistoryEntry: () => void

  // calendário
  dayEntries: DayEntry[]
  addDayEntry: (entry: Omit<DayEntry, 'id'>) => void
  updateDayEntry: (id: string, data: Partial<DayEntry>) => void
  deleteDayEntry: (id: string) => void
  getEntriesByDate: (date: string) => DayEntry[]

  // cartões
  cards: Card[]
  addCard: (card: Omit<Card, 'id'>) => void
  updateCard: (id: string, data: Partial<Card>) => void
  deleteCard: (id: string) => void
  addCardExpense: (cardId: string, expense: Omit<CardExpense, 'id'>) => void
  deleteCardExpense: (cardId: string, expenseId: string) => void

  // dívidas
  debts: Debt[]
  addDebt: (debt: Omit<Debt, 'id'>) => void
  updateDebt: (id: string, data: Partial<Debt>) => void
  deleteDebt: (id: string) => void
  toggleDebtPaid: (id: string) => void
}

export const useFinanceStore = create<FinanceStore>()(persist(
  (set, get) => ({
    // ── patrimônio ──────────────────────────────────────────────────────────
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

    // ── calendário ──────────────────────────────────────────────────────────
    dayEntries: [],

    addDayEntry: (entry) =>
      set((s) => ({ dayEntries: [...s.dayEntries, { ...entry, id: crypto.randomUUID() }] })),

    updateDayEntry: (id, data) =>
      set((s) => ({ dayEntries: s.dayEntries.map((e) => e.id !== id ? e : { ...e, ...data }) })),

    deleteDayEntry: (id) =>
      set((s) => ({ dayEntries: s.dayEntries.filter((e) => e.id !== id) })),

    getEntriesByDate: (date) => get().dayEntries.filter((e) => e.date === date),

    // ── cartões ─────────────────────────────────────────────────────────────
    cards: [],

    addCard: (card) =>
      set((s) => ({ cards: [...s.cards, { ...card, id: crypto.randomUUID() }] })),

    updateCard: (id, data) =>
      set((s) => ({ cards: s.cards.map((c) => c.id !== id ? c : { ...c, ...data }) })),

    deleteCard: (id) =>
      set((s) => ({ cards: s.cards.filter((c) => c.id !== id) })),

    addCardExpense: (cardId, expense) =>
      set((s) => ({
        cards: s.cards.map((c) => c.id !== cardId ? c : {
          ...c,
          expenses: [...c.expenses, { ...expense, id: crypto.randomUUID() }],
          currentBill: c.currentBill + expense.amount,
        }),
      })),

    deleteCardExpense: (cardId, expenseId) =>
      set((s) => ({
        cards: s.cards.map((c) => {
          if (c.id !== cardId) return c
          const exp = c.expenses.find((e) => e.id === expenseId)
          return {
            ...c,
            expenses: c.expenses.filter((e) => e.id !== expenseId),
            currentBill: Math.max(0, c.currentBill - (exp?.amount ?? 0)),
          }
        }),
      })),

    // ── dívidas ─────────────────────────────────────────────────────────────
    debts: [],

    addDebt: (debt) =>
      set((s) => ({ debts: [...s.debts, { ...debt, id: crypto.randomUUID() }] })),

    updateDebt: (id, data) =>
      set((s) => ({ debts: s.debts.map((d) => d.id !== id ? d : { ...d, ...data }) })),

    deleteDebt: (id) =>
      set((s) => ({ debts: s.debts.filter((d) => d.id !== id) })),

    toggleDebtPaid: (id) =>
      set((s) => ({ debts: s.debts.map((d) => d.id !== id ? d : { ...d, paid: !d.paid }) })),
  }),
  { name: 'valios-finance' }
))

// Retrocompatibilidade
export const useFinance = useFinanceStore
