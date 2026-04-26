import React, { createContext, useContext, useEffect, useState } from 'react'
import { fetchForecast } from '../api/forecast'
import { Spot, SportKey, Level, effectiveSport } from '../types'

interface AppContextValue {
  spots: Spot[]
  loading: boolean
  error: string | null
  sport: SportKey
  level: Level
  effectiveSportKey: string
  setSport: (s: SportKey) => void
  setLevel: (l: Level) => void
  refresh: () => void
}

const AppContext = createContext<AppContextValue>(null!)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [spots, setSpots] = useState<Spot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sport, setSport] = useState<SportKey>('surf')
  const [level, setLevel] = useState<Level>('expert')

  function load() {
    setLoading(true)
    setError(null)
    fetchForecast()
      .then(d => { setSpots(d.spots); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  return (
    <AppContext.Provider value={{
      spots,
      loading,
      error,
      sport,
      level,
      effectiveSportKey: effectiveSport(sport, level),
      setSport,
      setLevel,
      refresh: load,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
