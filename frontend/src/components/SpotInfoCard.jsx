import SPOT_INFO from '../data/spotInfo'
import { useMobile } from '../hooks/useMobile'

export default function SpotInfoCard({ spot, onClose }) {
  const mobile = useMobile()
  if (!spot) return null
  if (mobile) return null
  const info = SPOT_INFO[spot.id]
  if (!info) return null

  const cardStyle = mobile
    ? { ...s.card, top: 'auto', bottom: 70, left: 10, right: 10, maxWidth: '100%' }
    : s.card

  return (
    <div style={cardStyle}>
      <button onClick={onClose} style={s.close} title="Cerrar">✕</button>

      <div style={s.name}>{spot.name}</div>
      <div style={s.region}>{spot.region}</div>

      <div style={s.divider} />

      <Row icon="⬛" label="Fondo" value={info.bottom} />
      <Row icon="🌊" label="Ola" value={info.waveType} />
      <Row icon="✅" label="Mejor con" value={info.bestConditions} />

      <div style={s.divider} />

      <p style={s.desc}>{info.description}</p>
    </div>
  )
}

function Row({ icon, label, value }) {
  return (
    <div style={s.row}>
      <span style={s.icon}>{icon}</span>
      <span style={s.label}>{label}</span>
      <span style={s.value}>{value}</span>
    </div>
  )
}

const s = {
  card: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1000,
    background: 'rgba(10,22,40,0.92)',
    border: '1px solid #1e3a5f',
    borderRadius: 10,
    padding: '14px 16px 12px',
    backdropFilter: 'blur(8px)',
    maxWidth: 280,
    boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
    pointerEvents: 'auto',
  },
  close: {
    position: 'absolute',
    top: 8,
    right: 10,
    background: 'none',
    border: 'none',
    color: '#475569',
    fontSize: 13,
    cursor: 'pointer',
    padding: '2px 4px',
    lineHeight: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: 700,
    color: '#e2e8f0',
    marginBottom: 2,
    paddingRight: 20,
  },
  region: {
    fontSize: 11,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    background: '#1e3a5f',
    margin: '8px 0',
  },
  row: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 5,
  },
  icon: {
    fontSize: 12,
    width: 16,
    flexShrink: 0,
  },
  label: {
    fontSize: 11,
    color: '#64748b',
    width: 58,
    flexShrink: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  value: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 1.4,
  },
  desc: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 1.55,
    margin: 0,
  },
}
