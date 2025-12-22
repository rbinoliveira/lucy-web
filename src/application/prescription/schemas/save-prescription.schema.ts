import { z } from 'zod'

import { optionalString } from '@/application/_shared/validations/optional-string.validation'
import { requiredDate } from '@/application/_shared/validations/required-date.validation'
import { requiredEmail } from '@/application/_shared/validations/required-email.validation'
import { requiredString } from '@/application/_shared/validations/required-string.validation'

export const savePrescriptionSchema = z.object({
  id: optionalString({ field: 'id' }),
  name: requiredString({ field: 'nome' }),
  phone: requiredString({ field: 'telefone' }),
  dob: z.union([
    requiredDate({ field: 'data de nascimento' }),
    requiredString({ field: 'data de nascimento' }),
  ]),
  email: requiredEmail(),
  password: requiredString({ field: 'senha' }),
  ownerId: requiredString({ field: 'ownerId' }),
})

export type SavePrescriptionSchema = z.infer<typeof savePrescriptionSchema>

export const savePrescriptionFormSchema = savePrescriptionSchema.omit({
  password: true,
  ownerId: true,
})

export type SavePrescriptionFormSchema = z.infer<
  typeof savePrescriptionFormSchema
>

export const savePrescriptionUseCaseSchema = savePrescriptionSchema

export type SavePrescriptionUseCaseSchema = z.infer<
  typeof savePrescriptionUseCaseSchema
>
