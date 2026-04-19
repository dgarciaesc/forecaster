import { useState, useEffect } from 'react'

const MQ = window.matchMedia('(max-width: 767px)')

export function useMobile() {
  const [mobile, setMobile] = useState(MQ.matches)
  useEffect(() => {
    const handler = e => setMobile(e.matches)
    MQ.addEventListener('change', handler)
    return () => MQ.removeEventListener('change', handler)
  }, [])
  return mobile
}
