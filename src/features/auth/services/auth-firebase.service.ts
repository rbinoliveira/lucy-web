import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import { toast } from 'sonner'

import { UserModel } from '@/features/auth/models/user.model'
import { LoginSchema } from '@/features/auth/schemas/login.schema'
import { RecoverPasswordSchema } from '@/features/auth/schemas/recover-password.schema'
import { RegisterSchema } from '@/features/auth/schemas/register.schema'
import { appRoutes } from '@/shared/constants/app-routes.constant'
import { addAuthCookies } from '@/shared/helpers/add-auth-cookies.helper'
import { deleteAuthCookies } from '@/shared/helpers/delete-auth-cookies.helper'
import { handleError } from '@/shared/helpers/error.helper'
import { auth, db, googleProvider } from '@/shared/libs/firebase'

export async function signInWithGoogle() {
  try {
    await signInWithPopup(auth, googleProvider)
  } catch (err) {
    handleError({ err })
  }
}

export async function sendPasswordReset(data: RecoverPasswordSchema) {
  try {
    await sendPasswordResetEmail(auth, data.email)
    toast.success('E-mail enviado com sucesso')
  } catch (err) {
    handleError({ err })
  }
}

export async function registerWithCredentials(data: RegisterSchema) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password,
    )

    await addAuthCookies({
      user: {
        id: userCredential.user.uid,
        email: data.email,
        name: data.name,
        role: 'dentist',
        photo: null,
        cro: null,
        phone: null,
        isActive: false,
        deletedAt: null,
      },
    })

    toast.success('Conta criada com sucesso')
  } catch (err) {
    handleError({ err })
  }
}

export async function signInWithCredentials(data: LoginSchema) {
  try {
    await signInWithEmailAndPassword(auth, data.email, data.password)
  } catch (err) {
    handleError({ err })
  }
}

export async function signOut() {
  try {
    await auth.signOut()
    await deleteAuthCookies()
    if (typeof window !== 'undefined') {
      window.location.href = appRoutes.signIn
    }
  } catch (err) {
    handleError({
      err,
    })
  }
}

export async function createPatient() {
  try {
    await Promise.resolve()
  } catch (err) {
    handleError({ err })
  }
}

export async function getUser(id: string): Promise<UserModel | null> {
  const snap = await getDoc(doc(db, 'users', id))
  const data = snap.data() as UserModel
  return snap.exists() ? data : null
}

export async function upsertUser(id: string, data: UserModel): Promise<void> {
  const docRef = doc(db, 'users', id)
  await setDoc(docRef, data, { merge: true })
}

export async function deleteUser(id: string): Promise<void> {
  const docRef = doc(db, 'users', id)
  await deleteDoc(docRef)
}
