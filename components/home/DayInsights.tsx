'use client'
import { useTasks } from '@/lib/store/use-tasks'
import { useHealth } from '@/lib/store/use-health'

export function DayInsights() {
  const allTasks = useTasks((s) => s.tasks)
  const tasks = allTasks.filter((t) => t.date === 'today' && !t.done)
  const health = useHealth((s) => s.health)
  const waterPct = Math.round((health.water.consumed / health.water.goal) * 100)
  const gymDone = health.gym.today.status === 'done'

  const insights: string[] = []

  if (tasks.length > 0) {
    insights.push(`Você tem ${tasks.length} tarefa${tasks.length > 1 ? 's' : ''} pendente${tasks.length > 1 ? 's' : ''} — foque na mais importante agora.`)
  }
  if (waterPct < 50) {
    const remaining = Math.round((health.water.goal - health.water.consumed) / 1000 * 10) / 10
    insights.push(`Hidratação em ${waterPct}% — beba ${remaining}L antes das 14h.`)
  }
  if (!gymDone) {
    insights.push('Sem treino registrado ainda — 20 min já faz diferença.')
  }
  if (insights.length === 0) {
    insights.push('Dia indo muito bem! Continue no ritmo.')
  }

  return (
    <div
      className='rounded-xl p-5'
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <div className='text-[10px] font-mono tracking-wider mb-4' style={{ color: 'var(--text-muted)' }}>
        SUGESTÕES DO DIA
      </div>
      <div className='flex flex-col gap-3'>
        {insights.map((insight, i) => (
          <div key={i} className='flex items-start gap-2'>
            <span style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: 2 }}>✦</span>
            <span className='text-sm leading-relaxed' style={{ color: 'var(--text-secondary)' }}>
              {insight}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
