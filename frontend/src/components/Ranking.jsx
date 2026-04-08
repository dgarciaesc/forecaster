const DAY_LETTERS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

function qualityColor(days) {
  if (days >= 6) return '#22c55e'
  if (days >= 4) return '#84cc16'
  if (days >= 2) return '#eab308'
  if (days >= 1) return '#f97316'
  return '#ef4444'
}

function dayScoreColor(score) {
  if (score >= 85) return '#22c55e'
  if (score >= 70) return '#84cc16'
  if (score >= 55) return '#eab308'
  if (score >= 35) return '#f97316'
  if (score >= 20) return '#ef4444'
  return '#334155'
}

const MEDALS = ['🥇', '🥈', '🥉']

function DayStrip({ spot, sport }) {
  const days = spot.days ?? []
  if (!days.length) return null

  return (
    <div style={styles.dayStrip}>
      {days.map((d) => {
        const score = d.scores?.[sport] ?? 0
        const color = dayScoreColor(score)
        const letter = DAY_LETTERS[new Date(d.date + 'T12:00:00').getDay()]
        return (
          <div key={d.date} style={styles.dayCell} title={`${d.date}: ${Math.round(score)}`}>
            <div style={{ ...styles.dayDot, background: color }} />
            <span style={{ ...styles.dayLetter, color }}>{letter}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function Ranking({ spots, sport, selected, onSelect }) {
  if (!spots.length) {
    return (
      <div style={styles.empty}>
        <div style={styles.spinner} />
        <span>Cargando pronóstico…</span>
      </div>
    )
  }

  const sorted = [...spots]
    .map(s => ({
      ...s,
      qd: s.summary?.[sport]?.quality_days ?? 0,
      avg: s.summary?.[sport]?.avg_score ?? 0,
    }))
    .sort((a, b) => b.qd - a.qd || b.avg - a.avg)

  return (
    <div style={styles.list}>
      {sorted.map((spot, i) => {
        const color = qualityColor(spot.qd)
        const isSelected = selected?.id === spot.id
        return (
          <div
            key={spot.id}
            style={{
              borderBottom: '1px solid var(--border)',
              borderLeft: isSelected ? `3px solid ${color}` : '3px solid transparent',
              background: isSelected ? 'var(--panel2)' : 'transparent',
              transition: 'background 0.1s',
            }}
          >
            <div
              onClick={() => onSelect(isSelected ? null : spot)}
              style={styles.item}
            >
              <div style={styles.rank}>
                {i < 3 ? MEDALS[i] : <span style={styles.rankNum}>{i + 1}</span>}
              </div>
              <div style={styles.info}>
                <div style={styles.name}>{spot.name}</div>
                <div style={styles.region}>{spot.region}</div>
                <div style={styles.barWrap}>
                  <div style={{ ...styles.bar, width: `${(spot.qd / 7) * 100}%`, background: color }} />
                </div>
              </div>
              <div style={{ ...styles.days, color }}>
                <span style={styles.daysNum}>{spot.qd}</span>
                <span style={styles.daysOf}>/7</span>
              </div>
            </div>

            {isSelected && <DayStrip spot={spot} sport={sport} />}
          </div>
        )
      })}
    </div>
  )
}

const styles = {
  list: {
    overflowY: 'auto',
    flex: 1,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px 10px 10px',
    cursor: 'pointer',
  },
  rank: {
    width: 28,
    textAlign: 'center',
    fontSize: 16,
    flexShrink: 0,
  },
  rankNum: {
    fontSize: 13,
    color: 'var(--muted)',
    fontWeight: 600,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 13,
    fontWeight: 700,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  region: {
    fontSize: 11,
    color: 'var(--muted)',
    marginBottom: 4,
  },
  barWrap: {
    height: 4,
    background: 'var(--border)',
    borderRadius: 99,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 99,
    transition: 'width 0.4s ease',
  },
  days: {
    textAlign: 'right',
    flexShrink: 0,
  },
  daysNum: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: 1,
  },
  daysOf: {
    fontSize: 11,
    color: 'var(--muted)',
  },
  dayStrip: {
    display: 'flex',
    gap: 4,
    padding: '6px 12px 10px 48px',
  },
  dayCell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  dayDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  dayLetter: {
    fontSize: 10,
    fontWeight: 700,
  },
  empty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    color: 'var(--muted)',
    fontSize: 13,
    padding: 24,
  },
  spinner: {
    width: 24,
    height: 24,
    border: '3px solid var(--border)',
    borderTopColor: 'var(--surf)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
}

// Inject spinner keyframe once
if (typeof document !== 'undefined') {
  const id = 'ranking-spin-style'
  if (!document.getElementById(id)) {
    const el = document.createElement('style')
    el.id = id
    el.textContent = '@keyframes spin { to { transform: rotate(360deg); } }'
    document.head.appendChild(el)
  }
}
