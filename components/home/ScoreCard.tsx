'use client'

interface Props {
  score: number
  tasksDone: number
  tasksTotal: number
  waterMl: number
  waterGoal: number
  trained: boolean
  streak: number
}

export function ScoreCard({ score, tasksDone, tasksTotal, waterMl, waterGoal, trained }: Props) {
  const isEmpty = score === 0
  const r = 96
  const circ = 2 * Math.PI * r
  const dash = `${(score / 100) * circ} ${circ}`
  const currentHour = new Date().getHours()

  const blocks = Array.from({ length: 24 }, (_, h) => {
    if (h > currentHour) return 'future'
    if ((h >= 9 && h <= 11) || (h >= 14 && h <= 16) || (h >= 19 && h <= 21)) return 'peak'
    if (h >= 7) return 'mid'
    return 'low'
  })

  const phaseLabel =
    score >= 80 ? 'Excelente — dia sólido' :
    score >= 60 ? 'Bom ritmo — mantenha' :
    score >= 40 ? 'No caminho certo' : 'Ainda dá tempo de virar'

  return (
    <div style={{
      background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 12,
      padding: 28, display: 'flex', gap: 32, alignItems: 'center',
    }}>
      {/* Círculo SVG */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width={220} height={220} viewBox='0 0 220 220'>
          <circle cx={110} cy={110} r={r} fill='none' stroke='#141414' strokeWidth={8} />
          {!isEmpty && (
            <circle cx={110} cy={110} r={r} fill='none'
              stroke='#00ff88' strokeWidth={8} strokeLinecap='round'
              strokeDasharray={dash}
              transform='rotate(-90 110 110)'
              style={{ filter: 'drop-shadow(0 0 8px #00ff88)', transition: 'stroke-dasharray 1s ease' }}
            />
          )}
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: isEmpty ? 32 : 64,
            color: isEmpty ? '#1f1f1f' : '#f0f0f0',
            margin: 0, lineHeight: 1,
          }}>
            {score}
          </p>
          <p style={{ fontSize: 9, color: '#2a2a2a', letterSpacing: '0.14em', marginTop: 4 }}>SCORE</p>
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {isEmpty ? (
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#2a2a2a' }}>Comece o dia</p>
            <p style={{ fontSize: 13, color: '#1f1f1f', marginTop: 4 }}>
              adicione tarefas, registre água ou marque um treino
            </p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 10, color: '#333', letterSpacing: '0.1em' }}>SCORE DO DIA</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#f0f0f0', marginTop: 4 }}>
              {phaseLabel}
            </p>
            <p style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
              {tasksDone}/{tasksTotal} tarefas · {waterMl}ml água · {trained ? 'treino feito' : 'sem treino'}
            </p>
          </div>
        )}

        {/* Barra 24h */}
        <div>
          <p style={{ fontSize: 9, color: '#2a2a2a', letterSpacing: '0.12em', marginBottom: 8 }}>
            LINHA DO DIA — 0h → 23h
          </p>
          <div style={{ display: 'flex', gap: 2, height: 16 }}>
            {blocks.map((type, i) => (
              <div key={i} style={{
                flex: 1, borderRadius: 2,
                background:
                  type === 'future' ? '#0f0f0f' :
                  type === 'peak'   ? '#00ff88' :
                  type === 'mid'    ? 'rgba(245,158,11,0.2)' : '#141414',
                boxShadow: type === 'peak' ? '0 0 4px #00ff8866' : 'none',
                opacity: type === 'future' ? 0.3 : 1,
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {['0h','6h','12h','18h','23h'].map((t) => (
              <span key={t} style={{ fontSize: 9, color: '#222' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
