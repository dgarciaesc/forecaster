import { useMap, useMapEvents } from 'react-leaflet'
import { useEffect, useRef, useCallback } from 'react'
import { getLandGeoJSON, maskLand } from './HeatmapLayer'

const N_PARTICLES = 280
const TRAIL_LEN   = 14

// ── Maths helpers ─────────────────────────────────────────────────────────────
function circularMean(angles) {
  if (!angles.length) return 0
  const s = angles.reduce((a, v) => a + Math.sin(v * Math.PI / 180), 0) / angles.length
  const c = angles.reduce((a, v) => a + Math.cos(v * Math.PI / 180), 0) / angles.length
  return (Math.atan2(s, c) * 180 / Math.PI + 360) % 360
}

function meanArr(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
}

// IDW on a vector field: interpolates direction + magnitude at (lat,lon)
function sampleField(pts, lat, lon) {
  let ux = 0, uy = 0, wSum = 0
  for (const p of pts) {
    const d = Math.hypot(p.lat - lat, p.lon - lon)
    if (d < 0.015) return p
    const w = 1 / (d * d)
    const rad = p.dirDeg * Math.PI / 180
    ux += w * Math.sin(rad) * p.speed
    uy += w * Math.cos(rad) * p.speed
    wSum += w
  }
  if (wSum === 0) return null
  const uxn = ux / wSum
  const uyn = uy / wSum
  return {
    dirDeg: (Math.atan2(uxn, uyn) * 180 / Math.PI + 360) % 360,
    speed:  Math.hypot(uxn, uyn),
  }
}

// ── Particle helpers ───────────────────────────────────────────────────────────
function getBounds(map) {
  const b = map.getBounds()
  return { s: b.getSouth(), n: b.getNorth(), w: b.getWest(), e: b.getEast() }
}

function resetParticle(p, b) {
  p.lat    = b.s + Math.random() * (b.n - b.s)
  p.lon    = b.w + Math.random() * (b.e - b.w)
  p.age    = 0
  p.maxAge = 55 + Math.floor(Math.random() * 85)
  p.trail  = []
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function FlowLayer({ spots, seaPoints, sport, selectedDay }) {
  const map       = useMap()
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)
  const ptsRef    = useRef([])
  const pRef      = useRef([])
  const isWave    = sport === 'surf'
  const landRef   = useRef(null)

  // Build interpolation data from hourly forecasts
  useEffect(() => {
    const all = [...spots, ...seaPoints].filter(s => s.hourly?.length)
    ptsRef.current = all.flatMap(s => {
      const hrs = selectedDay
        ? s.hourly.filter(h => h.time.startsWith(selectedDay))
        : s.hourly.slice(0, 24)  // use first 24 h for "current" conditions
      if (!hrs.length) return []
      const dk = isWave ? 'wave_dir'    : 'wind_dir'
      const sk = isWave ? 'wave_height' : 'wind_speed'
      const dirs   = hrs.map(h => h[dk]).filter(v => v != null)
      const speeds = hrs.map(h => h[sk]).filter(v => v != null)
      if (!dirs.length) return []
      return [{ lat: s.lat, lon: s.lon, dirDeg: circularMean(dirs), speed: meanArr(speeds) }]
    })
  }, [spots, seaPoints, sport, selectedDay, isWave])

  // Fetch land mask once (shared cache with HeatmapLayer)
  useEffect(() => {
    getLandGeoJSON().then(geo => { landRef.current = geo })
  }, [])

  // One-time canvas + particle init per map instance
  useEffect(() => {
    const PANE = 'flowPane'
    if (!map.getPane(PANE)) {
      const pane = map.createPane(PANE)
      pane.style.zIndex = '400'
      pane.style.pointerEvents = 'none'
    }
    const canvas = document.createElement('canvas')
    canvas.style.position = 'absolute'
    canvas.style.pointerEvents = 'none'
    map.getPane(PANE).appendChild(canvas)
    canvasRef.current = canvas

    const b = getBounds(map)
    pRef.current = Array.from({ length: N_PARTICLES }, () => {
      const p = { lat: 0, lon: 0, age: 0, maxAge: 0, trail: [] }
      resetParticle(p, b)
      p.age = Math.floor(Math.random() * p.maxAge)  // stagger births
      return p
    })

    return () => {
      canvas.remove()
      cancelAnimationFrame(rafRef.current)
    }
  }, [map])

  // ── Animation loop ───────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const pts    = ptsRef.current
    if (!canvas || !pts.length) {
      rafRef.current = requestAnimationFrame(draw)
      return
    }

    const size    = map.getSize()
    const topLeft = map.containerPointToLayerPoint([0, 0])
    canvas.style.left = `${topLeft.x}px`
    canvas.style.top  = `${topLeft.y}px`
    if (canvas.width !== size.x || canvas.height !== size.y) {
      canvas.width  = size.x
      canvas.height = size.y
    }

    const ctx = canvas.getContext('2d')

    // Fade previous frame's content (creates the glowing tail effect)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillStyle = 'rgba(0,0,0,0.78)'
    ctx.fillRect(0, 0, size.x, size.y)
    ctx.globalCompositeOperation = 'source-over'

    const b   = getBounds(map)
    const rgb = isWave ? '80,170,255' : '120,240,150'  // blue for waves, green for wind

    for (const p of pRef.current) {
      const field = sampleField(pts, p.lat, p.lon)
      if (!field) { resetParticle(p, b); continue }

      // Move particle in the direction the wind/wave is going
      // (dirDeg is FROM-direction, so movement is opposite)
      const spd = isWave
        ? 0.00013 * Math.max(field.speed * 2.2, 0.4)
        : 0.00007 * Math.max(field.speed, 1.5)
      const rad = field.dirDeg * Math.PI / 180
      p.lat += -Math.cos(rad) * spd
      p.lon += -Math.sin(rad) * spd
      p.age++

      p.trail.push({ lat: p.lat, lon: p.lon })
      if (p.trail.length > TRAIL_LEN) p.trail.shift()

      const pt = map.latLngToContainerPoint([p.lat, p.lon])
      if (
        p.age > p.maxAge ||
        pt.x < -60 || pt.x > size.x + 60 ||
        pt.y < -60 || pt.y > size.y + 60
      ) {
        resetParticle(p, b)
        continue
      }
      if (p.trail.length < 2) continue

      // Opacity: ramps up at birth, fades at death
      const lifeAlpha = Math.sin((p.age / p.maxAge) * Math.PI)

      // Convert trail lat/lon → screen pixels and draw
      ctx.beginPath()
      const p0 = map.latLngToContainerPoint([p.trail[0].lat, p.trail[0].lon])
      ctx.moveTo(p0.x, p0.y)
      for (let i = 1; i < p.trail.length; i++) {
        const pi = map.latLngToContainerPoint([p.trail[i].lat, p.trail[i].lon])
        ctx.lineTo(pi.x, pi.y)
      }
      ctx.strokeStyle = `rgba(${rgb},${(lifeAlpha * 0.88).toFixed(2)})`
      ctx.lineWidth = 2.8
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
    }

    // Erase particles over land
    if (landRef.current) maskLand(ctx, map, landRef.current)

    rafRef.current = requestAnimationFrame(draw)
  }, [map, isWave])

  // Start / restart loop when draw function changes (sport / wave mode switch)
  useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw])

  // Clear & respawn particles on map move/zoom so trails don't smear
  useMapEvents({
    movestart() { clearAndRespawn() },
    zoomstart()  { clearAndRespawn() },
  })

  function clearAndRespawn() {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    const b = getBounds(map)
    pRef.current.forEach(p => resetParticle(p, b))
  }

  return null
}
