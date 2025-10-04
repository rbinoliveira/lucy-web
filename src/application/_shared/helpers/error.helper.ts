import { FirebaseError } from 'firebase/app'
import { toast } from 'sonner'

type ErrorType = {
  message?: string
  err?: any
}

export function handleError({ message, err }: ErrorType) {
  if (err && err.response?.data?.message && err.response?.status !== 500) {
    return toast('Error', {
      description: err.response.data.message,
    })
  }

  if (
    err &&
    err instanceof FirebaseError &&
    err.code === 'auth/invalid-credential'
  ) {
    return toast('Error', {
      description: 'E-mail ou senha inválidos',
    })
  }

  if (
    err &&
    err instanceof FirebaseError &&
    err.code === 'auth/email-already-in-use'
  ) {
    return toast('Error', {
      description:
        'E-mail já cadastrado, tente fazer login ou recupere sua senha',
    })
  }

  if (
    err &&
    err instanceof FirebaseError &&
    err.code === 'auth/weak-password'
  ) {
    return toast('Error', {
      description: 'Senha fraca, sua senha deve ter pelo menos 6 caracteres',
    })
  }

  console.log(err)

  return toast('Error', {
    description: message ?? 'Um erro inesperado ocorreu',
  })
}
