'use client'
import type { Task, Priority, TaskDate } from '@/lib/store/use-tasks'

interface Props {
  tasks: Task[]
  onToggle: (id: string) => void
  onAdd: (title: string, priority?: Priority, tag?: string, date?: TaskDate) => void
}

export function TasksInProcess({ tasks, onToggle }: Props) {
  const inProcess = tasks.filter((t) => !t.done && (t.date === 'today' || t.date === 'tomorrow'))

  return (
    <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 12, padding: 24 }}>
      <p style={{ fontSize: 10, color: '#333', letterSpacing: '0.12em', margin: '0 0 16px' }}>
        EM PROCESSO {inProcess.length > 0 && `(${inProcess.length})`}
      </p>

      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
        {inProcess.map((task) => (
          <div key={task.id} style={{
            minWidth: 160, maxWidth: 160,
            background: '#141414', border: '1px solid #1a1a1a',
            borderRadius: 10, padding: 16,
            display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0,
          }}>
            <span style={{
              fontSize: 9, letterSpacing: '0.1em',
              color: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#333',
            }}>
              {task.priority === 'high' ? '⚡ ALTA' : task.priority === 'medium' ? '→ MÉDIA' : '· BAIXA'}
            </span>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#d0d0d0', lineHeight: 1.3, flex: 1, margin: 0 }}>
              {task.title}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 10, color: '#2a2a2a', fontFamily: 'var(--font-mono)', margin: 0 }}>
                {task.date === 'today' ? 'Hoje' : 'Amanhã'}
              </p>
              <button
                onClick={() => onToggle(task.id)}
                style={{
                  background: 'transparent', border: '1px solid #1f1f1f',
                  borderRadius: 4, color: '#333', fontSize: 10, padding: '4px 8px',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00ff88'; e.currentTarget.style.color = '#00ff88' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1f1f1f'; e.currentTarget.style.color = '#333' }}
              >✓</button>
            </div>
          </div>
        ))}

        {inProcess.length === 0 && (
          <div style={{
            minWidth: 160, minHeight: 120,
            border: '1px dashed #1a1a1a', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <p style={{ color: '#1f1f1f', fontSize: 12, textAlign: 'center', padding: '0 16px', margin: 0 }}>
              Nenhuma tarefa em andamento
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
