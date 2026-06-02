'use client'
import { Droplets, Dumbbell, Wallet, Flame } from 'lucide-react'
import { useHealth } from '@/lib/store/use-health'
import { useTasks } from '@/lib/store/use-tasks'
import { formatCHF } from '@/lib/utils'
import { mockFinance } from '@/lib/data/mock-finance'

export function QuickStats() {
  const health = useHealth((s) => s.health)
  const tasks = useTasks((s) => s.tasks.filter((t) => t.date === 'today'))
  const waterPct = Math.round((health.water.consumed / health.water.goal) * 100)
  const gymDone = health.gym.today.status === 'done'
  const doneTasks = tasks.filter((t) => t.done).length

  // Streak: count consecutive days (simulated)
  const streak = 9

  const stats = [
    {
      icon: Droplets,
      label: 'Água',
      value: `${(health.water.consumed / 1000).toFixed(1)}L`,
      sub: `/ ${(health.water.goal / 1000).toFixed(1)}L`,
      pct: waterPct,
      color: '#3b82f6',
    },
    {
      icon: Dumbbell,
      label: 'Academia',
      value: gymDone ? 'Feito hoje' : 'Pendente',
      sub: health.gym.today.type,
      pct: gymDone ? 100 : 0,
      color: gymDone ? 'var(--accent-green)' : 'var(--accent-amber)',
    },
    {
      icon: Wallet,
      label: 'Patrimônio',
      value: formatCHF(mockFinance.total),
      sub: '↑ +2.3% mês',
      pct: null,
      color: 'var(--accent-green)',
    },
    {
      icon: Flame,
      label: 'Streak',
      value: `${streak} dias`,
      sub: 'seguidos',
      pct: null,
      color: 'var(--accent-amber)',
    },
  ]

  return (
    <div className='grid grid-cols-4 gap-3'>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className='rounded-xl p-4 transition-all duration-150 hover:translate-y-[-1px]'
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className='flex items-center gap-2 mb-3'>
            <stat.icon size={14} style={{ color: stat.color }} />
            <span className='text-[10px] font-mono tracking-wider uppercase' style={{ color: 'var(--text-muted)' }}>
              {stat.label}
            </span>
          </div>
          <div className='flex items-baseline gap-1 mb-1'>
            <span className='text-lg font-mono font-bold' style={{ color: 'var(--text-primary)' }}>
              {stat.value}
            </span>
            {stat.sub && (
              <span className='text-xs' style={{ color: 'var(--text-secondary)' }}>{stat.sub}</span>
            )}
          </div>
          {stat.pct !== null && (
            <div className='h-1 rounded-full mt-2' style={{ background: 'var(--bg-elevated)' }}>
              <div
                className='h-full rounded-full transition-all duration-500'
                style={{ width: `${stat.pct}%`, background: stat.color }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
