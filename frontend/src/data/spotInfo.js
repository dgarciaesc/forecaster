// Static descriptions for each surf spot (id matches spots.py)
const SPOT_INFO = {
  // ── Galicia ──────────────────────────────────────────────────────────────────
  1: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del NW 1.5–2.5 m, viento del SE (offshore)',
    description: 'Sede de competiciones nacionales e internacionales. Ola consistente y bien formada, apta para todos los niveles. Buenas instalaciones y fácil acceso.',
  },
  2: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del W-NW 1–2 m, viento del SE',
    description: 'Playa extensa con varios picos. Más tranquila que Pantín, ideal para surf y longboard. Aparcamiento amplio y acceso sencillo.',
  },
  3: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del W 1–2 m, viento del NE (offshore)',
    description: 'Playa de 2 km en la ría de Arousa. En verano los vientos térmicos la convierten en uno de los mejores spots de windsurf y kitesurf de Galicia.',
  },
  // ── Asturias ─────────────────────────────────────────────────────────────────
  4: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del N-NW 1–2.5 m, viento del S',
    description: 'Playa urbana con oleaje constante. Ola potente y hueca en bajamares. Zona de escuelas de surf y competiciones regionales.',
  },
  5: {
    bottom: 'Arena (desembocadura de río)',
    waveType: 'River mouth break',
    bestConditions: 'Mar del NE 1.5–3 m, viento del S, marea media',
    description: 'Considerada la mejor ola de Asturias. El cañón submarino concentra el oleaje creando tubos potentes. Requiere conocimiento del spot; corrientes fuertes.',
  },
  // ── Cantabria ─────────────────────────────────────────────────────────────────
  6: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del N 1–2 m, viento del S',
    description: 'Playa muy popular frente a Santander, accesible en ferry. Varios picos para todos los niveles. Amplia zona de aparcamiento y servicios.',
  },
  // ── País Vasco ────────────────────────────────────────────────────────────────
  7: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del N-NW 1.5–2.5 m, viento del S',
    description: 'Una de las playas surferas más largas del País Vasco. Sede del Zarautz Pro. Ola progresiva y apta para todo nivel. Acceso y servicios excelentes.',
  },
  8: {
    bottom: 'Arena (desembocadura de ría)',
    waveType: 'Left rivermouth break',
    bestConditions: 'Mar del NW 1.5–3 m, viento del SE, marea baja-media',
    description: 'Una de las mejores izquierdas de Europa. La ría de Gernika canaliza el mar creando una ola larga y hueca. Muy sensible a la marea y al oleaje; cuando está en condiciones, es espectacular.',
  },
  // ── Cádiz / Huelva ────────────────────────────────────────────────────────────
  9: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del SW 1–2.5 m, viento del NE (Levante ligero)',
    description: 'Playa extensa entre Vejer y Conil. Varios picos con ola potente y hueca. Muy concurrida en verano; mejor madrugada. Fácil acceso desde la A-48.',
  },
  10: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del SW-W 1–2 m, viento del N-NE',
    description: 'Playa extensa con oleaje regular. Buena opción cuando El Palmar está masificado. Ambiente más tranquilo y varios picos para elegir.',
  },
  11: {
    bottom: 'Arena y roca',
    waveType: 'Beach break / reef break',
    bestConditions: 'Mar del W-SW, Levante fuerte para kitesurf/windsurf',
    description: 'Capital mundial del kitesurf y windsurf por el Levante. En días de Poniente hay ola surfeable en la playa. Vientos fuertes y constantes casi todo el año.',
  },
  12: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del W-SW 1–2.5 m, viento del E (Levante)',
    description: 'Bahía cerrada ideal para kitesurf y windsurf cuando sopla el Levante. También surfeable con mar de SW y viento ligero. Aguas con poco fondo, cuidado en seco.',
  },
  13: {
    bottom: 'Arena y acantilados',
    waveType: 'Beach break',
    bestConditions: 'Mar del SW-W 1–2 m, viento del NE',
    description: 'Paraje natural protegido con acceso algo limitado. Ola con carácter, más hueca que en El Palmar. Recomendable en condiciones medias con Poniente.',
  },
  14: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del SW 1–2 m, viento del NE',
    description: 'Playa extensa en el Parque Natural de Doñana. Oleaje consistente y pocas multitudes. Acceso por carretera de arena; recomendable vehículo 4x4.',
  },
  // ── Mediterráneo ─────────────────────────────────────────────────────────────
  15: {
    bottom: 'Arena',
    waveType: 'Wind swell',
    bestConditions: 'Tramontana o Llevant fuertes, mar de 1–1.5 m',
    description: 'El surf en el Mediterráneo depende de temporales locales. Con Tramontana fuerte se generan olitas cortas pero divertidas. También buena zona para windsurf.',
  },
  16: {
    bottom: 'Arena y roca',
    waveType: 'Wind swell',
    bestConditions: 'Tramontana fuerte del N-NW, mar de 1–1.5 m',
    description: 'Similar a Roses. Spot emergente en el Alt Empordà. Mejor con Tramontana establecida varios días. También interesante para windsurf y kitesurf.',
  },
  17: {
    bottom: 'Arena',
    waveType: 'Wind swell',
    bestConditions: 'Llevant fuerte del E-SE, mar de 1–1.5 m',
    description: 'Una de las pocas opciones de surf en la costa catalana central. Con Llevant moderado-fuerte hay ola. Principalmente spot de windsurf y SUP.',
  },
  18: {
    bottom: 'Arena y roca',
    waveType: 'Wind swell',
    bestConditions: 'Levante fuerte del E, mar de 1–1.5 m',
    description: 'Zona con potencial para kitesurf y windsurf con viento de Levante. Ola pequeña pero divertida en temporales. Acceso fácil desde el puerto de Dénia.',
  },
  // ── Galicia (nuevos) ─────────────────────────────────────────────────────────
  19: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del W-NW 1.5–2.5 m, viento del SE',
    description: 'Playa extensa y poco masificada. Varios picos de calidad con ola potente. Buena alternativa cuando los spots más conocidos están saturados.',
  },
  20: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del W 1–2 m, viento del NE',
    description: 'Playa solitaria en la Costa da Morte. Ola consistente y entorno natural espectacular. Acceso por pista; merece la pena el esfuerzo.',
  },
  // ── Asturias (nuevos) ────────────────────────────────────────────────────────
  21: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del N-NW 1–2 m, viento del S-SE',
    description: 'Playa natural entre dunas. Ola de calidad y pocas multitudes. Zona de especial protección, sin urbanización. Acceso a pie desde el aparcamiento.',
  },
  22: {
    bottom: 'Arena y roca',
    waveType: 'Beach break / reef',
    bestConditions: 'Mar del NE 1.5–2.5 m, viento del S',
    description: 'Spot más expuesto al NE que otros de Asturias. Funciona bien cuando los spots de cara N están pequeños. Ola con más potencia que carácter.',
  },
  // ── Cantabria (nuevos) ───────────────────────────────────────────────────────
  23: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del N 1–2 m, viento del S',
    description: 'Playa en el Parque Natural de las Dunas de Liencres. Ola consistente en marea media. Entorno natural protegido; aparcamiento regulado en verano.',
  },
  24: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del N-NW 1–2.5 m, viento del S-SE',
    description: 'Playa con varios picos y poca masificación. Buena opción cuando los spots principales están llenos. Acceso sencillo y servicio de escuelas.',
  },
  // ── País Vasco (nuevos) ──────────────────────────────────────────────────────
  25: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del N-NW 1.5–2.5 m, viento del S',
    description: 'Playa popular y accesible desde Bilbao. Ola consistente con varios picos. Ambiente surfero animado y buenas escuelas. Metro hasta Sopelana.',
  },
  26: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del N 1.5–2.5 m, viento del S',
    description: 'Playa urbana en San Sebastián, frente al Kursaal. Oleaje potente para ser playa urbana. Muy accesible pero masificada. Excelente fondo de arena.',
  },
  // ── Cádiz sur (nuevos) ───────────────────────────────────────────────────────
  27: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del W-SW 1–2 m, viento del NE',
    description: 'Playa virgen en el Parque Natural del Estrecho. Aguas cristalinas y entorno arqueológico (ruinas romanas). Poco surf, más conocida por el kitesurf.',
  },
  28: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del SW 1–2 m, viento del NE',
    description: 'Flecha litoral en la desembocadura del Piedras. Ola consistente y poca multitud. Acceso por pista de arena; ideal para kitesurf con viento del NE.',
  },
  // ── Mediterráneo (nuevos) ────────────────────────────────────────────────────
  29: {
    bottom: 'Arena',
    waveType: 'Wind swell',
    bestConditions: 'Llevant del E, mar de 1–1.5 m',
    description: 'Playa urbana de Barcelona. Surf marginal, principalmente wind swell con Llevant. Muy accesible pero contaminada y concurrida. Mejor para SUP y kitesurf.',
  },
  30: {
    bottom: 'Arena',
    waveType: 'Wind swell',
    bestConditions: 'Llevant fuerte del E, mar de 1–1.5 m',
    description: 'Playa larga al sur de Barcelona. Similar a Barceloneta pero más espacio. Con Llevant fuerte hay ola pequeña. También zona de windsurf.',
  },
  31: {
    bottom: 'Arena',
    waveType: 'Wind swell',
    bestConditions: 'Llevant del E-SE, mar de 1 m',
    description: 'Playa familiar con ola pequeña en temporales. Más conocida como destino turístico que como spot. Entorno con buenos restaurantes.',
  },
  32: {
    bottom: 'Arena',
    waveType: 'Wind swell',
    bestConditions: 'Llevant fuerte, mar de 1–1.5 m',
    description: 'Delta del Ebro, ecosistema único. Con temporales de Llevant hay ola en el margen sur. Zona ideal para kitesurf por la constancia del viento.',
  },
  33: {
    bottom: 'Arena',
    waveType: 'Wind swell',
    bestConditions: 'Levante del E, mar de 1 m',
    description: 'Playa larga con ola ocasional. Buena opción para iniciarse con olas pequeñas. En verano el viento térmico permite practicar kitesurf y windsurf.',
  },
  34: {
    bottom: 'Arena',
    waveType: 'Wind swell',
    bestConditions: 'Levante del E, mar de 1–1.5 m',
    description: 'Playa urbana de Valencia. Con Levante fuerte hay ola surfeable pequeña. Acceso excelente y muchos servicios. Principal spot de kitesurf de la Comunitat Valenciana.',
  },
  35: {
    bottom: 'Arena',
    waveType: 'Wind swell',
    bestConditions: 'Levante fuerte del E-SE, mar de 1–1.5 m',
    description: 'Playa extensa al sur de Alicante. Con Levante hay ola pequeña. Destino habitual de kitesurfistas alicantinos por el viento constante.',
  },
  36: {
    bottom: 'Arena',
    waveType: 'Wind swell / lagoon',
    bestConditions: 'Levante del E, viento constante',
    description: 'Franja de arena entre el Mar Menor y el Mediterráneo. Aguas planas en el interior (Mar Menor) y ola pequeña en el exterior. Zona clásica de windsurf.',
  },
  37: {
    bottom: 'Arena',
    waveType: 'Wind swell',
    bestConditions: 'Levante fuerte del E, mar de 1 m',
    description: 'Playa extensa en la costa de Almería. Con Levante hay ola pequeña. Más conocida como destino turístico; pocas infraestructuras para surf.',
  },
  38: {
    bottom: 'Arena y roca volcánica',
    waveType: 'Wind swell / reef',
    bestConditions: 'Levante del E-SE, mar de 1–1.5 m',
    description: 'Zona volcánica única en el Mediterráneo. Con Levante hay ola sobre roca. Entorno natural espectacular y aguas muy claras. Acceso por carretera de tierra.',
  },
  // ── Portugal ─────────────────────────────────────────────────────────────────
  39: {
    bottom: 'Arena (sobre cañón submarino)',
    waveType: 'Big wave / beach break',
    bestConditions: 'Mar del NW 3–10 m+, viento del E-NE',
    description: 'Famosa mundialmente por las olas gigantes del invierno. El cañón submarino concentra el oleaje hasta alturas record. En verano es una playa familiar tranquila. Solo para expertos en condiciones grandes.',
  },
  40: {
    bottom: 'Arena y roca',
    waveType: 'Beach break / reef break',
    bestConditions: 'Mar del W-NW 1.5–3 m, viento del NE-E',
    description: 'Supertubos, uno de los mejores beach breaks del mundo. Ola potente, hueca y rápida sobre arena. Sede del campeonato WSL. También hay spots de reef alrededor del cabo.',
  },
  41: {
    bottom: 'Roca',
    waveType: 'Reef break (múltiples spots)',
    bestConditions: 'Mar del NW 1.5–3 m, viento del NE-E',
    description: 'Reserva Mundial de Surf con 8 spots de clase mundial. Pedra Branca, Reef, Coxos y más. Olas sobre roca para surfers experimentados. El pueblo tiene gran tradición surfera.',
  },
  42: {
    bottom: 'Arena y roca',
    waveType: 'Beach break / reef break',
    bestConditions: 'Mar del W-SW 1.5–3 m, viento del N-NE',
    description: 'Extremo suroeste de Europa, en la confluencia del Atlántico. Vientos fuertes y mar constante. Varios spots en los acantilados. También muy bueno para kitesurf y windsurf.',
  },
  43: {
    bottom: 'Arena',
    waveType: 'Beach break',
    bestConditions: 'Mar del W-NW 1–2.5 m, viento del N-NE',
    description: 'Playa extensa al sur de Lisboa con múltiples picos y bancos de arena de calidad. Menos conocida que Ericeira o Peniche pero con muy buenas condiciones. Fácil acceso desde Lisboa.',
  },
  // ── Canarias ─────────────────────────────────────────────────────────────────
  44: {
    bottom: 'Arena volcánica',
    waveType: 'Beach break',
    bestConditions: 'Mar del SE 1–2 m; viento Alisio del NE para kitesurf/windsurf',
    description: 'Capital mundial del windsurf y referencia del kitesurf. El viento Alisio sopla casi todos los días del año. Hay ola con mar de SE. Organiza el Campeonato Mundial de Windsurf PWA.',
  },
  45: {
    bottom: 'Arena y arrecife natural (La Barra)',
    waveType: 'Reef break protegido',
    bestConditions: 'Mar del NW 1.5–2.5 m, viento del NE',
    description: 'Playa urbana de Las Palmas con un arrecife natural único (La Barra) que crea una laguna protegida. Excelente para aprender y para longboard. También hay ola fuera del arrecife.',
  },
  46: {
    bottom: 'Arena',
    waveType: 'Beach break potente',
    bestConditions: 'Mar del NW 1.5–3 m, viento del N (también para kitesurf)',
    description: 'Playa salvaje en un acantilado impresionante. Ola potente y consistente, no apta para principiantes. El viento del N es perfecto para kitesurf. Vistas al Risco de Famara.',
  },
  47: {
    bottom: 'Arena y roca',
    waveType: 'Beach break / lagoon',
    bestConditions: 'Mar del NW 1–2.5 m, viento del N-NW',
    description: 'Dos ambientes: playa abierta con ola al norte del pueblo y laguna tranquila al sur. Ideal para todos los niveles. Uno de los mejores spots del norte de Fuerteventura.',
  },
  48: {
    bottom: 'Arena',
    waveType: 'Aguas planas / lagoon',
    bestConditions: 'Viento Alisio del NE constante, 15–30 nudos',
    description: 'Playa de aguas planas y viento Alisio constante: el spot perfecto para kitesurf y windsurf. Sede del Campeonato del Mundo de Kitesurf. Sin ola significativa, puro viento.',
  },
}

export default SPOT_INFO
