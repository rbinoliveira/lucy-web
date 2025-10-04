'use client'

import {
  EmailAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

import {
  appPublicRoutes,
  appRoutes,
} from '@/application/_shared/constants/app-routes.constant'
import { addAuthCookies } from '@/application/_shared/helpers/add-auth-cookies.helper'
import { deleteAuthCookies } from '@/application/_shared/helpers/delete-auth-cookies.helper'
import { handleError } from '@/application/_shared/helpers/error.helper'
import { generateRandomPassword } from '@/application/_shared/helpers/generate-password'
import { getAuthCookies } from '@/application/_shared/helpers/get-auth-cookies.helper'
import { auth } from '@/application/_shared/libs/firebase'
import {
  getDocument,
  upsertDocument,
} from '@/application/_shared/services/shared.service'

export type User = {
  id: string
  email: string
  name: string
  role: string
  photo?: string
  cro?: string
  phone?: string
}

type AuthContextType = {
  user: User | null
  updateUser: (userUpdated: User) => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
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
  ): Promise<User> {
    console.log(firebaseUser)
    const userDocument = await getDocument<User>('users', firebaseUser.uid)

    if (!userDocument) {
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        name: firebaseUser.displayName ?? '',
        role: 'admin',
        photo: firebaseUser.photoURL ?? '',
      }

      await upsertDocument<User>('users', firebaseUser.uid, newUser)

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
    }
  }

  async function setUserAsLoggedIn(userUpdated: User | null) {
    if (userUpdated) {
      if (userUpdated.role === 'admin') {
        await addAuthCookies({ user: userUpdated })
      } else {
        await auth.signOut()
        handleError({
          message: 'Usuário já associado a uma conta de paciente',
        })
      }
    } else {
      await deleteAuthCookies()
    }
    setUser(userUpdated)
  }

  function updateUser(userUpdated: User) {
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
