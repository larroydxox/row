import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCHF(value: number): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'agora mesmo'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `há ${hours}h`
  const days = Math.floor(hours / 24)
  return `há ${days} dia${days > 1 ? 's' : ''}`
}

export function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function todayLabel(): string {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const d = new Date()
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`
}

export function dayScore(
  tasks: { done: boolean }[],
  waterConsumed: number,
  waterGoal: number,
  gymDone: boolean
): number {
  const taskDone = tasks.filter((t) => t.done).length
  const taskTotal = tasks.length
  const taskScore = taskTotal > 0 ? (taskDone / taskTotal) * 40 : 0
  const waterScore = Math.min((waterConsumed / waterGoal) * 30, 30)
  const gymScore = gymDone ? 30 : 0
  return Math.round(taskScore + waterScore + gymScore)
}
