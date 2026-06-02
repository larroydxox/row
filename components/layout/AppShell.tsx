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

  const sidebarWidth = sidebarCollapsed ? 56 : 220

  // Render bare shell during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className='flex flex-col min-h-screen' style={{ marginLeft: 220 }}>
        <div className='h-14' style={{ borderBottom: '1px solid var(--border)' }} />
        <main className='flex-1 p-8 w-full max-w-[1200px] mx-auto'>
          {children}
        </main>
      </div>
    )
  }

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
