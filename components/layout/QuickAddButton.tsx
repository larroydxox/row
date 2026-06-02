'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, CheckSquare, Lightbulb, FileText, Droplets, Utensils } from 'lucide-react'
import { cn } from '@/lib/utils'

const actions = [
  { label: 'Nova tarefa', icon: CheckSquare, href: '/tasks' },
  { label: 'Nova ideia', icon: Lightbulb, href: '/ideas' },
  { label: 'Nova nota', icon: FileText, href: '/ideas?tab=notes' },
  { label: 'Registrar água', icon: Droplets, href: '/health?tab=water' },
  { label: 'Registrar refeição', icon: Utensils, href: '/health?tab=food' },
]

export function QuickAddButton() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <div className='fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-2'>
      {/* Actions */}
      {open && (
        <div className='flex flex-col-reverse gap-2 mb-2 animate-fade-in'>
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={() => { router.push(a.href); setOpen(false) }}
              className='flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg transition-all duration-150 hover:translate-x-[-2px]'
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-active)',
                color: 'var(--text-primary)',
              }}
            >
              <a.icon size={15} style={{ color: 'var(--accent-green)' }} />
              {a.label}
            </button>
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200',
          open && 'rotate-45'
        )}
        style={{
          background: 'var(--accent-green)',
          color: '#0a0a0a',
          boxShadow: '0 0 20px rgba(0,255,136,0.25)',
        }}
      >
        <Plus size={22} strokeWidth={2.5} />
      </button>
    </div>
  )
}
