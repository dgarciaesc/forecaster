import { createPortal } from 'react-dom'
import SPOT_INFO from '../data/spotInfo'

const SPORT_COLOR = { surf: '#38bdf8', windsurf: '#34d399', wingfoil: '#a78bfa', kitesurf: '#fb923c' }
const SPORT_LABEL = { surf: 'Surf', windsurf: 'Windsurf', wingfoil: 'Wingfoil', kitesurf: 'Kitesurf' }

// ── Colores tabla (igual que WindguruModal) ───────────────────────────────────
function windColor(kn) {
  if (kn < 4)  return { bg: '#1a3a1a', text: '#6ee76e' }
  if (kn < 8)  return { bg: '#1e4d1e', text: '#86e986' }
  if (kn < 12) return { bg: '#2d5a1b', text: '#a3ed6b' }
  if (kn < 16) return { bg: '#5a5a00', text: '#f0f060' }
  if (kn < 20) return { bg: '#6b3d00', text: '#ffb347' }
  if (kn < 25) return { bg: '#6b1a00', text: '#ff6b35' }
  if (kn < 32) return { bg: '#7a0000', text: '#ff4444' }
  return              { bg: '#4a0040', text: '#ff66ff' }
}
function waveColor(m) {
  if (m < 0.3) return { bg: '#0d2235', text: '#90caf9' }
  if (m < 0.7) return { bg: '#0d2e4a', text: '#64b5f6' }
  if (m < 1.2) return { bg: '#0d3d6e', text: '#42a5f5' }
  if (m < 1.8) return { bg: '#0a4f8a', text: '#90caf9' }
  if (m < 2.5) return { bg: '#083e7a', text: '#bbdefb' }
  if (m < 3.5) return { bg: '#051c5e', text: '#e3f2fd' }
  return              { bg: '#020d3a', text: '#ffffff' }
}
function scoreColor(sc) {
  if (sc >= 85) return { bg: '#1a4d1a' }
  if (sc >= 70) return { bg: '#243d1a' }
  if (sc >= 55) return { bg: '#3d3a00' }
  if (sc >= 35) return { bg: '#3d2200' }
  if (sc >= 20) return { bg: '#2a0000' }
  return              { bg: '#1a0a0a' }
}

function ScoreStars({ score }) {
  let filled, color
  if (score >= 85)      { filled = 5; color = '#86e986' }
  else if (score >= 70) { filled = 4; color = '#a3ed6b' }
  else if (score >= 55) { filled = 3; color = '#f0d060' }
  else if (score >= 35) { filled = 2; color = '#ffb347' }
  else if (score >= 20) { filled = 1; color = '#ff6666' }
  else                  { filled = 0; color = '#4a2020' }

  return (
    <span style={{ fontSize: 11, letterSpacing: 1, color }} title={`${Math.round(score)}`}>
      {'★'.repeat(filled)}{'☆'.repeat(5 - filled)}
    </span>
  )
}
function Arrow({ deg, size = 14, opacity = 1, fromDir = false }) {
  const rotation = fromDir ? (deg + 180) % 360 : deg
  return <span style={{ display: 'inline-block', transform: `rotate(${rotation}deg)`, fontSize: size, lineHeight: 1, opacity }}>↑</span>
}

function groupByDay(hourly) {
  const groups = {}
  for (const h of hourly) {
    const date = h.time.slice(0, 10)
    if (!groups[date]) groups[date] = []
    groups[date].push(h)
  }
  return groups
}
function fmtDay(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}
function fmtHour(t) { return t.slice(11, 16) }

// ── Componente ────────────────────────────────────────────────────────────────
export default function MobileSpotSheet({ spot, sport, onClose }) {
  if (!spot) return null

  const info        = SPOT_INFO[spot.id]
  const accentColor = SPORT_COLOR[sport]
  const hourly      = spot.hourly ?? []
  const groups      = groupByDay(hourly)
  const dates       = Object.keys(groups).sort()
  const allCols     = dates.flatMap(d => groups[d])

  const sheet = (
    <div style={s.backdrop} onClick={onClose}>
      <div style={s.sheet} onClick={e => e.stopPropagation()}>

        {/* Handle + close */}
        <div style={s.handleRow}>
          <div style={s.handle} />
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Spot header */}
        <div style={s.spotHeader}>
          <div>
            <span style={s.spotName}>{spot.name}</span>
            <span style={s.spotRegion}>{spot.region}</span>
          </div>
          <span style={{ ...s.badge, color: accentColor, borderColor: accentColor }}>
            {SPORT_LABEL[sport]}
          </span>
        </div>

        <div style={s.scrollArea}>
          {/* Spot description */}
          {info && (
            <div style={s.infoBlock}>
              <InfoRow icon="⬛" label="Fondo"    value={info.bottom} />
              <InfoRow icon="🌊" label="Ola"      value={info.waveType} />
              <InfoRow icon="✅" label="Mejor con" value={info.bestConditions} />
              <p style={s.desc}>{info.description}</p>
            </div>
          )}

          <div style={s.divider} />

          {/* Forecast table */}
          {allCols.length > 0 ? (
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.labelCell}>Día</th>
                    {dates.map(date => (
                      <th key={date} colSpan={groups[date].length} style={s.dayHeader}>
                        {fmtDay(date)}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th style={s.labelCell}>Hora</th>
                    {allCols.map((h, i) => <th key={i} style={s.hourCell}>{fmtHour(h.time)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={s.rowLabel}>💨 Viento (kn)</td>
                    {allCols.map((h, i) => { const c = windColor(h.wind_speed); return <td key={i} style={{ ...s.cell, background: c.bg, color: c.text }}>{Math.round(h.wind_speed)}</td> })}
                  </tr>
                  <tr>
                    <td style={s.rowLabel}>💨 Rachas (kn)</td>
                    {allCols.map((h, i) => { const c = windColor(h.wind_gust ?? 0); return <td key={i} style={{ ...s.cell, background: c.bg, color: c.text, fontStyle: 'italic' }}>{Math.round(h.wind_gust ?? 0)}</td> })}
                  </tr>
                  <tr>
                    <td style={s.rowLabel}>🧭 Dir. viento</td>
                    {allCols.map((h, i) => <td key={i} style={{ ...s.cell, color: '#94a3b8' }}><Arrow deg={h.wind_dir} fromDir /></td>)}
                  </tr>
                  <tr>
                    <td style={s.rowLabel}>🌊 Ola (m)</td>
                    {allCols.map((h, i) => { const c = waveColor(h.wave_height); return <td key={i} style={{ ...s.cell, background: c.bg, color: c.text }}>{h.wave_height.toFixed(1)}</td> })}
                  </tr>
                  <tr>
                    <td style={s.rowLabel}>⏱ Periodo (s)</td>
                    {allCols.map((h, i) => <td key={i} style={{ ...s.cell, color: '#7dd3fc' }}>{h.wave_period.toFixed(0)}</td>)}
                  </tr>
                  <tr>
                    <td style={s.rowLabel}>🧭 Dir. ola</td>
                    {allCols.map((h, i) => <td key={i} style={{ ...s.cell, color: '#60a5fa' }}><Arrow deg={h.wave_dir} size={12} opacity={0.7} /></td>)}
                  </tr>
                  <tr>
                    <td style={{ ...s.rowLabel, color: accentColor }}>★ Score</td>
                    {allCols.map((h, i) => { const sc = h.scores?.[sport] ?? 0; const c = scoreColor(sc); return <td key={i} style={{ ...s.cell, background: c.bg, textAlign: 'center' }}><ScoreStars score={sc} /></td> })}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p style={s.noData}>Sin datos de previsión disponibles</p>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(sheet, document.body)
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={s.infoRow}>
      <span style={s.infoIcon}>{icon}</span>
      <span style={s.infoLabel}>{label}</span>
      <span style={s.infoValue}>{value}</span>
    </div>
  )
}

const s = {
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.55)',
    zIndex: 3000,
    display: 'flex', alignItems: 'flex-end',
  },
  sheet: {
    width: '100%',
    maxHeight: '82vh',
    background: '#111e35',
    borderRadius: '16px 16px 0 0',
    borderTop: '1px solid #1e3a5f',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
  },
  handleRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '10px 16px 4px',
    position: 'relative', flexShrink: 0,
  },
  handle: {
    width: 36, height: 4,
    background: '#1e3a5f', borderRadius: 2,
  },
  closeBtn: {
    position: 'absolute', right: 14, top: 8,
    background: 'none', border: 'none',
    color: '#475569', fontSize: 16, cursor: 'pointer',
    padding: '4px 6px',
  },
  spotHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '6px 16px 12px', flexShrink: 0,
    borderBottom: '1px solid #1e3a5f',
  },
  spotName: { fontSize: 17, fontWeight: 800, color: '#e2e8f0', display: 'block' },
  spotRegion: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' },
  badge: {
    fontSize: 11, fontWeight: 700,
    border: '1px solid', borderRadius: 99,
    padding: '3px 10px', flexShrink: 0, marginTop: 2,
  },
  scrollArea: { flex: 1, overflowY: 'auto' },
  infoBlock: { padding: '12px 16px 8px' },
  infoRow: { display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 },
  infoIcon: { fontSize: 12, width: 16, flexShrink: 0 },
  infoLabel: { fontSize: 11, color: '#64748b', width: 60, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.05em' },
  infoValue: { fontSize: 12, color: '#94a3b8', lineHeight: 1.4 },
  desc: { fontSize: 12, color: '#94a3b8', lineHeight: 1.55, margin: '8px 0 0' },
  divider: { height: 1, background: '#1e3a5f', margin: '4px 0' },
  tableWrap: { overflowX: 'auto', overflowY: 'auto' },
  table: { borderCollapse: 'collapse', fontSize: 12, whiteSpace: 'nowrap', width: '100%' },
  labelCell: {
    background: '#0a1628', color: '#475569',
    fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
    padding: '6px 10px', textAlign: 'left',
    position: 'sticky', left: 0, zIndex: 2,
    borderBottom: '1px solid #1e3a5f', borderRight: '1px solid #1e3a5f',
  },
  dayHeader: {
    background: '#111e35', color: '#94a3b8',
    fontWeight: 700, fontSize: 11, padding: '6px 8px', textAlign: 'center',
    borderLeft: '1px solid #1e3a5f', borderBottom: '1px solid #1e3a5f',
  },
  hourCell: {
    background: '#0d1b2a', color: '#475569',
    fontSize: 10, fontWeight: 600, padding: '4px 6px', textAlign: 'center',
    borderLeft: '1px solid #0d2235', borderBottom: '1px solid #1e3a5f',
  },
  rowLabel: {
    background: '#0a1628', color: '#94a3b8',
    fontSize: 11, fontWeight: 600, padding: '7px 10px', textAlign: 'left',
    position: 'sticky', left: 0, zIndex: 1,
    borderRight: '1px solid #1e3a5f', borderBottom: '1px solid #0d2235',
  },
  cell: {
    padding: '6px 8px', textAlign: 'center',
    borderLeft: '1px solid #0d2235', borderBottom: '1px solid #0d2235',
    minWidth: 36, fontSize: 12,
  },
  noData: { color: '#475569', fontSize: 13, textAlign: 'center', padding: 24 },
}
