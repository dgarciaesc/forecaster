export const COLORS = {
  bg: '#0a1628',
  panel: '#111e35',
  panel2: '#0d1b2a',
  border: '#1e3a5f',
  text: '#e2e8f0',
  muted: '#64748b',
  muted2: '#475569',
  surf: '#38bdf8',
  windsurf: '#34d399',
  wingfoil: '#a78bfa',
  kitesurf: '#fb923c',
}

export const SPORT_COLORS: Record<string, string> = {
  surf: COLORS.surf,
  windsurf: COLORS.windsurf,
  wingfoil: COLORS.wingfoil,
  kitesurf: COLORS.kitesurf,
}

export const SPORT_LABELS: Record<string, string> = {
  surf: 'Surf',
  windsurf: 'Windsurf',
  wingfoil: 'Wingfoil',
  kitesurf: 'Kitesurf',
}

export function qualityColor(days: number): string {
  if (days >= 6) return '#22c55e'
  if (days >= 4) return '#84cc16'
  if (days >= 2) return '#eab308'
  if (days >= 1) return '#f97316'
  return '#ef4444'
}

export function dayScoreColor(score: number): string {
  if (score >= 85) return '#22c55e'
  if (score >= 70) return '#84cc16'
  if (score >= 55) return '#eab308'
  if (score >= 35) return '#f97316'
  if (score >= 20) return '#ef4444'
  return '#334155'
}

export function windColor(kn: number): { bg: string; text: string } {
  if (kn < 4)  return { bg: '#1a3a1a', text: '#6ee76e' }
  if (kn < 8)  return { bg: '#1e4d1e', text: '#86e986' }
  if (kn < 12) return { bg: '#2d5a1b', text: '#a3ed6b' }
  if (kn < 16) return { bg: '#5a5a00', text: '#f0f060' }
  if (kn < 20) return { bg: '#6b3d00', text: '#ffb347' }
  if (kn < 25) return { bg: '#6b1a00', text: '#ff6b35' }
  if (kn < 32) return { bg: '#7a0000', text: '#ff4444' }
  return             { bg: '#4a0040', text: '#ff66ff' }
}

export function waveColor(m: number): { bg: string; text: string } {
  if (m < 0.3) return { bg: '#0d2235', text: '#90caf9' }
  if (m < 0.7) return { bg: '#0d2e4a', text: '#64b5f6' }
  if (m < 1.2) return { bg: '#0d3d6e', text: '#42a5f5' }
  if (m < 1.8) return { bg: '#0a4f8a', text: '#90caf9' }
  if (m < 2.5) return { bg: '#083e7a', text: '#bbdefb' }
  if (m < 3.5) return { bg: '#051c5e', text: '#e3f2fd' }
  return             { bg: '#020d3a', text: '#ffffff' }
}

export function scoreColor(sc: number): string {
  if (sc >= 85) return '#1a4d1a'
  if (sc >= 70) return '#243d1a'
  if (sc >= 55) return '#3d3a00'
  if (sc >= 35) return '#3d2200'
  if (sc >= 20) return '#2a0000'
  return '#1a0a0a'
}
