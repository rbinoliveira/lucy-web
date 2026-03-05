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
  const isPendingApprovalRoute = pathname === appRoutes.pendingApproval
  const userCookie = request.cookies.get(appCookies.USER)?.value

  let userIsAuthenticated = false
  let profileCompleted = false
  let isActive = false

  try {
    if (userCookie) {
      const user = JSON.parse(userCookie)
      userIsAuthenticated = !!user && !!user.id
      isActive = user.isActive === true

      if (userIsAuthenticated) {
        const parsed = userSchema.safeParse(user)
        profileCompleted = parsed.success
      }
    }
  } catch {
    userIsAuthenticated = false
    profileCompleted = false
    isActive = false
  }

  // Não autenticado tentando acessar rota protegida
  if (!isPublicRoute && !userIsAuthenticated) {
    return NextResponse.redirect(new URL(appRoutes.signIn, request.url))
  }

  if (userIsAuthenticated) {
    // Perfil incompleto → /completar-perfil
    if (!profileCompleted) {
      if (!isCompleteProfileRoute) {
        return NextResponse.redirect(
          new URL(appRoutes.completeProfile, request.url),
        )
      }
      return NextResponse.next()
    }

    // Perfil completo mas não aprovado → /aguardando-aprovacao
    if (!isActive) {
      if (!isPendingApprovalRoute) {
        return NextResponse.redirect(
          new URL(appRoutes.pendingApproval, request.url),
        )
      }
      return NextResponse.next()
    }

    // Aprovado tentando acessar rota pública ou de onboarding → /dashboard
    if (isPublicRoute || isCompleteProfileRoute || isPendingApprovalRoute) {
      return NextResponse.redirect(new URL(appRoutes.dashboard, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
