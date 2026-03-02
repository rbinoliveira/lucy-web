import { cookies } from 'next/headers'

import { UserModel } from '@/features/auth/models/user.model'
import { appCookies } from '@/shared/constants/app-cookies.constant'

export async function getCurrentUserApi(): Promise<UserModel | null> {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get(appCookies.USER)?.value

    if (!userCookie) {
      return null
    }

    const user = JSON.parse(userCookie) as UserModel
    return user
  } catch {
    return null
  }
}
