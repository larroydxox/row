import type { Metadata } from 'next'
import { Space_Mono, JetBrains_Mono, Caveat } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/layout/AppShell'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
})

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

const caveat = Caveat({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-caveat',
})

export const metadata: Metadata = {
  title: 'Valios — Life OS',
  description: 'Dashboard pessoal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang='pt-BR'
      className={`h-full ${spaceMono.variable} ${jetbrainsMono.variable} ${caveat.variable}`}
    >
      <body className='h-full' style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
