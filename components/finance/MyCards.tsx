'use client'
import { useState } from 'react'
import { useFinanceStore } from '@/lib/store/use-finance'
import { formatBRL } from '@/lib/utils/format'
import type { Card } from '@/lib/store/use-finance'

const CARD_COLORS = ['#1a1a1a', '#ef4444', '#8b5cf6', '#3b82f6', '#f59e0b', '#10b981']

// ── Chip SVG ──────────────────────────────────────────────────────────────────
function Chip() {
  return (
    <svg width={28} height={22} viewBox='0 0 28 22' fill='none'>
      <rect width={28} height={22} rx={4} fill='#ffffff22' />
      <rect x={10} width={8} height={22} rx={0} fill='#ffffff11' />
      <rect y={7} width={28} height={8} rx={0} fill='#ffffff11' />
    </svg>
  )
}

// ── Visual do cartão ──────────────────────────────────────────────────────────
function CardVisual({ card, selected, onClick }: { card: Card; selected: boolean; onClick: () => void }) {
  const usedPct = card.limit > 0 ? Math.min((card.currentBill / card.limit) * 100, 100) : 0

  return (
    <div
      onClick={onClick}
      style={{
        minWidth: 240, height: 148, borderRadius: 16,
        background: `linear-gradient(135deg, ${card.color}, ${card.color}cc)`,
        padding: 20, cursor: 'pointer', flexShrink: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', transition: 'all 0.2s',
        border: `2px solid ${selected ? '#00ff88' : 'transparent'}`,
        boxShadow: selected ? `0 0 24px ${card.color}55` : '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Chip />
        <span style={{ fontSize: 9, letterSpacing: '0.12em', background: '#ffffff22', borderRadius: 12, padding: '3px 8px', color: '#ffffff99' }}>
          ACTIVE
        </span>
      </div>

      <div>
        <p style={{ fontSize: 9, color: '#ffffff66', letterSpacing: '0.1em', marginBottom: 2 }}>FATURA ATUAL</p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: '#fff', margin: 0 }}>
          {formatBRL(card.currentBill)}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontSize: 9, color: '#ffffff44', letterSpacing: '0.08em' }}>NÚMERO</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#ffffff88' }}>•••• {card.lastDigits}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 9, color: '#ffffff44', letterSpacing: '0.08em' }}>FECHA DIA</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: '#fff' }}>{card.closingDay}</p>
        </div>
      </div>

      {/* Barra de uso do limite */}
      {card.limit > 0 && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, borderRadius: '0 0 14px 14px', background: '#ffffff22' }}>
          <div style={{ width: `${usedPct}%`, height: '100%', background: usedPct > 80 ? '#ef4444' : '#ffffff', borderRadius: '0 0 0 14px', transition: 'width 0.5s ease' }} />
        </div>
      )}
    </div>
  )
}

// ── Modal adicionar cartão ────────────────────────────────────────────────────
function AddCardModal({ onAdd, onClose }: { onAdd: (c: Omit<Card, 'id'>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', lastDigits: '', limit: '', closingDay: '', dueDay: '', color: CARD_COLORS[0], currentBill: '0' })
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const fields = [
    { key: 'name',        label: 'NOME DO CARTÃO',    placeholder: 'Ex: Nubank, Inter...',  type: 'text'   },
    { key: 'lastDigits',  label: 'ÚLTIMOS 4 DÍGITOS', placeholder: '0000',                 type: 'text'   },
    { key: 'limit',       label: 'LIMITE (opcional)',  placeholder: '0',                    type: 'number' },
    { key: 'closingDay',  label: 'DIA DE FECHAMENTO', placeholder: '1–31',                 type: 'number' },
    { key: 'dueDay',      label: 'DIA DE VENCIMENTO', placeholder: '1–31',                 type: 'number' },
    { key: 'currentBill', label: 'FATURA ATUAL',       placeholder: '0',                    type: 'number' },
  ]

  const handleAdd = () => {
    if (!form.name || !form.closingDay || !form.dueDay) return
    onAdd({ name: form.name, lastDigits: form.lastDigits || '????', limit: parseFloat(form.limit) || 0, closingDay: parseInt(form.closingDay), dueDay: parseInt(form.dueDay), color: form.color, currentBill: parseFloat(form.currentBill) || 0, expenses: [] })
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 16, padding: 32, width: 420, maxWidth: '92vw', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#f0f0f0' }}>Novo Cartão</p>

        {fields.map((f) => (
          <div key={f.key}>
            <p style={{ fontSize: 9, color: '#333', letterSpacing: '0.12em', marginBottom: 6 }}>{f.label}</p>
            <input type={f.type} value={form[f.key as keyof typeof form]} onChange={(e) => set(f.key, e.target.value)} placeholder={f.placeholder}
              style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #1f1f1f', outline: 'none', color: '#f0f0f0', fontSize: 14, padding: '6px 0', width: '100%' }} />
          </div>
        ))}

        <div>
          <p style={{ fontSize: 9, color: '#333', letterSpacing: '0.12em', marginBottom: 10 }}>COR DO CARTÃO</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {CARD_COLORS.map((c) => (
              <div key={c} onClick={() => set('color', c)} style={{ width: 28, height: 28, borderRadius: '50%', background: c === '#1a1a1a' ? '#2a2a2a' : c, cursor: 'pointer', border: `2px solid ${form.color === c ? '#00ff88' : 'transparent'}`, transition: 'border 0.15s', boxSizing: 'border-box' }} />
            ))}
          </div>
        </div>

        <button onClick={handleAdd} style={{ padding: 12, background: '#00ff8820', border: '1px solid #00ff8840', borderRadius: 8, color: '#00ff88', cursor: 'pointer', fontSize: 13, letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>
          + ADICIONAR CARTÃO
        </button>
      </div>
    </div>
  )
}

// ── Inline add expense ────────────────────────────────────────────────────────
function AddExpenseInline({ cardId, onAdd }: { cardId: string; onAdd: (id: string, e: Parameters<typeof useFinanceStore.getState>['0' extends keyof ReturnType<typeof useFinanceStore.getState> ? never : never]) => void }) {
  const addCardExpense = useFinanceStore((s) => s.addCardExpense)
  const [desc, setDesc]   = useState('')
  const [amt, setAmt]     = useState('')
  const [inst, setInst]   = useState('1')

  const submit = () => {
    const v = parseFloat(amt)
    if (!desc.trim() || !v) return
    addCardExpense(cardId, { description: desc.trim(), amount: v, date: new Date().toISOString().split('T')[0], installments: parseInt(inst), currentInstallment: 1 })
    setDesc(''); setAmt(''); setInst('1')
  }

  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'center' }}>
      <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='Descrição do gasto...'
        style={{ flex: 2, background: 'transparent', border: 'none', borderBottom: '1px solid #1a1a1a', outline: 'none', color: '#888', fontSize: 13, padding: '6px 0' }} />
      <input value={amt} onChange={(e) => setAmt(e.target.value)} placeholder='R$' type='number'
        style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid #1a1a1a', outline: 'none', color: '#f0f0f0', fontFamily: 'var(--font-mono)', fontSize: 13, padding: '6px 0' }} />
      <select value={inst} onChange={(e) => setInst(e.target.value)} style={{ background: '#141414', border: '1px solid #1a1a1a', borderRadius: 4, color: '#555', fontSize: 11, padding: '4px 8px' }}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}x</option>)}
      </select>
      <button onClick={submit} style={{ background: 'transparent', border: '1px solid #1f1f1f', borderRadius: 6, color: '#555', padding: '6px 12px', cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap' }}>+ add</button>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
export function MyCards() {
  const { cards, addCard, deleteCard, deleteCardExpense } = useFinanceStore()
  const [selected, setSelected] = useState<string | null>(null)
  const [showAdd, setShowAdd]   = useState(false)

  return (
    <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 12, padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 10, color: '#333', letterSpacing: '0.14em', marginBottom: 4 }}>CARTÕES</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#f0f0f0' }}>Meus Cartões</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ padding: '8px 16px', borderRadius: 8, cursor: 'pointer', background: 'transparent', border: '1px solid #1f1f1f', color: '#555', fontSize: 12, letterSpacing: '0.08em', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00ff88'; e.currentTarget.style.color = '#00ff88' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1f1f1f'; e.currentTarget.style.color = '#555' }}>
          + Adicionar cartão
        </button>
      </div>

      {/* Lista de cartões */}
      {cards.length === 0 ? (
        <div style={{ border: '1px dashed #1a1a1a', borderRadius: 12, padding: 40, textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowAdd(true)}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#1f1f1f' }}>Nenhum cartão cadastrado</p>
          <p style={{ fontSize: 12, color: '#1a1a1a', marginTop: 8 }}>Clique para adicionar seu primeiro cartão</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
          {cards.map((card) => (
            <CardVisual key={card.id} card={card} selected={selected === card.id} onClick={() => setSelected(selected === card.id ? null : card.id)} />
          ))}
        </div>
      )}

      {/* Painel do cartão selecionado */}
      {selected && (() => {
        const card = cards.find((c) => c.id === selected)
        if (!card) return null
        return (
          <div style={{ marginTop: 20, background: '#141414', borderRadius: 10, padding: 20, borderLeft: `3px solid ${card.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#f0f0f0' }}>{card.name}</p>
                <p style={{ fontSize: 11, color: '#444', marginTop: 2 }}>
                  Fecha dia {card.closingDay} · Vence dia {card.dueDay}
                  {card.limit > 0 && ` · Limite ${formatBRL(card.limit)}`}
                </p>
              </div>
              <button onClick={() => { if (confirm('Remover cartão?')) { deleteCard(card.id); setSelected(null) } }}
                style={{ background: 'none', border: 'none', color: '#222', cursor: 'pointer', fontSize: 18, transition: '0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#222')}>🗑</button>
            </div>

            {card.expenses.length === 0 ? (
              <p style={{ fontSize: 13, color: '#1f1f1f', fontStyle: 'italic' }}>Nenhum gasto nesta fatura</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {card.expenses.map((exp) => (
                  <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
                    <div>
                      <p style={{ fontSize: 13, color: '#777', margin: 0 }}>{exp.description}</p>
                      {exp.installments > 1 && <p style={{ fontSize: 10, color: '#333' }}>{exp.currentInstallment}/{exp.installments}x</p>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#ef4444', margin: 0 }}>-{formatBRL(exp.amount)}</p>
                      <button onClick={() => deleteCardExpense(card.id, exp.id)} style={{ background: 'none', border: 'none', color: '#1a1a1a', cursor: 'pointer', fontSize: 16, transition: '0.2s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#1a1a1a')}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <AddExpenseInline cardId={card.id} onAdd={() => {}} />
          </div>
        )
      })()}

      {showAdd && <AddCardModal onAdd={addCard} onClose={() => setShowAdd(false)} />}
    </div>
  )
}
