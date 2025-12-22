import axios from 'axios'

import { envVars } from '@/application/_shared/config/env/env.mjs'

const api = axios.create({
  baseURL: envVars.NEXT_PUBLIC_VERCEL_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
