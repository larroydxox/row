'use client'
import React, { useState, useEffect } from 'react'
import { useHealthStore } from '@/lib/store/use-health'
import { Timer, Plus } from 'lucide-react'

const dayTypes = ['Push', 'Pull', 'Legs', 'Cardio', 'Descanso']

export function GymView() {
  const { gymSessions, addGymSession, getTodaySession } = useHealthStore()
  const [selectedType, setSelectedType] = useState('Push')
  const [restTimer, setRestTimer] = useState<number | null>(null)
  const [restActive, setRestActive] = useState(false)

  const session = getTodaySession()
  const done = !!session

  useEffect(() => {
    if (!restActive) return
    if (restTimer === null || restTimer <= 0) { setRestActive(false); return }
    const t = setTimeout(() => setRestTimer((v) => v !== null ? v - 1 : null), 1000)
    return () => clearTimeout(t)
  }, [restActive, restTimer])

  return (
    <div className='flex flex-col gap-6'>
      {/* Treino de hoje */}
      <div className='rounded-xl p-6' style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <div className='text-[10px] font-mono tracking-wider mb-2' style={{ color: 'var(--text-muted)' }}>TREINO DE HOJE</div>
            <div className='flex gap-1'>
              {dayTypes.map((type) => (
                <button key={type}
                  onClick={() => setSelectedType(type)}
                  className='px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150'
                  style={{
                    background: (session?.type ?? selectedType) === type ? 'var(--accent-green)' : 'var(--bg-elevated)',
                    color: (session?.type ?? selectedType) === type ? '#0a0a0a' : 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => { if (!done) addGymSession(selectedType) }}
            disabled={done}
            className='text-sm font-medium px-4 py-2 rounded-full transition-all'
            style={{
              background: done ? 'rgba(0,255,136,0.1)' : 'var(--accent-green)',
              color: done ? 'var(--accent-green)' : '#0a0a0a',
              border: done ? '1px solid rgba(0,255,136,0.3)' : 'none',
              cursor: done ? 'default' : 'pointer',
            }}>
            {done ? `✅ ${session?.type} concluído` : '+ Registrar treino'}
          </button>
        </div>

        <div className='flex items-center gap-3 mt-4'>
          {restActive && restTimer !== null ? (
            <div className='flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm'
              style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', color: 'var(--accent-green)' }}>
              <Timer size={14} />
              {Math.floor(restTimer / 60)}:{String(restTimer % 60).padStart(2, '0')}
            </div>
          ) : (
            <button onClick={() => { setRestTimer(90); setRestActive(true) }}
              className='flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all'
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-elevated)' }}>
              <Timer size={14} /> ⏱ Descanso 90s
            </button>
          )}
        </div>
      </div>

      {/* Histórico */}
      <div className='rounded-xl p-5' style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className='text-[10px] font-mono tracking-wider mb-4' style={{ color: 'var(--text-muted)' }}>ÚLTIMOS TREINOS</div>
        {gymSessions.length === 0 ? (
          <p className='text-sm italic' style={{ color: 'var(--text-muted)' }}>Nenhum treino registrado ainda</p>
        ) : (
          <div className='flex flex-col gap-3'>
            {[...gymSessions].reverse().slice(0, 10).map((s) => (
              <div key={s.id} className='flex items-center justify-between'>
                <span className='text-[11px] font-mono' style={{ color: 'var(--text-muted)' }}>
                  {new Date(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </span>
                <span className='text-xs px-2 py-0.5 rounded-full font-mono'
                  style={{ background: s.type === 'Descanso' ? 'var(--bg-elevated)' : 'rgba(0,255,136,0.1)', color: s.type === 'Descanso' ? 'var(--text-muted)' : 'var(--accent-green)' }}>
                  {s.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
