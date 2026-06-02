'use client'
import { useEffect, useRef, useState } from 'react'
import { useNotes } from '@/lib/store/use-notes'
import { useIdeas } from '@/lib/store/use-ideas'

interface GraphNode {
  id: string
  label: string
  type: 'note' | 'idea'
  x: number
  y: number
  connections: number
}

interface GraphEdge {
  source: string
  target: string
}

export default function BrainPage() {
  const notes = useNotes((s) => s.notes)
  const ideas = useIdeas((s) => s.ideas)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selected, setSelected] = useState<GraphNode | null>(null)
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])

  useEffect(() => {
    const w = 900
    const h = 600
    const allNodes: GraphNode[] = [
      ...notes.map((n, i) => ({
        id: n.id,
        label: n.title,
        type: 'note' as const,
        x: 100 + Math.cos((i / notes.length) * Math.PI * 2) * 280 + w / 2,
        y: 100 + Math.sin((i / notes.length) * Math.PI * 2) * 180 + h / 2,
        connections: 0,
      })),
      ...ideas.map((idea, i) => ({
        id: idea.id,
        label: idea.text.slice(0, 30) + '...',
        type: 'idea' as const,
        x: 80 + Math.cos((i / ideas.length) * Math.PI * 2 + Math.PI) * 200 + w / 2,
        y: 80 + Math.sin((i / ideas.length) * Math.PI * 2 + Math.PI) * 140 + h / 2,
        connections: 0,
      })),
    ]

    // Parse [[links]] from notes content to create edges
    const allEdges: GraphEdge[] = []
    notes.forEach((note) => {
      const matches = note.content.match(/\[\[([^\]]+)\]\]/g) || []
      matches.forEach((match) => {
        const linked = match.slice(2, -2).toLowerCase()
        const target = allNodes.find(
          (n) => n.label.toLowerCase().includes(linked) || linked.includes(n.label.toLowerCase())
        )
        if (target && target.id !== note.id) {
          allEdges.push({ source: note.id, target: target.id })
        }
      })
    })

    // Count connections
    allEdges.forEach((e) => {
      const s = allNodes.find((n) => n.id === e.source)
      const t = allNodes.find((n) => n.id === e.target)
      if (s) s.connections++
      if (t) t.connections++
    })

    setNodes(allNodes)
    setEdges(allEdges)
  }, [notes, ideas])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || nodes.length === 0) return
    const ctx = canvas.getContext('2d')!
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw edges
      edges.forEach((edge) => {
        const s = nodes.find((n) => n.id === edge.source)
        const t = nodes.find((n) => n.id === edge.target)
        if (!s || !t) return
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(t.x, t.y)
        ctx.strokeStyle = 'rgba(42,42,42,0.8)'
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Draw nodes
      nodes.forEach((node) => {
        const r = 8 + node.connections * 3
        const color = node.type === 'note' ? '#f59e0b' : '#8b5cf6'
        const isSelected = selected?.id === node.id

        // Glow
        if (isSelected) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, r + 6, 0, Math.PI * 2)
          ctx.fillStyle = `${color}22`
          ctx.fill()
        }

        // Circle
        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fillStyle = isSelected ? color : `${color}88`
        ctx.fill()

        // Label
        ctx.fillStyle = isSelected ? '#f0f0f0' : '#888'
        ctx.font = '10px JetBrains Mono, monospace'
        ctx.textAlign = 'center'
        ctx.fillText(node.label.slice(0, 20), node.x, node.y + r + 14)
      })
    }
    draw()

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const hit = nodes.find((n) => {
        const r = 8 + n.connections * 3
        return Math.hypot(n.x - x, n.y - y) <= r
      })
      setSelected(hit ?? null)
    }

    canvas.addEventListener('click', handleClick)
    return () => canvas.removeEventListener('click', handleClick)
  }, [nodes, edges, selected])

  return (
    <div className='animate-fade-in'>
      <div className='text-[10px] font-mono tracking-wider mb-4' style={{ color: 'var(--text-muted)' }}>
        GRAFO DE CONHECIMENTO · {nodes.length} nós · {edges.length} conexões
      </div>

      <div className='relative rounded-xl overflow-hidden' style={{ height: 600, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        {/* Dot grid background */}
        <div className='absolute inset-0 dot-grid opacity-50' />

        <canvas ref={canvasRef} className='absolute inset-0 w-full h-full' />

        {/* Legend */}
        <div className='absolute bottom-4 left-4 flex items-center gap-4'>
          <div className='flex items-center gap-1.5'>
            <div className='w-2 h-2 rounded-full' style={{ background: '#f59e0b' }} />
            <span className='text-[10px] font-mono' style={{ color: 'var(--text-muted)' }}>Notas</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <div className='w-2 h-2 rounded-full' style={{ background: '#8b5cf6' }} />
            <span className='text-[10px] font-mono' style={{ color: 'var(--text-muted)' }}>Ideias</span>
          </div>
        </div>

        {/* Center button */}
        <button
          className='absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-mono'
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          onClick={() => setSelected(null)}
        >
          Centralizar
        </button>
      </div>

      {/* Node panel */}
      {selected && (
        <div
          className='mt-4 rounded-xl p-5 animate-fade-in'
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-active)', borderLeft: `2px solid ${selected.type === 'note' ? '#f59e0b' : '#8b5cf6'}` }}
        >
          <div className='text-[10px] font-mono tracking-wider mb-2' style={{ color: 'var(--text-muted)' }}>
            {selected.type === 'note' ? 'NOTA' : 'IDEIA'} SELECIONADA
          </div>
          <h3 className='text-base font-semibold' style={{ color: 'var(--text-primary)' }}>{selected.label}</h3>
          <div className='mt-2 text-sm' style={{ color: 'var(--text-secondary)' }}>
            {selected.connections} conexão{selected.connections !== 1 ? 'ões' : ''}
          </div>
        </div>
      )}
    </div>
  )
}
