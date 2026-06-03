'use client'
import { useState } from 'react'
import { mockFinance } from '@/lib/data/mock-finance'
import { useFinance } from '@/lib/store/use-finance'
import { formatBRL } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Landmark, TrendingUp, Coins, Package, Plus, X } from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  landmark: Landmark, 'trending-up': TrendingUp, coins: Coins, package: Package,
}

const periods = ['1M', '3M', '6M', '1A', 'Total']

export default function FinancePage() {
  const [period, setPeriod] = useState('6M')
  const { total, categories, updateItem, addItem, removeItem } = useFinance()
  const { history, recentActivity } = mockFinance

  const prevTotal = history[history.length - 2]?.value ?? total
  const delta = ((total - prevTotal) / prevTotal) * 100

  return (
    <div className='animate-fade-in flex flex-col gap-6'>
      {/* Header */}
      <div>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: 6 }}>
          PATRIMÔNIO LÍQUIDO TOTAL
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 52, color: 'var(--text-primary)', lineHeight: 1 }}>
            {formatBRL(total)}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: delta >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}% este mês
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className='rounded-xl p-6' style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>HISTÓRICO</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {periods.map((p) => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                fontSize: 11, fontFamily: 'var(--font-mono)', padding: '4px 10px', borderRadius: 6,
                background: period === p ? 'var(--accent-green)' : 'var(--bg-elevated)',
                color: period === p ? '#0a0a0a' : 'var(--text-secondary)',
                border: '1px solid var(--border)', cursor: 'pointer',
              }}>{p}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width='100%' height={220}>
          <AreaChart data={history}>
            <defs>
              <linearGradient id='grad' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#00ff88' stopOpacity={0.25} />
                <stop offset='95%' stopColor='#00ff88' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke='rgba(255,255,255,0.03)' vertical={false} />
            <XAxis dataKey='month' tick={{ fill: '#444', fontSize: 11, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#444', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip
              contentStyle={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#888' }} itemStyle={{ color: '#00ff88' }}
              formatter={(v) => [formatBRL(Number(v)), 'Patrimônio']}
            />
            <Area type='monotone' dataKey='value' stroke='#00ff88' strokeWidth={2} fill='url(#grad)'
              dot={{ fill: '#00ff88', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Allocation + Recent Activity */}
      <div className='grid grid-cols-2 gap-6'>
        <div className='rounded-xl p-5' style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 16 }}>ALOCAÇÃO</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {categories.map((cat) => {
              const catTotal = cat.items.reduce((s, i) => s + i.value, 0)
              const pct = total > 0 ? Math.round((catTotal / total) * 100) : 0
              return (
                <div key={cat.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{cat.name}</span>
                    <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{pct}% · {formatBRL(catTotal)}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-elevated)' }}>
                    <div style={{ height: '100%', borderRadius: 3, width: `${pct}%`, background: cat.color, transition: 'width 0.5s' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className='rounded-xl p-5' style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 16 }}>ATIVIDADE RECENTE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{a.action}</div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{a.time}</div>
                </div>
                <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>{a.delta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset cards — editáveis */}
      <div className='grid grid-cols-2 gap-4'>
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] ?? Landmark
          const catTotal = cat.items.reduce((s, i) => s + i.value, 0)
          return (
            <AssetCard
              key={cat.id}
              cat={{ ...cat, total: catTotal }}
              Icon={Icon}
              onUpdate={(itemId, val) => updateItem(cat.id, itemId, val)}
              onAdd={(name) => addItem(cat.id, name)}
              onRemove={(itemId) => removeItem(cat.id, itemId)}
            />
          )
        })}
      </div>
    </div>
  )
}

function AssetCard({
  cat, Icon, onUpdate, onAdd, onRemove,
}: {
  cat: { id: string; name: string; color: string; total: number; items: { id: string; name: string; value: number }[] }
  Icon: React.ElementType
  onUpdate: (itemId: string, val: number) => void
  onAdd: (name: string) => void
  onRemove: (itemId: string) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [addingName, setAddingName] = useState(false)
  const [newName, setNewName] = useState('')

  return (
    <div className='rounded-xl p-5' style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderLeft: `2px solid ${cat.color}`,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon size={16} style={{ color: cat.color }} />
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{cat.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: cat.color }}>{formatBRL(cat.total)}</span>
          <button onClick={() => setAddingName(true)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {cat.items.map((item) => (
          <div key={item.id} className='group' style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 0', borderBottom: '1px solid #141414',
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {editingId === item.id ? (
                <input
                  autoFocus
                  defaultValue={item.value}
                  type='number'
                  style={{
                    background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${cat.color}`,
                    color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
                    fontSize: 13, width: 90, textAlign: 'right', outline: 'none',
                  }}
                  onBlur={(e) => { onUpdate(item.id, Number(e.target.value)); setEditingId(null) }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                />
              ) : (
                <span
                  onClick={() => setEditingId(item.id)}
                  title='Clique para editar'
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer' }}
                >
                  {formatBRL(item.value)}
                </span>
              )}
              <button
                onClick={() => onRemove(item.id)}
                style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0, transition: 'opacity 0.15s' }}
                className='group-hover-visible'
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}

        {/* Add new item */}
        {addingName && (
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder='Nome do ativo...'
              style={{
                flex: 1, background: 'var(--bg-elevated)', border: `1px solid ${cat.color}44`,
                borderRadius: 6, padding: '6px 10px', color: 'var(--text-primary)',
                fontSize: 13, outline: 'none',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newName.trim()) { onAdd(newName.trim()); setNewName(''); setAddingName(false) }
                if (e.key === 'Escape') { setAddingName(false); setNewName('') }
              }}
              onBlur={() => { if (newName.trim()) { onAdd(newName.trim()) } setNewName(''); setAddingName(false) }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
