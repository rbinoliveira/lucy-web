import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { toast } from 'sonner'

import { handleError } from '@/application/_shared/helpers/error.helper'
import { auth, googleProvider } from '@/application/_shared/libs/firebase'
import { LoginSchema } from '@/application/auth/schemas/login.schema'
import { RecoverPasswordSchema } from '@/application/auth/schemas/recover-password.schema'
import { RegisterSchema } from '@/application/auth/schemas/register.schema'

async function signInWithGoogle() {
  try {
    await signInWithPopup(auth, googleProvider)
  } catch (err) {
    handleError({ err })
  }
}

async function sendPasswordReset(data: RecoverPasswordSchema) {
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

    await updateProfile(userCredential.user, {
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

async function signOut() {
  try {
    await auth.signOut()
  } catch (err) {
    handleError({
      err,
    })
  }
}

async function createPatient() {
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

export {
  signInWithGoogle,
  sendPasswordReset,
  registerWithCredentials,
  signInWithCredentials,
  signOut,
}
