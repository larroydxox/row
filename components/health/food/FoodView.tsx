'use client'
import { useConfigStore } from '@/lib/store/use-config'

export function FoodView() {
  const { kcalGoal } = useConfigStore()

  return (
    <div className='flex flex-col gap-6'>
      <div className='rounded-xl p-8 text-center' style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text-muted)', marginBottom: 12 }}>
          Alimentação
        </p>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>
          Meta calórica: <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{kcalGoal} kcal</span>
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Registro de refeições em breve — configure sua meta em <strong>Config</strong>.
        </p>
      </div>
    </div>
  )
}
