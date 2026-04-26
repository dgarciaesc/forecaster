import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { HourlyData } from '../types'
import { windColor, waveColor, scoreColor, COLORS } from '../utils/colors'

const ROW_HEIGHT = 36
const HEADER_HEIGHT = 30
const LABEL_WIDTH = 110
const COL_WIDTH = 48

const ARROWS = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖']
function dirArrow(deg: number, fromDir = false): string {
  const r = fromDir ? (deg + 180) % 360 : deg
  return ARROWS[Math.round(r / 45) % 8]
}

function scoreStars(score: number): string {
  const filled = score >= 85 ? 5 : score >= 70 ? 4 : score >= 55 ? 3 : score >= 35 ? 2 : score >= 20 ? 1 : 0
  return '★'.repeat(filled) + '☆'.repeat(5 - filled)
}
function scoreStarColor(score: number): string {
  if (score >= 85) return '#86e986'
  if (score >= 70) return '#a3ed6b'
  if (score >= 55) return '#f0d060'
  if (score >= 35) return '#ffb347'
  if (score >= 20) return '#ff6666'
  return '#4a2020'
}

function groupByDay(hourly: HourlyData[]) {
  const groups: Record<string, HourlyData[]> = {}
  for (const h of hourly) {
    const d = h.time.slice(0, 10)
    if (!groups[d]) groups[d] = []
    groups[d].push(h)
  }
  return groups
}

function fmtDay(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', {
    weekday: 'short', day: 'numeric', month: 'short',
  })
}

const ROW_DEFS = [
  { key: 'wind',    label: '💨 Viento kn' },
  { key: 'gust',    label: '💨 Rachas kn' },
  { key: 'wdir',    label: '🧭 Dir. viento' },
  { key: 'wave',    label: '🌊 Ola m' },
  { key: 'period',  label: '⏱ Periodo s' },
  { key: 'wavedir', label: '🧭 Dir. ola' },
  { key: 'score',   label: '★ Score' },
]

function getCellContent(rowKey: string, h: HourlyData, sport: string) {
  switch (rowKey) {
    case 'wind': { const c = windColor(h.wind_speed); return { bg: c.bg, color: c.text, value: String(Math.round(h.wind_speed)) } }
    case 'gust': { const c = windColor(h.wind_gust ?? 0); return { bg: c.bg, color: c.text, value: String(Math.round(h.wind_gust ?? 0)) } }
    case 'wdir': return { bg: 'transparent', color: '#94a3b8', value: dirArrow(h.wind_dir, true) }
    case 'wave': { const c = waveColor(h.wave_height); return { bg: c.bg, color: c.text, value: h.wave_height.toFixed(1) } }
    case 'period': return { bg: 'transparent', color: '#7dd3fc', value: h.wave_period.toFixed(0) }
    case 'wavedir': return { bg: 'transparent', color: '#60a5fa', value: dirArrow(h.wave_dir, false) }
    case 'score': { const sc = h.scores?.[sport] ?? 0; return { bg: scoreColor(sc), color: scoreStarColor(sc), value: scoreStars(sc) } }
    default: return { bg: 'transparent', color: COLORS.text, value: '' }
  }
}

export default function ForecastTable({ hourly, sport }: { hourly: HourlyData[]; sport: string }) {
  if (!hourly.length) {
    return <View style={s.empty}><Text style={s.emptyText}>Sin datos de prevision</Text></View>
  }

  const groups = groupByDay(hourly)
  const dates = Object.keys(groups).sort()
  const allCols = dates.flatMap(d => groups[d])
  const tableHeight = HEADER_HEIGHT * 2 + ROW_HEIGHT * ROW_DEFS.length

  return (
    <View style={[s.container, { height: tableHeight }]}>
      {/* Fixed left label column */}
      <View style={s.leftCol}>
        <View style={[s.topSpacer, { height: HEADER_HEIGHT }]} />
        <View style={[s.hourLabel, { height: HEADER_HEIGHT }]}>
          <Text style={s.hourLabelText}>Hora</Text>
        </View>
        {ROW_DEFS.map(row => (
          <View key={row.key} style={[s.rowLabel, { height: ROW_HEIGHT }]}>
            <Text style={s.rowLabelText} numberOfLines={1}>{row.label}</Text>
          </View>
        ))}
      </View>

      {/* Scrollable data */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
        <View>
          {/* Day headers */}
          <View style={{ flexDirection: 'row', height: HEADER_HEIGHT }}>
            {dates.map(date => (
              <View
                key={date}
                style={[s.dayHeader, { width: groups[date].length * COL_WIDTH, height: HEADER_HEIGHT }]}
              >
                <Text style={s.dayHeaderText}>{fmtDay(date)}</Text>
              </View>
            ))}
          </View>

          {/* Hour headers */}
          <View style={{ flexDirection: 'row', height: HEADER_HEIGHT }}>
            {allCols.map((h, i) => (
              <View key={i} style={[s.hourCell, { width: COL_WIDTH, height: HEADER_HEIGHT }]}>
                <Text style={s.hourCellText}>{h.time.slice(11, 16)}</Text>
              </View>
            ))}
          </View>

          {/* Data rows */}
          {ROW_DEFS.map(row => (
            <View key={row.key} style={{ flexDirection: 'row', height: ROW_HEIGHT }}>
              {allCols.map((h, i) => {
                const { bg, color, value } = getCellContent(row.key, h, sport)
                return (
                  <View key={i} style={[s.cell, { width: COL_WIDTH, height: ROW_HEIGHT, backgroundColor: bg }]}>
                    <Text style={[s.cellText, { color, fontSize: row.key === 'score' ? 9 : 12 }]}>
                      {value}
                    </Text>
                  </View>
                )
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  container: { flexDirection: 'row', overflow: 'hidden' },
  leftCol: {
    width: LABEL_WIDTH,
    backgroundColor: COLORS.panel2,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  topSpacer: {
    backgroundColor: COLORS.panel2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  hourLabel: {
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  hourLabelText: { color: COLORS.muted, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  rowLabel: {
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#0d2235',
  },
  rowLabelText: { color: '#94a3b8', fontSize: 10, fontWeight: '600' },
  dayHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.panel,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dayHeaderText: { color: '#94a3b8', fontSize: 10, fontWeight: '700' },
  hourCell: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d1b2a',
    borderLeftWidth: 1,
    borderLeftColor: '#0d2235',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  hourCellText: { color: COLORS.muted, fontSize: 10, fontWeight: '600' },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#0d2235',
    borderBottomWidth: 1,
    borderBottomColor: '#0d2235',
  },
  cellText: { fontWeight: '600', textAlign: 'center' },
  empty: { padding: 24, alignItems: 'center' },
  emptyText: { color: COLORS.muted, fontSize: 13 },
})
