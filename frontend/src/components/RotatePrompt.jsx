import { useState, useEffect } from 'react'
import { useMobile } from '../hooks/useMobile'

function usePortrait() {
  const [portrait, setPortrait] = useState(window.innerHeight > window.innerWidth)
  useEffect(() => {
    const handler = () => setPortrait(window.innerHeight > window.innerWidth)
    window.addEventListener('resize', handler)
    window.addEventListener('orientationchange', handler)
    return () => {
      window.removeEventListener('resize', handler)
      window.removeEventListener('orientationchange', handler)
    }
  }, [])
  return portrait
}

export default function RotatePrompt() {
  const mobile  = useMobile()
  const portrait = usePortrait()

  if (!mobile || !portrait) return null

  return (
    <div style={s.overlay}>
      <div style={s.icon}>
        <svg viewBox="0 0 64 64" width="72" height="72">
          {/* Phone outline in portrait */}
          <rect x="20" y="8" width="24" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="32" cy="44" r="2" fill="currentColor" opacity="0.6" />
          {/* Rotation arrow */}
          <path
            d="M 52,20 A 22,22 0 0 1 32,54"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeDasharray="4 3"
          />
          <polyline points="28,50 32,54 28,58" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p style={s.title}>Gira el móvil</p>
      <p style={s.sub}>La app se ve mejor en horizontal</p>
    </div>
  )
}

const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: '#0a1628',
    zIndex: 9998,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    color: '#64748b',
  },
  icon: {
    marginBottom: 8,
    animation: 'rotate-hint 2s ease-in-out infinite',
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: '#e2e8f0',
    margin: 0,
  },
  sub: {
    fontSize: 14,
    color: '#64748b',
    margin: 0,
  },
}
