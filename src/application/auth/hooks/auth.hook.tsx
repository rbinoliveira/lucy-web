'use client'

import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  appPublicRoutes,
  appRoutes,
} from '@/application/_shared/constants/app-routes.constant'
import { addAuthCookies } from '@/application/_shared/helpers/add-auth-cookies.helper'
import { deleteAuthCookies } from '@/application/_shared/helpers/delete-auth-cookies.helper'
import { handleError } from '@/application/_shared/helpers/error.helper'
import { generateRandomPassword } from '@/application/_shared/helpers/generate-password'
import { getAuthCookies } from '@/application/_shared/helpers/get-auth-cookies.helper'
import { auth, db, provider } from '@/application/_shared/libs/firebase'
import { LoginSchema } from '@/application/auth/schemas/login.schema'
import { RecoverPasswordSchema } from '@/application/auth/schemas/recover-password.schema'
import { RegisterSchema } from '@/application/auth/schemas/register.schema'

export type User = {
  id: string
  email: string
  name: string
  role: string
  photo: string
}

type AuthContextType = {
  user: User | null
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  signInWithCredentials: (data: LoginSchema) => Promise<void>
  recoverPassword: (data: RecoverPasswordSchema) => Promise<void>
  registerWithCredentials: (data: RegisterSchema) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const pathname = usePathname()
  const router = useRouter()

  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, provider)
    } catch (err) {
      handleError({ err })
    }
  }

  async function recoverPassword(data: RecoverPasswordSchema) {
    try {
      await sendPasswordResetEmail(auth, data.email)
      toast('Success', {
        description: 'E-mail enviado com sucesso',
      })
    } catch (err) {
      handleError({ err })
    }
  }

  async function registerWithCredentials(data: RegisterSchema) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      )
      const user = userCredential.user

      await updateProfile(user, {
        displayName: data.name,
      })

      toast('Success', {
        description: 'Conta criada com sucesso',
      })
    } catch (err) {
      handleError({ err })
    }
  }

  async function signInWithCredentials(data: LoginSchema) {
    try {
      await signInWithCredential(
        auth,
        EmailAuthProvider.credential(data.email, data.password),
      )
    } catch (err) {
      handleError({ err })
    }
  }

  async function linkToAuthProviders(user: FirebaseUser | null) {
    if (!user) {
      return
    }

    const hasEmailProvider = user.providerData.some(
      (p) => p.providerId === 'password',
    )
    if (!hasEmailProvider) {
      const email = user.email
      const password = generateRandomPassword()

      const credential = EmailAuthProvider.credential(email!, password)
      await linkWithCredential(user, credential)
    }
  }

  async function getOrCreateFirestoreUser(user: FirebaseUser): Promise<User> {
    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      const newUser: User = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || '',
        role: 'admin',
        photo: user.photoURL || '',
      }

      await setDoc(userRef, {
        ...newUser,
        createdAt: serverTimestamp(),
        uid: user.uid,
      })

      return newUser
    }

    const data = userSnap.data()!

    return {
      id: data.uid,
      email: data.email,
      name: data.name,
      role: data.role,
      photo: data.photo,
    }
  }

  async function signOut() {
    try {
      await auth.signOut()
    } catch (err) {
      handleError({
        err,
      })
    }
  }

  async function setUserAsLoggedIn(user: User | null) {
    if (user) {
      if (user.role === 'admin') {
        await addAuthCookies({ user })
      } else {
        await auth.signOut()
        handleError({
          message: 'Usuário já associado a uma conta de paciente',
        })
      }
    } else {
      await deleteAuthCookies()
    }
    setUser(user)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      let user = null

      await linkToAuthProviders(authUser)

      if (authUser) {
        user = await getOrCreateFirestoreUser(authUser)
      }

      await setUserAsLoggedIn(user)

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
        signInWithGoogle,
        signOut,
        signInWithCredentials,
        recoverPassword,
        registerWithCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
