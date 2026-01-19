import { jwtDecode } from 'jwt-decode'
import { type NextRequest, NextResponse } from 'next/server'

import { PLATFORM_COOKIES } from '@/features/platform/constants/platform-cookies.constants'
import {
  platformRoutes,
  publicRoutes,
  unloggedRoutes,
} from '@/features/platform/constants/platform-routes.constants'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isStaticResource =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|css|js)$/)
  const isPublicRoute = publicRoutes.includes(pathname)

  if (isStaticResource || isPublicRoute) {
    return NextResponse.next()
  }

  const isUnloggedRoute = unloggedRoutes.includes(pathname)

  const refreshToken = request.cookies.get(
    PLATFORM_COOKIES.REFRESH_TOKEN,
  )?.value
  const accessToken = request.cookies.get(PLATFORM_COOKIES.ACCESS_TOKEN)?.value
  const kioskPage = request.cookies.get(PLATFORM_COOKIES.KIOSK_PAGE)?.value

  let userStatus: string | null = null
  if (accessToken) {
    const decodedJwtSub = jwtDecode(accessToken)?.sub
    if (decodedJwtSub) {
      const { status } = JSON.parse(decodedJwtSub)
      if (status) {
        userStatus = status
      }
    }
  }

  const userIsAuthenticated = accessToken && refreshToken
  const userIsActive = userStatus === 'active'

  if (
    pathname !== platformRoutes.subscribe &&
    userIsAuthenticated &&
    !userIsActive
  ) {
    return NextResponse.redirect(new URL(platformRoutes.subscribe, request.url))
  }

  if (isUnloggedRoute && userIsAuthenticated) {
    return NextResponse.redirect(new URL(platformRoutes.dashboard, request.url))
  }

  if (
    !isUnloggedRoute &&
    pathname !== platformRoutes.dashboard &&
    !pathname?.includes(platformRoutes.kiosk) &&
    kioskPage
  ) {
    return NextResponse.redirect(new URL(platformRoutes.kiosk, request.url))
  }

  if (!isUnloggedRoute && !userIsAuthenticated) {
    return NextResponse.redirect(new URL(platformRoutes.signIn, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
