'use client'
import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { CommandPalette } from './CommandPalette'
import { QuickAddButton } from './QuickAddButton'
import { ToastContainer } from '@/components/shared/Toast'

export function ClientShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div style={{ marginLeft: collapsed ? 56 : 220, transition: 'margin-left 0.2s ease', minHeight: '100vh' }}>
        <header
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            background: 'rgba(10,10,10,0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <Greeting />
          <button
            onClick={() => setCmdOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: 8,
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer',
            }}
          >
            🔍 Buscar <kbd style={{ fontSize: 10, opacity: 0.6 }}>⌘K</kbd>
          </button>
        </header>
        <main style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </main>
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <QuickAddButton />
      <ToastContainer />
    </>
  )
}

function Greeting() {
  const h = new Date().getHours()
  const greeting = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const d = new Date()
  const label = `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`
  return (
    <div>
      <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{label}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{greeting}</div>
    </div>
  )
}
