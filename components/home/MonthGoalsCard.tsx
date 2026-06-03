'use client'
import { useState } from 'react'
import type { MonthGoal } from '@/lib/store/use-tasks'

interface Props {
  goals: MonthGoal[]
  onAdd: (text: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function MonthGoalsCard({ goals, onAdd, onToggle, onDelete }: Props) {
  const [input, setInput] = useState('')
  const done = goals.filter((g) => g.done).length

  return (
    <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 12, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <p style={{ fontSize: 10, color: '#333', letterSpacing: '0.12em', margin: 0 }}>METAS DO MÊS</p>
        {goals.length > 0 && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#444', margin: 0 }}>{done}/{goals.length}</p>
        )}
      </div>

      {goals.length === 0 && (
        <p style={{ color: '#1f1f1f', fontSize: 13, fontFamily: 'var(--font-display)', marginBottom: 12 }}>
          Defina suas metas do mês
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 12 }}>
        {goals.map((goal) => (
          <div key={goal.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 0', borderBottom: '1px solid #0f0f0f',
          }}>
            <button onClick={() => onToggle(goal.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
              <svg width={18} height={18} viewBox='0 0 18 18'>
                <circle cx={9} cy={9} r={8} fill='none' stroke={goal.done ? '#00ff88' : '#1f1f1f'} strokeWidth={1.5} />
                {goal.done && <circle cx={9} cy={9} r={4} fill='#00ff88' />}
              </svg>
            </button>
            <p style={{ fontSize: 13, color: goal.done ? '#2a2a2a' : '#777', flex: 1, margin: 0, textDecoration: goal.done ? 'line-through' : 'none' }}>
              {goal.text}
            </p>
            <button
              onClick={() => onDelete(goal.id)}
              style={{ background: 'none', border: 'none', color: '#1a1a1a', cursor: 'pointer', fontSize: 16, padding: '0 4px', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#1a1a1a')}
            >×</button>
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='+ Adicionar meta...'
        onKeyDown={(e) => {
          if (e.key === 'Enter' && input.trim()) { onAdd(input.trim()); setInput('') }
        }}
        style={{
          background: 'transparent', border: 'none', borderBottom: '1px solid #141414',
          color: '#f0f0f0', fontSize: 13, padding: '8px 0', outline: 'none', width: '100%',
        }}
      />
    </div>
  )
}
