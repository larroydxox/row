'use client'
import { useTasksStore } from '@/lib/store/use-tasks'
import { useHealthStore } from '@/lib/store/use-health'
import { useFinanceStore } from '@/lib/store/use-finance'
import { useConfigStore } from '@/lib/store/use-config'
import { formatBRL } from '@/lib/utils/format'
import { getTotal } from '@/lib/utils/finance'

const Div = () => <div style={{ width: 1, height: 32, background: '#1f1f1f', flexShrink: 0 }} />

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ flexShrink: 0 }}>
      <p style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#444', letterSpacing: '0.1em', marginBottom: 2 }}>{label}</p>
      {children}
    </div>
  )
}

export function DailyBriefing() {
  const tasks   = useTasksStore((s) => s.tasks)
  const streak  = useTasksStore((s) => s.streak)
  const today   = tasks.filter((t) => t.date === 'today')
  const done    = today.filter((t) => t.done).length

  const { getTodayWater, getTodaySession } = useHealthStore()
  const { waterGoal }  = useConfigStore()
  const categories     = useFinanceStore((s) => s.categories)

  const waterMl  = getTodayWater()
  const session  = getTodaySession()
  const total    = getTotal(categories)

  const now = new Date()
  const days   = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  const h = now.getHours()
  const m = String(now.getMinutes()).padStart(2, '0')
  const dateStr  = `${days[now.getDay()]} · ${now.getDate()} ${months[now.getMonth()]} · ${h}:${m}`
  const greeting = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'

  const mono    = { fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--text-primary)' } as const
  const display = { fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)' } as const

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '14px 0', marginBottom: 28, borderBottom: '1px solid #1a1a1a', overflowX: 'auto' }}>
      <Stat label={dateStr}><p style={display}>{greeting}</p></Stat>
      <Div />
      <Stat label='TAREFAS'><p style={mono}>{today.length === 0 ? '—' : <>{done}<span style={{ color: '#444' }}>/{today.length}</span></>}</p></Stat>
      <Div />
      <Stat label='ÁGUA'><p style={{ ...mono, color: '#3b82f6' }}>{waterMl === 0 ? '—' : `${(waterMl/1000).toFixed(1)}L`}</p></Stat>
      <Div />
      <Stat label='PATRIMÔNIO'><p style={mono}>{total === 0 ? '—' : formatBRL(total)}</p></Stat>
      <Div />
      <Stat label='STREAK'><p style={{ ...mono, color: '#f59e0b' }}>{streak === 0 ? '—' : `${streak} 🔥`}</p></Stat>
      <Div />
      <Stat label='TREINO'><p style={{ ...mono, fontSize: 14, color: session ? 'var(--accent-green)' : '#333' }}>{session ? `✓ ${session.type}` : '—'}</p></Stat>
    </div>
  )
}
