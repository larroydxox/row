import type { Metadata } from 'next'
import './globals.css'
import { ClientShell } from '@/components/layout/ClientShell'

export const metadata: Metadata = {
  title: 'Valios — Life OS',
  description: 'Dashboard pessoal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR'>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}
