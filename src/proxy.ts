import { type NextRequest, NextResponse } from 'next/server'

import { userSchema } from '@/features/auth/schemas/user.schema'
import { appCookies } from '@/shared/constants/app-cookies.constant'
import {
  appPublicRoutes,
  appRoutes,
} from '@/shared/constants/app-routes.constant'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isStaticResource =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|css|js)$/)

  if (isStaticResource) {
    return NextResponse.next()
  }

  const isPublicRoute = appPublicRoutes.includes(pathname)
  const isCompleteProfileRoute = pathname === appRoutes.completeProfile
  const userCookie = request.cookies.get(appCookies.USER)?.value

  let userIsAuthenticated = false
  let profileCompleted = false

  try {
    if (userCookie) {
      const user = JSON.parse(userCookie)
      userIsAuthenticated = !!user && !!user.id

      if (userIsAuthenticated) {
        const parsed = userSchema.safeParse(user)
        profileCompleted = parsed.success
      }
    }
  } catch {
    userIsAuthenticated = false
    profileCompleted = false
  }

  if (!isPublicRoute && !isCompleteProfileRoute && !userIsAuthenticated) {
    return NextResponse.redirect(new URL(appRoutes.signIn, request.url))
  }

  if (userIsAuthenticated && !profileCompleted) {
    if (pathname !== appRoutes.completeProfile) {
      return NextResponse.redirect(
        new URL(appRoutes.completeProfile, request.url),
      )
    }
    return NextResponse.next()
  }

  if (userIsAuthenticated && profileCompleted) {
    if (isPublicRoute || isCompleteProfileRoute) {
      return NextResponse.redirect(new URL(appRoutes.dashboard, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
