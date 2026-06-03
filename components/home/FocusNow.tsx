'use client'
import { useTasksStore } from '@/lib/store/use-tasks'

const priorityOrder = { high: 0, medium: 1, low: 2 }

export function FocusNow() {
  const tasks      = useTasksStore((s) => s.tasks)
  const toggleTask = useTasksStore((s) => s.toggleTask)

  const pending = tasks
    .filter((t) => t.date === 'today' && !t.done)
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  const focus = pending[0]
  const next  = pending[1]

  if (!focus) return null

  return (
    <div style={{
      marginTop: 8, padding: '28px 32px',
      border: '1px solid #1f1f1f', borderLeft: '3px solid var(--accent-green)',
      borderRadius: 8,
      background: 'linear-gradient(90deg, rgba(0,255,136,0.04) 0%, transparent 60%)',
    }}>
      <p style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#444', letterSpacing: '0.15em', marginBottom: 10 }}>
        ⬤ FOCO AGORA
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.25 }}>
        {focus.title}
      </p>
      <p style={{ fontSize: 13, color: '#555' }}>
        {focus.priority === 'high' ? 'Alta prioridade' : focus.priority === 'medium' ? 'Média prioridade' : 'Baixa prioridade'}
        {focus.tag ? ` · ${focus.tag}` : ''}
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button onClick={() => toggleTask(focus.id)} style={{ padding: '8px 20px', background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)', borderRadius: 6, color: 'var(--accent-green)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
          ✓ Marcar concluída
        </button>
        {next && (
          <button onClick={() => toggleTask(focus.id)} style={{ padding: '8px 20px', background: 'transparent', border: '1px solid #1f1f1f', borderRadius: 6, color: '#555', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
            → Próxima: {next.title.slice(0, 24)}{next.title.length > 24 ? '…' : ''}
          </button>
        )}
      </div>
    </div>
  )
}
