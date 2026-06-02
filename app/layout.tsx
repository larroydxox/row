'use client'
import './globals.css'
import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { QuickAddButton } from '@/components/layout/QuickAddButton'
import { ToastContainer } from '@/components/shared/Toast'
import { SidebarProvider, useSidebar } from '@/lib/sidebar-context'

function AppShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()
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
    <body className='h-full' style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <Sidebar />
      <div
        className='flex flex-col min-h-screen'
        style={{
          marginLeft: collapsed ? 56 : 220,
          transition: 'margin-left 0.2s ease',
        }}
      >
        <Header onOpenCommand={() => setCmdOpen(true)} />
        <main className='flex-1 p-8 max-w-[1200px] mx-auto w-full'>
          {children}
        </main>
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <QuickAddButton />
      <ToastContainer />
    </body>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR' className='h-full'>
      <head>
        <title>Valios — Life OS</title>
        <meta name='description' content='Dashboard pessoal' />
      </head>
      <SidebarProvider>
        <AppShell>{children}</AppShell>
      </SidebarProvider>
    </html>
  )
}
