'use client'
import { formatBRL } from '@/lib/utils/format'
import type { GymSession } from '@/lib/store/use-health'

interface Props {
  tasksDone: number
  tasksTotal: number
  waterMl: number
  waterGoal: number
  patrimonio: number
  streak: number
  session: GymSession | undefined
}

export function BriefingBar({ tasksDone, tasksTotal, waterMl, waterGoal, patrimonio, streak, session }: Props) {
  const waterPct = waterGoal > 0 ? Math.round((waterMl / waterGoal) * 100) : 0

  const items = [
    { label: 'TAREFAS',    value: tasksTotal === 0 ? '—' : `${tasksDone}/${tasksTotal}`, color: '#f0f0f0' },
    { label: 'ÁGUA',       value: waterMl === 0 ? '—' : `${waterMl}ml`,               color: '#3b82f6' },
    { label: 'PATRIMÔNIO', value: patrimonio === 0 ? '—' : formatBRL(patrimonio),      color: '#f0f0f0' },
    { label: 'STREAK',     value: streak === 0 ? '—' : `${streak} dias 🔥`,           color: streak > 0 ? '#f59e0b' : '#333' },
    { label: 'TREINO',     value: session ? `✓ ${session.type}` : '—',               color: session ? '#00ff88' : '#333' },
    { label: 'META ÁGUA',  value: waterMl === 0 ? '—' : `${waterPct}%`,             color: waterMl >= waterGoal && waterGoal > 0 ? '#00ff88' : '#555' },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${items.length}, 1fr)`,
      border: '1px solid #141414',
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      {items.map((item, i) => (
        <div key={i} style={{
          padding: '14px 20px',
          borderRight: i < items.length - 1 ? '1px solid #141414' : 'none',
        }}>
          <p style={{ fontSize: 9, color: '#2a2a2a', letterSpacing: '0.14em', marginBottom: 6, margin: '0 0 6px' }}>{item.label}</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: item.color, margin: 0 }}>{item.value}</p>
        </div>
      ))}
    </div>
  )
}
