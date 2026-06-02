'use client'
import { useState } from 'react'
import { mockFinance } from '@/lib/data/mock-finance'
import { formatCHF } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Landmark, TrendingUp, Coins, Package, Plus } from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  landmark: Landmark,
  'trending-up': TrendingUp,
  coins: Coins,
  package: Package,
}

const periods = ['1M', '3M', '6M', '1A', 'Total']

export default function FinancePage() {
  const [period, setPeriod] = useState('6M')
  const { total, history, categories, recentActivity } = mockFinance

  const prevTotal = history[history.length - 2]?.value ?? total
  const delta = ((total - prevTotal) / prevTotal) * 100

  return (
    <div className='animate-fade-in flex flex-col gap-6'>
      {/* Header */}
      <div>
        <div className='text-[10px] font-mono tracking-widest uppercase mb-1' style={{ color: 'var(--text-muted)' }}>
          PATRIMÔNIO LÍQUIDO TOTAL
        </div>
        <div className='flex items-baseline gap-4'>
          <span className='font-mono font-bold' style={{ fontSize: 52, color: 'var(--text-primary)', lineHeight: 1 }}>
            {formatCHF(total)}
          </span>
          <span className='text-sm font-mono' style={{ color: delta >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            {delta >= 0 ? '↑' : '↓'} +{Math.abs(delta).toFixed(1)}% este mês
          </span>
        </div>
      </div>

      {/* Chart */}
      <div
        className='rounded-xl p-6'
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        {/* Period selector */}
        <div className='flex items-center justify-between mb-4'>
          <div className='text-[10px] font-mono tracking-wider' style={{ color: 'var(--text-muted)' }}>
            HISTÓRICO
          </div>
          <div className='flex gap-1'>
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className='text-[11px] font-mono px-2.5 py-1 rounded-md transition-all duration-150'
                style={{
                  background: period === p ? 'var(--accent-green)' : 'var(--bg-elevated)',
                  color: period === p ? '#0a0a0a' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                {p}
              </button>
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
            <XAxis dataKey='month' tick={{ fill: '#444', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#444', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip
              contentStyle={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#888' }}
              itemStyle={{ color: '#00ff88' }}
              formatter={(v) => [formatCHF(Number(v)), 'Patrimônio']}
            />
            <Area type='monotone' dataKey='value' stroke='#00ff88' strokeWidth={2} fill='url(#grad)' dot={{ fill: '#00ff88', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Allocation + Assets */}
      <div className='grid grid-cols-2 gap-6'>
        {/* Allocation donut (simplified) */}
        <div
          className='rounded-xl p-5'
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className='text-[10px] font-mono tracking-wider mb-4' style={{ color: 'var(--text-muted)' }}>ALOCAÇÃO</div>
          <div className='flex flex-col gap-3'>
            {categories.map((cat) => {
              const pct = Math.round((cat.total / total) * 100)
              return (
                <div key={cat.name}>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-sm' style={{ color: 'var(--text-secondary)' }}>{cat.name}</span>
                    <span className='text-sm font-mono' style={{ color: 'var(--text-primary)' }}>
                      {pct}% · {formatCHF(cat.total)}
                    </span>
                  </div>
                  <div className='h-1.5 rounded-full' style={{ background: 'var(--bg-elevated)' }}>
                    <div className='h-full rounded-full transition-all duration-500' style={{ width: `${pct}%`, background: cat.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent activity */}
        <div
          className='rounded-xl p-5'
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className='text-[10px] font-mono tracking-wider mb-4' style={{ color: 'var(--text-muted)' }}>ATIVIDADE RECENTE</div>
          <div className='flex flex-col gap-4'>
            {recentActivity.map((a, i) => (
              <div key={i} className='flex items-center justify-between'>
                <div>
                  <div className='text-sm' style={{ color: 'var(--text-secondary)' }}>{a.action}</div>
                  <div className='text-[11px] font-mono' style={{ color: 'var(--text-muted)' }}>{a.time}</div>
                </div>
                <span className='text-sm font-mono' style={{ color: 'var(--accent-green)' }}>{a.delta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset cards */}
      <div className='grid grid-cols-2 gap-4'>
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] ?? Landmark
          return (
            <div
              key={cat.name}
              className='rounded-xl p-5'
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderLeft: `2px solid ${cat.color}`,
              }}
            >
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <Icon size={16} style={{ color: cat.color }} />
                  <span className='text-sm font-medium' style={{ color: 'var(--text-primary)' }}>{cat.name}</span>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='font-mono font-bold text-sm' style={{ color: cat.color }}>{formatCHF(cat.total)}</span>
                  <button style={{ color: 'var(--text-muted)' }}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                {cat.items.map((item) => (
                  <div key={item.name} className='flex items-center justify-between'>
                    <span className='text-sm' style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                    <span className='text-sm font-mono' style={{ color: 'var(--text-primary)' }}>{formatCHF(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
