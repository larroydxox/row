'use client'
import './globals.css'
import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { QuickAddButton } from '@/components/layout/QuickAddButton'
import { ToastContainer } from '@/components/shared/Toast'

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
    <html lang='pt-BR' className='h-full'>
      <head>
        <title>Valios — Life OS</title>
        <meta name='description' content='Dashboard pessoal' />
      </head>
      <body className='h-full' style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <Sidebar />
        <div className='flex flex-col min-h-screen' style={{ marginLeft: '220px', transition: 'margin-left 0.2s' }}>
          <Header onOpenCommand={() => setCmdOpen(true)} />
          <main className='flex-1 p-8 max-w-[1200px] mx-auto w-full'>
            {children}
          </main>
        </div>
        <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
        <QuickAddButton />
        <ToastContainer />
      </body>
    </html>
  )
}
