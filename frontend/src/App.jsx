import { useState, useEffect } from 'react'
import MapView from './components/MapView'
import Ranking from './components/Ranking'
import SportSelector from './components/SportSelector'
import WindguruModal from './components/WindguruModal'
import Header from './components/Header'
import LoginScreen from './components/LoginScreen'
import MobileLayout from './components/MobileLayout'
import { useMobile } from './hooks/useMobile'

const TOKEN_KEY = 'forecaster_token'
const AUTH_ENABLED = import.meta.env.VITE_AUTH_ENABLED === 'true'

export default function App() {
  const [token, setToken] = useState(() => AUTH_ENABLED ? localStorage.getItem(TOKEN_KEY) : 'no-auth')
  const [sport, setSport] = useState('surf')
  const [spots, setSpots] = useState([])
  const [seaPoints, setSeaPoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [modalSpot, setModalSpot] = useState(null)
  const [showHeatmap, setShowHeatmap] = useState(true)

  function handleLogin(credentialResponse) {
    const t = credentialResponse.credential
    localStorage.setItem(TOKEN_KEY, t)
    setToken(t)
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }

  useEffect(() => {
    if (!token) return
    const headers = AUTH_ENABLED ? { Authorization: `Bearer ${token}` } : {}
    fetch('/api/forecast', { headers })
      .then(r => {
        if (r.status === 401) { handleLogout(); return null }
        if (!r.ok) throw new Error(r.statusText)
        return r.json()
      })
      .then(d => { if (d) { setSpots(d.spots); setSeaPoints(d.sea_points || []); setLoading(false) } })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [token])

  if (AUTH_ENABLED && !token) return <LoginScreen onLogin={handleLogin} />

  const mobile = useMobile()

  function handleSearchSelect(spot) {
    setSelected(spot)
    setModalSpot(spot)
  }

  const mapContent = (
    <>
      {error ? (
        <div style={styles.errorBox}>Error cargando datos: {error}</div>
      ) : (
        <MapView
          spots={spots} seaPoints={seaPoints} sport={sport}
          selected={selected} onSelect={setSelected}
          onOpenModal={setModalSpot} showHeatmap={showHeatmap}
        />
      )}
      <HeatmapToggle active={showHeatmap} onChange={setShowHeatmap} />
      {modalSpot && (
        <WindguruModal spot={modalSpot} sport={sport} onClose={() => setModalSpot(null)} />
      )}
    </>
  )

  if (mobile) {
    return (
      <div style={styles.shell}>
        <Header spots={spots} onSelectSpot={handleSearchSelect} onLogout={handleLogout} mobile />
        <MobileLayout
          sport={sport}
          onSportChange={s => { setSport(s); setSelected(null) }}
          spots={spots}
          selected={selected}
          onSelect={setSelected}
        >
          {mapContent}
        </MobileLayout>
      </div>
    )
  }

  return (
    <div style={styles.shell}>
    <Header spots={spots} onSelectSpot={handleSearchSelect} onLogout={handleLogout} />
    <div style={styles.root}>
      <aside style={styles.left}>
        <div style={styles.panelHeader}>
          <span style={styles.panelTitle}>Ranking · 7 días</span>
          {loading && <span style={styles.badge}>cargando…</span>}
        </div>
        <Ranking spots={spots} sport={sport} selected={selected} onSelect={setSelected} />
      </aside>

      <main style={styles.center}>
        {mapContent}
      </main>

      <aside style={styles.right}>
        <div style={styles.panelHeader}>
          <span style={styles.panelTitle}>Deporte</span>
        </div>
        <SportSelector sport={sport} onChange={s => { setSport(s); setSelected(null) }} />
        <Legend />
      </aside>
    </div>
    </div>
  )
}

function HeatmapToggle({ active, onChange }) {
  return (
    <button
      onClick={() => onChange(!active)}
      style={{
        position: 'absolute',
        bottom: 24,
        right: 12,
        zIndex: 1000,
        background: active ? '#1e3a5f' : '#111e35',
        border: `1px solid ${active ? '#38bdf8' : '#1e3a5f'}`,
        color: active ? '#38bdf8' : '#64748b',
        borderRadius: 8,
        padding: '6px 12px',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        backdropFilter: 'blur(4px)',
      }}
    >
      <span style={{ fontSize: 14 }}>🌡</span>
      Mapa de calor
    </button>
  )
}

function Legend() {
  const items = [
    { color: '#22c55e', label: '6-7 días de calidad' },
    { color: '#84cc16', label: '4-5 días de calidad' },
    { color: '#eab308', label: '2-3 días de calidad' },
    { color: '#f97316', label: '1 día de calidad' },
    { color: '#ef4444', label: 'Sin días de calidad' },
  ]
  return (
    <div style={styles.legend}>
      <div style={styles.legendTitle}>Leyenda</div>
      {items.map(({ color, label }) => (
        <div key={label} style={styles.legendRow}>
          <div style={{ ...styles.dot, background: color }} />
          <span style={styles.legendLabel}>{label}</span>
        </div>
      ))}
    </div>
  )
}

const styles = {
  shell: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  root: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  left: {
    width: 270,
    minWidth: 220,
    background: 'var(--panel)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  center: {
    flex: 1,
    position: 'relative',
  },
  right: {
    width: 230,
    minWidth: 200,
    background: 'var(--panel)',
    borderLeft: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  panelHeader: {
    padding: '14px 16px 10px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  panelTitle: {
    fontWeight: 700,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--muted)',
  },
  badge: {
    fontSize: 11,
    color: 'var(--muted)',
    background: 'var(--panel2)',
    padding: '2px 7px',
    borderRadius: 99,
  },
  errorBox: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#f87171',
    background: 'var(--bg)',
    fontSize: 15,
  },
  legend: {
    marginTop: 'auto',
    padding: '16px',
    borderTop: '1px solid var(--border)',
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--muted)',
    marginBottom: 10,
  },
  legendRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    flexShrink: 0,
  },
  legendLabel: {
    fontSize: 12,
    color: 'var(--text)',
  },
}
