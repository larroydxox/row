'use client'
import type { Task, MonthGoal } from '@/lib/store/use-tasks'

interface Props { tasks: Task[]; monthGoals: MonthGoal[] }

export function MonthProgressCard({ tasks, monthGoals }: Props) {
  const thisMonth  = new Date().getMonth()
  const monthTasks = tasks.filter((t) => new Date(t.createdAt).getMonth() === thisMonth)
  const monthDone  = monthTasks.filter((t) => t.done).length
  const monthTotal = monthTasks.length
  const goalsDone  = monthGoals.filter((g) => g.done).length
  const goalsTotal = monthGoals.length
  const pct        = monthTotal === 0 ? 0 : Math.round((monthDone / monthTotal) * 100)

  const r    = 40
  const circ = 2 * Math.PI * r
  const dash = `${(pct / 100) * circ} ${circ}`

  return (
    <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 12, padding: 24 }}>
      <p style={{ fontSize: 11, color: '#444', letterSpacing: '0.12em', margin: '0 0 20px' }}>MÊS ATUAL</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width={100} height={100} viewBox='0 0 100 100'>
            <circle cx={50} cy={50} r={r} fill='none' stroke='#1a1a1a' strokeWidth={8} />
            {pct > 0 && (
              <circle cx={50} cy={50} r={r} fill='none' stroke='#00ff88'
                strokeWidth={8} strokeLinecap='round'
                strokeDasharray={dash}
                transform='rotate(-90 50 50)'
                style={{ filter: 'drop-shadow(0 0 4px #00ff88)', transition: 'stroke-dasharray 0.8s ease' }}
              />
            )}
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: '#f0f0f0', margin: 0 }}>{pct}%</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Tarefas', done: monthDone,  total: monthTotal,  color: '#00ff88' },
            { label: 'Metas',   done: goalsDone,  total: goalsTotal,  color: '#8b5cf6' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <p style={{ fontSize: 11, color: '#555', margin: 0 }}>{item.label}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#f0f0f0', margin: 0 }}>
                {item.total === 0 ? '—' : `${item.done}/${item.total}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
