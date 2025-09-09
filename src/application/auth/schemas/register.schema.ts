import { z } from 'zod'

import { requiredEmail } from '@/application/_shared/validations/required-email.validation'
import { requiredString } from '@/application/_shared/validations/required-string.validation'

export const registerSchema = z
  .object({
    name: requiredString({ field: 'name' }),
    email: requiredEmail(),
    password: requiredString({ field: 'password' }),
    confirmPassword: requiredString({ field: 'confirmPassword' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type RegisterSchema = z.infer<typeof registerSchema>
