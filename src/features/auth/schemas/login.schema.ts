import { z } from 'zod'

import { requiredEmail } from '@/shared/validations/required-email.validation'
import { requiredString } from '@/shared/validations/required-string.validation'

export const loginSchema = z.object({
  email: requiredEmail(),
  password: requiredString({ field: 'password' }),
})

export type LoginSchema = z.infer<typeof loginSchema>
