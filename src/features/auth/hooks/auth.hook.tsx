'use client'

import {
  EmailAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

import { UserModel } from '@/features/auth/models/user.model'
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
  const [loading, setLoading] = useState(true)

  const pathname = usePathname()
  const router = useRouter()

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
      const parsedUserByCookies = userByCookies
        ? JSON.parse(userByCookies)
        : null
      const newUser: UserModel = {
        id: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        name: firebaseUser.displayName ?? parsedUserByCookies?.name ?? '',
        role: 'dentist',
        photo: firebaseUser.photoURL ?? '',
        status: 'pending',
      }

      await upsertUser(firebaseUser.uid, newUser)

      return newUser
    }

    return {
      id: userDocument.id,
      email: userDocument.email,
      name: userDocument.name,
      role: userDocument.role,
      photo: userDocument.photo,
      cro: userDocument.cro,
      phone: userDocument.phone,
      status: userDocument.status,
    }
  }

  async function setUserAsLoggedIn(userUpdated: UserModel | null) {
    if (userUpdated) {
      if (userUpdated.role !== 'admin' && userUpdated.role !== 'dentist') {
        await auth.signOut()
        handleError({
          message: 'Usuário já associado a uma conta de paciente',
        })
        return
      }

      if (userUpdated.status === 'rejected') {
        await auth.signOut()
        handleError({
          message: 'Sua conta foi rejeitada. Entre em contato com o suporte.',
        })
        return
      }

      await addAuthCookies({ user: userUpdated })
    } else {
      await deleteAuthCookies()
    }
    setUser(userUpdated)
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

      await setUserAsLoggedIn(userUpdated)

      setLoading(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (loading) {
      return
    }

    const isRoutePublic = appPublicRoutes.includes(pathname)
    if (isRoutePublic && user) {
      router.push(appRoutes.dashboard)
    }
    if (!isRoutePublic && !user) {
      router.push(appRoutes.signIn)
    }
  }, [user, pathname, router, loading])

  useEffect(() => {
    async function getUser() {
      const authCookie = await getAuthCookies()
      if (authCookie) {
        setUser(JSON.parse(authCookie))
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
