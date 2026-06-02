'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, CheckSquare, Lightbulb, FileText, Droplets, Home, Wallet, Heart, Brain } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

const quickActions = [
  { label: 'Início', icon: Home, href: '/', group: 'navegação' },
  { label: 'Tarefas', icon: CheckSquare, href: '/tasks', group: 'navegação' },
  { label: 'Ideias', icon: Lightbulb, href: '/ideas', group: 'navegação' },
  { label: 'Cérebro', icon: Brain, href: '/brain', group: 'navegação' },
  { label: 'Finanças', icon: Wallet, href: '/finance', group: 'navegação' },
  { label: 'Saúde', icon: Heart, href: '/health', group: 'navegação' },
  { label: 'Nova tarefa', icon: CheckSquare, href: '/tasks', group: 'ações' },
  { label: 'Nova ideia', icon: Lightbulb, href: '/ideas', group: 'ações' },
  { label: 'Nova nota', icon: FileText, href: '/ideas?tab=notes', group: 'ações' },
  { label: 'Registrar água', icon: Droplets, href: '/health?tab=water', group: 'ações' },
]

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const router = useRouter()

  const filtered = quickActions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (!open) { setQuery(''); setActive(0) }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') setActive((v) => Math.min(v + 1, filtered.length - 1))
      if (e.key === 'ArrowUp') setActive((v) => Math.max(v - 1, 0))
      if (e.key === 'Enter' && filtered[active]) {
        router.push(filtered[active].href)
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, active, filtered, onClose, router])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!open) return null

  const groups = Array.from(new Set(filtered.map((a) => a.group)))

  return (
    <div
      className='fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]'
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className='w-full max-w-xl rounded-xl overflow-hidden shadow-2xl animate-fade-in'
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-active)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className='flex items-center gap-3 px-4 py-3' style={{ borderBottom: '1px solid var(--border)' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            autoFocus
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0) }}
            placeholder='Buscar ou executar ação...'
            className='flex-1 bg-transparent outline-none text-sm'
            style={{ color: 'var(--text-primary)', caretColor: 'var(--accent-green)' }}
          />
          <kbd className='text-[10px] px-1.5 py-0.5 rounded font-mono' style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className='max-h-80 overflow-y-auto py-2'>
          {groups.map((group) => (
            <div key={group}>
              <div className='px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider' style={{ color: 'var(--text-muted)' }}>
                {group}
              </div>
              {filtered
                .filter((a) => a.group === group)
                .map((action, i) => {
                  const idx = filtered.indexOf(action)
                  return (
                    <button
                      key={action.label}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors duration-100'
                      )}
                      style={{
                        background: idx === active ? 'var(--bg-surface)' : 'transparent',
                        color: idx === active ? 'var(--text-primary)' : 'var(--text-secondary)',
                      }}
                      onClick={() => { router.push(action.href); onClose() }}
                      onMouseEnter={() => setActive(idx)}
                    >
                      <action.icon size={15} />
                      {action.label}
                    </button>
                  )
                })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className='px-4 py-8 text-center text-sm' style={{ color: 'var(--text-muted)' }}>
              Nenhum resultado encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
