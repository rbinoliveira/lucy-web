import { z } from 'zod'

import { optionalString } from '@/shared/validations/optional-string.validation'
import { requiredDate } from '@/shared/validations/required-date.validation'
import { requiredString } from '@/shared/validations/required-string.validation'

const genderEnum = z.enum(['male', 'female', 'other'])

const addressSchema = z
  .object({
    street: optionalString({ field: 'rua' }),
    number: optionalString({ field: 'número' }),
    complement: optionalString({ field: 'complemento' }),
    neighborhood: optionalString({ field: 'bairro' }),
    city: optionalString({ field: 'cidade' }),
    state: optionalString({ field: 'estado' }),
    zipCode: optionalString({ field: 'CEP' }),
  })
  .optional()

export const savePatientFormSchema = z.object({
  id: optionalString({ field: 'id' }),
  name: requiredString({ field: 'nome' }),
  phone: requiredString({ field: 'telefone' }),
  dob: z.union([
    requiredDate({ field: 'data de nascimento' }),
    requiredString({ field: 'data de nascimento' }),
  ]),
  gender: genderEnum,
  email: requiredString({ field: 'email' }),
  cpf: optionalString({ field: 'CPF' }),
  susNumber: optionalString({ field: 'número do SUS' }),
  address: addressSchema,
})

export type SavePatientFormSchema = z.infer<typeof savePatientFormSchema>

export const savePatientUseCaseSchema = savePatientFormSchema.extend({
  ownerId: requiredString({ field: 'ownerId' }),
  nameNormalized: optionalString({ field: 'nameNormalized' }),
  phoneNormalized: optionalString({ field: 'phoneNormalized' }),
})

export type SavePatientUseCaseSchema = z.infer<typeof savePatientUseCaseSchema>
