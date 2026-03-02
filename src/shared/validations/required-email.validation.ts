import { z } from 'zod'

export const requiredEmail = () => {
  return z
    .string({
      message: 'e-mail é obrigatório',
    })
    .email({ message: 'Digite um e-mail válido' })
}
