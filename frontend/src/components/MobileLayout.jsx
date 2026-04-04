import { useState } from 'react'
import { SurfIcon, WindsurfIcon, WingfoilIcon, KitesurfIcon } from './SportIcons'
import Ranking from './Ranking'

const SPORTS = [
  { id: 'surf',     label: 'Surf',     Icon: SurfIcon,     color: 'var(--surf)' },
  { id: 'windsurf', label: 'Windsurf', Icon: WindsurfIcon, color: 'var(--windsurf)' },
  { id: 'wingfoil', label: 'Wingfoil', Icon: WingfoilIcon, color: 'var(--wingfoil)' },
  { id: 'kitesurf', label: 'Kitesurf', Icon: KitesurfIcon, color: 'var(--kitesurf)' },
]

// ── Bottom sport bar ──────────────────────────────────────────────────────────
function SportBar({ sport, onChange, onToggleRanking, rankingOpen }) {
  return (
    <div style={s.bar}>
      {SPORTS.map(({ id, label, Icon, color }) => {
        const active = sport === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{ ...s.barBtn, color: active ? color : 'var(--muted)' }}
          >
            <span style={active ? { filter: `drop-shadow(0 0 4px ${color})` } : {}}>
              <Icon size={22} />
            </span>
            <span style={{ ...s.barLabel, fontWeight: active ? 700 : 400 }}>{label}</span>
            {active && <div style={{ ...s.activeLine, background: color }} />}
          </button>
        )
      })}

      {/* Ranking toggle */}
      <button
        onClick={onToggleRanking}
        style={{ ...s.barBtn, color: rankingOpen ? '#e2e8f0' : 'var(--muted)' }}
      >
        <span style={{ fontSize: 20, lineHeight: 1 }}>☰</span>
        <span style={s.barLabel}>Ranking</span>
        {rankingOpen && <div style={{ ...s.activeLine, background: '#e2e8f0' }} />}
      </button>
    </div>
  )
}

// ── Ranking drawer ────────────────────────────────────────────────────────────
function RankingDrawer({ open, spots, sport, selected, onSelect, onClose }) {
  if (!open) return null
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={s.backdrop} />
      {/* Drawer */}
      <div style={s.drawer}>
        <div style={s.drawerHandle} />
        <div style={s.drawerTitle}>Ranking · 7 días</div>
        <div style={s.drawerScroll}>
          <Ranking
            spots={spots}
            sport={sport}
            selected={selected}
            onSelect={spot => { onSelect(spot); onClose() }}
          />
        </div>
      </div>
    </>
  )
}

// ── Mobile layout wrapper ─────────────────────────────────────────────────────
export default function MobileLayout({
  sport, onSportChange,
  spots, selected, onSelect,
  children,   // map + overlays
}) {
  const [rankingOpen, setRankingOpen] = useState(false)

  return (
    <div style={s.root}>
      {/* Map fills all space */}
      <div style={s.mapWrap}>
        {children}
      </div>

      {/* Bottom sport bar */}
      <SportBar
        sport={sport}
        onChange={id => { onSportChange(id); setRankingOpen(false) }}
        onToggleRanking={() => setRankingOpen(v => !v)}
        rankingOpen={rankingOpen}
      />

      {/* Ranking slide-up drawer */}
      <RankingDrawer
        open={rankingOpen}
        spots={spots}
        sport={sport}
        selected={selected}
        onSelect={onSelect}
        onClose={() => setRankingOpen(false)}
      />
    </div>
  )
}

const s = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  mapWrap: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },

  // Sport bar
  bar: {
    display: 'flex',
    background: '#0d1b2e',
    borderTop: '1px solid #1e3a5f',
    flexShrink: 0,
  },
  barBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    padding: '10px 4px 8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    fontFamily: 'inherit',
  },
  barLabel: {
    fontSize: 10,
    letterSpacing: '0.02em',
  },
  activeLine: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 2,
    borderRadius: 2,
  },

  // Drawer
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 1200,
  },
  drawer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60vh',
    background: '#111e35',
    borderTop: '1px solid #1e3a5f',
    borderRadius: '16px 16px 0 0',
    zIndex: 1201,
    display: 'flex',
    flexDirection: 'column',
  },
  drawerHandle: {
    width: 36,
    height: 4,
    background: '#1e3a5f',
    borderRadius: 2,
    margin: '10px auto 0',
    flexShrink: 0,
  },
  drawerTitle: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--muted)',
    padding: '10px 16px 8px',
    borderBottom: '1px solid #1e3a5f',
    flexShrink: 0,
  },
  drawerScroll: {
    flex: 1,
    overflowY: 'auto',
  },
}
