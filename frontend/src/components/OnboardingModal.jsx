import { useState } from 'react'

const STORAGE_KEY = 'wavepulse_onboarded'

const STEPS = [
  {
    icon: '🗺️',
    title: 'Mapa interactivo',
    text: 'Visualiza todos los spots de España, Portugal y Canarias. El mapa de calor muestra de un vistazo dónde están las mejores condiciones — verde es bueno, rojo es malo.',
  },
  {
    icon: '🏄',
    title: 'Elige tu deporte',
    text: 'Selecciona entre Surf, Windsurf, Wingfoil o Kitesurf. El ranking y el mapa de calor se actualizan para mostrarte los mejores spots según tu deporte.',
  },
  {
    icon: '📍',
    title: 'Explora cada spot',
    text: 'Haz clic en cualquier marcador del mapa para ver la ficha del spot: tipo de ola, fondo, y mejores condiciones. Un segundo clic abre el parte detallado hora a hora.',
  },
  {
    icon: '📊',
    title: 'Parte meteorológico',
    text: 'El parte horario muestra viento, altura de ola, período y puntuación para los próximos 7 días — al estilo Windguru. Desplázate horizontalmente para navegar por los días.',
  },
]

export default function OnboardingModal() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY))

  if (!visible) return null

  function close() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        {/* Header */}
        <div style={s.logoRow}>
          <div style={s.radarRing}>
            <div style={s.radarSweep} />
            <div style={s.radarDot} />
          </div>
          <span style={s.appName}>WAVEPULSE</span>
        </div>

        {/* Step content */}
        <div style={s.stepIcon}>{current.icon}</div>
        <h2 style={s.title}>{current.title}</h2>
        <p style={s.text}>{current.text}</p>

        {/* Dots */}
        <div style={s.dots}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ ...s.dot, background: i === step ? '#38bdf8' : '#1e3a5f' }} />
          ))}
        </div>

        {/* Actions */}
        <div style={s.actions}>
          {!isLast ? (
            <>
              <button style={s.skipBtn} onClick={close}>Saltar</button>
              <button style={s.nextBtn} onClick={() => setStep(s => s + 1)}>Siguiente →</button>
            </>
          ) : (
            <button style={s.startBtn} onClick={close}>¡Empezar!</button>
          )}
        </div>
      </div>
    </div>
  )
}

const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9000,
    padding: 16,
  },
  modal: {
    background: '#111e35',
    border: '1px solid #1e3a5f',
    borderRadius: 16,
    padding: '32px 36px 28px',
    maxWidth: 400,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  radarRing: {
    position: 'relative',
    width: 28,
    height: 28,
    borderRadius: '50%',
    border: '1.5px solid #22c55e55',
    background: 'radial-gradient(circle, #0d2218 0%, #0a1628 100%)',
    overflow: 'hidden',
    flexShrink: 0,
  },
  radarSweep: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: 'conic-gradient(from 0deg, transparent 0deg, rgba(34,197,94,0.55) 55deg, transparent 55deg)',
    animation: 'radar-spin 2.4s linear infinite',
  },
  radarDot: {
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 3, height: 3,
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 4px #22c55e',
  },
  appName: {
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: '0.12em',
    background: 'linear-gradient(to right, #22c55e, #eab308, #ef4444)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  stepIcon: {
    fontSize: 48,
    marginBottom: 16,
    lineHeight: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: '#e2e8f0',
    margin: '0 0 12px',
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 1.65,
    textAlign: 'center',
    margin: '0 0 28px',
  },
  dots: {
    display: 'flex',
    gap: 6,
    marginBottom: 24,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    transition: 'background 0.2s',
  },
  actions: {
    display: 'flex',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
  },
  skipBtn: {
    background: 'none',
    border: '1px solid #1e3a5f',
    borderRadius: 8,
    color: '#475569',
    fontSize: 13,
    padding: '9px 18px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  nextBtn: {
    background: '#1e3a5f',
    border: '1px solid #2d5a8e',
    borderRadius: 8,
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: 600,
    padding: '9px 20px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  startBtn: {
    background: 'linear-gradient(135deg, #22c55e22, #38bdf822)',
    border: '1px solid #38bdf8',
    borderRadius: 8,
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: 700,
    padding: '10px 32px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: '0.05em',
  },
}
