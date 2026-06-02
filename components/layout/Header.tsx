'use client'
import { greeting, todayLabel } from '@/lib/utils'
import { Search } from 'lucide-react'

interface HeaderProps {
  onOpenCommand: () => void
}

export function Header({ onOpenCommand }: HeaderProps) {
  return (
    <header
      className='h-14 flex items-center justify-between px-8 sticky top-0 z-40'
      style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}
    >
      <div className='flex flex-col'>
        <span className='text-xs font-mono' style={{ color: 'var(--text-muted)' }}>
          {todayLabel()}
        </span>
        <span className='text-sm font-medium' style={{ color: 'var(--text-secondary)' }}>
          {greeting()}
        </span>
      </div>
      <button
        onClick={onOpenCommand}
        className='flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-150'
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-active)'
          ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
          ;(e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
        }}
      >
        <Search size={14} />
        <span>Buscar</span>
        <kbd
          className='text-[10px] px-1.5 py-0.5 rounded font-mono'
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        >
          ⌘K
        </kbd>
      </button>
    </header>
  )
}
