import { setCookie } from 'cookies-next'

import { UserModel } from '@/features/auth/models/user.model'
import { appCookies } from '@/shared/constants/app-cookies.constant'

type AddAuthCookiesProps = {
  user: UserModel
}

export async function addAuthCookies({
  user,
}: AddAuthCookiesProps): Promise<void> {
  await setCookie(appCookies.USER, user)
}
