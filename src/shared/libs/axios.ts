import axios from 'axios'

import { envVars } from '@/shared/config/env/env.mjs'

const api = axios.create({
  baseURL:
    typeof window !== 'undefined'
      ? window.location.origin
      : envVars.NEXT_PUBLIC_VERCEL_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
