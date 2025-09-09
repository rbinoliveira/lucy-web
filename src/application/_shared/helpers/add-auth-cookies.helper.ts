import { setCookie } from 'cookies-next'

import { appCookies } from '@/application/_shared/constants/app-cookies.constant'
import { User } from '@/application/auth/hooks/auth.hook'

type AddAuthCookiesProps = {
  user: User
}

export async function addAuthCookies({
  user,
}: AddAuthCookiesProps): Promise<void> {
  await setCookie(appCookies.USER_ID, user)
}
