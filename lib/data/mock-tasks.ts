export type Priority = 'high' | 'medium' | 'low'
export type TaskDate = 'today' | 'tomorrow' | 'week' | 'someday'

export interface Task {
  id: string
  title: string
  done: boolean
  priority: Priority
  tag: string
  date: TaskDate
  subtasks?: { id: string; title: string; done: boolean }[]
}

export const mockTasks: Task[] = [
  { id: '1', title: 'Revisar finanças do mês', done: false, priority: 'high', tag: 'finanças', date: 'today' },
  { id: '2', title: 'Treino — Push day', done: true, priority: 'high', tag: 'academia', date: 'today' },
  { id: '3', title: 'Ler 20 páginas', done: false, priority: 'medium', tag: 'pessoal', date: 'today' },
  { id: '4', title: 'Email para cliente X', done: false, priority: 'high', tag: 'trabalho', date: 'today' },
  { id: '5', title: 'Comprar suplementos', done: false, priority: 'low', tag: 'saúde', date: 'today' },
  { id: '6', title: 'Planejar semana', done: false, priority: 'medium', tag: 'pessoal', date: 'tomorrow' },
  { id: '7', title: 'Reunião com equipe', done: false, priority: 'high', tag: 'trabalho', date: 'tomorrow' },
  { id: '8', title: 'Revisar portfólio de ações', done: false, priority: 'medium', tag: 'finanças', date: 'week' },
  { id: '9', title: 'Organizar arquivos digitais', done: false, priority: 'low', tag: 'pessoal', date: 'someday' },
  { id: '10', title: 'Aprender TypeScript avançado', done: false, priority: 'medium', tag: 'desenvolvimento', date: 'someday' },
]

export const tagColors: Record<string, string> = {
  'finanças': '#3b82f6',
  'academia': '#00ff88',
  'pessoal': '#8b5cf6',
  'trabalho': '#f59e0b',
  'saúde': '#ec4899',
  'desenvolvimento': '#06b6d4',
}
