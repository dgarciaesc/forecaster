import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useApp } from '../context/AppContext'
import { COLORS, SPORT_COLORS, SPORT_LABELS } from '../utils/colors'
import { SportKey, Level } from '../types'

const SPORTS: { id: SportKey; emoji: string }[] = [
  { id: 'surf', emoji: '🏄' },
  { id: 'windsurf', emoji: '🌬️' },
  { id: 'wingfoil', emoji: '🪁' },
  { id: 'kitesurf', emoji: '💨' },
]

const LEGEND = [
  { color: '#22c55e', label: '6-7 dias de calidad' },
  { color: '#84cc16', label: '4-5 dias de calidad' },
  { color: '#eab308', label: '2-3 dias de calidad' },
  { color: '#f97316', label: '1 dia de calidad' },
  { color: '#ef4444', label: 'Sin dias de calidad' },
]

export default function SportScreen() {
  const { sport, level, setSport, setLevel } = useApp()

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Deporte y Nivel</Text>
      </View>
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.sectionLabel}>Deporte</Text>
        <View style={s.sportGrid}>
          {SPORTS.map(({ id, emoji }) => {
            const active = sport === id
            const color = SPORT_COLORS[id]
            return (
              <TouchableOpacity
                key={id}
                onPress={() => setSport(id)}
                style={[s.sportBtn, {
                  borderColor: active ? color : COLORS.border,
                  backgroundColor: active ? `${color}22` : 'transparent',
                }]}
              >
                <Text style={s.sportEmoji}>{emoji}</Text>
                <Text style={[s.sportLabel, { color: active ? color : COLORS.muted }]}>
                  {SPORT_LABELS[id]}
                </Text>
                {active && <View style={[s.activeDot, { backgroundColor: color }]} />}
              </TouchableOpacity>
            )
          })}
        </View>

        <Text style={[s.sectionLabel, { marginTop: 28 }]}>Nivel</Text>
        <View style={s.levelRow}>
          {(['expert', 'beginner'] as Level[]).map(l => {
            const active = level === l
            const color = SPORT_COLORS[sport]
            return (
              <TouchableOpacity
                key={l}
                onPress={() => setLevel(l)}
                style={[s.levelBtn, {
                  borderColor: active ? color : COLORS.border,
                  backgroundColor: active ? `${color}22` : 'transparent',
                  flex: 1,
                }]}
              >
                <Text style={s.levelEmoji}>{l === 'expert' ? '⚡' : '🌊'}</Text>
                <Text style={[s.levelLabel, { color: active ? color : COLORS.muted }]}>
                  {l === 'expert' ? 'Experto' : 'Principiante'}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={s.legendCard}>
          <Text style={s.legendTitle}>Leyenda calidad</Text>
          {LEGEND.map(({ color, label }) => (
            <View key={label} style={s.legendRow}>
              <View style={[s.dot, { backgroundColor: color }]} />
              <Text style={s.legendLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: {
    color: COLORS.muted, fontSize: 13, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1,
  },
  content: { padding: 20, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: 1, color: COLORS.muted, marginBottom: 12,
  },
  sportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sportBtn: {
    width: '47%', alignItems: 'center', padding: 20,
    borderRadius: 12, borderWidth: 1, gap: 6,
  },
  sportEmoji: { fontSize: 28 },
  sportLabel: { fontSize: 14, fontWeight: '600' },
  activeDot: { width: 6, height: 6, borderRadius: 3, marginTop: 2 },
  levelRow: { flexDirection: 'row', gap: 10 },
  levelBtn: { alignItems: 'center', padding: 20, borderRadius: 12, borderWidth: 1, gap: 6 },
  levelEmoji: { fontSize: 24 },
  levelLabel: { fontSize: 14, fontWeight: '600' },
  legendCard: {
    marginTop: 28, padding: 16,
    backgroundColor: COLORS.panel, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  legendTitle: {
    fontSize: 11, fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: 1, color: COLORS.muted, marginBottom: 12,
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: 13, color: COLORS.text },
})
