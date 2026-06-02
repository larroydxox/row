import { create } from 'zustand'
import { mockIdeas, Idea } from '../data/mock-ideas'

interface IdeasState {
  ideas: Idea[]
  addIdea: (text: string, tag?: string, tagColor?: string) => void
  deleteIdea: (id: string) => void
}

export const useIdeas = create<IdeasState>((set) => ({
  ideas: mockIdeas,
  addIdea: (text, tag = 'geral', tagColor = '#888888') =>
    set((s) => ({
      ideas: [
        { id: crypto.randomUUID(), text, tag, tagColor, createdAt: new Date() },
        ...s.ideas,
      ],
    })),
  deleteIdea: (id) =>
    set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) })),
}))
