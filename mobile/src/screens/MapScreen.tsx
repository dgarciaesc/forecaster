import { StyleSheet, Text, View } from 'react-native'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useApp } from '../context/AppContext'
import { qualityColor, COLORS } from '../utils/colors'
import { RootStackParamList } from '../navigation/RootNavigator'

type Nav = NativeStackNavigationProp<RootStackParamList>

export default function MapScreen() {
  const { spots, loading, effectiveSportKey } = useApp()
  const navigation = useNavigation<Nav>()

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: 40.4168,
          longitude: -5.5,
          latitudeDelta: 15,
          longitudeDelta: 15,
        }}
        userInterfaceStyle="dark"
      >
        {spots.map(spot => {
          const qd = spot.summary?.[effectiveSportKey]?.quality_days ?? 0
          const color = qualityColor(qd)
          return (
            <Marker
              key={spot.id}
              coordinate={{ latitude: spot.lat, longitude: spot.lon }}
              onPress={() => navigation.navigate('SpotDetail', { spot })}
            >
              <View style={[styles.marker, { backgroundColor: color }]}>
                <Text style={styles.markerText}>{qd}</Text>
              </View>
            </Marker>
          )
        })}
      </MapView>

      {loading && (
        <SafeAreaView style={styles.loadingOverlay} pointerEvents="none">
          <View style={styles.loadingPill}>
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        </SafeAreaView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  markerText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    alignItems: 'center',
    paddingTop: 8,
  },
  loadingPill: {
    backgroundColor: 'rgba(10,22,40,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loadingText: { color: COLORS.muted, fontSize: 12 },
})
