export function SurfIcon({ size = 36, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wave */}
      <path d="M1 29 C4 25 8 27 12 25 C16 23 20 27 24 25 C28 23 32 26 35 29"
            stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Surfboard */}
      <path d="M7 26 Q18 21 29 25"
            stroke={color} strokeWidth="3" strokeLinecap="round"/>
      {/* Head */}
      <circle cx="20" cy="13" r="2.5" fill={color}/>
      {/* Torso crouched */}
      <path d="M20 16 L19 20" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      {/* Arms spread for balance */}
      <path d="M19 18 L14 16" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M19 18 L23 16" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      {/* Legs bent on board */}
      <path d="M19 20 L16 24" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M19 20 L22 24" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export function WindsurfIcon({ size = 36, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Board */}
      <path d="M5 31 Q18 28 31 31" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      {/* Mast */}
      <path d="M17 29 L15 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      {/* Sail filled */}
      <path d="M15 7 L29 23 L15 27 Z"
            fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Boom */}
      <path d="M15 20 L26 22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      {/* Person holding boom */}
      <circle cx="17" cy="25" r="2" fill={color}/>
      <path d="M17 27 L17 30" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M17 26 L22 22" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

export function WingfoilIcon({ size = 36, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wing upper arc */}
      <path d="M3 13 Q10 3 18 5 Q26 3 33 13"
            stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Wing lower arc (inflated) */}
      <path d="M3 13 Q10 19 18 17 Q26 19 33 13"
            stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      {/* Wing fill */}
      <path d="M3 13 Q10 3 18 5 Q26 3 33 13 Q26 19 18 17 Q10 19 3 13 Z"
            fill={color} fillOpacity="0.15"/>
      {/* Strut / handle */}
      <path d="M18 17 L18 23" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      {/* Person */}
      <circle cx="18" cy="22" r="2" fill={color}/>
      <path d="M18 24 L18 28" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      {/* Board */}
      <path d="M12 30 Q18 28 24 30" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      {/* Foil mast */}
      <path d="M18 30 L18 34" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      {/* Foil horizontal blade */}
      <path d="M12 34 L24 34" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

export function KitesurfIcon({ size = 36, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Kite upper arc */}
      <path d="M7 8 Q18 2 29 8"
            stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Kite lower arc (bow kite shape) */}
      <path d="M7 8 Q18 16 29 8"
            stroke={color} strokeWidth="2" strokeLinecap="round"/>
      {/* Kite fill */}
      <path d="M7 8 Q18 2 29 8 Q18 16 7 8 Z"
            fill={color} fillOpacity="0.2"/>
      {/* Kite lines */}
      <path d="M12 12 L16 25" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M24 12 L20 25" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      {/* Control bar */}
      <path d="M13 25 L23 25" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Person */}
      <circle cx="18" cy="28" r="2" fill={color}/>
      {/* Arms to bar */}
      <path d="M18 29 L14 26" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M18 29 L22 26" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      {/* Legs + board */}
      <path d="M18 30 L15 33" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M18 30 L21 33" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M11 34 Q18 32 25 34" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}
