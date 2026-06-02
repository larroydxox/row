'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CheckSquare, Lightbulb, Brain, Wallet, Heart, Settings, ChevronLeft, ChevronRight } from 'lucide-react'

const nav = [
  { href: '/',        icon: Home,        label: 'Início' },
  { href: '/tasks',   icon: CheckSquare, label: 'Tarefas' },
  { href: '/ideas',   icon: Lightbulb,   label: 'Ideias' },
  { href: '/brain',   icon: Brain,       label: 'Cérebro' },
  { href: '/finance', icon: Wallet,      label: 'Finanças' },
  { href: '/health',  icon: Heart,       label: 'Saúde' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const w = collapsed ? 56 : 220

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, height: '100vh', width: w,
      background: 'var(--bg-surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', zIndex: 50,
      transition: 'width 0.2s ease', overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? 0 : '0 16px' }}>
        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--accent-green)', letterSpacing: collapsed ? '0.1em' : '0.2em' }}>
          {collapsed ? 'V' : 'VALIOS'}
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '10px 0' : '10px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 8, textDecoration: 'none',
              fontSize: 14, fontWeight: 500,
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: active ? 'var(--bg-elevated)' : 'transparent',
              borderLeft: active ? '2px solid var(--accent-green)' : '2px solid transparent',
              transition: 'background 0.15s, color 0.15s',
              whiteSpace: 'nowrap',
            }}>
              <Icon size={16} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              {!collapsed && label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Link href='/config' style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: collapsed ? '10px 0' : '10px 12px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderRadius: 8, textDecoration: 'none',
          fontSize: 14, color: 'var(--text-secondary)',
          whiteSpace: 'nowrap',
        }}>
          <Settings size={16} strokeWidth={1.8} />
          {!collapsed && 'Config'}
        </Link>
        <button onClick={onToggle} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: collapsed ? '10px 0' : '10px 12px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderRadius: 8, border: 'none', background: 'transparent',
          color: 'var(--text-muted)', cursor: 'pointer', width: '100%',
          fontSize: 13, whiteSpace: 'nowrap',
        }}>
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Recolher</span></>}
        </button>
      </div>
    </aside>
  )
}
