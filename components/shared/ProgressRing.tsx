'use client'
import { useEffect, useRef } from 'react'

interface ProgressRingProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
  children?: React.ReactNode
  glow?: boolean
}

export function ProgressRing({
  value,
  size = 160,
  strokeWidth = 8,
  color = 'var(--accent-green)',
  children,
  glow = true,
}: ProgressRingProps) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(value, 100) / 100)
  const cx = size / 2
  const cy = size / 2

  return (
    <div className='relative' style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {glow && (
            <filter id='ring-glow' x='-30%' y='-30%' width='160%' height='160%'>
              <feGaussianBlur stdDeviation='3' result='blur' />
              <feMerge>
                <feMergeNode in='blur' />
                <feMergeNode in='SourceGraphic' />
              </feMerge>
            </filter>
          )}
        </defs>
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill='none'
          stroke='rgba(255,255,255,0.05)'
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          cx={cx} cy={cy} r={r}
          fill='none'
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          filter={glow ? 'url(#ring-glow)' : undefined}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      {/* Center content */}
      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        {children}
      </div>
    </div>
  )
}
