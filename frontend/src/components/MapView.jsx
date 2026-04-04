import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import HeatmapLayer, { daysToRGB } from './HeatmapLayer'
import SpotInfoCard from './SpotInfoCard'
import { useMobile } from '../hooks/useMobile'

const SPORT_COLOR = {
  surf:     '#38bdf8',
  windsurf: '#34d399',
  wingfoil: '#a78bfa',
  kitesurf: '#fb923c',
}

function qualityColor(days) {
  if (days >= 6) return '#22c55e'
  if (days >= 4) return '#84cc16'
  if (days >= 2) return '#eab308'
  if (days >= 1) return '#f97316'
  return '#ef4444'
}

function FlyTo({ spot }) {
  const map = useMap()
  useEffect(() => {
    if (spot) map.flyTo([spot.lat, spot.lon], 9, { duration: 0.8 })
  }, [spot, map])
  return null
}

function HeatmapLegend() {
  const steps = [0, 1, 2, 3, 4, 5, 6, 7]
  // Build a CSS gradient from the color stops
  const stops = steps.map(d => {
    const [r, g, b] = daysToRGB(d)
    const pct = Math.round((d / 7) * 100)
    return `rgb(${r},${g},${b}) ${pct}%`
  }).join(', ')

  return (
    <div style={leg.wrap}>
      <div style={leg.title}>Días de calidad / 7</div>
      <div style={leg.row}>
        <span style={leg.label}>0</span>
        <div style={{ ...leg.bar, background: `linear-gradient(to right, ${stops})` }} />
        <span style={leg.label}>7</span>
      </div>
      <div style={leg.ticks}>
        {steps.map(d => (
          <span key={d} style={leg.tick}>{d}</span>
        ))}
      </div>
    </div>
  )
}

const leg = {
  wrap: {
    position: 'absolute',
    bottom: 28,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    background: 'rgba(10,22,40,0.85)',
    border: '1px solid #1e3a5f',
    borderRadius: 8,
    padding: '8px 14px 6px',
    backdropFilter: 'blur(6px)',
    pointerEvents: 'none',
    minWidth: 240,
  },
  title: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#64748b',
    marginBottom: 5,
    textAlign: 'center',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  bar: {
    flex: 1,
    height: 12,
    borderRadius: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    color: '#94a3b8',
    width: 10,
    textAlign: 'center',
  },
  ticks: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 2,
    paddingLeft: 16,
    paddingRight: 16,
  },
  tick: {
    fontSize: 9,
    color: '#475569',
  },
}

function HoverMarker({ spot, color, accentColor, isSelected, onClick, qd }) {
  const [hovered, setHovered] = useState(false)
  const markerRef = useRef(null)

  const radius = isSelected ? 14 : hovered ? 13 : 9
  const weight = isSelected ? 3 : hovered ? 2.5 : 1
  const borderColor = isSelected ? accentColor : hovered ? '#fff' : '#0a1628'

  // Set pointer cursor on the underlying SVG element
  useEffect(() => {
    const el = markerRef.current?.getElement()
    if (el) el.style.cursor = 'pointer'
  }, [markerRef.current])

  return (
    <CircleMarker
      ref={markerRef}
      center={[spot.lat, spot.lon]}
      radius={radius}
      pathOptions={{
        color:       borderColor,
        fillColor:   color,
        fillOpacity: 0.92,
        weight,
      }}
      eventHandlers={{
        click:      () => onClick(),
        mouseover:  () => setHovered(true),
        mouseout:   () => setHovered(false),
      }}
    >
      <Tooltip direction="top" offset={[0, -8]} opacity={0.97}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.5 }}>
          {spot.name}
          <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 6 }}>
            {qd}/7 días
          </span>
          <div style={{ fontSize: 11, color: '#38bdf8', marginTop: 2 }}>
            Clic para ver el parte
          </div>
        </div>
      </Tooltip>
    </CircleMarker>
  )
}

// ── Mobile tap handler ────────────────────────────────────────────────────────
// Leaflet SVG marker click events are unreliable on iOS. Instead we listen on
// the map-level click event (which fires reliably on touch) and find the
// nearest spot by pixel distance.
function MobileClickHandler({ spots, onSelect, onOpenModal }) {
  const map = useMap()
  useMapEvents({
    click(e) {
      const clickPt = map.latLngToContainerPoint(e.latlng)
      let nearest = null
      let minDist = Infinity
      for (const spot of spots) {
        const sp = map.latLngToContainerPoint([spot.lat, spot.lon])
        const d = Math.hypot(clickPt.x - sp.x, clickPt.y - sp.y)
        if (d < minDist) { minDist = d; nearest = spot }
      }
      if (nearest && minDist < 40) {
        onSelect(nearest)
        onOpenModal(nearest)
      }
    },
  })
  return null
}

export default function MapView({ spots, seaPoints = [], sport, selected, onSelect, onOpenModal, showHeatmap }) {
  const [infoSpot, setInfoSpot] = useState(null)
  const mobile = useMobile()

  // Open card automatically when a spot is selected
  useEffect(() => {
    setInfoSpot(selected)
  }, [selected])

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={[36.0, -10.0]}
        zoom={5}
        style={{ height: '100%', width: '100%', background: '#0a1628' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
        />

        {showHeatmap && spots.length > 0 && (
          <HeatmapLayer spots={[...spots, ...seaPoints]} sport={sport} opacity={0.55} />
        )}

        {selected && <FlyTo spot={selected} />}

        {spots.map(spot => {
          const qd          = spot.summary?.[sport]?.quality_days ?? 0
          const color       = qualityColor(qd)
          const isSelected  = selected?.id === spot.id
          const accentColor = SPORT_COLOR[sport]

          return (
            <HoverMarker
              key={spot.id}
              spot={spot}
              color={color}
              accentColor={accentColor}
              isSelected={isSelected}
              onClick={() => { onSelect(spot); onOpenModal(spot) }}
              qd={qd}
            />
          )
        })}

        {mobile && (
          <MobileClickHandler spots={spots} onSelect={onSelect} onOpenModal={onOpenModal} />
        )}
      </MapContainer>

      {showHeatmap && <HeatmapLegend />}
      <SpotInfoCard spot={infoSpot} onClose={() => setInfoSpot(null)} />
    </div>
  )
}
