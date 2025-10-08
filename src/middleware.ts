import { type NextRequest, NextResponse } from 'next/server'

import { appCookies } from '@/application/_shared/constants/app-cookies.constant'
import {
  appPublicRoutes,
  appRoutes,
} from '@/application/_shared/constants/app-routes.constant'
import { userSchema } from '@/application/auth/schemas/user.schema'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isStaticResource =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|css|js)$/)
  if (isStaticResource) {
    return NextResponse.next()
  }

  const atualPath = request.nextUrl.pathname
  const isRoutePublic = appPublicRoutes.includes(atualPath)
  const isAdminRoute = atualPath.startsWith('/medicamentos')

  const userCookie = request.cookies.get(appCookies.USER)?.value

  const userIsAuthenticated = !!userCookie

  if (userIsAuthenticated) {
    const user = JSON.parse(userCookie)
    const profileCompleted = userSchema.safeParse(user).success

    if (!profileCompleted && pathname !== appRoutes.completeProfile) {
      return NextResponse.redirect(
        new URL(appRoutes.completeProfile, request.url),
      )
    }

    if (isAdminRoute && user.role !== 'admin') {
      return NextResponse.redirect(new URL(appRoutes.dashboard, request.url))
    }

    if (
      isRoutePublic ||
      (profileCompleted && pathname === appRoutes.completeProfile)
    ) {
      return NextResponse.redirect(new URL(appRoutes.dashboard, request.url))
    }
  } else {
    if (!isRoutePublic) {
      return NextResponse.redirect(new URL(appRoutes.signIn, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
