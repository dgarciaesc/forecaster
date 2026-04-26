import { useEffect, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createAlert, fetchAlerts, deleteAlert } from '../api/forecast'
import { useApp } from '../context/AppContext'
import { COLORS, SPORT_COLORS, SPORT_LABELS } from '../utils/colors'
import { SportKey } from '../types'

const SPORTS: { id: SportKey; emoji: string }[] = [
  { id: 'surf', emoji: '🏄' },
  { id: 'windsurf', emoji: '🌬️' },
  { id: 'wingfoil', emoji: '🪁' },
  { id: 'kitesurf', emoji: '💨' },
]

const ZONES = [
  { value: 'all', label: 'Todas las zonas' },
  { value: 'cantabrico_oriental', label: 'Cantabrico oriental' },
  { value: 'cantabrico_occidental', label: 'Cantabrico occidental' },
  { value: 'atlantico_norte', label: 'Atlantico norte' },
  { value: 'portugal_sur', label: 'Portugal Sur' },
  { value: 'andalucia_occidental', label: 'Andalucia occidental' },
  { value: 'mediterraneo_sur', label: 'Mediterraneo sur' },
  { value: 'levante', label: 'Levante' },
  { value: 'cataluna', label: 'Cataluna' },
  { value: 'baleares', label: 'Baleares' },
  { value: 'canarias', label: 'Canarias' },
]

interface ExistingAlert {
  id: number
  sports: string
  days: number
  weekend: boolean
  no_rain: boolean
  zone: string
}

export default function AlertsScreen() {
  const { sport } = useApp()
  const [email, setEmail] = useState('')
  const [selectedSports, setSelectedSports] = useState<Record<string, string>>({ [sport]: 'expert' })
  const [days, setDays] = useState(3)
  const [weekend, setWeekend] = useState(false)
  const [noRain, setNoRain] = useState(false)
  const [zone, setZone] = useState('all')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [existingAlerts, setExistingAlerts] = useState<ExistingAlert[]>([])

  useEffect(() => {
    if (!email.includes('@')) return
    fetchAlerts(email)
      .then(data => setExistingAlerts(data as ExistingAlert[]))
      .catch(() => {})
  }, [email, sent])

  function toggleSport(id: SportKey) {
    setSelectedSports(prev => {
      const next = { ...prev }
      if (next[id]) delete next[id]
      else next[id] = 'expert'
      return next
    })
  }

  function toggleLevel(id: SportKey) {
    setSelectedSports(prev => ({
      ...prev,
      [id]: prev[id] === 'beginner' ? 'expert' : 'beginner',
    }))
  }

  async function handleSubmit() {
    if (!email || Object.keys(selectedSports).length === 0) return
    setLoading(true)
    try {
      await createAlert({ email, sports: selectedSports, days, weekend, no_rain: noRain, zone })
      setSent(true)
    } catch {
      Alert.alert('Error', 'No se pudo guardar la alerta. Intentalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    await deleteAlert(id)
    setExistingAlerts(prev => prev.filter(a => a.id !== id))
  }

  const activeSports = Object.keys(selectedSports) as SportKey[]
  const firstColor = SPORT_COLORS[activeSports[0]] ?? COLORS.surf
  const canSubmit = email.includes('@') && activeSports.length > 0

  if (sent) {
    return (
      <SafeAreaView style={s.container} edges={['top']}>
        <View style={s.successWrap}>
          <View style={s.successIcon}><Text style={s.successCheck}>✓</Text></View>
          <Text style={s.successTitle}>Alerta configurada!</Text>
          <Text style={s.successSub}>Te avisaremos en {email}</Text>
          <TouchableOpacity style={s.newAlertBtn} onPress={() => setSent(false)}>
            <Text style={s.newAlertText}>Nueva alerta</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>🔔 Alertas de parte</Text>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.content}>

          <Text style={s.label}>Tu correo</Text>
          <TextInput
            value={email}
            onChangeText={v => { setEmail(v); setSent(false) }}
            placeholder="correo@ejemplo.com"
            placeholderTextColor={COLORS.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            style={s.input}
          />

          {existingAlerts.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text style={s.label}>Alertas activas</Text>
              {existingAlerts.map(a => {
                const sportsObj = JSON.parse(a.sports) as Record<string, string>
                const sportsStr = Object.entries(sportsObj)
                  .map(([id, lvl]) => `${SPORT_LABELS[id] ?? id} ${lvl === 'beginner' ? '🌊' : '⚡'}`)
                  .join(', ')
                return (
                  <View key={a.id} style={s.alertRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.alertSports}>{sportsStr}</Text>
                      <Text style={s.alertMeta}>
                        {a.weekend ? 'fines de semana' : `min. ${a.days} dia${a.days > 1 ? 's' : ''}`}
                        {a.no_rain ? ' · sin lluvia' : ''}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDelete(a.id)} style={s.deleteBtn}>
                      <Text style={s.deleteBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
          )}

          <Text style={[s.label, { marginTop: 20 }]}>Deporte y nivel</Text>
          <View style={s.sportGrid}>
            {SPORTS.map(({ id, emoji }) => {
              const active = !!selectedSports[id]
              const color = SPORT_COLORS[id]
              const lvl = selectedSports[id]
              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => toggleSport(id)}
                  style={[s.sportBtn, {
                    borderColor: active ? color : COLORS.border,
                    backgroundColor: active ? `${color}22` : 'transparent',
                  }]}
                >
                  <Text style={s.sportEmoji}>{emoji}</Text>
                  <Text style={[s.sportLabel, { color: active ? color : COLORS.muted }]}>
                    {SPORT_LABELS[id]}
                  </Text>
                  {active && (
                    <View style={s.levelRow}>
                      <TouchableOpacity
                        onPress={e => { e.stopPropagation?.(); toggleLevel(id) }}
                        style={[s.levelChip, {
                          backgroundColor: lvl === 'beginner' ? `${color}33` : 'transparent',
                          borderColor: lvl === 'beginner' ? color : 'transparent',
                        }]}
                      >
                        <Text style={{ color, fontSize: 14 }}>🌊</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={e => { e.stopPropagation?.(); toggleLevel(id) }}
                        style={[s.levelChip, {
                          backgroundColor: lvl === 'expert' ? `${color}33` : 'transparent',
                          borderColor: lvl === 'expert' ? color : 'transparent',
                        }]}
                      >
                        <Text style={{ color, fontSize: 14 }}>⚡</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              )
            })}
          </View>

          <Text style={[s.label, { marginTop: 20 }]}>Dias de calidad minimos</Text>
          <View style={s.daysRow}>
            {[1, 2, 3, 4, 5, 6, 7].map(n => {
              const active = !weekend && days === n
              return (
                <TouchableOpacity
                  key={n}
                  onPress={() => { setDays(n); setWeekend(false) }}
                  style={[s.dayBtn, {
                    borderColor: active ? firstColor : COLORS.border,
                    backgroundColor: active ? `${firstColor}22` : 'transparent',
                  }]}
                >
                  <Text style={[s.dayBtnText, { color: active ? firstColor : COLORS.muted }]}>{n}</Text>
                </TouchableOpacity>
              )
            })}
            <TouchableOpacity
              onPress={() => setWeekend(v => !v)}
              style={[s.weekendBtn, {
                borderColor: weekend ? firstColor : COLORS.border,
                backgroundColor: weekend ? `${firstColor}22` : 'transparent',
              }]}
            >
              <Text style={[s.dayBtnText, { color: weekend ? firstColor : COLORS.muted, fontSize: 11 }]}>
                📅 Finde
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setNoRain(v => !v)}
            style={[s.extraBtn, {
              borderColor: noRain ? '#fbbf24' : COLORS.border,
              backgroundColor: noRain ? '#fbbf2422' : 'transparent',
              marginTop: 10,
            }]}
          >
            <Text style={[s.extraBtnText, { color: noRain ? '#fbbf24' : COLORS.muted }]}>
              ☀️ Solo dias sin lluvia
            </Text>
          </TouchableOpacity>

          <Text style={[s.label, { marginTop: 20 }]}>Zona</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8, paddingBottom: 4 }}>
              {ZONES.map(z => {
                const active = zone === z.value
                return (
                  <TouchableOpacity
                    key={z.value}
                    onPress={() => setZone(z.value)}
                    style={[s.zoneChip, {
                      borderColor: active ? firstColor : COLORS.border,
                      backgroundColor: active ? `${firstColor}22` : 'transparent',
                    }]}
                  >
                    <Text style={[s.zoneChipText, { color: active ? firstColor : COLORS.muted }]}>
                      {z.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </ScrollView>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit || loading}
            style={[s.submitBtn, {
              backgroundColor: canSubmit ? `${firstColor}33` : 'transparent',
              borderColor: canSubmit ? firstColor : COLORS.border,
              opacity: loading ? 0.6 : 1,
            }]}
          >
            <Text style={[s.submitBtnText, { color: canSubmit ? firstColor : COLORS.muted }]}>
              {loading ? 'Guardando...' : 'Activar alerta'}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { color: COLORS.text, fontSize: 16, fontWeight: '800' },
  content: { padding: 20, paddingBottom: 48 },
  label: {
    fontSize: 11, fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: 1, color: COLORS.muted, marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.panel, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, padding: 12, color: COLORS.text, fontSize: 14,
  },
  alertRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.panel, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 8, padding: 10, marginBottom: 8, gap: 8,
  },
  alertSports: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
  alertMeta: { color: COLORS.muted, fontSize: 11, marginTop: 2 },
  deleteBtn: { padding: 4 },
  deleteBtnText: { color: COLORS.muted, fontSize: 16 },
  sportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sportBtn: {
    width: '47%', alignItems: 'center', padding: 14,
    borderRadius: 10, borderWidth: 1, gap: 4,
  },
  sportEmoji: { fontSize: 22 },
  sportLabel: { fontSize: 12, fontWeight: '600' },
  levelRow: { flexDirection: 'row', gap: 4, marginTop: 4 },
  levelChip: { padding: 4, borderRadius: 6, borderWidth: 1 },
  daysRow: { flexDirection: 'row', gap: 6 },
  dayBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, alignItems: 'center',
  },
  dayBtnText: { fontSize: 13, fontWeight: '700' },
  weekendBtn: {
    flex: 2, paddingVertical: 10, borderRadius: 8, borderWidth: 1, alignItems: 'center',
  },
  extraBtn: { padding: 12, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  extraBtnText: { fontSize: 12, fontWeight: '600' },
  zoneChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  zoneChipText: { fontSize: 12, fontWeight: '500' },
  submitBtn: {
    marginTop: 24, padding: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center',
  },
  submitBtnText: { fontSize: 15, fontWeight: '700' },
  successWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12,
  },
  successIcon: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#1a4d1a',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  successCheck: { fontSize: 28, color: '#86e986' },
  successTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  successSub: { fontSize: 14, color: COLORS.muted, textAlign: 'center' },
  newAlertBtn: {
    marginTop: 16, paddingHorizontal: 24, paddingVertical: 12,
    backgroundColor: COLORS.panel, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border,
  },
  newAlertText: { color: COLORS.text, fontWeight: '600' },
})
