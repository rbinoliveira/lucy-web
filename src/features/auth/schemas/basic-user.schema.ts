import { z } from 'zod'

import { requiredEmail } from '@/shared/validations/required-email.validation'
import { requiredString } from '@/shared/validations/required-string.validation'

export const basicUserSchema = z.object({
  email: requiredEmail(),
  name: requiredString({ field: 'nome' }),
})

export type BasicUserSchema = z.infer<typeof basicUserSchema>
