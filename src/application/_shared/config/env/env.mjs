import { z } from 'zod'

const server = z.object({
  GCP_SERVICE_ACCOUNT: z.string().min(1),
  FIREBASE_STORAGE_BUCKET: z.string().min(1),
})

const client = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().min(1),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_VERCEL_URL: z.string().min(1),
})

const processEnv = {
  GCP_SERVICE_ACCOUNT: process.env.GCP_SERVICE_ACCOUNT,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
}

const merged = server.merge(client)

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let envVars = /** @type {MergedOutput} */ (process.env)

const skip =
  !!process.env.SKIP_ENV_VALIDATION &&
  process.env.SKIP_ENV_VALIDATION !== 'false' &&
  process.env.SKIP_ENV_VALIDATION !== '0'
if (!skip) {
  const isServer = typeof window === 'undefined'

  const parsed = /** @type {MergedSafeParseReturn} */ (
    isServer ? merged.safeParse(processEnv) : client.safeParse(processEnv)
  )

  if (parsed.success === false) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    )
    throw new Error('Invalid environment variables')
  }

  envVars = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined
      if (!isServer && !prop.startsWith('NEXT_PUBLIC_'))
        throw new Error(
          process.env.NODE_ENV === 'production'
            ? '❌ Attempted to access a server-side environment variable on the client'
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`,
        )
      return target[/** @type {keyof typeof target} */ (prop)]
    },
  })
}

export { envVars }
