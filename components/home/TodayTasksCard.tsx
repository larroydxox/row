'use client'
import { useState } from 'react'
import { formatDate } from '@/lib/utils/format'
import type { Task, Priority, TaskDate } from '@/lib/store/use-tasks'

interface Props {
  tasks: Task[]
  onAdd: (title: string, priority?: Priority, tag?: string, date?: TaskDate) => void
  onToggle: (id: string) => void
}

export function TodayTasksCard({ tasks, onAdd, onToggle }: Props) {
  const [input, setInput] = useState('')
  const todayTasks = tasks.filter((t) => t.date === 'today')
  const done = todayTasks.filter((t) => t.done).length

  return (
    <div style={{
      background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 12,
      padding: 24, display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 10, color: '#333', letterSpacing: '0.12em', margin: 0 }}>
          HOJE — {formatDate(new Date())}
        </p>
        {todayTasks.length > 0 && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: done === todayTasks.length ? '#00ff88' : '#444', margin: 0 }}>
            {done}/{todayTasks.length}
          </p>
        )}
      </div>

      {todayTasks.length === 0 ? (
        <p style={{ color: '#1f1f1f', fontFamily: 'var(--font-display)', fontSize: 15, textAlign: 'center', padding: '20px 0', margin: 0 }}>
          Nenhuma tarefa para hoje
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', maxHeight: 220 }}>
          {todayTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggle(task.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 6, cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#141414')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <svg width={18} height={18} viewBox='0 0 18 18' style={{ flexShrink: 0 }}>
                <circle cx={9} cy={9} r={8} fill='none' stroke={task.done ? '#00ff88' : '#1f1f1f'} strokeWidth={1.5} />
                {task.done && <circle cx={9} cy={9} r={4} fill='#00ff88' />}
              </svg>
              <p style={{ fontSize: 13, color: task.done ? '#333' : '#888', flex: 1, margin: 0, textDecoration: task.done ? 'line-through' : 'none', transition: 'all 0.3s' }}>
                {task.title}
              </p>
              <span style={{ fontSize: 9, letterSpacing: '0.08em', color: task.priority === 'high' ? '#ef444466' : task.priority === 'medium' ? '#f59e0b66' : '#33333366' }}>
                {task.priority === 'high' ? '⚡' : task.priority === 'medium' ? '→' : '·'}
              </span>
            </div>
          ))}
        </div>
      )}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='+ Adicionar tarefa...'
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
