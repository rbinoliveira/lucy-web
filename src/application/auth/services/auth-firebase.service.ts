import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithPopup,
} from 'firebase/auth'
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import { toast } from 'sonner'

import { addAuthCookies } from '@/application/_shared/helpers/add-auth-cookies.helper'
import { handleError } from '@/application/_shared/helpers/error.helper'
import { auth, db, googleProvider } from '@/application/_shared/libs/firebase'
import { UserModel } from '@/application/auth/models/user.model'
import { LoginSchema } from '@/application/auth/schemas/login.schema'
import { RecoverPasswordSchema } from '@/application/auth/schemas/recover-password.schema'
import { RegisterSchema } from '@/application/auth/schemas/register.schema'

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
        email: data.email,
        name: data.name,
        role: 'dentist',
        photo: '',
        id: userCredential.user.uid,
      },
    })

    toast.success('Conta criada com sucesso')
  } catch (err) {
    handleError({ err })
  }
}

export async function signInWithCredentials(data: LoginSchema) {
  try {
    await signInWithCredential(
      auth,
      EmailAuthProvider.credential(data.email, data.password),
    )
  } catch (err) {
    handleError({ err })
  }
}

export async function signOut() {
  try {
    await auth.signOut()
  } catch (err) {
    handleError({
      err,
    })
  }
}

export async function createPatient() {
  try {
    // Verify if user exists on authentication
    // if not exist, create it on authentication
    // verify if user exists on firestore
    // if not exist, create it on firestore
    // return user
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
