import { useState, useRef, useEffect } from 'react'

// ── Radar logo ────────────────────────────────────────────────────────────────
function RadarLogo() {
  return (
    <div style={logo.wrap}>
      <div style={logo.ring}>
        <div style={logo.sweep} />
        <div style={logo.dot} />
      </div>
      <span style={logo.text}>WAVEPULSE</span>
    </div>
  )
}

const logo = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    userSelect: 'none',
  },
  ring: {
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '1.5px solid #22c55e55',
    background: 'radial-gradient(circle, #0d2218 0%, #0a1628 100%)',
    flexShrink: 0,
    overflow: 'hidden',
  },
  sweep: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: 'conic-gradient(from 0deg, transparent 0deg, rgba(34,197,94,0.55) 55deg, transparent 55deg)',
    animation: 'radar-spin 2.4s linear infinite',
  },
  dot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 6px #22c55e',
  },
  text: {
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: '0.12em',
    background: 'linear-gradient(to right, #22c55e, #eab308, #ef4444)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
}

// ── Spot search ───────────────────────────────────────────────────────────────
function SpotSearch({ spots, onSelectSpot }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  const results = query.length < 1 ? [] : spots.filter(s =>
    s.name?.toLowerCase().includes(query.toLowerCase()) ||
    s.region?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8)

  // Close on outside click
  useEffect(() => {
    function handle(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function pick(spot) {
    onSelectSpot(spot)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={wrapRef} style={search.wrap}>
      <div style={search.inputWrap}>
        <span style={search.icon}>⌕</span>
        <input
          style={search.input}
          placeholder="Buscar spot…"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button style={search.clear} onClick={() => { setQuery(''); setOpen(false) }}>✕</button>
        )}
      </div>
      {open && results.length > 0 && (
        <div style={search.dropdown}>
          {results.map(spot => (
            <button key={spot.id} style={search.item} onClick={() => pick(spot)}>
              <span style={search.itemName}>{spot.name}</span>
              <span style={search.itemRegion}>{spot.region}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const search = {
  wrap: {
    position: 'relative',
    width: 240,
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    background: '#162040',
    border: '1px solid #1e3a5f',
    borderRadius: 8,
    padding: '0 10px',
    gap: 6,
  },
  icon: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 1,
  },
  input: {
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#e2e8f0',
    fontSize: 13,
    padding: '8px 0',
    fontFamily: 'inherit',
  },
  clear: {
    background: 'none',
    border: 'none',
    color: '#475569',
    cursor: 'pointer',
    fontSize: 11,
    padding: '2px 0',
    lineHeight: 1,
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    background: '#111e35',
    border: '1px solid #1e3a5f',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 9999,
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid #1e3a5f22',
    padding: '9px 12px',
    cursor: 'pointer',
    color: 'inherit',
    textAlign: 'left',
    transition: 'background 0.1s',
    fontFamily: 'inherit',
  },
  itemName: {
    fontSize: 13,
    fontWeight: 600,
    color: '#e2e8f0',
  },
  itemRegion: {
    fontSize: 11,
    color: '#64748b',
    marginLeft: 8,
  },
}

// ── Header ────────────────────────────────────────────────────────────────────
export default function Header({ spots, onSelectSpot, onLogout, mobile }) {
  return (
    <header style={hdr.wrap}>
      <div style={hdr.left}><RadarLogo /></div>
      {!mobile && (
        <div style={hdr.center}>
          <SpotSearch spots={spots} onSelectSpot={onSelectSpot} />
        </div>
      )}
      <div style={hdr.right}>
        {onLogout && (
          <button onClick={onLogout} style={hdr.logoutBtn} title="Cerrar sesión">
            Salir
          </button>
        )}
      </div>
    </header>
  )
}

const hdr = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    height: 52,
    background: '#0d1b2e',
    borderBottom: '1px solid #1e3a5f',
    flexShrink: 0,
    zIndex: 1100,
  },
  left:   { flex: 1 },
  center: { display: 'flex', justifyContent: 'center' },
  right:  { flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' },
  logoutBtn: {
    background: 'none',
    border: '1px solid #1e3a5f',
    borderRadius: 6,
    color: '#475569',
    fontSize: 12,
    padding: '5px 12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}
