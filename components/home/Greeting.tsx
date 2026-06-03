'use client'
import { formatDate } from '@/lib/utils/format'

interface Props {
  greeting: string
  userName: string
  score: number
}

export function Greeting({ greeting, userName, score }: Props) {
  const now = new Date()
  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#333', letterSpacing: '0.14em', marginBottom: 6 }}>
          {formatDate(now)} · {time}
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: '#f0f0f0', margin: 0, lineHeight: 1.1 }}>
          {greeting}{userName ? `, ${userName}` : ''}.
        </h1>
      </div>
      {score > 0 && (
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 10, color: '#333', letterSpacing: '0.12em', marginBottom: 4 }}>SCORE DO DIA</p>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 32,
            color: score >= 70 ? '#00ff88' : score >= 40 ? '#f59e0b' : '#ef4444',
          }}>
            {score}
          </p>
        </div>
      )}
    </div>
  )
}
