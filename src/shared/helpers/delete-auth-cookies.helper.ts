import { deleteCookie } from 'cookies-next'

import { appCookies } from '@/shared/constants/app-cookies.constant'

export async function deleteAuthCookies() {
  await deleteCookie(appCookies.USER)
}
