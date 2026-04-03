import { SurfIcon, WindsurfIcon, WingfoilIcon, KitesurfIcon } from './SportIcons'

const SPORTS = [
  { id: 'surf',     label: 'Surf',      Icon: SurfIcon,     color: 'var(--surf)' },
  { id: 'windsurf', label: 'Windsurf',  Icon: WindsurfIcon, color: 'var(--windsurf)' },
  { id: 'wingfoil', label: 'Wingfoil',  Icon: WingfoilIcon, color: 'var(--wingfoil)' },
  { id: 'kitesurf', label: 'Kitesurf',  Icon: KitesurfIcon, color: 'var(--kitesurf)' },
]

export default function SportSelector({ sport, onChange }) {
  return (
    <div style={styles.container}>
      {SPORTS.map(({ id, label, Icon, color }) => {
        const active = sport === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              ...styles.btn,
              borderColor: active ? color : 'var(--border)',
              background: active ? `${color}22` : 'transparent',
            }}
          >
            <span style={{ color: active ? color : 'var(--muted)', flexShrink: 0 }}>
              <Icon size={30} />
            </span>
            <span style={{ ...styles.label, color: active ? color : 'var(--muted)' }}>
              {label}
            </span>
            {active && <div style={{ ...styles.activeDot, background: color }} />}
          </button>
        )
      })}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: '14px 12px',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    position: 'relative',
  },
  label: {
    flex: 1,
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 600,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    flexShrink: 0,
  },
}
