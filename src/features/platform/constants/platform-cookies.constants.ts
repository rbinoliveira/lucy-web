import { env } from '@/features/platform/config/env'

export const PLATFORM_COOKIES = {
  REFRESH_TOKEN: `${env.NEXT_PUBLIC_APP_NAME}:refreshToken`,
  ACCESS_TOKEN: `${env.NEXT_PUBLIC_APP_NAME}:accessToken`,
  KIOSK_PAGE: `${env.NEXT_PUBLIC_APP_NAME}:kioskPage`,
  SELECTED_BRANCH: `${env.NEXT_PUBLIC_APP_NAME}:selectedBranch`,
  SIGN_UP: `${env.NEXT_PUBLIC_APP_NAME}:signup`,
}
