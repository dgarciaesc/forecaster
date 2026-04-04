import { useState } from 'react'
import { SurfIcon, WindsurfIcon, WingfoilIcon, KitesurfIcon } from './SportIcons'
import Ranking from './Ranking'

const SPORTS = [
  { id: 'surf',     label: 'Surf',     Icon: SurfIcon,     color: 'var(--surf)' },
  { id: 'windsurf', label: 'Windsurf', Icon: WindsurfIcon, color: 'var(--windsurf)' },
  { id: 'wingfoil', label: 'Wingfoil', Icon: WingfoilIcon, color: 'var(--wingfoil)' },
  { id: 'kitesurf', label: 'Kitesurf', Icon: KitesurfIcon, color: 'var(--kitesurf)' },
]

function SportBar({ sport, onChange, onToggleRanking, rankingOpen }) {
  return (
    <div style={s.sportBar}>
      {SPORTS.map(({ id, label, Icon, color }) => {
        const active = sport === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              ...s.btn,
              color: active ? color : 'var(--muted)',
              borderBottom: active ? `2px solid ${color}` : '2px solid transparent',
            }}
          >
            <span style={active ? { filter: `drop-shadow(0 0 3px ${color})` } : {}}>
              <Icon size={20} />
            </span>
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 400 }}>{label}</span>
          </button>
        )
      })}

      {/* Ranking tab */}
      <button
        onClick={onToggleRanking}
        style={{
          ...s.btn,
          color: rankingOpen ? '#e2e8f0' : 'var(--muted)',
          borderBottom: rankingOpen ? '2px solid #e2e8f0' : '2px solid transparent',
          borderLeft: '1px solid #1e3a5f',
        }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>☰</span>
        <span style={{ fontSize: 11, fontWeight: rankingOpen ? 700 : 400 }}>Ranking</span>
      </button>
    </div>
  )
}

function RankingDrawer({ open, spots, sport, selected, onSelect, onClose }) {
  if (!open) return null
  return (
    <>
      <div onClick={onClose} style={s.backdrop} />
      <div style={s.drawer}>
        <div style={s.handle} />
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

export default function MobileLayout({ sport, onSportChange, spots, selected, onSelect, children }) {
  const [rankingOpen, setRankingOpen] = useState(false)

  return (
    <div style={s.root}>
      <SportBar
        sport={sport}
        onChange={id => { onSportChange(id); setRankingOpen(false) }}
        onToggleRanking={() => setRankingOpen(v => !v)}
        rankingOpen={rankingOpen}
      />

      <div style={s.mapWrap}>
        {children}
      </div>

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
  },
  sportBar: {
    display: 'flex',
    background: '#0d1b2e',
    borderBottom: '1px solid #1e3a5f',
    flexShrink: 0,
  },
  btn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    padding: '8px 4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'color 0.15s',
  },
  mapWrap: {
    flex: 1,
    position: 'relative',
  },
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
    height: '65vh',
    background: '#111e35',
    borderTop: '1px solid #1e3a5f',
    borderRadius: '16px 16px 0 0',
    zIndex: 1201,
    display: 'flex',
    flexDirection: 'column',
  },
  handle: {
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
