'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useTasks } from '@/lib/store/use-tasks'
import { useHealth } from '@/lib/store/use-health'
import { useFinance } from '@/lib/store/use-finance'
import { formatBRL } from '@/lib/utils'

// Coloque sua chave Anthropic aqui ou em .env.local como NEXT_PUBLIC_ANTHROPIC_KEY
const ANTHROPIC_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_KEY ?? ''

type JarvisState = 'idle' | 'listening' | 'processing' | 'speaking'

interface Particle {
  angle: number
  speed: number
  offset: number
  size: number
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2,
    speed: 0.003 + Math.random() * 0.004,
    offset: Math.random() * Math.PI * 2,
    size: 1.2 + Math.random() * 2.2,
  }))
}

function drawOrb(
  ctx: CanvasRenderingContext2D,
  size: number,
  state: JarvisState,
  micVolume: number,
  time: number,
  particles: Particle[]
) {
  const cx = size / 2
  const cy = size / 2
  const baseRadius = size * 0.38

  ctx.clearRect(0, 0, size, size)

  const color =
    state === 'listening'  ? '#00ff88' :
    state === 'processing' ? '#f59e0b' :
    state === 'speaking'   ? '#00ff88' :
    '#00ff8855'

  ctx.shadowBlur = state === 'idle' ? 3 : 14
  ctx.shadowColor = state === 'processing' ? '#f59e0b' : '#00ff88'

  particles.forEach((p) => {
    p.angle += p.speed
    const distortion = state === 'listening' ? micVolume * baseRadius * 0.5 : 0
    const speakWave  = state === 'speaking'  ? Math.sin(time * 8 + p.offset) * baseRadius * 0.15 : 0
    const breathe    = Math.sin(time * 0.8 + p.offset) * (baseRadius * 0.06)
    const r = baseRadius + breathe + distortion + speakWave
    const x = cx + Math.cos(p.angle) * r
    const y = cy + Math.sin(p.angle) * r
    const ps = p.size * (size / 420)

    ctx.beginPath()
    ctx.arc(x, y, ps, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  })

  ctx.shadowBlur = 0

  // Glow central
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 0.6)
  glow.addColorStop(0,
    state === 'processing' ? '#f59e0b15' :
    state === 'idle'       ? '#00ff8808' : '#00ff8820'
  )
  glow.addColorStop(1, 'transparent')
  ctx.beginPath()
  ctx.arc(cx, cy, baseRadius * 0.6, 0, Math.PI * 2)
  ctx.fillStyle = glow
  ctx.fill()
}

// ── StatusText ──────────────────────────────────────────────────────────────

function StatusText({ state, transcript, reply }: { state: JarvisState; transcript: string; reply: string }) {
  const display = { fontFamily: 'var(--font-display)', lineHeight: 1.35 } as const
  const mono    = { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em' } as const

  if (state === 'idle') return (
    <p style={{ ...display, fontSize: 18, color: '#2a2a2a' }}>clique no orbe para falar</p>
  )
  if (state === 'listening') return (
    <p style={{ ...display, fontSize: 20, color: '#00ff88' }}>ouvindo…</p>
  )
  if (state === 'processing') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <p style={{ ...mono, color: '#333' }}>VOCÊ DISSE</p>
      <p style={{ ...display, fontSize: 20, color: '#555', fontStyle: 'italic' }}>"{transcript}"</p>
    </div>
  )
  if (state === 'speaking') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 520 }}>
      <p style={{ ...mono, color: '#00ff8888' }}>JARVIS</p>
      <p style={{ ...display, fontSize: 22, color: '#f0f0f0' }}>{reply}</p>
    </div>
  )
  return null
}

// ── JarvisWidget ─────────────────────────────────────────────────────────────

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
  const particlesRef  = useRef<Particle[]>(makeParticles(120))
  const miniParticles = useRef<Particle[]>(makeParticles(30))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const audioCtxRef   = useRef<AudioContext | null>(null)
  const analyserRef   = useRef<AnalyserNode | null>(null)
  const streamRef     = useRef<MediaStream | null>(null)

  // read live context for system prompt
  const allTasks = useTasks((s) => s.tasks)
  const today    = allTasks.filter((t) => t.date === 'today')
  const pending  = today.filter((t) => !t.done).map((t) => t.title)
  const health   = useHealth((s) => s.health)
  const total    = useFinance((s) => s.total)

  // ── Animation loop ──────────────────────────────────────────────────────
  useEffect(() => {
    let running = true

    const loop = () => {
      if (!running) return
      timeRef.current += 0.016

      // mini canvas (always)
      const mini = miniCanvasRef.current
      if (mini) {
        const mCtx = mini.getContext('2d')
        if (mCtx) drawOrb(mCtx, 32, state, micVolume, timeRef.current, miniParticles.current)
      }

      // big canvas (only when open)
      if (open) {
        const big = canvasRef.current
        if (big) {
          const bCtx = big.getContext('2d')
          if (bCtx) drawOrb(bCtx, 420, state, micVolume, timeRef.current, particlesRef.current)
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => { running = false; cancelAnimationFrame(rafRef.current) }
  }, [open, state, micVolume])

  // ── Mic analyser ─────────────────────────────────────────────────────────
  const startMicAnalyser = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser
      ctx.createMediaStreamSource(stream).connect(analyser)

      const buf = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        analyser.getByteFrequencyData(buf)
        const avg = buf.reduce((a, b) => a + b, 0) / buf.length
        setMicVolume(avg / 128)
        if (analyserRef.current) requestAnimationFrame(tick)
      }
      tick()
    } catch {
      // microfone não autorizado — continua sem distorção
    }
  }

  const stopMicAnalyser = () => {
    analyserRef.current = null
    audioCtxRef.current?.close()
    audioCtxRef.current = null
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setMicVolume(0)
  }

  // ── Speech Recognition ───────────────────────────────────────────────────
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
      sendToAI(text)
    }
    rec.onerror = () => { stopMicAnalyser(); setState('idle') }
    rec.onend   = () => { if (state === 'listening') setState('idle') }
    rec.start()
    recognitionRef.current = rec
  }, [state])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    stopMicAnalyser()
    setState('idle')
  }, [])

  // ── Anthropic API ─────────────────────────────────────────────────────────
  const sendToAI = async (text: string) => {
    if (!ANTHROPIC_KEY) {
      setReply('Chave da API Anthropic não configurada. Adicione NEXT_PUBLIC_ANTHROPIC_KEY no .env.local.')
      speak('Chave da API não configurada.')
      return
    }

    const systemPrompt = `Você é JARVIS, assistente pessoal no dashboard VALIOS.
Contexto de hoje:
- Tarefas pendentes: ${pending.length > 0 ? pending.join(', ') : 'nenhuma'}
- Água: ${(health.water.consumed / 1000).toFixed(1)}L de ${(health.water.goal / 1000).toFixed(1)}L
- Treino: ${health.gym.today.status === 'done' ? `${health.gym.today.type} feito` : 'pendente'}
- Patrimônio: ${formatBRL(total)}
- Streak: 9 dias
Responda em no máximo 2 frases. Seja direto. Português do Brasil.`

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 200,
          system: systemPrompt,
          messages: [{ role: 'user', content: text }],
        }),
      })
      const data = await res.json()
      const replyText = data?.content?.[0]?.text ?? 'Não consegui processar.'
      setReply(replyText)
      speak(replyText)
    } catch {
      setReply('Erro ao conectar com a API.')
      speak('Erro ao conectar.')
    }
  }

  // ── Speech Synthesis ──────────────────────────────────────────────────────
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

  return (
    <>
      {/* CSS animations */}
      <style>{`
        @keyframes jarvis-idle-pulse {
          0%, 100% { box-shadow: 0 0 0 0 #00ff8820; }
          50%       { box-shadow: 0 0 0 8px #00ff8800; }
        }
        @keyframes jarvis-scale-in {
          from { transform: scale(0.08); opacity: 0; }
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
          background: '#0a0a0a', border: '1px solid #00ff8840',
          cursor: 'pointer', zIndex: 55,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'jarvis-idle-pulse 3s ease-in-out infinite',
          transition: 'border-color 0.3s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#00ff8888')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#00ff8840')}
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
              background: 'rgba(0,0,0,0.88)',
              backdropFilter: 'blur(14px)',
              zIndex: 100,
              animation: 'jarvis-fade-in 0.3s ease',
            }}
          />
          <div style={{
            position: 'fixed', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            zIndex: 101, gap: 32,
            pointerEvents: 'none',
          }}>
            {/* Orbe grande */}
            <canvas
              ref={canvasRef}
              width={420}
              height={420}
              onClick={handleOrbClick}
              style={{
                cursor: 'pointer', pointerEvents: 'auto',
                animation: 'jarvis-scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
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
                background: 'transparent', border: '1px solid #1f1f1f',
                borderRadius: 20, padding: '8px 20px',
                color: '#333', fontSize: 12, cursor: 'pointer',
                letterSpacing: '0.1em', fontFamily: 'var(--font-mono)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#555')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#333')}
            >
              ESC para fechar
            </button>
          </div>
        </>
      )}
    </>
  )
}
