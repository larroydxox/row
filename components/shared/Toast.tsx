'use client'
import { create } from 'zustand'
import { useEffect } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'
interface Toast { id: string; message: string; type: ToastType }

interface ToastState {
  toasts: Toast[]
  add: (message: string, type?: ToastType) => void
  remove: (id: string) => void
}

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  add: (message, type = 'success') => {
    const id = crypto.randomUUID()
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3500)
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

const icons = { success: CheckCircle, error: XCircle, info: Info }
const colors = {
  success: 'var(--accent-green)',
  error: 'var(--accent-red)',
  info: 'var(--accent-blue)',
}

function ToastItem({ toast }: { toast: Toast }) {
  const { remove } = useToast()
  const Icon = icons[toast.type]
  return (
    <div
      className='flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl animate-fade-in'
      style={{ background: 'var(--bg-elevated)', border: `1px solid var(--border-active)`, minWidth: 280 }}
    >
      <Icon size={16} style={{ color: colors[toast.type], flexShrink: 0 }} />
      <span className='flex-1 text-sm' style={{ color: 'var(--text-primary)' }}>{toast.message}</span>
      <button onClick={() => remove(toast.id)} style={{ color: 'var(--text-muted)' }}>
        <X size={14} />
      </button>
      {/* Progress bar */}
      <div
        className='absolute bottom-0 left-0 h-0.5 rounded-b-lg'
        style={{
          background: colors[toast.type],
          animation: 'toast-progress 3.5s linear forwards',
          width: '100%',
        }}
      />
    </div>
  )
}

export function ToastContainer() {
  const { toasts } = useToast()
  return (
    <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center pointer-events-none'>
      {toasts.map((t) => (
        <div key={t.id} className='pointer-events-auto relative overflow-hidden'>
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  )
}
