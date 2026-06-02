'use client'
import { useState } from 'react'
import { useNotes } from '@/lib/store/use-notes'
import { Plus, Trash2, Save } from 'lucide-react'

export function NotesView() {
  const { notes, activeId, setActive, addNote, updateNote, deleteNote } = useNotes()
  const activeNote = notes.find((n) => n.id === activeId)
  const [saved, setSaved] = useState(false)

  const handleContentChange = (content: string) => {
    if (!activeId) return
    updateNote(activeId, { content })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleTitleChange = (title: string) => {
    if (!activeId) return
    updateNote(activeId, { title })
  }

  return (
    <div className='flex gap-6 h-[calc(100vh-200px)]'>
      {/* Left: Notes list */}
      <div
        className='w-[280px] flex-shrink-0 flex flex-col rounded-xl overflow-hidden'
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className='p-3' style={{ borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={addNote}
            className='w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150'
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
          >
            <Plus size={14} />
            Nova nota
          </button>
        </div>
        <div className='flex-1 overflow-y-auto p-2'>
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => setActive(note.id)}
              className='w-full text-left px-3 py-3 rounded-lg mb-1 transition-all duration-150 group'
              style={{
                background: note.id === activeId ? 'var(--bg-elevated)' : 'transparent',
                borderLeft: note.id === activeId ? '2px solid var(--accent-green)' : '2px solid transparent',
              }}
            >
              <div className='text-sm font-medium mb-1 truncate' style={{ color: note.id === activeId ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {note.title}
              </div>
              <div className='text-[11px] truncate' style={{ color: 'var(--text-muted)' }}>
                {note.content.slice(0, 50).replace(/[#*`\[\]]/g, '')}
              </div>
              <div className='flex items-center justify-between mt-1.5'>
                <span className='text-[10px] font-mono' style={{ color: 'var(--text-muted)' }}>
                  {note.updatedAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id) }}
                  className='opacity-0 group-hover:opacity-100 transition-opacity'
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent-red)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Editor */}
      {activeNote ? (
        <div
          className='flex-1 flex flex-col rounded-xl overflow-hidden'
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          {/* Title bar */}
          <div className='flex items-center justify-between px-6 py-4' style={{ borderBottom: '1px solid var(--border)' }}>
            <input
              value={activeNote.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className='flex-1 bg-transparent outline-none text-lg font-semibold'
              style={{ color: 'var(--text-primary)', caretColor: 'var(--accent-green)' }}
            />
            {saved && (
              <span className='text-xs flex items-center gap-1' style={{ color: 'var(--text-muted)' }}>
                <Save size={11} /> Salvo
              </span>
            )}
          </div>

          {/* Content */}
          <div className='flex-1 overflow-y-auto p-6'>
            <textarea
              value={activeNote.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className='w-full h-full bg-transparent outline-none text-sm leading-relaxed resize-none font-mono'
              style={{
                color: 'var(--text-secondary)',
                caretColor: 'var(--accent-green)',
                minHeight: '100%',
              }}
              placeholder='Escreva em Markdown...'
            />
          </div>

          {/* Tags */}
          <div className='px-6 py-3 flex items-center gap-2' style={{ borderTop: '1px solid var(--border)' }}>
            {activeNote.tags.map((tag) => (
              <span
                key={tag}
                className='text-[10px] font-mono px-2 py-0.5 rounded-full'
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-active)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className='flex-1 flex items-center justify-center' style={{ color: 'var(--text-muted)' }}>
          <span className='text-sm'>Selecione uma nota</span>
        </div>
      )}
    </div>
  )
}
