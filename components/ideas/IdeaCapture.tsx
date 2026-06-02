'use client'
import { useState } from 'react'
import { useIdeas } from '@/lib/store/use-ideas'
import { timeAgo } from '@/lib/utils'
import { ArrowRight, CheckSquare, Share2, Trash2 } from 'lucide-react'

export function IdeaCapture() {
  const { ideas, addIdea, deleteIdea } = useIdeas()
  const [input, setInput] = useState('')

  const handleCapture = () => {
    if (!input.trim()) return
    addIdea(input.trim())
    setInput('')
  }

  return (
    <div>
      {/* Capture input */}
      <div
        className='rounded-xl p-4 mb-6'
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleCapture()
            }
          }}
          placeholder='O que está na sua cabeça?'
          rows={3}
          className='w-full bg-transparent outline-none text-base resize-none'
          style={{
            color: 'var(--text-primary)',
            caretColor: 'var(--accent-green)',
            fontFamily: 'inherit',
          }}
        />
        <div className='flex justify-end mt-2'>
          <button
            onClick={handleCapture}
            className='px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150'
            style={{ background: 'var(--accent-green)', color: '#0a0a0a' }}
          >
            Capturar
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className='flex flex-col gap-3'>
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className='rounded-xl p-4 group transition-all duration-150 hover:translate-y-[-1px]'
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderLeft: '2px solid var(--accent-purple)',
            }}
          >
            <div className='flex items-start justify-between gap-4'>
              <p className='text-sm leading-relaxed flex-1' style={{ color: 'var(--text-primary)' }}>
                {idea.text}
              </p>
              <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0'>
                <button title='Virar Tarefa' style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent-green)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
                >
                  <CheckSquare size={14} />
                </button>
                <button title='Mover para Nota' style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent-blue)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
                >
                  <ArrowRight size={14} />
                </button>
                <button title='Conectar' style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent-purple)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
                >
                  <Share2 size={14} />
                </button>
                <button onClick={() => deleteIdea(idea.id)} style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent-red)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className='flex items-center gap-3 mt-3'>
              <span
                className='text-[10px] font-mono px-2 py-0.5 rounded-full'
                style={{
                  background: `${idea.tagColor}22`,
                  color: idea.tagColor,
                  border: `1px solid ${idea.tagColor}44`,
                }}
              >
                {idea.tag}
              </span>
              <span className='text-[11px] font-mono' style={{ color: 'var(--text-muted)' }}>
                {timeAgo(idea.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
