'use client'
import { useConfigStore } from '@/lib/store/use-config'

export default function ConfigPage() {
  const { userName, waterGoal, kcalGoal, setUserName, setWaterGoal, setKcalGoal } = useConfigStore()

  return (
    <div className='animate-fade-in max-w-lg'>
      <div className='text-[10px] font-mono tracking-wider mb-6' style={{ color: 'var(--text-muted)' }}>CONFIGURAÇÕES</div>
      <div className='rounded-xl p-6 flex flex-col gap-5' style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>

        <div>
          <div className='text-sm font-medium mb-2' style={{ color: 'var(--text-primary)' }}>Nome</div>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder='Seu nome...'
            className='w-full px-3 py-2 rounded-lg text-sm outline-none'
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>

        <div>
          <div className='text-sm font-medium mb-2' style={{ color: 'var(--text-primary)' }}>Meta de água (ml/dia)</div>
          <input
            type='number'
            value={waterGoal}
            onChange={(e) => setWaterGoal(Number(e.target.value))}
            className='w-full px-3 py-2 rounded-lg text-sm outline-none font-mono'
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <p className='text-xs mt-1' style={{ color: 'var(--text-muted)' }}>{(waterGoal / 1000).toFixed(1)}L por dia</p>
        </div>

        <div>
          <div className='text-sm font-medium mb-2' style={{ color: 'var(--text-primary)' }}>Meta calórica (kcal/dia)</div>
          <input
            type='number'
            value={kcalGoal}
            onChange={(e) => setKcalGoal(Number(e.target.value))}
            className='w-full px-3 py-2 rounded-lg text-sm outline-none font-mono'
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>

        <div style={{ height: 1, background: 'var(--border)' }} />
        <div className='text-[10px] font-mono' style={{ color: 'var(--text-muted)' }}>
          VALIOS v0.2.0 · Dados salvos localmente no seu navegador
        </div>
      </div>
    </div>
  )
}
