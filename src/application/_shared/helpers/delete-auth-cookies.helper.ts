import { deleteCookie } from 'cookies-next'

import { appCookies } from '@/application/_shared/constants/app-cookies.constant'

export async function deleteAuthCookies() {
  await deleteCookie(appCookies.USER)
}
