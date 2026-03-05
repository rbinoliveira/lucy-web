'use client'

import {
  EmailAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { UserModel } from '@/features/auth/models/user.model'
import { userSchema } from '@/features/auth/schemas/user.schema'
import {
  getUser,
  upsertUser,
} from '@/features/auth/services/auth-firebase.service'
import {
  appPublicRoutes,
  appRoutes,
} from '@/shared/constants/app-routes.constant'
import { addAuthCookies } from '@/shared/helpers/add-auth-cookies.helper'
import { deleteAuthCookies } from '@/shared/helpers/delete-auth-cookies.helper'
import { handleError } from '@/shared/helpers/error.helper'
import { generateRandomPassword } from '@/shared/helpers/generate-password'
import { getAuthCookies } from '@/shared/helpers/get-auth-cookies.helper'
import { auth } from '@/shared/libs/firebase'

type AuthContextType = {
  user: UserModel | null
  updateUser: (userUpdated: UserModel) => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserModel | null>(null)
  const previousUserRef = useRef<UserModel | null>(null)
  const hasRedirectedRef = useRef(false)

  async function linkToAuthProviders(firebaseUser: FirebaseUser | null) {
    if (!firebaseUser) {
      return
    }

    const hasEmailProvider = firebaseUser.providerData.some(
      (p) => p.providerId === 'password',
    )
    if (!hasEmailProvider) {
      const email = firebaseUser.email
      const password = generateRandomPassword()

      const credential = EmailAuthProvider.credential(email!, password)
      await linkWithCredential(firebaseUser, credential)
    }
  }

  async function getOrCreateFirestoreUser(
    firebaseUser: FirebaseUser,
  ): Promise<UserModel> {
    const userDocument = await getUser(firebaseUser.uid)

    if (!userDocument) {
      const userByCookies = await getAuthCookies()
      let parsedUserByCookies: { name?: string } | null = null
      if (userByCookies) {
        try {
          parsedUserByCookies = JSON.parse(userByCookies)
        } catch {
          parsedUserByCookies = null
        }
      }
      const newUser: UserModel = {
        id: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        name: firebaseUser.displayName ?? parsedUserByCookies?.name ?? '',
        role: 'dentist',
        photo: firebaseUser.photoURL ?? null,
        cro: null,
        phone: null,
        isActive: false,
        deletedAt: null,
      }

      await upsertUser(firebaseUser.uid, newUser)

      return newUser
    }

    return {
      id: userDocument.id,
      email: userDocument.email,
      name: userDocument.name,
      role: userDocument.role,
      photo: userDocument.photo ?? null,
      cro: userDocument.cro ?? null,
      phone: userDocument.phone ?? null,
      isActive: userDocument.isActive,
      deletedAt: userDocument.deletedAt ?? null,
    }
  }

  async function setUserAsLoggedIn(userUpdated: UserModel | null) {
    if (userUpdated) {
      if (userUpdated.role !== 'dentist') {
        await auth.signOut()
        await deleteAuthCookies()
        handleError({
          message:
            userUpdated.role === 'admin'
              ? 'Acesso restrito. Use o painel administrativo.'
              : 'Usuário já associado a uma conta de paciente',
        })
        return
      }

      if (userUpdated.deletedAt) {
        await auth.signOut()
        await deleteAuthCookies()
        handleError({
          message: 'Sua conta foi desativada. Entre em contato com o suporte.',
        })
        return
      }

      await addAuthCookies({ user: userUpdated })
      setUser(userUpdated)
    } else {
      await deleteAuthCookies()
      setUser(null)
    }
  }

  function updateUser(userUpdated: UserModel) {
    setUser(userUpdated)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      let userUpdated = null

      await linkToAuthProviders(authUser)

      if (authUser) {
        userUpdated = await getOrCreateFirestoreUser(authUser)
      }

      const previousUser = previousUserRef.current
      const userChanged = previousUser?.id !== userUpdated?.id

      await setUserAsLoggedIn(userUpdated)

      previousUserRef.current = userUpdated

      if (
        typeof window !== 'undefined' &&
        userChanged &&
        !hasRedirectedRef.current
      ) {
        const currentPath = window.location.pathname
        const hasReloadedAfterLogin = sessionStorage.getItem('auth_reload_done')

        if (userUpdated && !previousUser) {
          const profileCompleted = userSchema.safeParse(userUpdated).success
          const isOnCorrectRoute = profileCompleted
            ? currentPath === appRoutes.dashboard
            : currentPath === appRoutes.completeProfile

          if (
            !hasReloadedAfterLogin &&
            (appPublicRoutes.includes(currentPath) || !isOnCorrectRoute)
          ) {
            hasRedirectedRef.current = true
            sessionStorage.setItem('auth_reload_done', 'true')
            setTimeout(() => {
              window.location.reload()
            }, 100)
          } else if (hasReloadedAfterLogin) {
            sessionStorage.removeItem('auth_reload_done')
          }
        } else if (!userUpdated && previousUser) {
          sessionStorage.removeItem('auth_reload_done')
          if (currentPath !== appRoutes.signIn) {
            hasRedirectedRef.current = true
            window.location.href = appRoutes.signIn
          }
        }
      }
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    async function getUser() {
      const authCookie = await getAuthCookies()
      if (!authCookie) return
      try {
        setUser(JSON.parse(authCookie))
      } catch {
        await deleteAuthCookies()
        setUser(null)
      }
    }

    getUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
