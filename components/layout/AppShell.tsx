'use client'
import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { CommandPalette } from './CommandPalette'
import { QuickAddButton } from './QuickAddButton'
import { ToastContainer } from '@/components/shared/Toast'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // SSR: render nothing — this is a private dashboard, no SEO needed.
  // All content renders client-side only, eliminating any hydration mismatch.
  if (!mounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-base)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '2px solid rgba(0,255,136,0.2)',
            borderTopColor: '#00ff88',
            animation: 'spin 0.7s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const sidebarWidth = sidebarCollapsed ? 56 : 220

  return (
    <>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />
      <div
        className='flex flex-col min-h-screen transition-all duration-200'
        style={{ marginLeft: sidebarWidth }}
      >
        <Header onOpenCommand={() => setCmdOpen(true)} />
        <main className='flex-1 p-8 w-full max-w-[1200px] mx-auto'>
          {children}
        </main>
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <QuickAddButton />
      <ToastContainer />
    </>
  )
}
