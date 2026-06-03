'use client'
import { useState } from 'react'
import { useFinanceStore } from '@/lib/store/use-finance'
import { formatBRL } from '@/lib/utils/format'
import type { Debt } from '@/lib/store/use-finance'

const CATEGORIES = ['moradia', 'assinatura', 'empréstimo', 'escola', 'saúde', 'outro'] as const
type DebtCategory = typeof CATEGORIES[number]

const CATEGORY_COLORS: Record<DebtCategory, string> = {
  moradia: '#3b82f6', assinatura: '#8b5cf6', empréstimo: '#ef4444',
  escola: '#f59e0b', saúde: '#10b981', outro: '#555',
}

// ── Modal adicionar dívida ────────────────────────────────────────────────────
function AddDebtModal({ onAdd, onClose }: { onAdd: (d: Omit<Debt, 'id'>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', amount: '', dueDay: '', type: 'fixed' as 'fixed' | 'variable', category: 'outro' as DebtCategory, notes: '' })
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const submit = () => {
    if (!form.name || !form.amount || !form.dueDay) return
    onAdd({
      name: form.name,
      amount: parseFloat(form.amount),
      dueDay: parseInt(form.dueDay),
      type: form.type,
      category: form.category,
      color: CATEGORY_COLORS[form.category],
      paid: false,
      notes: form.notes,
    })
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 16, padding: 32, width: 420, maxWidth: '92vw', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#f0f0f0' }}>Nova Dívida / Conta</p>

        {[
          { key: 'name',   label: 'NOME',               placeholder: 'Ex: Aluguel, Netflix, Academia...', type: 'text' },
          { key: 'amount', label: 'VALOR (R$)',          placeholder: '0,00',                              type: 'number' },
          { key: 'dueDay', label: 'DIA DO VENCIMENTO',  placeholder: '1–31',                              type: 'number' },
          { key: 'notes',  label: 'OBSERVAÇÕES',        placeholder: 'Opcional...',                       type: 'text' },
        ].map((f) => (
          <div key={f.key}>
            <p style={{ fontSize: 9, color: '#333', letterSpacing: '0.12em', marginBottom: 6 }}>{f.label}</p>
            <input type={f.type} value={form[f.key as keyof typeof form] as string} onChange={(e) => set(f.key, e.target.value)} placeholder={f.placeholder}
              style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #1f1f1f', outline: 'none', color: '#f0f0f0', fontSize: 14, padding: '6px 0', width: '100%' }} />
          </div>
        ))}

        {/* Categoria */}
        <div>
          <p style={{ fontSize: 9, color: '#333', letterSpacing: '0.12em', marginBottom: 8 }}>CATEGORIA</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => {
              const active = form.category === cat
              return (
                <button key={cat} onClick={() => set('category', cat)} style={{
                  padding: '4px 12px', borderRadius: 20, cursor: 'pointer',
                  background: active ? `${CATEGORY_COLORS[cat]}22` : 'transparent',
                  border: `1px solid ${active ? CATEGORY_COLORS[cat] : '#1a1a1a'}`,
                  color: active ? CATEGORY_COLORS[cat] : '#444',
                  fontSize: 11, transition: 'all 0.15s',
                }}>{cat}</button>
              )
            })}
          </div>
        </div>

        {/* Tipo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {(['fixed', 'variable'] as const).map((t) => (
            <button key={t} onClick={() => setForm((f) => ({ ...f, type: t }))} style={{
              padding: 10, borderRadius: 8, cursor: 'pointer',
              background: form.type === t ? '#00ff8815' : '#141414',
              border: `1px solid ${form.type === t ? '#00ff8840' : 'transparent'}`,
              color: form.type === t ? '#00ff88' : '#444',
              fontSize: 11, letterSpacing: '0.08em',
            }}>
              {t === 'fixed' ? 'FIXO' : 'VARIÁVEL'}
            </button>
          ))}
        </div>

        <button onClick={submit} style={{ padding: 12, background: '#00ff8820', border: '1px solid #00ff8840', borderRadius: 8, color: '#00ff88', cursor: 'pointer', fontSize: 13, letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>
          + ADICIONAR
        </button>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
export function Debts() {
  const { debts, addDebt, deleteDebt, toggleDebtPaid } = useFinanceStore()
  const [showAdd, setShowAdd] = useState(false)

  const totalMonthly = debts.reduce((a, d) => a + d.amount, 0)
  const unpaid       = debts.filter((d) => !d.paid).reduce((a, d) => a + d.amount, 0)
  const paid         = debts.filter((d) => d.paid).reduce((a, d) => a + d.amount, 0)

  const sorted = [...debts].sort((a, b) => a.dueDay - b.dueDay)

  return (
    <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 12, padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 10, color: '#333', letterSpacing: '0.14em', marginBottom: 4 }}>COMPROMISSOS</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#f0f0f0' }}>Dívidas & Contas</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ padding: '8px 16px', borderRadius: 8, cursor: 'pointer', background: 'transparent', border: '1px solid #1f1f1f', color: '#555', fontSize: 12, letterSpacing: '0.08em', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00ff88'; e.currentTarget.style.color = '#00ff88' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1f1f1f'; e.currentTarget.style.color = '#555' }}>
          + Adicionar
        </button>
      </div>

      {/* Resumo */}
      {debts.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'TOTAL MENSAL', value: totalMonthly, color: '#f0f0f0' },
            { label: 'A PAGAR',      value: unpaid,       color: '#ef4444' },
            { label: 'PAGO',         value: paid,         color: '#00ff88' },
          ].map((s) => (
            <div key={s.label} style={{ background: '#141414', borderRadius: 8, padding: 12 }}>
              <p style={{ fontSize: 9, color: '#333', letterSpacing: '0.1em', marginBottom: 6 }}>{s.label}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: s.value === 0 ? '#222' : s.color, margin: 0 }}>
                {s.value === 0 ? '—' : formatBRL(s.value)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Lista */}
      {debts.length === 0 ? (
        <div style={{ border: '1px dashed #1a1a1a', borderRadius: 8, padding: 32, textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowAdd(true)}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#1f1f1f' }}>Nenhum compromisso cadastrado</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sorted.map((debt) => {
            const catColor = CATEGORY_COLORS[debt.category as DebtCategory] ?? '#555'
            return (
              <div key={debt.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', background: '#141414', borderRadius: 10,
                borderLeft: `3px solid ${debt.paid ? '#1a1a1a' : catColor}`,
                opacity: debt.paid ? 0.5 : 1, transition: 'opacity 0.3s',
              }}>
                {/* Checkbox */}
                <button onClick={() => toggleDebtPaid(debt.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
                  <svg width={20} height={20} viewBox='0 0 20 20'>
                    <circle cx={10} cy={10} r={9} fill='none' stroke={debt.paid ? '#00ff88' : '#1f1f1f'} strokeWidth={1.5} />
                    {debt.paid && <path d='M6 10l3 3 5-6' stroke='#00ff88' strokeWidth={1.5} fill='none' strokeLinecap='round' />}
                  </svg>
                </button>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <p style={{ fontSize: 14, color: debt.paid ? '#333' : '#888', textDecoration: debt.paid ? 'line-through' : 'none', margin: 0 }}>
                      {debt.name}
                    </p>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, background: `${catColor}22`, color: catColor, letterSpacing: '0.08em' }}>
                      {debt.category}
                    </span>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, background: '#141414', color: '#333' }}>
                      {debt.type === 'fixed' ? 'fixo' : 'variável'}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: '#2a2a2a', fontFamily: 'var(--font-mono)', margin: 0 }}>
                    Vence dia {debt.dueDay}{debt.notes ? ` · ${debt.notes}` : ''}
                  </p>
                </div>

                {/* Valor */}
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: debt.paid ? '#333' : '#f0f0f0', flexShrink: 0, margin: 0 }}>
                  {formatBRL(debt.amount)}
                </p>

                {/* Deletar */}
                <button onClick={() => deleteDebt(debt.id)} style={{ background: 'none', border: 'none', color: '#1a1a1a', cursor: 'pointer', fontSize: 18, padding: '0 4px', transition: '0.2s', lineHeight: 1 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#1a1a1a')}>×</button>
              </div>
            )
          })}
        </div>
      )}

      {showAdd && <AddDebtModal onAdd={addDebt} onClose={() => setShowAdd(false)} />}
    </div>
  )
}
