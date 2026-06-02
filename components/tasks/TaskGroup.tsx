'use client'
import { useState } from 'react'
import { TaskItem } from './TaskItem'
import { Task } from '@/lib/data/mock-tasks'
import { useTasks } from '@/lib/store/use-tasks'
import { Plus } from 'lucide-react'

interface TaskGroupProps {
  label: string
  date: Task['date']
  tasks: Task[]
  showAddInput?: boolean
}

export function TaskGroup({ label, date, tasks, showAddInput = true }: TaskGroupProps) {
  const { addTask } = useTasks()
  const [input, setInput] = useState('')

  const handleAdd = () => {
    if (!input.trim()) return
    addTask({ title: input.trim(), done: false, priority: 'medium', tag: 'geral', date })
    setInput('')
  }

  const done = tasks.filter((t) => t.done).length

  return (
    <div className='mb-8'>
      <div className='flex items-center gap-3 mb-3'>
        <span
          className='text-[10px] font-mono tracking-widest uppercase font-bold'
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </span>
        <span
          className='text-[10px] font-mono px-2 py-0.5 rounded-full'
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
        >
          {done}/{tasks.length}
        </span>
        <div className='flex-1 h-px' style={{ background: 'var(--border)' }} />
      </div>

      <div className='flex flex-col gap-2'>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div
            className='text-sm italic py-3 px-4'
            style={{ color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: 8 }}
          >
            Nenhuma tarefa aqui
          </div>
        )}
      </div>

      {showAddInput && (
        <div
          className='flex items-center gap-3 mt-3 px-4 py-2.5 rounded-lg'
          style={{ border: '1px dashed var(--border)' }}
        >
          <Plus size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder={`Adicionar para ${date === 'today' ? 'hoje' : date === 'tomorrow' ? 'amanhã' : 'esta semana'}...`}
            className='flex-1 bg-transparent outline-none text-sm'
            style={{ color: 'var(--text-primary)', caretColor: 'var(--accent-green)' }}
          />
        </div>
      )}
    </div>
  )
}
