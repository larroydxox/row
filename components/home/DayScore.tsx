'use client'
import { ProgressRing } from '@/components/shared/ProgressRing'
import { useTasks } from '@/lib/store/use-tasks'
import { useHealth } from '@/lib/store/use-health'
import { dayScore } from '@/lib/utils'

const TIMELINE_HOURS = Array.from({ length: 24 }, (_, i) => i)

function getPhaseColor(h: number): string {
  if (h < 6) return 'rgba(255,255,255,0.04)'
  if (h < 9) return 'rgba(0,255,136,0.18)'  // pico manhã
  if (h < 12) return 'rgba(0,255,136,0.10)'
  if (h < 14) return 'rgba(245,158,11,0.15)' // neutro
  if (h < 17) return 'rgba(0,255,136,0.08)'
  if (h < 20) return 'rgba(245,158,11,0.12)' // tarde
  if (h < 22) return 'rgba(0,255,136,0.18)'  // pico noturno
  return 'rgba(255,255,255,0.03)'
}

function getPhaseLabel(score: number): string {
  if (score < 20) return 'Começando o dia'
  if (score < 40) return 'Manhã — aquecendo'
  if (score < 60) return 'Tarde — manter ritmo'
  if (score < 80) return 'Pico de foco'
  return 'Dia excelente'
}

export function DayScore() {
  const tasks = useTasks((s) => s.tasks.filter((t) => t.date === 'today'))
  const health = useHealth((s) => s.health)
  const score = dayScore(
    tasks,
    health.water.consumed,
    health.water.goal,
    health.gym.today.status === 'done'
  )
  const now = new Date().getHours()

  return (
    <div
      className='rounded-xl p-6'
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <div className='flex items-center gap-8'>
        {/* Ring */}
        <div className='glow-pulse flex-shrink-0'>
          <ProgressRing value={score} size={160} strokeWidth={8} glow>
            <span className='font-mono text-4xl font-bold' style={{ color: 'var(--text-primary)' }}>
              {score}
            </span>
            <span className='text-xs mt-1 font-mono' style={{ color: 'var(--text-muted)' }}>
              SCORE
            </span>
          </ProgressRing>
        </div>

        <div className='flex-1 min-w-0'>
          <div className='text-[10px] font-mono tracking-wider mb-1' style={{ color: 'var(--text-muted)' }}>
            SCORE DO DIA
          </div>
          <div className='text-xl font-semibold mb-1' style={{ color: 'var(--text-primary)' }}>
            {getPhaseLabel(score)}
          </div>
          <div className='text-sm mb-4' style={{ color: 'var(--text-secondary)' }}>
            Melhor hora hoje: 20h — reserve para o que mais importa
          </div>

          {/* 24h timeline */}
          <div>
            <div className='text-[10px] font-mono mb-2' style={{ color: 'var(--text-muted)' }}>
              LINHA DO DIA — 24H
            </div>
            <div className='flex gap-0.5 h-5'>
              {TIMELINE_HOURS.map((h) => (
                <div
                  key={h}
                  className='flex-1 rounded-sm relative'
                  style={{
                    background: getPhaseColor(h),
                    outline: h === now ? '1px solid var(--accent-green)' : 'none',
                  }}
                  title={`${h}h`}
                />
              ))}
            </div>
            <div className='flex justify-between text-[9px] font-mono mt-1' style={{ color: 'var(--text-muted)' }}>
              <span>0h</span>
              <span>6h</span>
              <span>12h</span>
              <span>18h</span>
              <span>23h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
