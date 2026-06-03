'use client'
import { useHealthStore } from '@/lib/store/use-health'
import { useConfigStore } from '@/lib/store/use-config'
import { Droplets, Trash2 } from 'lucide-react'

const quickAmounts = [200, 350, 500, 1000]

export function WaterView() {
  const { waterLog, addWater, removeWaterEntry, getTodayWater } = useHealthStore()
  const { waterGoal } = useConfigStore()

  const todayStr  = new Date().toDateString()
  const todayLog  = waterLog.filter((l) => new Date(l.time).toDateString() === todayStr)
  const consumed  = getTodayWater()
  const pct       = Math.min(Math.round((consumed / waterGoal) * 100), 100)
  const consumedL = (consumed / 1000).toFixed(1)
  const goalL     = (waterGoal / 1000).toFixed(1)

  return (
    <div className='max-w-2xl mx-auto flex flex-col gap-6'>
      {/* Visual */}
      <div className='rounded-xl p-8 flex flex-col items-center' style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className='relative mb-6' style={{ width: 100, height: 180 }}>
          <svg width={100} height={180} viewBox='0 0 100 180'>
            <path d='M35 20 L20 45 L15 160 Q15 170 25 170 L75 170 Q85 170 85 160 L80 45 L65 20 Z'
              fill='rgba(255,255,255,0.03)' stroke='rgba(255,255,255,0.1)' strokeWidth={1.5} />
            <rect x={38} y={10} width={24} height={12} rx={3} fill='rgba(255,255,255,0.08)' />
            <clipPath id='bottle-clip'>
              <path d='M35 20 L20 45 L15 160 Q15 170 25 170 L75 170 Q85 170 85 160 L80 45 L65 20 Z' />
            </clipPath>
            <g clipPath='url(#bottle-clip)'>
              <rect x={15} y={170 - (155 * pct / 100)} width={70} height={155 * pct / 100}
                fill='rgba(59,130,246,0.35)' style={{ transition: 'y 0.6s ease, height 0.6s ease' }} />
            </g>
          </svg>
          <div className='absolute inset-0 flex items-center justify-center'>
            <span className='font-mono font-bold text-2xl' style={{ color: 'var(--text-primary)' }}>{pct}%</span>
          </div>
        </div>

        <div className='text-xl font-mono font-bold mb-1' style={{ color: 'var(--text-primary)' }}>
          {consumedL}L <span style={{ color: 'var(--text-muted)' }}>de {goalL}L</span>
        </div>

        <div className='flex gap-3 mt-4'>
          {quickAmounts.map((ml) => (
            <button key={ml} onClick={() => addWater(ml)}
              className='px-4 py-2.5 rounded-lg text-sm font-mono font-medium transition-all duration-150'
              style={{ border: '1px solid var(--border-active)', color: 'var(--text-secondary)', background: 'var(--bg-elevated)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.15)'; e.currentTarget.style.color = '#3b82f6'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-active)' }}>
              +{ml >= 1000 ? `${ml / 1000}L` : `${ml}ml`}
            </button>
          ))}
        </div>
      </div>

      {/* Log */}
      <div className='rounded-xl p-5' style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className='text-[10px] font-mono tracking-wider mb-4' style={{ color: 'var(--text-muted)' }}>LOG DO DIA</div>
        {todayLog.length === 0 ? (
          <div className='text-sm italic' style={{ color: 'var(--text-muted)' }}>Nenhum registro ainda</div>
        ) : (
          <div className='flex flex-col gap-2'>
            {[...todayLog].reverse().map((entry) => (
              <div key={entry.id} className='flex items-center justify-between group'>
                <span className='text-sm font-mono' style={{ color: 'var(--text-muted)' }}>
                  {new Date(entry.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className='text-sm' style={{ color: 'var(--text-secondary)' }}>+{entry.amount}ml</span>
                <button onClick={() => removeWaterEntry(entry.id)}
                  className='opacity-0 group-hover:opacity-100 transition-opacity'
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent-red)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}>
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {consumed >= waterGoal && waterGoal > 0 && (
        <div className='flex items-center gap-2 text-sm font-mono' style={{ color: 'var(--accent-green)' }}>
          <Droplets size={14} />
          Meta de hoje atingida! 🎉
        </div>
      )}
    </div>
  )
}
