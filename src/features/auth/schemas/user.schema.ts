import { z } from 'zod'

import { optionalString } from '@/shared/validations/optional-string.validation'
import { requiredEmail } from '@/shared/validations/required-email.validation'
import { requiredString } from '@/shared/validations/required-string.validation'

export const userSchema = z.object({
  id: optionalString({ field: 'id' }),
  email: requiredEmail(),
  name: requiredString({ field: 'nome' }),
  role: z.enum(['admin', 'dentist', 'patient']),
  photo: optionalString({ field: 'foto' }),
  cro: z
    .string()
    .trim()
    .regex(/^\d{4,7}$/, {
      message: 'CRO inválido — deve conter somente dígitos (4 a 7 caracteres).',
    }),
  phone: requiredString({
    field: 'telefone',
    min: 14,
    max: 15,
    customLengthMessage: 'Complete o telefone',
  }),
})

export type UserSchema = z.infer<typeof userSchema>
