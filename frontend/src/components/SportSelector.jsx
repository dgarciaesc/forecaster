import { SurfIcon, WindsurfIcon, WingfoilIcon, KitesurfIcon } from './SportIcons'

const SPORTS = [
  { id: 'surf',     label: 'Surf',      Icon: SurfIcon,     color: 'var(--surf)' },
  { id: 'windsurf', label: 'Windsurf',  Icon: WindsurfIcon, color: 'var(--windsurf)' },
  { id: 'wingfoil', label: 'Wingfoil',  Icon: WingfoilIcon, color: 'var(--wingfoil)' },
  { id: 'kitesurf', label: 'Kitesurf',  Icon: KitesurfIcon, color: 'var(--kitesurf)' },
]

export default function SportSelector({ sport, onChange, level, onLevelChange }) {
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
              alignItems: active ? 'flex-start' : 'center',
            }}
          >
            <div style={styles.btnTop}>
              <span style={{ color: active ? color : 'var(--muted)', flexShrink: 0 }}>
                <Icon size={30} />
              </span>
              <span style={{ ...styles.label, color: active ? color : 'var(--muted)' }}>
                {label}
              </span>
              {active && <div style={{ ...styles.activeDot, background: color }} />}
            </div>

            {active && (
              <div style={styles.levelRow} onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => onLevelChange('beginner')}
                  style={{
                    ...styles.levelBtn,
                    background: level === 'beginner' ? `${color}33` : 'transparent',
                    color: level === 'beginner' ? color : 'var(--muted)',
                    borderColor: level === 'beginner' ? color : '#1e3a5f',
                  }}
                >
                  🌊 Principiante
                </button>
                <button
                  onClick={() => onLevelChange('expert')}
                  style={{
                    ...styles.levelBtn,
                    background: level === 'expert' ? `${color}33` : 'transparent',
                    color: level === 'expert' ? color : 'var(--muted)',
                    borderColor: level === 'expert' ? color : '#1e3a5f',
                  }}
                >
                  ⚡ Experto
                </button>
              </div>
            )}
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
    flexDirection: 'column',
    gap: 8,
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  btnTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
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
  levelRow: {
    display: 'flex',
    gap: 6,
    width: '100%',
  },
  levelBtn: {
    flex: 1,
    padding: '5px 0',
    borderRadius: 6,
    border: '1px solid',
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 600,
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
  },
}
