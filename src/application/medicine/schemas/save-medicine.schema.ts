import { z } from 'zod'

import { optionalString } from '@/application/_shared/validations/optional-string.validation'
import { requiredDate } from '@/application/_shared/validations/required-date.validation'
import { requiredEmail } from '@/application/_shared/validations/required-email.validation'
import { requiredString } from '@/application/_shared/validations/required-string.validation'

export const saveMedicineSchema = z.object({
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

export type SaveMedicineSchema = z.infer<typeof saveMedicineSchema>

export const saveMedicineFormSchema = saveMedicineSchema.omit({
  password: true,
  ownerId: true,
})

export type SaveMedicineFormSchema = z.infer<typeof saveMedicineFormSchema>

export const saveMedicineUseCaseSchema = saveMedicineSchema

export type SaveMedicineUseCaseSchema = z.infer<
  typeof saveMedicineUseCaseSchema
>
