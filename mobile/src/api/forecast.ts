import { API_URL } from '../config'
import { Spot } from '../types'

export async function fetchForecast(): Promise<{ spots: Spot[]; sea_points: unknown[] }> {
  const res = await fetch(`${API_URL}/api/forecast`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export interface AlertPayload {
  email: string
  sports: Record<string, string>
  days: number
  weekend: boolean
  no_rain: boolean
  zone: string
}

export async function createAlert(payload: AlertPayload): Promise<void> {
  const res = await fetch(`${API_URL}/api/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

export async function fetchAlerts(email: string): Promise<unknown[]> {
  const res = await fetch(`${API_URL}/api/alerts?email=${encodeURIComponent(email)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function deleteAlert(id: number): Promise<void> {
  await fetch(`${API_URL}/api/alerts/${id}`, { method: 'DELETE' })
}
