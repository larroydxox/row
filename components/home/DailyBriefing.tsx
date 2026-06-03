'use client'
import { useTasks } from '@/lib/store/use-tasks'
import { useHealth } from '@/lib/store/use-health'
import { useFinance } from '@/lib/store/use-finance'
import { formatBRL } from '@/lib/utils'

const divider = (
  <div style={{ width: 1, height: 32, background: '#1f1f1f', flexShrink: 0 }} />
)

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ flexShrink: 0 }}>
      <p style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#444', letterSpacing: '0.1em', marginBottom: 2 }}>{label}</p>
      {children}
    </div>
  )
}

export function DailyBriefing() {
  const allTasks = useTasks((s) => s.tasks)
  const today = allTasks.filter((t) => t.date === 'today')
  const done = today.filter((t) => t.done).length

  const health = useHealth((s) => s.health)
  const waterL = (health.water.consumed / 1000).toFixed(1)
  const gymDone = health.gym.today.status === 'done'
  const gymType = health.gym.today.type

  const total = useFinance((s) => s.total)

  const now = new Date()
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const h = now.getHours()
  const m = String(now.getMinutes()).padStart(2, '0')
  const dateStr = `${days[now.getDay()]} · ${now.getDate()} ${months[now.getMonth()]} · ${h}:${m}`
  const greeting = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'

  const mono = { fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--text-primary)' } as const
  const display = { fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)' } as const

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 32,
      padding: '14px 0', marginBottom: 28,
      borderBottom: '1px solid #1a1a1a',
      overflowX: 'auto',
    }}>
      {/* Data */}
      <Stat label={dateStr}>
        <p style={display}>{greeting}</p>
      </Stat>

      {divider}

      {/* Tarefas */}
      <Stat label='TAREFAS'>
        <p style={mono}>
          {done}<span style={{ color: '#444' }}>/{today.length}</span>
        </p>
      </Stat>

      {divider}

      {/* Água */}
      <Stat label='ÁGUA'>
        <p style={{ ...mono, color: '#3b82f6' }}>{waterL}L</p>
      </Stat>

      {divider}

      {/* Patrimônio */}
      <Stat label='PATRIMÔNIO'>
        <p style={mono}>{formatBRL(total)}</p>
      </Stat>

      {divider}

      {/* Streak */}
      <Stat label='STREAK'>
        <p style={{ ...mono, color: '#f59e0b' }}>9 🔥</p>
      </Stat>

      {divider}

      {/* Treino */}
      <Stat label='TREINO'>
        <p style={{ ...mono, fontSize: 14, color: gymDone ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
          {gymDone ? `✓ ${gymType}` : `⏳ ${gymType}`}
        </p>
      </Stat>
    </div>
  )
}
