import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../utils/colors'
import MapScreen from '../screens/MapScreen'
import RankingScreen from '../screens/RankingScreen'
import SpotDetailScreen from '../screens/SpotDetailScreen'
import SportScreen from '../screens/SportScreen'
import AlertsScreen from '../screens/AlertsScreen'
import { Spot } from '../types'

export type RootStackParamList = {
  Tabs: undefined
  SpotDetail: { spot: Spot }
}

export type TabParamList = {
  Mapa: undefined
  Ranking: undefined
  Deporte: undefined
  Alertas: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<TabParamList>()

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Mapa: 'map-outline',
  Ranking: 'trophy-outline',
  Deporte: 'fitness-outline',
  Alertas: 'notifications-outline',
}

function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: COLORS.panel, borderTopColor: COLORS.border },
        tabBarActiveTintColor: COLORS.surf,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="Ranking" component={RankingScreen} />
      <Tab.Screen name="Deporte" component={SportScreen} />
      <Tab.Screen name="Alertas" component={AlertsScreen} />
    </Tab.Navigator>
  )
}

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.panel },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: COLORS.bg },
      }}
    >
      <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="SpotDetail"
        component={SpotDetailScreen}
        options={({ route }) => ({ title: route.params.spot.name })}
      />
    </Stack.Navigator>
  )
}
