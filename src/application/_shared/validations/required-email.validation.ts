import { z } from 'zod'

export const requiredEmail = () => {
  return z
    .string({
      required_error: 'e-mail é obrigatório',
      invalid_type_error: 'e-mail é obrigatório',
    })
    .email({ message: 'Digite um e-mail válido' })
}
