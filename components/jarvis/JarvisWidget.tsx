'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useTasksStore } from '@/lib/store/use-tasks'
import { useHealthStore } from '@/lib/store/use-health'
import { useFinanceStore } from '@/lib/store/use-finance'
import { formatBRL } from '@/lib/utils/format'
import { getTotal } from '@/lib/utils/finance'

const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY ?? ''

type JarvisState = 'idle' | 'listening' | 'processing' | 'speaking'

// ── Globo 3D com distribuição de Fibonacci ───────────────────────────────────

interface GlobePoint {
  x: number   // -1 a 1 (posição na esfera unitária)
  y: number
  z: number
  size: number
}

function makeSpherePoints(count: number): GlobePoint[] {
  const pts: GlobePoint[] = []
  const phi = Math.PI * (3 - Math.sqrt(5)) // ângulo áureo
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = phi * i
    pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, size: 1.2 + Math.random() * 1.6 })
  }
  return pts
}

function drawGlobe(
  ctx: CanvasRenderingContext2D,
  size: number,
  state: JarvisState,
  micVolume: number,
  time: number,
  points: GlobePoint[]
) {
  const cx = size / 2
  const cy = size / 2
  const baseRadius = size * 0.38

  ctx.clearRect(0, 0, size, size)

  // Escala dinâmica por estado
  const breathScale = 1 + Math.sin(time * 0.8) * 0.04
  const micScale    = state === 'listening' ? 1 + micVolume * 0.35 : 1
  const speakScale  = state === 'speaking'  ? 1 + Math.sin(time * 7) * 0.08 : 1
  const r = baseRadius * breathScale * micScale * speakScale

  // Rotação: Y constante + leve oscilação em X
  const rotY = time * 0.38
  const rotX = Math.sin(time * 0.18) * 0.22

  const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX)

  // Projetar pontos e ordenar por profundidade (Z) para painter's algorithm
  const projected = points.map((p) => {
    // Rotação Y
    const x1 = p.x * cosY - p.z * sinY
    const z1 = p.x * sinY + p.z * cosY
    // Rotação X
    const y2 = p.y * cosX - z1 * sinX
    const z2 = p.y * sinX + z1 * cosX

    const depth = (z2 + 1) / 2   // 0 = fundo, 1 = frente
    return {
      sx: cx + x1 * r,
      sy: cy + y2 * r,
      depth,
      size: p.size,
    }
  }).sort((a, b) => a.depth - b.depth)  // fundo → frente

  // Desenhar pontos
  projected.forEach((p) => {
    const opacity   = state === 'idle'
      ? 0.08 + p.depth * 0.35
      : 0.25 + p.depth * 0.75
    const ptSize    = p.size * (size / 420) * (0.4 + p.depth * 0.9)

    ctx.beginPath()
    ctx.arc(p.sx, p.sy, ptSize, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity.toFixed(3)})`

    // Glow nos pontos da frente quando ativo
    if (state !== 'idle' && p.depth > 0.65) {
      ctx.shadowBlur  = size > 100 ? 8 : 3
      ctx.shadowColor = state === 'processing' ? '#f59e0b' : 'rgba(255,255,255,0.8)'
    } else {
      ctx.shadowBlur = 0
    }
    ctx.fill()
  })

  ctx.shadowBlur = 0

  // Glow central suave
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.55)
  glow.addColorStop(0,
    state === 'processing' ? 'rgba(245,158,11,0.06)' :
    state === 'idle'       ? 'rgba(255,255,255,0.02)' :
                             'rgba(255,255,255,0.05)')
  glow.addColorStop(1, 'transparent')
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2)
  ctx.fillStyle = glow
  ctx.fill()
}

// ── StatusText ────────────────────────────────────────────────────────────────

function StatusText({ state, transcript, reply }: { state: JarvisState; transcript: string; reply: string }) {
  const display = { fontFamily: 'var(--font-display)', lineHeight: 1.35 } as const
  const mono    = { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em' } as const

  if (state === 'idle') return (
    <p style={{ ...display, fontSize: 18, color: '#333' }}>clique no globo para falar</p>
  )
  if (state === 'listening') return (
    <p style={{ ...display, fontSize: 20, color: '#fff' }}>ouvindo…</p>
  )
  if (state === 'processing') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <p style={{ ...mono, color: '#333' }}>VOCÊ DISSE</p>
      <p style={{ ...display, fontSize: 20, color: '#666', fontStyle: 'italic' }}>"{transcript}"</p>
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 520 }}>
      <p style={{ ...mono, color: 'rgba(255,255,255,0.35)' }}>JARVIS</p>
      <p style={{ ...display, fontSize: 22, color: '#f0f0f0' }}>{reply}</p>
    </div>
  )
}

// ── JarvisWidget ──────────────────────────────────────────────────────────────

interface Props {
  open: boolean
  setOpen: (v: boolean | ((prev: boolean) => boolean)) => void
}

export function JarvisWidget({ open, setOpen }: Props) {
  const [state, setState]         = useState<JarvisState>('idle')
  const [transcript, setTranscript] = useState('')
  const [reply, setReply]         = useState('')
  const [micVolume, setMicVolume] = useState(0)

  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const miniCanvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef        = useRef<number>(0)
  const timeRef       = useRef(0)
  // pontos fixos — não mudam entre renders para o globo manter coerência
  const bigPoints  = useRef<GlobePoint[]>(makeSpherePoints(180))
  const miniPoints = useRef<GlobePoint[]>(makeSpherePoints(60))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const audioCtxRef    = useRef<AudioContext | null>(null)
  const analyserRef    = useRef<AnalyserNode | null>(null)
  const streamRef      = useRef<MediaStream | null>(null)
  const micVolRef      = useRef(0)

  // contexto do dia para o system prompt
  const allTasks  = useTasksStore((s) => s.tasks)
  const today     = allTasks.filter((t) => t.date === 'today')
  const pending   = today.filter((t) => !t.done).map((t) => t.title)
  const { getTodayWater, getTodaySession } = useHealthStore()
  const categories = useFinanceStore((s) => s.categories)
  const total      = getTotal(categories)

  // ── Loop de animação ────────────────────────────────────────────────────────
  useEffect(() => {
    let running = true

    const loop = () => {
      if (!running) return
      timeRef.current += 0.016
      const t = timeRef.current
      const vol = micVolRef.current

      const mini = miniCanvasRef.current
      if (mini) {
        const ctx = mini.getContext('2d')
        if (ctx) drawGlobe(ctx, 32, state, vol, t, miniPoints.current)
      }

      if (open) {
        const big = canvasRef.current
        if (big) {
          const ctx = big.getContext('2d')
          if (ctx) drawGlobe(ctx, 420, state, vol, t, bigPoints.current)
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => { running = false; cancelAnimationFrame(rafRef.current) }
  }, [open, state])   // micVolRef é ref, não precisa na dep

  // ── Mic analyser ────────────────────────────────────────────────────────────
  const startMicAnalyser = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const actx = new AudioContext()
      audioCtxRef.current = actx
      const an = actx.createAnalyser()
      an.fftSize = 256
      analyserRef.current = an
      actx.createMediaStreamSource(stream).connect(an)
      const buf = new Uint8Array(an.frequencyBinCount)
      const tick = () => {
        if (!analyserRef.current) return
        an.getByteFrequencyData(buf)
        const avg = buf.reduce((a, b) => a + b, 0) / buf.length
        micVolRef.current = avg / 128
        setMicVolume(avg / 128)
        requestAnimationFrame(tick)
      }
      tick()
    } catch { /* sem microfone */ }
  }

  const stopMicAnalyser = () => {
    analyserRef.current = null
    audioCtxRef.current?.close()
    audioCtxRef.current = null
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    micVolRef.current = 0
    setMicVolume(0)
  }

  // ── Gemini API ───────────────────────────────────────────────────────────────
  const sendToGemini = useCallback(async (text: string) => {
    const systemPrompt = `Você é JARVIS, assistente pessoal no dashboard VALIOS.
Contexto de hoje:
- Tarefas pendentes: ${pending.length ? pending.join(', ') : 'nenhuma'}
- Água: ${(getTodayWater() / 1000).toFixed(1)}L
- Treino: ${getTodaySession() ? `${getTodaySession()!.type} feito` : 'pendente'}
- Patrimônio: ${formatBRL(total)}
Responda em no máximo 2 frases. Seja direto. Português do Brasil.`

    if (!GEMINI_KEY) {
      const msg = 'Chave Gemini não configurada. Adicione NEXT_PUBLIC_GEMINI_KEY no .env.local.'
      setReply(msg); speak(msg); return
    }

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: 'user', parts: [{ text }] }],
            generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
          }),
        }
      )
      const data = await res.json()
      const msg = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Não entendi.'
      setReply(msg)
      speak(msg)
    } catch {
      const msg = 'Erro ao conectar com Gemini.'
      setReply(msg); speak(msg)
    }
  }, [pending, total, getTodayWater, getTodaySession])

  // ── Speech Recognition ───────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    stopMicAnalyser()
    setState('idle')
  }, [])

  const startListening = useCallback(async () => {
    setState('listening')
    await startMicAnalyser()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR: any = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    if (!SR) { setState('idle'); return }

    const rec = new SR()
    rec.lang = 'pt-BR'
    rec.continuous = false
    rec.interimResults = false

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setTranscript(text)
      setState('processing')
      stopMicAnalyser()
      sendToGemini(text)
    }
    rec.onerror = () => { stopMicAnalyser(); setState('idle') }
    rec.start()
    recognitionRef.current = rec
  }, [sendToGemini])

  // ── Speech Synthesis ─────────────────────────────────────────────────────────
  const speak = (text: string) => {
    setState('speaking')
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = 'pt-BR'
    utt.rate = 0.92
    utt.pitch = 0.8
    const voices = window.speechSynthesis.getVoices()
    const pt = voices.find((v) => v.lang.startsWith('pt'))
    if (pt) utt.voice = pt
    utt.onend = () => setState('idle')
    window.speechSynthesis.speak(utt)
  }

  const handleOrbClick = () => {
    if (state === 'idle') startListening()
    else if (state === 'listening') stopListening()
  }

  const close = () => {
    setOpen(false)
    stopListening()
    window.speechSynthesis.cancel()
    setState('idle')
  }

  // Cor da borda da bolinha por estado
  const pillBorder =
    state === 'listening'  ? '#ffffff66' :
    state === 'processing' ? '#f59e0b66' :
    state === 'speaking'   ? '#ffffff44' :
    '#ffffff18'

  return (
    <>
      <style>{`
        @keyframes jarvis-idle-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.06); }
          50%       { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
        }
        @keyframes jarvis-scale-in {
          from { transform: scale(0.06); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        @keyframes jarvis-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Bolinha flutuante */}
      <button
        onClick={() => setOpen((v) => !v)}
        title='JARVIS (J)'
        style={{
          position: 'fixed', bottom: 88, right: 24,
          width: 48, height: 48, borderRadius: '50%',
          background: '#060606',
          border: `1px solid ${pillBorder}`,
          cursor: 'pointer', zIndex: 55,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'jarvis-idle-pulse 3s ease-in-out infinite',
          transition: 'border-color 0.4s ease',
        }}
      >
        <canvas ref={miniCanvasRef} width={32} height={32} style={{ borderRadius: '50%', display: 'block' }} />
      </button>

      {/* Overlay fullscreen */}
      {open && (
        <>
          <div
            onClick={close}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.92)',
              backdropFilter: 'blur(16px)',
              zIndex: 100,
              animation: 'jarvis-fade-in 0.3s ease',
            }}
          />

          <div style={{
            position: 'fixed', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            zIndex: 101, gap: 36,
            pointerEvents: 'none',
          }}>
            {/* Globo grande */}
            <canvas
              ref={canvasRef}
              width={420}
              height={420}
              onClick={handleOrbClick}
              style={{
                cursor: state === 'processing' ? 'default' : 'pointer',
                pointerEvents: 'auto',
                animation: 'jarvis-scale-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />

            {/* Status */}
            <div style={{ textAlign: 'center', pointerEvents: 'auto', minHeight: 72 }}>
              <StatusText state={state} transcript={transcript} reply={reply} />
            </div>

            {/* Fechar */}
            <button
              onClick={close}
              style={{
                pointerEvents: 'auto',
                background: 'transparent',
                border: '1px solid #1a1a1a',
                borderRadius: 20, padding: '8px 24px',
                color: '#2a2a2a', fontSize: 11, cursor: 'pointer',
                letterSpacing: '0.12em', fontFamily: 'var(--font-mono)',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#555'
                e.currentTarget.style.borderColor = '#333'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#2a2a2a'
                e.currentTarget.style.borderColor = '#1a1a1a'
              }}
            >
              ESC · fechar
            </button>
          </div>
        </>
      )}
    </>
  )
}
