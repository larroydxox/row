'use client'
import { useHealth } from '@/lib/store/use-health'
import { Droplets, Flame, Trash2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'

const quickAmounts = [200, 350, 500, 1000]

export function WaterView() {
  const { health, addWater, removeWaterEntry } = useHealth()
  const { water } = health
  const pct = Math.min(Math.round((water.consumed / water.goal) * 100), 100)
  const consumedL = (water.consumed / 1000).toFixed(1)
  const goalL = (water.goal / 1000).toFixed(1)

  return (
    <div className='max-w-2xl mx-auto flex flex-col gap-6'>
      {/* Central visual */}
      <div
        className='rounded-xl p-8 flex flex-col items-center'
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        {/* Water bottle SVG */}
        <div className='relative mb-6' style={{ width: 100, height: 180 }}>
          <svg width='100' height='180' viewBox='0 0 100 180'>
            {/* Bottle outline */}
            <path
              d='M35 20 L20 45 L15 160 Q15 170 25 170 L75 170 Q85 170 85 160 L80 45 L65 20 Z'
              fill='rgba(255,255,255,0.03)'
              stroke='rgba(255,255,255,0.1)'
              strokeWidth='1.5'
            />
            {/* Cap */}
            <rect x='38' y='10' width='24' height='12' rx='3' fill='rgba(255,255,255,0.08)' />
            {/* Water fill (clip) */}
            <clipPath id='bottle-clip'>
              <path d='M35 20 L20 45 L15 160 Q15 170 25 170 L75 170 Q85 170 85 160 L80 45 L65 20 Z' />
            </clipPath>
            <g clipPath='url(#bottle-clip)'>
              <rect
                x='15'
                y={170 - (155 * pct / 100)}
                width='70'
                height={155 * pct / 100}
                fill='rgba(59,130,246,0.35)'
                style={{ transition: 'y 0.6s ease, height 0.6s ease' }}
              />
              {/* Wave */}
              <path
                d={`M15,${170 - (155 * pct / 100)} Q32,${170 - (155 * pct / 100) - 6} 50,${170 - (155 * pct / 100)} Q68,${170 - (155 * pct / 100) + 6} 85,${170 - (155 * pct / 100)} L85,170 L15,170 Z`}
                fill='rgba(59,130,246,0.5)'
                style={{ transition: 'all 0.6s ease' }}
              />
            </g>
          </svg>
          {/* Percentage overlay */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <span className='font-mono font-bold text-2xl' style={{ color: 'var(--text-primary)' }}>{pct}%</span>
          </div>
        </div>

        <div className='text-xl font-mono font-bold mb-1' style={{ color: 'var(--text-primary)' }}>
          {consumedL}L <span style={{ color: 'var(--text-muted)' }}>de {goalL}L</span>
        </div>

        {/* Quick add buttons */}
        <div className='flex gap-3 mt-4'>
          {quickAmounts.map((ml) => (
            <button
              key={ml}
              onClick={() => addWater(ml)}
              className='px-4 py-2.5 rounded-lg text-sm font-mono font-medium transition-all duration-150'
              style={{
                border: '1px solid var(--border-active)',
                color: 'var(--text-secondary)',
                background: 'var(--bg-elevated)',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.15)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.4)'
                ;(e.currentTarget as HTMLElement).style.color = '#3b82f6'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-active)'
                ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
              }}
            >
              +{ml >= 1000 ? `${ml / 1000}L` : `${ml}ml`}
            </button>
          ))}
        </div>
      </div>

      {/* Log */}
      <div
        className='rounded-xl p-5'
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className='text-[10px] font-mono tracking-wider mb-4' style={{ color: 'var(--text-muted)' }}>
          LOG DO DIA
        </div>
        {water.log.length === 0 ? (
          <div className='text-sm italic' style={{ color: 'var(--text-muted)' }}>Nenhum registro ainda</div>
        ) : (
          <div className='flex flex-col gap-2'>
            {water.log.map((entry, i) => (
              <div key={i} className='flex items-center justify-between group'>
                <span className='text-sm font-mono' style={{ color: 'var(--text-muted)' }}>{entry.time}</span>
                <span className='text-sm' style={{ color: 'var(--text-secondary)' }}>+{entry.amount}ml</span>
                <button
                  onClick={() => removeWaterEntry(i)}
                  className='opacity-0 group-hover:opacity-100 transition-opacity'
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent-red)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Streak + weekly */}
      <div className='flex items-center gap-2 text-sm font-mono' style={{ color: 'var(--text-secondary)' }}>
        <Droplets size={14} style={{ color: '#3b82f6' }} />
        {water.streak} dias atingindo a meta
      </div>

      {/* Weekly bar chart */}
      <div
        className='rounded-xl p-5'
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className='text-[10px] font-mono tracking-wider mb-4' style={{ color: 'var(--text-muted)' }}>
          SEMANA
        </div>
        <ResponsiveContainer width='100%' height={100}>
          <BarChart data={water.weeklyData} barSize={20}>
            <XAxis dataKey='day' tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Bar dataKey='consumed' radius={[3, 3, 0, 0]}>
              {water.weeklyData.map((d, i) => (
                <Cell
                  key={i}
                  fill={d.consumed >= d.goal ? 'rgba(59,130,246,0.7)' : 'rgba(59,130,246,0.25)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
