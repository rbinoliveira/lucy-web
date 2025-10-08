import { envVars } from '@/application/_shared/config/env/env.mjs'

export const appCookies = {
  USER: `${envVars.NEXT_PUBLIC_APP_NAME}_user`,
}
