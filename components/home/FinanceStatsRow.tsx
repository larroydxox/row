'use client'
import { useRouter } from 'next/navigation'
import { formatBRL } from '@/lib/utils/format'
import { getCategoryTotal } from '@/lib/utils/finance'
import type { FinanceCategory } from '@/lib/store/use-finance'

interface Props {
  categories: FinanceCategory[]
  patrimonio: number
}

export function FinanceStatsRow({ categories, patrimonio }: Props) {
  const router = useRouter()
  const byId = (id: string) => categories.find((c) => c.id === id)

  const cards = [
    { id: 'bank',   label: 'CONTAS BANCÁRIAS',    color: '#3b82f6', highlight: true  },
    { id: 'stocks', label: 'AÇÕES & INVEST.',      color: '#00ff88', highlight: false },
    { id: 'crypto', label: 'CRYPTO',               color: '#f59e0b', highlight: false },
    { id: 'other',  label: 'OUTROS ATIVOS',        color: '#8b5cf6', highlight: false },
  ].map((c) => ({ ...c, value: getCategoryTotal(byId(c.id) ?? { items: [] }) }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <p style={{ fontSize: 10, color: '#333', letterSpacing: '0.12em', margin: 0 }}>PATRIMÔNIO TOTAL</p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#f0f0f0', margin: 0 }}>
          {patrimonio === 0 ? '—' : formatBRL(patrimonio)}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => router.push('/finance')}
            style={{
              padding: 18, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
              background: card.highlight ? `linear-gradient(135deg, ${card.color}22, ${card.color}11)` : '#0f0f0f',
              border: card.highlight ? 'none' : '1px solid #141414',
              borderLeft: `3px solid ${card.color}`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <p style={{ fontSize: 9, color: '#444', letterSpacing: '0.12em', margin: 0 }}>{card.label}</p>
              <span style={{ fontSize: 9, color: card.color }}>→</span>
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: card.highlight ? 26 : 20, color: card.value === 0 ? '#1a1a1a' : '#f0f0f0', margin: 0 }}>
              {card.value === 0 ? '—' : formatBRL(card.value)}
            </p>
            {card.value === 0 && (
              <p style={{ fontSize: 10, color: '#1a1a1a', marginTop: 6, margin: '6px 0 0' }}>adicionar em Finanças</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
