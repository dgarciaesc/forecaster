import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/RootNavigator'
import { useApp } from '../context/AppContext'
import { COLORS, SPORT_COLORS, SPORT_LABELS } from '../utils/colors'
import ForecastTable from '../components/ForecastTable'

type Props = NativeStackScreenProps<RootStackParamList, 'SpotDetail'>

const SPOT_INFO: Record<number, {
  bottom: string; waveType: string; bestConditions: string; description: string
}> = {
  1:  { bottom: 'Arena', waveType: 'Beach break', bestConditions: 'Mar del NW 1.5-2.5 m, viento del SE', description: 'Sede de competiciones nacionales e internacionales. Ola consistente y bien formada, apta para todos los niveles.' },
  2:  { bottom: 'Arena', waveType: 'Beach break', bestConditions: 'Mar del W-NW 1-2 m, viento del SE', description: 'Playa extensa con varios picos. Mas tranquila que Pantin, ideal para surf y longboard.' },
  3:  { bottom: 'Arena', waveType: 'Beach break', bestConditions: 'Mar del W 1-2 m, viento del NE', description: 'Playa de 2 km en la ria de Arousa. En verano los vientos termicos la convierten en uno de los mejores spots de windsurf y kitesurf de Galicia.' },
  4:  { bottom: 'Arena', waveType: 'Beach break', bestConditions: 'Mar del N-NW 1-2.5 m, viento del S', description: 'Playa urbana con oleaje constante. Ola potente y hueca en bajamares.' },
  5:  { bottom: 'Arena', waveType: 'River mouth break', bestConditions: 'Mar del NE 1.5-3 m, viento del S', description: 'Considerada la mejor ola de Asturias. El canon submarino concentra el oleaje creando tubos potentes.' },
  6:  { bottom: 'Arena', waveType: 'Beach break', bestConditions: 'Mar del N 1-2 m, viento del S', description: 'Playa muy popular frente a Santander. Varios picos para todos los niveles.' },
  7:  { bottom: 'Arena', waveType: 'Beach break', bestConditions: 'Mar del N-NW 1.5-3 m, viento del S', description: 'Uno de los spots mas famosos de Espana. Ola de calidad con buena consistencia.' },
  8:  { bottom: 'Roca', waveType: 'Reef break', bestConditions: 'Mar del N 2-4 m, viento del S-SW', description: 'Ola de roca muy tecnica, exclusiva para surfistas expertos. Tubos potentes.' },
  9:  { bottom: 'Arena', waveType: 'Beach break', bestConditions: 'Mar del N-NE 1-2.5 m, viento del S', description: 'Playa del Pais Vasco con oleaje consistente y varios picos.' },
  10: { bottom: 'Arena', waveType: 'Beach break', bestConditions: 'Mar del N 1-2 m, viento del S', description: 'Extensa playa con buenas condiciones para todos los niveles.' },
}

export default function SpotDetailScreen({ route }: Props) {
  const { spot } = route.params
  const { sport, effectiveSportKey } = useApp()
  const info = SPOT_INFO[spot.id]
  const accentColor = SPORT_COLORS[sport] ?? COLORS.surf

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={[s.badge, { borderColor: accentColor }]}>
        <Text style={[s.badgeText, { color: accentColor }]}>
          {SPORT_LABELS[sport]}
        </Text>
      </View>

      {info && (
        <View style={s.infoBlock}>
          <InfoRow icon="⬛" label="Fondo"    value={info.bottom} />
          <InfoRow icon="🌊" label="Ola"      value={info.waveType} />
          <InfoRow icon="✅" label="Mejor con" value={info.bestConditions} />
          <Text style={s.desc}>{info.description}</Text>
        </View>
      )}

      <View style={s.divider} />

      <Text style={s.sectionTitle}>Pronostico</Text>
      <ForecastTable hourly={spot.hourly ?? []} sport={effectiveSportKey} />
    </ScrollView>
  )
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoIcon}>{icon}</Text>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, paddingBottom: 32 },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  infoBlock: { marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 8 },
  infoIcon: { fontSize: 12, width: 18 },
  infoLabel: {
    fontSize: 11, color: COLORS.muted, width: 68,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  infoValue: { flex: 1, fontSize: 12, color: '#94a3b8', lineHeight: 18 },
  desc: { fontSize: 12, color: '#94a3b8', lineHeight: 20, marginTop: 8 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 16 },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: 1, color: COLORS.muted, marginBottom: 12,
  },
})
