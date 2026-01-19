// ────────────────────────────────
// Environment Configuration
// ────────────────────────────────

import { z } from 'zod'

const client = z.object({
  NEXT_PUBLIC_API_URL: z.url().default('http://localhost:3334'),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('academy'),
})

const processEnv = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
}

const parsed = client.safeParse(processEnv)

if (parsed.success === false) {
  console.error('❌ Invalid environment variables:', parsed.error.issues)
  throw new Error('Invalid environment variables')
}

export const env = parsed.data
