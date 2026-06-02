export interface Idea {
  id: string
  text: string
  tag: string
  tagColor: string
  createdAt: Date
}

export const mockIdeas: Idea[] = [
  {
    id: '1',
    text: 'Criar sistema de revisão espaçada integrado com as notas',
    tag: 'produto',
    tagColor: '#8b5cf6',
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '2',
    text: 'Automatizar lançamento de patrimônio via Open Finance',
    tag: 'finanças',
    tagColor: '#3b82f6',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: '3',
    text: 'Adicionar modo foco com timer pomodoro na tela de tarefas',
    tag: 'produto',
    tagColor: '#8b5cf6',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '4',
    text: 'Estudar cripto DeFi para diversificação de portfólio',
    tag: 'finanças',
    tagColor: '#3b82f6',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
]
