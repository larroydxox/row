'use client'
import { cn } from '@/lib/utils'

interface Tab {
  key: string
  label: string
  icon?: string
}

interface SubTabsProps {
  tabs: Tab[]
  active: string
  onChange: (key: string) => void
}

export function SubTabs({ tabs, active, onChange }: SubTabsProps) {
  return (
    <div
      className='inline-flex gap-1 p-1 rounded-lg mb-6'
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className='flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150'
          style={{
            background: active === tab.key ? 'var(--bg-elevated)' : 'transparent',
            color: active === tab.key ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: active === tab.key ? '1px solid var(--border-active)' : '1px solid transparent',
          }}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
