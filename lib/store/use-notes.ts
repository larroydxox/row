import { create } from 'zustand'
import { mockNotes, Note } from '../data/mock-notes'

interface NotesState {
  notes: Note[]
  activeId: string | null
  setActive: (id: string | null) => void
  addNote: () => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
}

export const useNotes = create<NotesState>((set) => ({
  notes: mockNotes,
  activeId: mockNotes[0]?.id ?? null,
  setActive: (id) => set({ activeId: id }),
  addNote: () =>
    set((s) => {
      const id = crypto.randomUUID()
      return {
        notes: [
          { id, title: 'Nova nota', content: '', tags: [], updatedAt: new Date() },
          ...s.notes,
        ],
        activeId: id,
      }
    }),
  updateNote: (id, updates) =>
    set((s) => ({
      notes: s.notes.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n
      ),
    })),
  deleteNote: (id) =>
    set((s) => ({
      notes: s.notes.filter((n) => n.id !== id),
      activeId: s.activeId === id ? (s.notes[0]?.id ?? null) : s.activeId,
    })),
}))
