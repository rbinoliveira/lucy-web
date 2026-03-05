import { z } from 'zod'

import { optionalString } from '@/shared/validations/optional-string.validation'
import { requiredDate } from '@/shared/validations/required-date.validation'
import { requiredEmail } from '@/shared/validations/required-email.validation'
import { requiredString } from '@/shared/validations/required-string.validation'

const genderEnum = z.enum(['male', 'female', 'other'])

export const savePatientFormSchema = z.object({
  id: optionalString({ field: 'id' }),
  name: requiredString({ field: 'nome' }),
  phone: requiredString({ field: 'telefone' }),
  dob: z.union([
    requiredDate({ field: 'data de nascimento' }),
    requiredString({ field: 'data de nascimento' }),
  ]),
  gender: genderEnum,
  email: requiredEmail(),
  cpf: optionalString({ field: 'CPF' }),
})

export type SavePatientFormSchema = z.infer<typeof savePatientFormSchema>

export const savePatientUseCaseSchema = savePatientFormSchema.extend({
  ownerId: requiredString({ field: 'ownerId' }),
  nameNormalized: optionalString({ field: 'nameNormalized' }),
  phoneNormalized: optionalString({ field: 'phoneNormalized' }),
})

export type SavePatientUseCaseSchema = z.infer<typeof savePatientUseCaseSchema>
