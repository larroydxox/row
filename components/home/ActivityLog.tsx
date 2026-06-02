'use client'

const activities = [
  { time: '09:14', action: 'Água registrada — +350ml' },
  { time: '08:42', action: 'Treino Push concluído' },
  { time: '08:00', action: 'Tarefa "Email para cliente X" adicionada' },
  { time: '07:30', action: 'Meta de água redefinida para 3L' },
  { time: '23:15', action: 'Nota "Estratégia 2025" atualizada', dim: true },
  { time: '22:00', action: 'Ideia capturada: revisão espaçada', dim: true },
]

export function ActivityLog() {
  return (
    <div
      className='rounded-xl p-5'
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <div className='text-[10px] font-mono tracking-wider mb-4' style={{ color: 'var(--text-muted)' }}>
        ATIVIDADE RECENTE
      </div>
      <div className='flex flex-col gap-3'>
        {activities.map((a, i) => (
          <div key={i} className='flex items-start gap-4'>
            <span
              className='text-[11px] font-mono flex-shrink-0 mt-0.5'
              style={{ color: 'var(--text-muted)', minWidth: 36 }}
            >
              {a.time}
            </span>
            <span
              className='text-sm'
              style={{ color: a.dim ? 'var(--text-muted)' : 'var(--text-secondary)' }}
            >
              {a.action}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
