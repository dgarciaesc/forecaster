import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useApp } from '../context/AppContext'
import { qualityColor, dayScoreColor, COLORS } from '../utils/colors'
import { RootStackParamList } from '../navigation/RootNavigator'
import { Spot } from '../types'

type Nav = NativeStackNavigationProp<RootStackParamList>

const MEDALS = ['🥇', '🥈', '🥉']
const DAY_LETTERS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

function DayStrip({ spot, sport }: { spot: Spot; sport: string }) {
  const days = spot.days ?? []
  if (!days.length) return null
  return (
    <View style={s.dayStrip}>
      {days.map(d => {
        const score = d.scores?.[sport] ?? 0
        const color = dayScoreColor(score)
        const letter = DAY_LETTERS[new Date(d.date + 'T12:00:00').getDay()]
        return (
          <View key={d.date} style={s.dayCell}>
            <View style={[s.dayDot, { backgroundColor: color }]} />
            <Text style={[s.dayLetter, { color }]}>{letter}</Text>
          </View>
        )
      })}
    </View>
  )
}

export default function RankingScreen() {
  const { spots, loading, effectiveSportKey } = useApp()
  const navigation = useNavigation<Nav>()

  const sorted = [...spots]
    .map(sp => ({
      ...sp,
      qd: sp.summary?.[effectiveSportKey]?.quality_days ?? 0,
      avg: sp.summary?.[effectiveSportKey]?.avg_score ?? 0,
    }))
    .sort((a, b) => b.qd - a.qd || b.avg - a.avg)

  if (loading) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        <View style={s.header}><Text style={s.headerTitle}>Ranking · 7 dias</Text></View>
        <View style={s.centered}><Text style={s.muted}>Cargando pronostico...</Text></View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Ranking · 7 dias</Text>
      </View>
      <FlatList
        data={sorted}
        keyExtractor={item => String(item.id)}
        ItemSeparatorComponent={() => <View style={s.separator} />}
        renderItem={({ item, index }) => {
          const color = qualityColor(item.qd)
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('SpotDetail', { spot: item })}
              style={s.item}
            >
              <View style={s.rankBadge}>
                {index < 3
                  ? <Text style={s.medal}>{MEDALS[index]}</Text>
                  : <Text style={s.rankNum}>{index + 1}</Text>
                }
              </View>
              <View style={s.info}>
                <Text style={s.name} numberOfLines={1}>{item.name}</Text>
                <Text style={s.region}>{item.region}</Text>
                <View style={s.barWrap}>
                  <View style={[s.bar, { width: `${(item.qd / 7) * 100}%`, backgroundColor: color }]} />
                </View>
                <DayStrip spot={item} sport={effectiveSportKey} />
              </View>
              <View>
                <Text style={[s.daysNum, { color }]}>{item.qd}</Text>
                <Text style={s.daysOf}>/7</Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />
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
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: COLORS.muted, fontSize: 14 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  rankBadge: { width: 28, alignItems: 'center' },
  medal: { fontSize: 16 },
  rankNum: { fontSize: 13, fontWeight: '600', color: COLORS.muted },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  region: { fontSize: 11, color: COLORS.muted, marginBottom: 6 },
  barWrap: {
    height: 4, backgroundColor: COLORS.border,
    borderRadius: 99, overflow: 'hidden', marginBottom: 6,
  },
  bar: { height: '100%', borderRadius: 99 },
  daysNum: { fontSize: 18, fontWeight: '800', textAlign: 'right' },
  daysOf: { fontSize: 11, color: COLORS.muted, textAlign: 'right' },
  separator: { height: 1, backgroundColor: COLORS.border },
  dayStrip: { flexDirection: 'row', gap: 4 },
  dayCell: { alignItems: 'center', flex: 1 },
  dayDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 2 },
  dayLetter: { fontSize: 9, fontWeight: '700' },
})
