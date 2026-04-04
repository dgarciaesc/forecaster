import { useMap, useMapEvents } from 'react-leaflet'
import { useEffect, useRef, useCallback } from 'react'

// ── Color scale: red (0 días) → orange → yellow → lime → green (7 días)
const COLOR_STOPS = [
  [0,   [180, 20,  20]],
  [14,  [220, 50,  10]],
  [28,  [230, 110, 10]],
  [43,  [220, 180, 10]],
  [57,  [180, 210, 10]],
  [71,  [100, 190, 20]],
  [86,  [40,  170, 30]],
  [100, [10,  130, 20]],
]

export function daysToRGB(days) {
  const s = Math.max(0, Math.min(100, (days / 7) * 100))
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const [s0, c0] = COLOR_STOPS[i]
    const [s1, c1] = COLOR_STOPS[i + 1]
    if (s >= s0 && s <= s1) {
      const t = (s - s0) / (s1 - s0)
      return [
        Math.round(c0[0] + t * (c1[0] - c0[0])),
        Math.round(c0[1] + t * (c1[1] - c0[1])),
        Math.round(c0[2] + t * (c1[2] - c0[2])),
      ]
    }
  }
  return COLOR_STOPS[COLOR_STOPS.length - 1][1]
}

function idw(pts, lat, lon, power = 2.5) {
  let num = 0, den = 0
  for (const p of pts) {
    const d = Math.hypot(p.lat - lat, p.lon - lon)
    if (d < 0.005) return p.score
    const w = 1 / Math.pow(d, power)
    num += w * p.score
    den += w
  }
  return den > 0 ? num / den : 0
}

// ── Land mask ─────────────────────────────────────────────────────────────────
// Cache the GeoJSON globally so it's only fetched once
let _landGeoJSON = null
let _landFetchPromise = null

function getLandGeoJSON() {
  if (_landGeoJSON) return Promise.resolve(_landGeoJSON)
  if (_landFetchPromise) return _landFetchPromise
  _landFetchPromise = fetch(
    'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json'
  )
    .then(r => r.json())
    .then(topo => {
      // Convert TopoJSON → GeoJSON using the topology arcs
      _landGeoJSON = topoToGeo(topo)
      return _landGeoJSON
    })
  return _landFetchPromise
}

// Minimal TopoJSON → GeoJSON converter (no external lib needed)
function topoToGeo(topo) {
  const obj = topo.objects.land
  const arcs = topo.arcs
  const scale = topo.transform?.scale ?? [1, 1]
  const translate = topo.transform?.translate ?? [0, 0]

  // Decode quantised arcs
  const decoded = arcs.map(arc => {
    let x = 0, y = 0
    return arc.map(([dx, dy]) => {
      x += dx; y += dy
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]]
    })
  })

  function arcCoords(idx) {
    return idx >= 0 ? decoded[idx] : [...decoded[~idx]].reverse()
  }

  function ringCoords(ring) {
    return ring.flatMap((idx, i) => {
      const pts = arcCoords(idx)
      return i === 0 ? pts : pts.slice(1)
    })
  }

  const features = []
  for (const geom of obj.geometries) {
    if (geom.type === 'Polygon') {
      features.push({ type: 'Feature', geometry: { type: 'Polygon', coordinates: geom.arcs.map(ringCoords) } })
    } else if (geom.type === 'MultiPolygon') {
      features.push({ type: 'Feature', geometry: { type: 'MultiPolygon', coordinates: geom.arcs.map(poly => poly.map(ringCoords)) } })
    }
  }
  return { type: 'FeatureCollection', features }
}

// Draw land polygons onto ctx using destination-out (erases heatmap over land)
function maskLand(ctx, map, landGeoJSON) {
  const bounds = map.getBounds().pad(0.1)

  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillStyle = 'rgba(0,0,0,1)'

  for (const feature of landGeoJSON.features) {
    const geom = feature.geometry
    const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates

    for (const poly of polys) {
      // Quick bbox check: skip if totally outside viewport
      const outer = poly[0]
      const lons = outer.map(p => p[0])
      const lats = outer.map(p => p[1])
      if (Math.min(...lons) > bounds.getEast()  ||
          Math.max(...lons) < bounds.getWest()  ||
          Math.min(...lats) > bounds.getNorth() ||
          Math.max(...lats) < bounds.getSouth()) continue

      for (const ring of poly) {
        ctx.beginPath()
        for (let i = 0; i < ring.length; i++) {
          const [lon, lat] = ring[i]
          const pt = map.latLngToContainerPoint([lat, lon])
          if (i === 0) ctx.moveTo(pt.x, pt.y)
          else ctx.lineTo(pt.x, pt.y)
        }
        ctx.closePath()
        ctx.fill('evenodd')
      }
    }
  }
  ctx.restore()
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function HeatmapLayer({ spots, sport, opacity = 0.55, selectedDay = null }) {
  const map = useMap()
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const ptsRef = useRef([])
  const landRef = useRef(null)

  // Fetch land mask once
  useEffect(() => {
    getLandGeoJSON().then(geo => { landRef.current = geo })
  }, [])

  // Keep data points in sync
  useEffect(() => {
    ptsRef.current = spots
      .filter(s => selectedDay ? s.hourly?.length > 0 : s.summary?.[sport])
      .map(s => {
        let score
        if (selectedDay) {
          const hrs = (s.hourly ?? []).filter(h => h.time.startsWith(selectedDay))
          const sc = hrs.map(h => h.scores?.[sport] ?? 0)
          const avg = sc.length > 0 ? sc.reduce((a, b) => a + b, 0) / sc.length : 0
          score = (avg / 100) * 7
        } else {
          score = s.summary?.[sport]?.quality_days ?? 0
        }
        return { lat: s.lat, lon: s.lon, score }
      })
  }, [spots, sport, selectedDay])

  // Create Leaflet pane + canvas once
  useEffect(() => {
    const PANE = 'heatmapPane'
    if (!map.getPane(PANE)) {
      const pane = map.createPane(PANE)
      pane.style.zIndex = '350'
      pane.style.pointerEvents = 'none'
    }
    const pane = map.getPane(PANE)
    const canvas = document.createElement('canvas')
    canvas.style.position = 'absolute'
    canvas.style.pointerEvents = 'none'
    pane.appendChild(canvas)
    canvasRef.current = canvas
    return () => canvas.remove()
  }, [map])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    const pts = ptsRef.current
    if (!canvas || pts.length === 0) return

    const size = map.getSize()
    const SCALE = 7

    const w = Math.ceil(size.x / SCALE)
    const h = Math.ceil(size.y / SCALE)

    // Position canvas inside the pane correctly
    const topLeft = map.containerPointToLayerPoint([0, 0])
    canvas.style.left = `${topLeft.x}px`
    canvas.style.top  = `${topLeft.y}px`
    canvas.width  = size.x
    canvas.height = size.y

    // 1. Rasterise heatmap at low resolution
    const offscreen = document.createElement('canvas')
    offscreen.width = w
    offscreen.height = h
    const octx = offscreen.getContext('2d')
    const imageData = octx.createImageData(w, h)
    const alpha = Math.round(opacity * 255)

    for (let py = 0; py < h; py++) {
      for (let px = 0; px < w; px++) {
        const ll = map.containerPointToLatLng([px * SCALE + SCALE / 2, py * SCALE + SCALE / 2])
        const score = idw(pts, ll.lat, ll.lng)
        const [r, g, b] = daysToRGB(score)
        const i = (py * w + px) * 4
        imageData.data[i]     = r
        imageData.data[i + 1] = g
        imageData.data[i + 2] = b
        imageData.data[i + 3] = alpha
      }
    }
    octx.putImageData(imageData, 0, 0)

    // 2. Upscale to final canvas
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(offscreen, 0, 0, size.x, size.y)

    // 3. Erase land areas
    if (landRef.current) {
      maskLand(ctx, map, landRef.current)
    }
  }, [map, opacity])

  const scheduleRender = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      render()
      rafRef.current = null
    })
  }, [render])

  useEffect(() => {
    scheduleRender()
  }, [scheduleRender, spots, sport, selectedDay])

  useMapEvents({
    move:   scheduleRender,
    zoom:   scheduleRender,
    resize: scheduleRender,
  })

  return null
}
