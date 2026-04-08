import { useEffect } from 'react'

const SPORT_LABEL = { surf: 'Surf', windsurf: 'Windsurf', wingfoil: 'Wingfoil', kitesurf: 'Kitesurf' }
const SPORT_COLOR = { surf: '#38bdf8', windsurf: '#34d399', wingfoil: '#a78bfa', kitesurf: '#fb923c' }

// Wind speed → background color (Windguru palette)
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

// Wave height → background color
function waveColor(m) {
  if (m < 0.3) return { bg: '#0d2235', text: '#90caf9' }
  if (m < 0.7) return { bg: '#0d2e4a', text: '#64b5f6' }
  if (m < 1.2) return { bg: '#0d3d6e', text: '#42a5f5' }
  if (m < 1.8) return { bg: '#0a4f8a', text: '#90caf9' }
  if (m < 2.5) return { bg: '#083e7a', text: '#bbdefb' }
  if (m < 3.5) return { bg: '#051c5e', text: '#e3f2fd' }
  return              { bg: '#020d3a', text: '#ffffff' }
}

// Score → background color
function scoreColor(s) {
  if (s >= 85) return { bg: '#1a4d1a' }
  if (s >= 70) return { bg: '#243d1a' }
  if (s >= 55) return { bg: '#3d3a00' }
  if (s >= 35) return { bg: '#3d2200' }
  if (s >= 20) return { bg: '#2a0000' }
  return              { bg: '#1a0a0a' }
}

// Score → star icons (0–5 stars, 0 = mal)
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

// Arrow rotated to show where wind blows TO (FROM + 180°)
function WindArrow({ deg }) {
  return (
    <span style={{
      display: 'inline-block',
      transform: `rotate(${(deg + 180) % 360}deg)`,
      fontSize: 14,
      lineHeight: 1,
    }}>↑</span>
  )
}

function WaveArrow({ deg }) {
  return (
    <span style={{
      display: 'inline-block',
      transform: `rotate(${deg}deg)`,
      fontSize: 12,
      lineHeight: 1,
      opacity: 0.7,
    }}>↑</span>
  )
}

// Group hourly entries by date
function groupByDay(hourly) {
  const groups = {}
  for (const h of hourly) {
    const date = h.time.slice(0, 10)
    if (!groups[date]) groups[date] = []
    groups[date].push(h)
  }
  return groups
}

function formatDayHeader(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatHour(timeStr) {
  return timeStr.slice(11, 16)
}

export default function WindguruModal({ spot, sport, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!spot) return null

  const hourly = spot.hourly ?? []
  const groups = groupByDay(hourly)
  const dates  = Object.keys(groups).sort()
  const accentColor = SPORT_COLOR[sport]

  // Flatten all columns in order
  const allCols = dates.flatMap(d => groups[d])

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={s.header}>
          <div>
            <span style={s.spotName}>{spot.name}</span>
            <span style={s.spotRegion}>{spot.region}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ ...s.sportBadge, color: accentColor, borderColor: accentColor }}>
              {SPORT_LABEL[sport]}
            </span>
            <button style={s.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Scrollable table */}
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              {/* Day row */}
              <tr>
                <th style={s.labelCell}>Día</th>
                {dates.map(date => (
                  <th
                    key={date}
                    colSpan={groups[date].length}
                    style={s.dayHeader}
                  >
                    {formatDayHeader(date)}
                  </th>
                ))}
              </tr>
              {/* Hour row */}
              <tr>
                <th style={s.labelCell}>Hora</th>
                {allCols.map((h, i) => (
                  <th key={i} style={s.hourCell}>{formatHour(h.time)}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Wind speed */}
              <tr>
                <td style={s.rowLabel}>💨 Viento (kn)</td>
                {allCols.map((h, i) => {
                  const c = windColor(h.wind_speed)
                  return (
                    <td key={i} style={{ ...s.dataCell, background: c.bg, color: c.text }}>
                      {Math.round(h.wind_speed)}
                    </td>
                  )
                })}
              </tr>

              {/* Wind gusts */}
              <tr>
                <td style={s.rowLabel}>💨 Rachas (kn)</td>
                {allCols.map((h, i) => {
                  const c = windColor(h.wind_gust ?? 0)
                  return (
                    <td key={i} style={{ ...s.dataCell, background: c.bg, color: c.text, fontStyle: 'italic' }}>
                      {Math.round(h.wind_gust ?? 0)}
                    </td>
                  )
                })}
              </tr>

              {/* Wind direction */}
              <tr>
                <td style={s.rowLabel}>🧭 Dir. viento</td>
                {allCols.map((h, i) => (
                  <td key={i} style={{ ...s.dataCell, color: '#94a3b8' }}>
                    <WindArrow deg={h.wind_dir} />
                  </td>
                ))}
              </tr>

              {/* Wave height */}
              <tr>
                <td style={s.rowLabel}>🌊 Ola (m)</td>
                {allCols.map((h, i) => {
                  const c = waveColor(h.wave_height)
                  return (
                    <td key={i} style={{ ...s.dataCell, background: c.bg, color: c.text }}>
                      {h.wave_height.toFixed(1)}
                    </td>
                  )
                })}
              </tr>

              {/* Wave period */}
              <tr>
                <td style={s.rowLabel}>⏱ Periodo (s)</td>
                {allCols.map((h, i) => (
                  <td key={i} style={{ ...s.dataCell, color: '#7dd3fc' }}>
                    {h.wave_period.toFixed(0)}
                  </td>
                ))}
              </tr>

              {/* Wave direction */}
              <tr>
                <td style={s.rowLabel}>🧭 Dir. ola</td>
                {allCols.map((h, i) => (
                  <td key={i} style={{ ...s.dataCell, color: '#60a5fa' }}>
                    <WaveArrow deg={h.wave_dir} />
                  </td>
                ))}
              </tr>

              {/* Sport score */}
              <tr>
                <td style={{ ...s.rowLabel, color: accentColor }}>
                  ★ Score {SPORT_LABEL[sport]}
                </td>
                {allCols.map((h, i) => {
                  const score = h.scores?.[sport] ?? 0
                  const c = scoreColor(score)
                  return (
                    <td key={i} style={{ ...s.dataCell, background: c.bg, textAlign: 'center' }}>
                      <ScoreStars score={score} />
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Color legend */}
        <div style={s.legend}>
          <span style={s.legendTitle}>Viento:</span>
          {[
            ['<4kn', windColor(2)], ['4-8', windColor(6)], ['8-12', windColor(10)],
            ['12-16', windColor(14)], ['16-20', windColor(18)], ['20-25', windColor(22)],
            ['25-32', windColor(28)], ['>32', windColor(35)],
          ].map(([label, c]) => (
            <span key={label} style={{ ...s.legendChip, background: c.bg, color: c.text }}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const s = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(3px)',
  },
  modal: {
    background: '#0d1b2a',
    border: '1px solid #1e3a5f',
    borderRadius: 12,
    width: 'min(95vw, 1100px)',
    maxHeight: '85vh',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 20px',
    borderBottom: '1px solid #1e3a5f',
    flexShrink: 0,
  },
  spotName: {
    fontSize: 18, fontWeight: 800, color: '#e2e8f0', marginRight: 10,
  },
  spotRegion: {
    fontSize: 13, color: '#64748b',
  },
  sportBadge: {
    fontSize: 12, fontWeight: 700,
    border: '1px solid', borderRadius: 99,
    padding: '3px 10px',
  },
  closeBtn: {
    background: 'transparent', border: 'none',
    color: '#64748b', fontSize: 18, cursor: 'pointer',
    padding: '2px 6px', borderRadius: 4,
    transition: 'color 0.1s',
  },
  tableWrap: {
    overflowX: 'auto', overflowY: 'auto',
    flex: 1,
  },
  table: {
    borderCollapse: 'collapse',
    fontSize: 12,
    whiteSpace: 'nowrap',
    width: '100%',
  },
  labelCell: {
    background: '#0a1628',
    color: '#475569',
    fontSize: 10, fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '6px 12px',
    textAlign: 'left',
    position: 'sticky', left: 0, zIndex: 2,
    borderBottom: '1px solid #1e3a5f',
    borderRight: '1px solid #1e3a5f',
  },
  dayHeader: {
    background: '#111e35',
    color: '#94a3b8',
    fontWeight: 700, fontSize: 11,
    padding: '6px 8px',
    textAlign: 'center',
    borderLeft: '1px solid #1e3a5f',
    borderBottom: '1px solid #1e3a5f',
  },
  hourCell: {
    background: '#0d1b2a',
    color: '#475569',
    fontSize: 10, fontWeight: 600,
    padding: '4px 6px',
    textAlign: 'center',
    borderLeft: '1px solid #0d2235',
    borderBottom: '1px solid #1e3a5f',
  },
  rowLabel: {
    background: '#0a1628',
    color: '#94a3b8',
    fontSize: 11, fontWeight: 600,
    padding: '7px 12px',
    textAlign: 'left',
    position: 'sticky', left: 0, zIndex: 1,
    borderRight: '1px solid #1e3a5f',
    borderBottom: '1px solid #0d2235',
  },
  dataCell: {
    padding: '6px 8px',
    textAlign: 'center',
    borderLeft: '1px solid #0d2235',
    borderBottom: '1px solid #0d2235',
    minWidth: 36,
    fontSize: 12,
  },
  legend: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '10px 16px',
    borderTop: '1px solid #1e3a5f',
    flexShrink: 0,
    flexWrap: 'wrap',
  },
  legendTitle: {
    fontSize: 10, fontWeight: 700,
    color: '#475569', textTransform: 'uppercase',
    letterSpacing: '0.08em', marginRight: 4,
  },
  legendChip: {
    fontSize: 10, padding: '2px 7px',
    borderRadius: 4, fontWeight: 600,
  },
}
