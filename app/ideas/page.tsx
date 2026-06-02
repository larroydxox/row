'use client'
import { useState } from 'react'
import { SubTabs } from '@/components/shared/SubTabs'
import { IdeaCapture } from '@/components/ideas/IdeaCapture'
import { NotesView } from '@/components/notes/NotesView'

const tabs = [
  { key: 'ideas', label: 'Ideias', icon: '💡' },
  { key: 'notes', label: 'Notas', icon: '📝' },
]

export default function IdeasPage() {
  const [tab, setTab] = useState('ideas')

  return (
    <div className='animate-fade-in'>
      <SubTabs tabs={tabs} active={tab} onChange={setTab} />
      {tab === 'ideas' ? <IdeaCapture /> : <NotesView />}
    </div>
  )
}
