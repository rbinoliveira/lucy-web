import { getCookie } from 'cookies-next'

import { appCookies } from '@/application/_shared/constants/app-cookies.constant'

export async function getAuthCookies(): Promise<string | undefined> {
  const user = await getCookie(appCookies.USER_ID)
  return user
}
