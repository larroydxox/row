'use client'
import { useState } from 'react'
import { formatBRL } from '@/lib/utils/format'
import type { DayEntry, Card, Debt } from '@/lib/store/use-finance'

interface Props {
  date: string
  entries: DayEntry[]
  cardClosings: Card[]
  debtsToday: Debt[]
  onAdd: (entry: Omit<DayEntry, 'id'>) => void
  onDelete: (id: string) => void
  onClose: () => void
}

const CATEGORIES = ['salário', 'freelance', 'compra', 'cartão', 'investimento', 'outro']

export function DayModal({ date, entries, cardClosings, debtsToday, onAdd, onDelete, onClose }: Props) {
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('outro')

  const balance = entries.reduce((acc, e) => acc + (e.type === 'income' ? e.amount : -e.amount), 0)
  const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  const handleAdd = () => {
    const val = parseFloat(amount.replace(',', '.'))
    if (!val || !description.trim()) return
    onAdd({ date, type, amount: val, description: description.trim(), category })
    setAmount('')
    setDescription('')
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 16, padding: 32, width: 480, maxWidth: '92vw', maxHeight: '88vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 22 }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: 10, color: '#333', letterSpacing: '0.12em', marginBottom: 4 }}>DIA SELECIONADO</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#f0f0f0', textTransform: 'capitalize' }}>{formattedDate}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#333', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {/* Saldo do dia */}
        {entries.length > 0 && (
          <div style={{ background: '#141414', borderRadius: 8, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 11, color: '#444' }}>Saldo do dia</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: balance >= 0 ? '#00ff88' : '#ef4444' }}>
              {balance >= 0 ? '+' : ''}{formatBRL(balance)}
            </p>
          </div>
        )}

        {/* Alertas — fechamento e vencimento */}
        {(cardClosings.length > 0 || debtsToday.length > 0) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {cardClosings.map((card) => (
              <div key={card.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#141414', borderRadius: 8, padding: '12px 16px', borderLeft: `3px solid ${card.color}` }}>
                <div>
                  <p style={{ fontSize: 9, color: '#333', letterSpacing: '0.1em' }}>FECHAMENTO CARTÃO</p>
                  <p style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{card.name} •••• {card.lastDigits}</p>
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: '#ef4444' }}>
                  {card.currentBill === 0 ? '—' : formatBRL(card.currentBill)}
                </p>
              </div>
            ))}
            {debtsToday.map((debt) => (
              <div key={debt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#141414', borderRadius: 8, padding: '12px 16px', borderLeft: `3px solid ${debt.color}` }}>
                <div>
                  <p style={{ fontSize: 9, color: '#333', letterSpacing: '0.1em' }}>VENCIMENTO</p>
                  <p style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{debt.name}</p>
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: '#ef4444' }}>{formatBRL(debt.amount)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Lançamentos */}
        {entries.length > 0 && (
          <div>
            <p style={{ fontSize: 10, color: '#333', letterSpacing: '0.1em', marginBottom: 10 }}>LANÇAMENTOS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {entries.map((entry) => (
                <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#141414', borderRadius: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 14, color: entry.type === 'income' ? '#00ff88' : '#ef4444' }}>
                      {entry.type === 'income' ? '↑' : '↓'}
                    </span>
                    <p style={{ fontSize: 13, color: '#777', margin: 0 }}>{entry.description}</p>
                    <span style={{ fontSize: 9, color: '#333', background: '#1a1a1a', padding: '2px 7px', borderRadius: 10 }}>{entry.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: entry.type === 'income' ? '#00ff88' : '#ef4444', margin: 0 }}>
                      {entry.type === 'income' ? '+' : '-'}{formatBRL(entry.amount)}
                    </p>
                    <button onClick={() => onDelete(entry.id)} style={{ background: 'none', border: 'none', color: '#222', cursor: 'pointer', fontSize: 16, lineHeight: 1, transition: '0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#222')}>×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulário */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid #141414', paddingTop: 20 }}>
          <p style={{ fontSize: 10, color: '#333', letterSpacing: '0.1em' }}>ADICIONAR LANÇAMENTO</p>

          {/* Toggle entrada/saída */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {(['income', 'expense'] as const).map((t) => (
              <button key={t} onClick={() => setType(t)} style={{
                padding: 10, borderRadius: 8, cursor: 'pointer',
                background: type === t ? (t === 'income' ? '#00ff8820' : '#ef444420') : '#141414',
                color: type === t ? (t === 'income' ? '#00ff88' : '#ef4444') : '#444',
                fontSize: 12, letterSpacing: '0.1em', fontFamily: 'var(--font-mono)',
                border: `1px solid ${type === t ? (t === 'income' ? '#00ff8840' : '#ef444440') : 'transparent'}`,
                transition: 'all 0.2s',
              }}>
                {t === 'income' ? '↑ ENTRADA' : '↓ SAÍDA'}
              </button>
            ))}
          </div>

          {/* Valor */}
          <div>
            <p style={{ fontSize: 10, color: '#2a2a2a', marginBottom: 6, letterSpacing: '0.08em' }}>VALOR</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #1f1f1f', paddingBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: '#333' }}>R$</span>
              <input
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='0,00'
                style={{ background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: 22, color: '#f0f0f0', width: '100%' }}
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <p style={{ fontSize: 10, color: '#2a2a2a', marginBottom: 6, letterSpacing: '0.08em' }}>DESCRIÇÃO</p>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Ex: Salário, Mercado, Uber...'
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #1f1f1f', outline: 'none', color: '#f0f0f0', fontSize: 14, padding: '8px 0', width: '100%' }}
            />
          </div>

          {/* Categoria */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: '4px 12px', borderRadius: 20, cursor: 'pointer',
                background: category === cat ? '#00ff8815' : 'transparent',
                border: `1px solid ${category === cat ? '#00ff8840' : '#1a1a1a'}`,
                color: category === cat ? '#00ff88' : '#444',
                fontSize: 11, transition: 'all 0.15s',
              }}>{cat}</button>
            ))}
          </div>

          {/* Botão */}
          <button
            onClick={handleAdd}
            disabled={!amount || !description.trim()}
            style={{
              padding: 12, borderRadius: 8, cursor: amount && description.trim() ? 'pointer' : 'not-allowed',
              background: amount && description.trim() ? '#00ff8820' : '#141414',
              border: `1px solid ${amount && description.trim() ? '#00ff8840' : '#1a1a1a'}`,
              color: amount && description.trim() ? '#00ff88' : '#333',
              fontSize: 13, letterSpacing: '0.1em', fontFamily: 'var(--font-mono)',
              transition: 'all 0.2s',
            }}
          >
            + ADICIONAR
          </button>
        </div>
      </div>
    </div>
  )
}
