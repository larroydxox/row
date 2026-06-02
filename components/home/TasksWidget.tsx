'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'
import { useTasks } from '@/lib/store/use-tasks'
import { todayLabel } from '@/lib/utils'

export function TasksWidget() {
  const { tasks, toggleTask, addTask } = useTasks()
  const today = tasks.filter((t) => t.date === 'today')
  const done = today.filter((t) => t.done).length
  const [input, setInput] = useState('')

  const handleAdd = () => {
    if (!input.trim()) return
    addTask({ title: input.trim(), done: false, priority: 'medium', tag: 'geral', date: 'today' })
    setInput('')
  }

  return (
    <div
      className='rounded-xl p-6'
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <div className='text-[10px] font-mono tracking-wider mb-1' style={{ color: 'var(--text-muted)' }}>
        HOJE — {todayLabel().toUpperCase()}
      </div>
      <div className='flex items-baseline gap-2 mb-4'>
        <span className='text-3xl font-bold font-mono' style={{ color: 'var(--accent-green)' }}>{done}</span>
        <span className='font-mono' style={{ color: 'var(--text-muted)' }}>/ {today.length} concluídas</span>
      </div>

      <div className='flex flex-col gap-2 mb-4'>
        {today.slice(0, 5).map((task) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className='flex items-center gap-3 text-left group'
          >
            <div
              className='w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200'
              style={{
                background: task.done ? 'var(--accent-green)' : 'transparent',
                border: `1.5px solid ${task.done ? 'var(--accent-green)' : 'var(--border-active)'}`,
              }}
            >
              {task.done && <Check size={12} color='#0a0a0a' strokeWidth={3} />}
            </div>
            <span
              className='text-sm transition-all duration-200'
              style={{
                color: task.done ? 'var(--text-muted)' : 'var(--text-secondary)',
                textDecoration: task.done ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </span>
          </button>
        ))}
      </div>

      {/* Quick add */}
      <div className='flex gap-2' style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder='Adicionar tarefa rápida...'
          className='flex-1 bg-transparent outline-none text-sm'
          style={{ color: 'var(--text-primary)', caretColor: 'var(--accent-green)' }}
        />
        <button
          onClick={handleAdd}
          className='text-xs px-3 py-1.5 rounded-md font-medium transition-all duration-150'
          style={{ background: 'var(--accent-green)', color: '#0a0a0a' }}
        >
          +
        </button>
      </div>
    </div>
  )
}
