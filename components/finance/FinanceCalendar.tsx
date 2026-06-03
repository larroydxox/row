'use client'
import { useState } from 'react'
import { useFinanceStore } from '@/lib/store/use-finance'
import { formatBRL } from '@/lib/utils/format'
import { DayModal } from './DayModal'

function pad(n: number) { return String(n).padStart(2, '0') }
function dateStr(y: number, m: number, d: number) { return `${y}-${pad(m + 1)}-${pad(d)}` }

const WEEK_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export function FinanceCalendar() {
  const { dayEntries, addDayEntry, deleteDayEntry, cards, debts } = useFinanceStore()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [current, setCurrent] = useState(() => {
    const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() }
  })

  const { year, month } = current
  const firstDOW  = new Date(year, month, 1).getDay()
  const daysCount = new Date(year, month + 1, 0).getDate()
  const todayStr  = dateStr(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())

  const monthPrefix = `${year}-${pad(month + 1)}`

  const monthEntries = dayEntries.filter((e) => e.date.startsWith(monthPrefix))
  const monthIncome  = monthEntries.filter((e) => e.type === 'income').reduce((a, e) => a + e.amount, 0)
  const monthExpense = monthEntries.filter((e) => e.type === 'expense').reduce((a, e) => a + e.amount, 0)
  const monthBalance = monthIncome - monthExpense

  const getDayBalance = (day: number) => {
    const ds = dateStr(year, month, day)
    return dayEntries
      .filter((e) => e.date === ds)
      .reduce((acc, e) => acc + (e.type === 'income' ? e.amount : -e.amount), 0)
  }

  const prev = () => setCurrent(({ year: y, month: m }) => m === 0 ? { year: y - 1, month: 11 } : { year: y, month: m - 1 })
  const next = () => setCurrent(({ year: y, month: m }) => m === 11 ? { year: y + 1, month: 0 } : { year: y, month: m + 1 })

  const monthLabel = new Date(year, month, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const selectedEntries  = selectedDate ? dayEntries.filter((e) => e.date === selectedDate) : []
  const selectedDay      = selectedDate ? parseInt(selectedDate.split('-')[2]) : 0
  const selectedClosings = selectedDate ? cards.filter((c) => c.closingDay === selectedDay) : []
  const selectedDebts    = selectedDate ? debts.filter((d) => d.dueDay === selectedDay) : []

  return (
    <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 12, padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 10, color: '#333', letterSpacing: '0.14em', marginBottom: 4 }}>CALENDÁRIO FINANCEIRO</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#f0f0f0', textTransform: 'capitalize' }}>{monthLabel}</p>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {[{ label: '‹', fn: prev }, { label: 'Hoje', fn: () => { const d = new Date(); setCurrent({ year: d.getFullYear(), month: d.getMonth() }) } }, { label: '›', fn: next }].map(({ label, fn }) => (
            <button key={label} onClick={fn} style={{ background: 'transparent', border: '1px solid #1a1a1a', borderRadius: 6, color: '#555', padding: '6px 12px', cursor: 'pointer', fontSize: label === 'Hoje' ? 11 : 16, transition: 'all 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#333')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1a1a1a')}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Resumo do mês */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'ENTRADAS', value: monthIncome,  color: '#00ff88' },
          { label: 'SAÍDAS',   value: monthExpense, color: '#ef4444' },
          { label: 'SALDO',    value: monthBalance, color: monthBalance >= 0 ? '#00ff88' : '#ef4444' },
        ].map((item) => (
          <div key={item.label} style={{ background: '#141414', borderRadius: 8, padding: '14px 16px' }}>
            <p style={{ fontSize: 9, color: '#333', letterSpacing: '0.12em', marginBottom: 6 }}>{item.label}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: item.value === 0 ? '#222' : item.color, margin: 0 }}>
              {item.value === 0 ? '—' : (item.label === 'SALDO' && monthBalance < 0 ? '-' : '') + formatBRL(Math.abs(item.value))}
            </p>
          </div>
        ))}
      </div>

      {/* Dias da semana */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {WEEK_LABELS.map((d) => (
          <p key={d} style={{ textAlign: 'center', fontSize: 9, color: '#2a2a2a', letterSpacing: '0.08em', margin: '0 0 8px' }}>{d}</p>
        ))}
      </div>

      {/* Grid de dias */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {/* Células vazias */}
        {Array.from({ length: firstDOW }, (_, i) => <div key={`e-${i}`} />)}

        {/* Dias */}
        {Array.from({ length: daysCount }, (_, i) => {
          const day   = i + 1
          const ds    = dateStr(year, month, day)
          const bal   = getDayBalance(day)
          const hasData = dayEntries.some((e) => e.date === ds)
          const isToday = ds === todayStr
          const closings = cards.filter((c) => c.closingDay === day)
          const dueDebts = debts.filter((d) => d.dueDay === day)

          return (
            <div
              key={day}
              onClick={() => setSelectedDate(ds)}
              style={{
                minHeight: 64, padding: 8, borderRadius: 8, cursor: 'pointer',
                border: `1px solid ${isToday ? '#00ff8833' : '#0f0f0f'}`,
                background: isToday ? '#00ff8808' : '#141414',
                display: 'flex', flexDirection: 'column', gap: 4, transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = isToday ? '#00ff8855' : '#1f1f1f')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = isToday ? '#00ff8833' : '#0f0f0f')}
            >
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: isToday ? '#00ff88' : '#444', margin: 0, lineHeight: 1 }}>{day}</p>

              {hasData && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: bal >= 0 ? '#00ff88' : '#ef4444', margin: 0, lineHeight: 1 }}>
                  {bal >= 0 ? '+' : ''}{formatBRL(Math.abs(bal)).replace('R$ ', '')}
                </p>
              )}

              <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginTop: 'auto' }}>
                {closings.map((c) => (
                  <div key={c.id} title={`Fecha ${c.name}`} style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                ))}
                {dueDebts.map((d) => (
                  <div key={d.id} title={`Vence ${d.name}`} style={{ width: 6, height: 6, borderRadius: 1, background: d.color, flexShrink: 0 }} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', gap: 20, marginTop: 18, paddingTop: 16, borderTop: '1px solid #141414', flexWrap: 'wrap' }}>
        {[
          { shape: '●', color: '#3b82f6', label: 'Fechamento de cartão' },
          { shape: '■', color: '#ef4444', label: 'Vencimento de dívida' },
          { shape: '—', color: '#00ff88', label: 'Saldo positivo'       },
          { shape: '—', color: '#ef4444', label: 'Saldo negativo'       },
        ].map(({ shape, color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color }}>{shape}</span>
            <p style={{ fontSize: 10, color: '#333', margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedDate && (
        <DayModal
          date={selectedDate}
          entries={selectedEntries}
          cardClosings={selectedClosings}
          debtsToday={selectedDebts}
          onAdd={addDayEntry}
          onDelete={deleteDayEntry}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  )
}
