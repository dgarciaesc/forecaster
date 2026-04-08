import { useState, useEffect } from 'react'
import { SurfIcon, WindsurfIcon, WingfoilIcon, KitesurfIcon } from './SportIcons'

const SPORTS = [
  { id: 'surf',     label: 'Surf',     Icon: SurfIcon,     color: 'var(--surf)' },
  { id: 'windsurf', label: 'Windsurf', Icon: WindsurfIcon, color: 'var(--windsurf)' },
  { id: 'wingfoil', label: 'Wingfoil', Icon: WingfoilIcon, color: 'var(--wingfoil)' },
  { id: 'kitesurf', label: 'Kitesurf', Icon: KitesurfIcon, color: 'var(--kitesurf)' },
]

// selectedSports: { surf: 'expert', windsurf: 'beginner', ... }
function SportGrid({ selectedSports, onChange }) {
  function toggleSport(id) {
    const next = { ...selectedSports }
    if (next[id]) delete next[id]
    else next[id] = 'expert'
    onChange(next)
  }

  function toggleLevel(id, e) {
    e.stopPropagation()
    const next = { ...selectedSports }
    next[id] = next[id] === 'beginner' ? 'expert' : 'beginner'
    onChange(next)
  }

  return (
    <div style={s.sportGrid}>
      {SPORTS.map(({ id, label, Icon, color }) => {
        const active = !!selectedSports[id]
        const level  = selectedSports[id]
        return (
          <button
            key={id}
            type="button"
            onClick={() => toggleSport(id)}
            style={{
              ...s.sportBtn,
              borderColor: active ? color : '#1e3a5f',
              background: active ? `${color}22` : 'transparent',
              color: active ? color : 'var(--muted)',
            }}
          >
            <Icon size={24} color={active ? color : undefined} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>

            {active && (
              <div style={s.levelToggle} onClick={e => toggleLevel(id, e)}>
                <span style={{
                  ...s.levelChip,
                  background: level === 'beginner' ? `${color}33` : 'transparent',
                  color: level === 'beginner' ? color : `${color}88`,
                  borderColor: level === 'beginner' ? color : 'transparent',
                }}>🌊</span>
                <span style={{
                  ...s.levelChip,
                  background: level === 'expert' ? `${color}33` : 'transparent',
                  color: level === 'expert' ? color : `${color}88`,
                  borderColor: level === 'expert' ? color : 'transparent',
                }}>⚡</span>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default function AlertModal({ onClose, spots, initialSport = 'surf', initialLevel = 'expert' }) {
  const [selectedSports, setSelectedSports] = useState({ [initialSport]: initialLevel })
  const [days, setDays]       = useState(3)
  const [weekend, setWeekend] = useState(false)
  const [noRain, setNoRain]   = useState(false)
  const [spotId, setSpotId]   = useState('all')
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const activeSportIds = Object.keys(selectedSports)
  const firstColor = SPORTS.find(s => s.id === activeSportIds[0])?.color ?? 'var(--surf)'
  const canSubmit = email && activeSportIds.length > 0

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    console.log('Alert config:', { selectedSports, days, weekend, noRain, spotId, email })
    setSent(true)
  }

  const ZONE_LABELS = {
    all: 'todas las zonas',
    cantabrico_oriental: 'Cantábrico oriental',
    cantabrico_occidental: 'Cantábrico occidental',
    atlantico_norte: 'Atlántico norte',
    portugal_sur: 'Portugal Sur',
    andalucia_occidental: 'Andalucía occidental',
    mediterraneo_sur: 'Mediterráneo sur',
    levante: 'Levante',
    cataluna: 'Cataluña',
    baleares: 'Baleares',
    canarias: 'Canarias',
  }

  const sportSummary = activeSportIds
    .map(id => {
      const m = SPORTS.find(s => s.id === id)
      const lvl = selectedSports[id] === 'beginner' ? '🌊' : '⚡'
      return `${m?.label} ${lvl}`
    })
    .join(', ')

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>

        <div style={s.header}>
          <div style={s.headerTitle}>
            <span>🔔</span>
            <span>Alerta de parte</span>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        {sent ? (
          <div style={s.successWrap}>
            <div style={s.successIcon}>✓</div>
            <p style={s.successText}>¡Alerta configurada!</p>
            <p style={s.successSub}>
              Te avisaremos en <strong>{email}</strong> para <strong>{sportSummary}</strong>
              {weekend ? ', fines de semana' : ` con mínimo ${days} día${days > 1 ? 's' : ''}`}
              {noRain ? ', solo días sin lluvia' : ''}
              {` en ${ZONE_LABELS[spotId] ?? 'todas las zonas'}`}.
            </p>
            <button style={{ ...s.submitBtn, background: '#1e3a5f', color: '#e2e8f0', borderColor: '#1e3a5f', marginTop: 16 }} onClick={onClose}>Cerrar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={s.form}>

            <label style={s.label}>Deporte y nivel</label>
            <SportGrid selectedSports={selectedSports} onChange={setSelectedSports} />
            {activeSportIds.length === 0 && (
              <span style={{ fontSize: 11, color: '#ef4444' }}>Selecciona al menos un deporte</span>
            )}

            <label style={s.label}>Días de calidad mínimos</label>
            <div style={s.daysRow}>
              {[1, 2, 3, 4, 5, 6, 7].map(n => {
                const active = !weekend && days === n
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => { setDays(n); setWeekend(false) }}
                    style={{
                      ...s.dayBtn,
                      borderColor: active ? firstColor : '#1e3a5f',
                      background: active ? `${firstColor}22` : 'transparent',
                      color: active ? firstColor : 'var(--muted)',
                    }}
                  >
                    {n}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={() => setWeekend(v => !v)}
                style={{
                  ...s.dayBtn,
                  flex: 2,
                  fontSize: 11,
                  borderColor: weekend ? firstColor : '#1e3a5f',
                  background: weekend ? `${firstColor}22` : 'transparent',
                  color: weekend ? firstColor : 'var(--muted)',
                }}
              >
                📅 Finde
              </button>
            </div>

            <div style={s.extraRow}>
              <button
                type="button"
                onClick={() => setNoRain(v => !v)}
                style={{
                  ...s.extraBtn,
                  borderColor: noRain ? '#fbbf24' : '#1e3a5f',
                  background: noRain ? '#fbbf2422' : 'transparent',
                  color: noRain ? '#fbbf24' : 'var(--muted)',
                }}
              >
                ☀️ Solo días sin lluvia
              </button>
            </div>

            <label style={s.label}>Zona</label>
            <select value={spotId} onChange={e => setSpotId(e.target.value)} style={s.select}>
              <option value="all">Todas las zonas</option>
              <option value="cantabrico_oriental">Cantábrico oriental</option>
              <option value="cantabrico_occidental">Cantábrico occidental</option>
              <option value="atlantico_norte">Atlántico norte</option>
              <option value="portugal_sur">Portugal Sur</option>
              <option value="andalucia_occidental">Andalucía occidental</option>
              <option value="mediterraneo_sur">Mediterráneo sur</option>
              <option value="levante">Levante</option>
              <option value="cataluna">Cataluña</option>
              <option value="baleares">Baleares</option>
              <option value="canarias">Canarias</option>
            </select>

            <label style={s.label}>Tu correo</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              style={s.input}
            />

            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                ...s.submitBtn,
                background: canSubmit ? `${firstColor}33` : 'transparent',
                borderColor: canSubmit ? firstColor : '#1e3a5f',
                color: canSubmit ? firstColor : 'var(--muted)',
                cursor: canSubmit ? 'pointer' : 'default',
              }}
            >
              Activar alerta
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

const s = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 2000, backdropFilter: 'blur(3px)',
  },
  modal: {
    background: '#0d1b2a', border: '1px solid #1e3a5f',
    borderRadius: 14, width: 'min(92vw, 440px)',
    maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid #1e3a5f',
  },
  headerTitle: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 16, fontWeight: 800, color: '#e2e8f0',
  },
  closeBtn: {
    background: 'transparent', border: 'none',
    color: '#64748b', fontSize: 18, cursor: 'pointer',
    padding: '2px 6px', borderRadius: 4,
  },
  form: {
    padding: '20px', display: 'flex', flexDirection: 'column', gap: 8,
  },
  label: {
    fontSize: 11, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.07em',
    color: '#64748b', marginTop: 8,
  },
  sportGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
  },
  sportBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    padding: '10px 8px', borderRadius: 10, border: '1px solid',
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
  },
  levelToggle: {
    display: 'flex', gap: 4, marginTop: 2,
  },
  levelChip: {
    fontSize: 13, padding: '2px 7px',
    borderRadius: 6, border: '1px solid',
    cursor: 'pointer', transition: 'all 0.12s',
  },
  daysRow: {
    display: 'flex', gap: 5,
  },
  dayBtn: {
    flex: 1, padding: '8px 0',
    borderRadius: 8, border: '1px solid',
    cursor: 'pointer', fontFamily: 'inherit',
    fontSize: 13, fontWeight: 700, transition: 'all 0.15s',
  },
  extraRow: {
    display: 'flex', gap: 8,
  },
  extraBtn: {
    flex: 1, padding: '9px 12px',
    borderRadius: 8, border: '1px solid',
    cursor: 'pointer', fontFamily: 'inherit',
    fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
  },
  select: {
    width: '100%', padding: '10px 12px',
    background: '#111e35', border: '1px solid #1e3a5f',
    borderRadius: 8, color: '#e2e8f0',
    fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
  },
  input: {
    width: '100%', padding: '10px 12px',
    background: '#111e35', border: '1px solid #1e3a5f',
    borderRadius: 8, color: '#e2e8f0',
    fontSize: 13, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box',
  },
  submitBtn: {
    marginTop: 12, padding: '12px',
    borderRadius: 10, border: '1px solid',
    fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
    transition: 'all 0.15s', width: '100%',
  },
  successWrap: {
    padding: '40px 24px', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
  },
  successIcon: {
    width: 48, height: 48, borderRadius: '50%',
    background: '#1a4d1a', color: '#86e986',
    fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  successText: { fontSize: 18, fontWeight: 800, color: '#e2e8f0', margin: 0 },
  successSub:  { fontSize: 13, color: '#94a3b8', lineHeight: 1.6, margin: 0 },
}
