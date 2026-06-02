'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Home, CheckSquare, Lightbulb, Brain, Wallet, Heart, Settings, ChevronLeft, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const groups = [
  {
    label: '— principal —',
    items: [
      { href: '/', icon: Home, label: 'Início' },
      { href: '/tasks', icon: CheckSquare, label: 'Tarefas' },
      { href: '/ideas', icon: Lightbulb, label: 'Ideias' },
      { href: '/brain', icon: Brain, label: 'Cérebro' },
    ],
  },
  {
    label: '— dinheiro —',
    items: [
      { href: '/finance', icon: Wallet, label: 'Finanças' },
    ],
  },
  {
    label: '— corpo —',
    items: [
      { href: '/health', icon: Heart, label: 'Saúde' },
    ],
  },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full flex flex-col z-50 transition-all duration-200',
        'border-r',
        collapsed ? 'w-14' : 'w-[220px]'
      )}
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-14 px-4', collapsed && 'justify-center')}>
        {collapsed ? (
          <span className='font-mono text-sm font-bold' style={{ color: 'var(--accent-green)', letterSpacing: '0.1em' }}>V</span>
        ) : (
          <span className='font-mono text-sm font-bold tracking-[0.2em]' style={{ color: 'var(--accent-green)' }}>VALIOS</span>
        )}
      </div>

      {/* Nav */}
      <nav className='flex-1 overflow-y-auto py-2 px-2'>
        {groups.map((group) => (
          <div key={group.label} className='mb-4'>
            {!collapsed && (
              <div
                className='px-2 py-1 text-[10px] font-mono uppercase tracking-wider mb-1'
                style={{ color: 'var(--text-muted)' }}
              >
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium mb-0.5 transition-all duration-150',
                    active
                      ? 'border-l-2'
                      : 'border-l-2 border-transparent hover:border-transparent',
                    collapsed && 'justify-center px-0'
                  )}
                  style={{
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: active ? 'var(--bg-elevated)' : 'transparent',
                    borderLeftColor: active ? 'var(--accent-green)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                    }
                  }}
                >
                  <item.icon size={16} strokeWidth={1.8} className='flex-shrink-0' />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: Config + Collapse */}
      <div className='px-2 pb-4 flex flex-col gap-1'>
        <Link
          href='/config'
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150',
            collapsed && 'justify-center px-0'
          )}
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
          }}
        >
          <Settings size={16} strokeWidth={1.8} />
          {!collapsed && <span>Config</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150 w-full',
            collapsed && 'justify-center px-0'
          )}
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className='text-xs'>Recolher</span>}
        </button>
      </div>
    </aside>
  )
}
