'use client'
import type { Task } from '@/lib/store/use-tasks'

interface Props { tasks: Task[]; streak: number }

export function OverallInfoCard({ tasks, streak }: Props) {
  const totalDone  = tasks.filter((t) => t.done).length
  const inProgress = tasks.filter((t) => !t.done && t.date !== 'someday').length
  const total      = tasks.length

  return (
    <div style={{
      background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 12, padding: 24,
      display: 'flex', flexDirection: 'column', gap: 20,
    }}>
      <p style={{ fontSize: 11, color: '#444', letterSpacing: '0.12em', margin: 0 }}>VISÃO GERAL</p>

      <div style={{ display: 'flex', gap: 24, alignItems: 'baseline' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 52, color: '#f0f0f0', lineHeight: 1, margin: 0 }}>
            {totalDone === 0 ? '—' : totalDone}
          </p>
          <p style={{ fontSize: 10, color: '#444', letterSpacing: '0.08em', marginTop: 4 }}>tarefas concluídas</p>
        </div>
        {streak > 0 && (
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#f59e0b', lineHeight: 1, margin: 0 }}>{streak}</p>
            <p style={{ fontSize: 10, color: '#444', marginTop: 4 }}>dias seguidos</p>
          </div>
        )}
      </div>

      <div style={{ height: 1, background: '#1a1a1a' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[
          { value: total,      label: 'Total' },
          { value: inProgress, label: 'Em andamento' },
          { value: totalDone,  label: 'Concluídas' },
        ].map((item) => (
          <div key={item.label} style={{ background: '#141414', borderRadius: 8, padding: '12px 8px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: '#f0f0f0', margin: 0 }}>{item.value}</p>
            <p style={{ fontSize: 9, color: '#333', marginTop: 4, letterSpacing: '0.08em', margin: '4px 0 0' }}>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
