import { z } from 'zod'

import { requiredEmail } from '@/application/_shared/validations/required-email.validation'

export const recoverPasswordSchema = z.object({
  email: requiredEmail(),
})

export type RecoverPasswordSchema = z.infer<typeof recoverPasswordSchema>
