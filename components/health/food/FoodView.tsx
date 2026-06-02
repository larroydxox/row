'use client'
import { useState } from 'react'
import { useHealth } from '@/lib/store/use-health'
import { ProgressRing } from '@/components/shared/ProgressRing'
import { BarChart, Bar, XAxis, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'

export function FoodView() {
  const health = useHealth((s) => s.health)
  const { food } = health
  const kcalPct = Math.round((food.kcalConsumed / food.kcalGoal) * 100)

  const macros = [
    { key: 'protein', label: 'Proteína', ...food.macros.protein },
    { key: 'carbs', label: 'Carboidrato', ...food.macros.carbs },
    { key: 'fat', label: 'Gordura', ...food.macros.fat },
    { key: 'fiber', label: 'Fibra', ...food.macros.fiber },
  ]

  return (
    <div className='flex flex-col gap-6'>
      {/* Summary */}
      <div
        className='rounded-xl p-6'
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className='flex items-start gap-8'>
          <ProgressRing value={kcalPct} size={120} strokeWidth={7} color='var(--accent-amber)' glow={false}>
            <span className='font-mono text-xl font-bold' style={{ color: 'var(--text-primary)' }}>{kcalPct}%</span>
          </ProgressRing>
          <div className='flex-1'>
            <div className='flex items-baseline gap-2 mb-4'>
              <span className='text-2xl font-mono font-bold' style={{ color: 'var(--text-primary)' }}>{food.kcalConsumed}</span>
              <span className='text-sm font-mono' style={{ color: 'var(--text-muted)' }}>/ {food.kcalGoal} kcal</span>
            </div>
            <div className='flex flex-col gap-3'>
              {macros.map((m) => {
                const pct = Math.round((m.consumed / m.goal) * 100)
                return (
                  <div key={m.key}>
                    <div className='flex justify-between mb-1'>
                      <span className='text-xs' style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                      <span className='text-xs font-mono' style={{ color: 'var(--text-secondary)' }}>
                        {m.consumed}{m.unit} / {m.goal}{m.unit}
                      </span>
                    </div>
                    <div className='h-1.5 rounded-full' style={{ background: 'var(--bg-elevated)' }}>
                      <div className='h-full rounded-full transition-all duration-500' style={{ width: `${Math.min(pct, 100)}%`, background: m.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Meal timeline */}
      <div className='flex flex-col gap-3'>
        {food.meals.map((meal) => (
          <MealCard key={meal.name} meal={meal} />
        ))}
      </div>

      {/* Weekly calories */}
      <div
        className='rounded-xl p-5'
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className='text-[10px] font-mono tracking-wider mb-4' style={{ color: 'var(--text-muted)' }}>
          CALORIAS SEMANAIS
        </div>
        <ResponsiveContainer width='100%' height={120}>
          <BarChart data={food.weeklyKcal} barSize={24}>
            <XAxis dataKey='day' tick={{ fill: '#444', fontSize: 10 }} axisLine={false} tickLine={false} />
            <ReferenceLine y={food.kcalGoal} stroke='rgba(245,158,11,0.4)' strokeDasharray='4 3' />
            <Bar dataKey='kcal' radius={[3, 3, 0, 0]}>
              {food.weeklyKcal.map((d, i) => (
                <Cell key={i} fill={d.kcal > food.kcalGoal ? 'rgba(239,68,68,0.5)' : 'rgba(245,158,11,0.5)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function MealCard({ meal }: { meal: { name: string; kcal: number; items: { name: string; kcal: number }[] } }) {
  const [open, setOpen] = useState(meal.items.length > 0)

  return (
    <div
      className='rounded-xl overflow-hidden'
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className='w-full flex items-center justify-between p-4'
      >
        <div className='flex items-center gap-3'>
          <span className='text-sm font-medium' style={{ color: 'var(--text-primary)' }}>{meal.name}</span>
          {meal.items.length === 0 && (
            <span className='text-[10px] font-mono' style={{ color: 'var(--text-muted)' }}>vazio</span>
          )}
        </div>
        <div className='flex items-center gap-3'>
          <span className='text-sm font-mono' style={{ color: 'var(--accent-amber)' }}>{meal.kcal} kcal</span>
          {open ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
        </div>
      </button>
      {open && (
        <div className='px-4 pb-4' style={{ borderTop: '1px solid var(--border)' }}>
          <div className='flex flex-col gap-2 mt-3'>
            {meal.items.map((item) => (
              <div key={item.name} className='flex items-center justify-between'>
                <span className='text-sm' style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                <span className='text-xs font-mono' style={{ color: 'var(--text-muted)' }}>{item.kcal} kcal</span>
              </div>
            ))}
          </div>
          <button
            className='mt-3 flex items-center gap-2 text-xs'
            style={{ color: 'var(--text-muted)' }}
          >
            <Plus size={12} />
            Adicionar alimento
          </button>
        </div>
      )}
    </div>
  )
}
