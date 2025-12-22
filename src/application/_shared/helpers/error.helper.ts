import { AxiosError } from 'axios'
import { FirebaseError } from 'firebase/app'
import { toast } from 'sonner'

type ErrorType = {
  message?: string
  err?: any
}

export function handleError({ message, err }: ErrorType) {
  if (err && err.response?.data?.message && err.response?.status !== 500) {
    return toast.error(err.response.data.message)
  }

  if (
    err &&
    err instanceof FirebaseError &&
    err.code === 'auth/invalid-credential'
  ) {
    return toast.error('E-mail ou senha inválidos')
  }

  if (
    err &&
    err instanceof FirebaseError &&
    err.code === 'auth/email-already-in-use'
  ) {
    return toast.error(
      'E-mail já cadastrado, tente fazer login ou recupere sua senha',
    )
  }

  if (
    err &&
    err instanceof FirebaseError &&
    err.code === 'auth/weak-password'
  ) {
    return toast.error(
      'Senha fraca, sua senha deve ter pelo menos 6 caracteres',
    )
  }

  if (err instanceof AxiosError) {
    return toast.error(err.response?.data.error)
  }

  return toast.error(message ?? 'Um erro inesperado ocorreu', {
    description: 'Por favor, tente novamente',
  })
}
