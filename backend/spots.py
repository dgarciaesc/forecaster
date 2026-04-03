# coast_facing: dirección hacia la que mira el mar desde la playa (de donde vienen las olas).
# El viento OFFSHORE viene de la dirección opuesta (coast_facing + 180°).
# Ej: Pantín mira al NW (315°) → viento offshore viene del SE (135°).

SPOTS = [
    # Galicia
    {"id": 1,  "name": "Pantín",            "region": "Galicia",    "lat": 43.7312, "lon": -7.9108, "coast_facing": 315},
    {"id": 2,  "name": "Valdoviño",         "region": "Galicia",    "lat": 43.6083, "lon": -8.1667, "coast_facing": 280},
    {"id": 3,  "name": "A Lanzada",         "region": "Galicia",    "lat": 42.4833, "lon": -8.8667, "coast_facing": 270},
    # Asturias
    {"id": 4,  "name": "Salinas",           "region": "Asturias",   "lat": 43.5778, "lon": -5.9717, "coast_facing": 355},
    {"id": 5,  "name": "Rodiles",           "region": "Asturias",   "lat": 43.5056, "lon": -5.4244, "coast_facing": 10},
    # Cantabria
    {"id": 6,  "name": "Somo",              "region": "Cantabria",  "lat": 43.4648, "lon": -3.7381, "coast_facing": 350},
    # País Vasco
    {"id": 7,  "name": "Zarautz",           "region": "País Vasco", "lat": 43.2848, "lon": -2.1742, "coast_facing": 340},
    {"id": 8,  "name": "Mundaka",           "region": "País Vasco", "lat": 43.4069, "lon": -2.6949, "coast_facing": 320},
    # Cádiz / Huelva
    {"id": 9,  "name": "El Palmar",         "region": "Cádiz",      "lat": 36.1483, "lon": -6.0158, "coast_facing": 255},
    {"id": 10, "name": "Conil",             "region": "Cádiz",      "lat": 36.2762, "lon": -6.0862, "coast_facing": 250},
    {"id": 11, "name": "Tarifa",            "region": "Cádiz",      "lat": 36.0143, "lon": -5.6044, "coast_facing": 175},
    {"id": 12, "name": "Valdevaqueros",     "region": "Cádiz",      "lat": 36.0500, "lon": -5.6833, "coast_facing": 210},
    {"id": 13, "name": "Los Caños de Meca", "region": "Cádiz",      "lat": 36.1900, "lon": -5.9500, "coast_facing": 225},
    {"id": 14, "name": "Mazagón",           "region": "Huelva",     "lat": 37.1333, "lon": -6.8167, "coast_facing": 195},
    # Mediterráneo
    {"id": 15, "name": "Roses",             "region": "Girona",     "lat": 42.2696, "lon":  3.1769, "coast_facing": 85},
    {"id": 16, "name": "L'Escala",          "region": "Girona",     "lat": 42.1167, "lon":  3.1333, "coast_facing": 95},
    {"id": 17, "name": "Sitges",            "region": "Barcelona",  "lat": 41.2275, "lon":  1.8111, "coast_facing": 140},
    {"id": 18, "name": "Dénia",             "region": "Alicante",   "lat": 38.8417, "lon":  0.1058, "coast_facing": 90},
    # Nuevos — Galicia
    {"id": 19, "name": "Razo",              "region": "A Coruña",   "lat": 43.2256, "lon": -8.8961, "coast_facing": 265},
    {"id": 20, "name": "Louro",             "region": "A Coruña",   "lat": 42.7883, "lon": -9.0672, "coast_facing": 255},
    # Nuevos — Asturias
    {"id": 21, "name": "Xagó",              "region": "Asturias",   "lat": 43.5897, "lon": -5.9072, "coast_facing": 345},
    {"id": 22, "name": "Berbes",            "region": "Asturias",   "lat": 43.4789, "lon": -5.0689, "coast_facing": 15},
    # Nuevos — Cantabria
    {"id": 23, "name": "Liencres",          "region": "Cantabria",  "lat": 43.4472, "lon": -3.9944, "coast_facing": 355},
    {"id": 24, "name": "Merón",             "region": "Cantabria",  "lat": 43.3833, "lon": -4.3833, "coast_facing": 340},
    # Nuevos — País Vasco
    {"id": 25, "name": "Sopelana",          "region": "País Vasco", "lat": 43.3906, "lon": -2.9803, "coast_facing": 350},
    {"id": 26, "name": "Zurriola",          "region": "País Vasco", "lat": 43.3261, "lon": -1.9759, "coast_facing": 335},
    # Nuevos — Sur atlántico
    {"id": 27, "name": "Bolonia",           "region": "Cádiz",      "lat": 36.0878, "lon": -5.7639, "coast_facing": 185},
    {"id": 28, "name": "El Rompido",        "region": "Huelva",     "lat": 37.2167, "lon": -7.1167, "coast_facing": 205},
    # Nuevos — Mediterráneo
    {"id": 29, "name": "Barceloneta",       "region": "Barcelona",  "lat": 41.3796, "lon":  2.1937, "coast_facing": 145},
    {"id": 30, "name": "Castelldefels",     "region": "Barcelona",  "lat": 41.2731, "lon":  1.9806, "coast_facing": 155},
    {"id": 31, "name": "Cambrils",          "region": "Tarragona",  "lat": 41.0683, "lon":  1.0594, "coast_facing": 130},
    {"id": 32, "name": "Delta de l'Ebre",   "region": "Tarragona",  "lat": 40.6500, "lon":  0.7167, "coast_facing": 110},
    {"id": 33, "name": "Benicàssim",        "region": "Castellón",  "lat": 40.0583, "lon":  0.0667, "coast_facing": 100},
    {"id": 34, "name": "Malvarrosa",        "region": "Valencia",   "lat": 39.4833, "lon": -0.3167, "coast_facing": 110},
    {"id": 35, "name": "Guardamar",         "region": "Alicante",   "lat": 38.0833, "lon": -0.6500, "coast_facing": 115},
    {"id": 36, "name": "La Manga",          "region": "Murcia",     "lat": 37.7000, "lon": -0.7167, "coast_facing":  90},
    {"id": 37, "name": "Roquetas de Mar",   "region": "Almería",    "lat": 36.7500, "lon": -2.6167, "coast_facing": 185},
    {"id": 38, "name": "Cabo de Gata",      "region": "Almería",    "lat": 36.7333, "lon": -2.1833, "coast_facing": 165},
    # Portugal
    {"id": 39, "name": "Nazaré",            "region": "Portugal",   "lat": 39.6019, "lon": -9.0701, "coast_facing": 270},
    {"id": 40, "name": "Peniche",           "region": "Portugal",   "lat": 39.3553, "lon": -9.3817, "coast_facing": 275},
    {"id": 41, "name": "Ericeira",          "region": "Portugal",   "lat": 38.9666, "lon": -9.4188, "coast_facing": 280},
    {"id": 42, "name": "Sagres",            "region": "Portugal",   "lat": 37.0167, "lon": -8.9500, "coast_facing": 250},
    {"id": 43, "name": "Costa da Caparica", "region": "Portugal",   "lat": 38.5667, "lon": -9.2333, "coast_facing": 265},
    # Canarias
    {"id": 44, "name": "El Médano",         "region": "Tenerife",   "lat": 28.0481, "lon":-16.5358, "coast_facing": 170},
    {"id": 45, "name": "Las Canteras",      "region": "Gran Canaria","lat": 28.1479, "lon":-15.4392, "coast_facing": 285},
    {"id": 46, "name": "Famara",            "region": "Lanzarote",  "lat": 29.1167, "lon":-13.5667, "coast_facing": 285},
    {"id": 47, "name": "El Cotillo",        "region": "Fuerteventura","lat": 28.6833,"lon":-14.0167, "coast_facing": 280},
    {"id": 48, "name": "Sotavento",         "region": "Fuerteventura","lat": 28.1167,"lon":-14.2500, "coast_facing": 130},
]

# Virtual sea points — used only for heatmap interpolation, not shown as markers/ranking
SEA_POINTS = [
    # Deep Atlantic off Galicia / Portugal
    {"id": 101, "lat": 44.0, "lon": -12.0, "coast_facing": 270},
    {"id": 102, "lat": 42.0, "lon": -13.5, "coast_facing": 270},
    {"id": 103, "lat": 40.0, "lon": -13.0, "coast_facing": 270},
    {"id": 104, "lat": 38.0, "lon": -12.0, "coast_facing": 270},
    {"id": 105, "lat": 36.5, "lon": -10.5, "coast_facing": 270},
    # Bay of Biscay
    {"id": 106, "lat": 46.0, "lon":  -4.0, "coast_facing": 180},
    {"id": 107, "lat": 45.5, "lon":  -7.0, "coast_facing": 180},
    {"id": 108, "lat": 44.5, "lon":  -9.5, "coast_facing": 270},
    # Strait of Gibraltar / Alboran
    {"id": 109, "lat": 35.8, "lon":  -5.5, "coast_facing": 270},
    {"id": 110, "lat": 36.2, "lon":  -3.0, "coast_facing": 180},
    {"id": 111, "lat": 35.5, "lon":  -1.0, "coast_facing": 180},
    # Western Mediterranean
    {"id": 112, "lat": 38.5, "lon":   3.0, "coast_facing":  90},
    {"id": 113, "lat": 40.5, "lon":   5.5, "coast_facing":  90},
    {"id": 114, "lat": 43.0, "lon":   4.5, "coast_facing":  90},
    {"id": 115, "lat": 41.5, "lon":   8.5, "coast_facing":  90},
    # Canarias open ocean
    {"id": 116, "lat": 29.5, "lon": -17.0, "coast_facing": 270},
    {"id": 117, "lat": 27.0, "lon": -16.0, "coast_facing": 270},
    {"id": 118, "lat": 25.5, "lon": -14.5, "coast_facing": 270},
    # Mid-Atlantic ridge area (very different swell)
    {"id": 119, "lat": 33.0, "lon": -16.0, "coast_facing": 270},
    {"id": 120, "lat": 35.0, "lon": -14.0, "coast_facing": 270},
]
