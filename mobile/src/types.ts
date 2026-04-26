export interface HourlyData {
  time: string
  wind_speed: number
  wind_gust: number
  wind_dir: number
  wave_height: number
  wave_period: number
  wave_dir: number
  scores: Record<string, number>
}

export interface DayData {
  date: string
  scores: Record<string, number>
}

export interface SpotSummary {
  quality_days: number
  avg_score: number
}

export interface Spot {
  id: number
  name: string
  region: string
  zone: string
  lat: number
  lon: number
  summary: Record<string, SpotSummary>
  days: DayData[]
  hourly: HourlyData[]
}

export type SportKey = 'surf' | 'windsurf' | 'wingfoil' | 'kitesurf'
export type Level = 'expert' | 'beginner'

export function effectiveSport(sport: SportKey, level: Level): string {
  return level === 'beginner' ? `${sport}_beginner` : sport
}
