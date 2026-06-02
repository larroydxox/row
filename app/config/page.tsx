'use client'

export default function ConfigPage() {
  return (
    <div className='animate-fade-in max-w-lg'>
      <div className='text-[10px] font-mono tracking-wider mb-6' style={{ color: 'var(--text-muted)' }}>
        CONFIGURAÇÕES
      </div>
      <div
        className='rounded-xl p-6 flex flex-col gap-4'
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div>
          <div className='text-sm font-medium mb-1' style={{ color: 'var(--text-primary)' }}>Nome</div>
          <input
            defaultValue='Usuário'
            className='w-full px-3 py-2 rounded-lg text-sm outline-none'
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <div>
          <div className='text-sm font-medium mb-1' style={{ color: 'var(--text-primary)' }}>Meta de água (ml)</div>
          <input
            type='number'
            defaultValue={3000}
            className='w-full px-3 py-2 rounded-lg text-sm outline-none font-mono'
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <div>
          <div className='text-sm font-medium mb-1' style={{ color: 'var(--text-primary)' }}>Meta calórica (kcal)</div>
          <input
            type='number'
            defaultValue={2200}
            className='w-full px-3 py-2 rounded-lg text-sm outline-none font-mono'
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <div>
          <div className='text-sm font-medium mb-3' style={{ color: 'var(--text-primary)' }}>Tema</div>
          <div className='flex gap-2'>
            {['Escuro', 'Mais escuro', 'OLED'].map((t) => (
              <button
                key={t}
                className='px-4 py-2 rounded-lg text-sm font-mono transition-all duration-150'
                style={{
                  background: t === 'Escuro' ? 'var(--accent-green)' : 'var(--bg-elevated)',
                  color: t === 'Escuro' ? '#0a0a0a' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className='pt-2'>
          <div className='text-[10px] font-mono' style={{ color: 'var(--text-muted)' }}>
            VALIOS v0.1.0 · Todos os dados ficam no seu navegador
          </div>
        </div>
      </div>
    </div>
  )
}
