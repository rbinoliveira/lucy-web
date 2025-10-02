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

  return toast('Error', {
    description: message ?? 'Um erro inesperado ocorreu',
  })
}
