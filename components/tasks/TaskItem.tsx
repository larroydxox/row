'use client'
import { Check, Trash2 } from 'lucide-react'
import { Task, tagColors } from '@/lib/data/mock-tasks'
import { useTasks } from '@/lib/store/use-tasks'

const priorityConfig = {
  high: { label: '⚡ Alta', color: 'var(--accent-red)' },
  medium: { label: '→ Média', color: 'var(--accent-amber)' },
  low: { label: '· Baixa', color: 'var(--text-muted)' },
}

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTasks()
  const prio = priorityConfig[task.priority]
  const tagColor = tagColors[task.tag] ?? '#888'

  return (
    <div
      className='flex items-center gap-3 px-4 py-3 rounded-lg group transition-all duration-150'
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        opacity: task.done ? 0.55 : 1,
      }}
    >
      {/* Drag handle */}
      <span className='text-xs select-none opacity-0 group-hover:opacity-100 cursor-grab transition-opacity' style={{ color: 'var(--text-muted)', letterSpacing: -1 }}>
        ⠿
      </span>

      {/* Checkbox */}
      <button
        onClick={() => toggleTask(task.id)}
        className='w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200'
        style={{
          background: task.done ? 'var(--accent-green)' : 'transparent',
          border: `1.5px solid ${task.done ? 'var(--accent-green)' : 'var(--border-active)'}`,
          boxShadow: task.done ? '0 0 8px rgba(0,255,136,0.25)' : 'none',
        }}
      >
        {task.done && <Check size={11} color='#0a0a0a' strokeWidth={3} />}
      </button>

      {/* Title */}
      <span
        className='flex-1 text-sm transition-all duration-200'
        style={{
          color: task.done ? 'var(--text-muted)' : 'var(--text-primary)',
          textDecoration: task.done ? 'line-through' : 'none',
          textDecorationColor: 'var(--text-muted)',
        }}
      >
        {task.title}
      </span>

      {/* Priority */}
      <span className='text-[11px] font-mono' style={{ color: prio.color }}>
        {prio.label}
      </span>

      {/* Tag */}
      <span
        className='text-[10px] font-mono px-2 py-0.5 rounded-full'
        style={{ background: `${tagColor}22`, color: tagColor, border: `1px solid ${tagColor}44` }}
      >
        {task.tag}
      </span>

      {/* Delete */}
      <button
        onClick={() => deleteTask(task.id)}
        className='opacity-0 group-hover:opacity-100 transition-opacity'
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent-red)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}
