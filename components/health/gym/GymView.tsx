'use client'
import React, { useState, useEffect } from 'react'
import { useHealth } from '@/lib/store/use-health'
import { mockHealth } from '@/lib/data/mock-health'
import { Check, Timer, Plus, Dumbbell } from 'lucide-react'

const dayTypes = ['Push', 'Pull', 'Legs', 'Cardio', 'Descanso']

const statusConfig = {
  done: { label: '✅ Concluído', color: 'var(--accent-green)' },
  pending: { label: '⏳ Pendente', color: 'var(--accent-amber)' },
  rest: { label: '— Descanso', color: 'var(--text-muted)' },
}

export function GymView() {
  const { health, toggleGymStatus } = useHealth()
  const { gym } = health
  const [restTimer, setRestTimer] = useState<number | null>(null)
  const [restActive, setRestActive] = useState(false)
  const status = statusConfig[gym.today.status]

  useEffect(() => {
    if (!restActive) return
    if (restTimer === null || restTimer <= 0) {
      setRestActive(false)
      return
    }
    const t = setTimeout(() => setRestTimer((v) => (v !== null ? v - 1 : null)), 1000)
    return () => clearTimeout(t)
  }, [restActive, restTimer])

  const startRest = () => {
    setRestTimer(90)
    setRestActive(true)
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Today's workout */}
      <div
        className='rounded-xl p-6'
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className='flex items-center justify-between mb-4'>
          <div>
            <div className='text-[10px] font-mono tracking-wider mb-1' style={{ color: 'var(--text-muted)' }}>
              TREINO DE HOJE
            </div>
            <button
              onClick={toggleGymStatus}
              className='text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-150'
              style={{ background: `${status.color}22`, color: status.color, border: `1px solid ${status.color}44` }}
            >
              {status.label}
            </button>
          </div>

          {/* Day type selector */}
          <div className='flex gap-1'>
            {dayTypes.map((type) => (
              <button
                key={type}
                className='px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150'
                style={{
                  background: gym.today.type === type ? 'var(--accent-green)' : 'var(--bg-elevated)',
                  color: gym.today.type === type ? '#0a0a0a' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises */}
        <div className='flex flex-col gap-2 mb-4'>
          {gym.today.exercises.map((ex) => (
            <div
              key={ex.name}
              className='flex items-center justify-between px-4 py-3 rounded-lg'
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              <span className='text-sm font-medium' style={{ color: 'var(--text-primary)' }}>{ex.name}</span>
              <div className='flex items-center gap-4'>
                <span className='text-sm font-mono' style={{ color: 'var(--text-secondary)' }}>
                  {ex.sets} × {ex.reps} × {ex.kg}kg
                </span>
                <button className='text-xs' style={{ color: 'var(--text-muted)' }}>editar</button>
              </div>
            </div>
          ))}
        </div>

        <div className='flex items-center gap-3'>
          <button
            className='flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-150'
            style={{ border: '1px dashed var(--border)', color: 'var(--text-muted)' }}
          >
            <Plus size={14} /> Adicionar exercício
          </button>

          {/* Rest timer */}
          {restActive && restTimer !== null ? (
            <div
              className='flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm'
              style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', color: 'var(--accent-green)' }}
            >
              <Timer size={14} />
              {Math.floor(restTimer / 60)}:{String(restTimer % 60).padStart(2, '0')}
            </div>
          ) : (
            <button
              onClick={startRest}
              className='flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-150'
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-elevated)' }}
            >
              <Timer size={14} /> ⏱ Iniciar descanso — 90s
            </button>
          )}
        </div>
      </div>

      {/* Frequency heatmap */}
      <div
        className='rounded-xl p-5'
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className='text-[10px] font-mono tracking-wider mb-4' style={{ color: 'var(--text-muted)' }}>
          FREQUÊNCIA SEMANAL
        </div>
        <WorkoutHeatmap history={gym.history} />
      </div>

      {/* Recent workouts */}
      <div
        className='rounded-xl p-5'
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className='text-[10px] font-mono tracking-wider mb-4' style={{ color: 'var(--text-muted)' }}>
          ÚLTIMOS TREINOS
        </div>
        <div className='flex flex-col gap-3'>
          {gym.history.map((h) => (
            <div key={h.date} className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <span className='text-[11px] font-mono' style={{ color: 'var(--text-muted)' }}>{h.date.slice(5)}</span>
                <span
                  className='text-xs px-2 py-0.5 rounded-full font-mono'
                  style={{
                    background: h.type === 'Rest' ? 'var(--bg-elevated)' : 'rgba(0,255,136,0.1)',
                    color: h.type === 'Rest' ? 'var(--text-muted)' : 'var(--accent-green)',
                  }}
                >
                  {h.type}
                </span>
              </div>
              {h.volume > 0 && (
                <span className='text-sm font-mono' style={{ color: 'var(--text-secondary)' }}>
                  {(h.volume / 1000).toFixed(1)}t volume
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WorkoutHeatmap({ history }: { history: typeof mockHealth.gym.history }) {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  const weeks = 4

  return (
    <div>
      <div className='grid gap-1' style={{ gridTemplateColumns: `40px repeat(${weeks}, 1fr)` }}>
        <div />
        {Array.from({ length: weeks }, (_, i) => (
          <div key={i} className='text-center text-[10px] font-mono mb-1' style={{ color: 'var(--text-muted)' }}>
            S{weeks - i}
          </div>
        ))}
        {days.map((day, di) => (
          <React.Fragment key={day}>
            <div className='text-[10px] font-mono flex items-center' style={{ color: 'var(--text-muted)' }}>
              {day}
            </div>
            {Array.from({ length: weeks }, (_, wi) => {
              const entry = history[di]
              const hasWorkout = entry && entry.type !== 'Rest' && di === wi
              return (
                <div
                  key={`${day}-${wi}`}
                  className='h-8 rounded-sm'
                  style={{
                    background: hasWorkout
                      ? `rgba(0,255,136,${0.3 + (entry.volume / 10000) * 0.5})`
                      : 'var(--bg-elevated)',
                  }}
                  title={hasWorkout ? `${entry.type} · ${entry.volume}kg` : 'Descanso'}
                />
              )
            })}
          </React.Fragment>
        ))}
      </div>
      <div className='flex items-center gap-3 mt-3 justify-end'>
        <div className='flex items-center gap-1.5'>
          <div className='w-3 h-3 rounded-sm' style={{ background: 'var(--bg-elevated)' }} />
          <span className='text-[10px] font-mono' style={{ color: 'var(--text-muted)' }}>Descanso</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <div className='w-3 h-3 rounded-sm' style={{ background: 'rgba(0,255,136,0.4)' }} />
          <span className='text-[10px] font-mono' style={{ color: 'var(--text-muted)' }}>Treino</span>
        </div>
      </div>
    </div>
  )
}
