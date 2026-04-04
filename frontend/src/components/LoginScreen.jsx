import { GoogleLogin } from '@react-oauth/google'

export default function LoginScreen({ onLogin }) {
  return (
    <div style={s.overlay}>
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoRow}>
          <svg viewBox="0 0 52 46" width="48" height="43" style={{ filter: 'drop-shadow(0 0 8px #22c55e99)' }}>
            <defs>
              <linearGradient id="login-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#22c55e" />
                <stop offset="50%"  stopColor="#eab308" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <path
              d="M 8,11 C 6,9 4,8 5,6 C 6,4 10,3 15,3 L 33,2 C 37,2 42,5 44,9 L 45,17 C 46,21 44,25 42,28 L 37,35 C 33,40 27,44 21,43 L 14,39 C 10,36 7,31 6,26 L 4,18 Z"
              fill="url(#login-grad)"
              fillOpacity="0.2"
              stroke="url(#login-grad)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M 8,11 L 6,26 L 14,39 L 18,40 L 16,30 L 10,22 L 9,14 Z"
              fill="none" stroke="#22c55e" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="2,2"
            />
            <circle cx="10" cy="42" r="1.2" fill="#eab308" fillOpacity="0.7" />
            <circle cx="13" cy="43" r="1"   fill="#eab308" fillOpacity="0.6" />
            <circle cx="16" cy="44" r="1"   fill="#eab308" fillOpacity="0.6" />
          </svg>
          <span style={s.appName}>WAVEPULSE</span>
        </div>

        <p style={s.tagline}>Previsión de surf · España, Portugal &amp; Canarias</p>

        <div style={s.divider} />

        <p style={s.prompt}>Inicia sesión para acceder</p>

        <div style={s.googleBtn}>
          <GoogleLogin
            onSuccess={onLogin}
            onError={() => console.error('Google login failed')}
            theme="filled_black"
            shape="rectangular"
            size="large"
            text="signin_with"
            locale="es"
          />
        </div>
      </div>
    </div>
  )
}

const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: '#0a1628',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  card: {
    background: '#111e35',
    border: '1px solid #1e3a5f',
    borderRadius: 16,
    padding: '40px 48px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
    minWidth: 340,
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: '0.12em',
    background: 'linear-gradient(to right, #22c55e, #eab308, #ef4444)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  tagline: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 28,
    textAlign: 'center',
  },
  divider: {
    width: '100%',
    height: 1,
    background: '#1e3a5f',
    marginBottom: 28,
  },
  prompt: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  googleBtn: {
    display: 'flex',
    justifyContent: 'center',
  },
}
