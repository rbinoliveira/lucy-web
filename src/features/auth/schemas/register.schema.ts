import { z } from 'zod'

import { requiredEmail } from '@/shared/validations/required-email.validation'
import { requiredString } from '@/shared/validations/required-string.validation'

export const registerSchema = z
  .object({
    name: requiredString({ field: 'name' }),
    email: requiredEmail(),
    password: requiredString({ field: 'senha', min: 6 }),
    confirmPassword: requiredString({ field: 'confirmar senha' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type RegisterSchema = z.infer<typeof registerSchema>
