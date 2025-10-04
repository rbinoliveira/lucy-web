import { z } from 'zod'

import { requiredDate } from '@/application/_shared/validations/required-date.validation'
import { requiredEmail } from '@/application/_shared/validations/required-email.validation'
import { requiredString } from '@/application/_shared/validations/required-string.validation'

export const savePatientSchema = z.object({
  name: requiredString({ field: 'nome' }),
  phone: requiredString({ field: 'telefone' }),
  dob: requiredDate({ field: 'data de nascimento' }),
  email: requiredEmail(),
})

export type SavePatientSchema = z.infer<typeof savePatientSchema>
