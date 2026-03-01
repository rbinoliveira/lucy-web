import { z } from 'zod'

import { optionalString } from '@/shared/validations/optional-string.validation'
import { requiredString } from '@/shared/validations/required-string.validation'

export const prescriptionStatusEnum = z.enum([
  'active',
  'finished',
  'cancelled',
])

export const savePrescriptionSchema = z.object({
  id: optionalString({ field: 'id' }),
  patientId: requiredString({ field: 'paciente' }),
  patientEmail: requiredString({ field: 'e-mail do paciente' }),
  patientName: requiredString({ field: 'nome do paciente' }),
  medicineId: requiredString({ field: 'medicamento' }),
  medicineName: requiredString({ field: 'nome do medicamento' }),
  dosage: requiredString({ field: 'posologia' }),
  durationDays: z
    .union([z.number().int().min(0), z.string()])
    .optional()
    .nullable()
    .transform((v) => {
      if (v === '' || v === undefined || v === null) return undefined
      const n = Number(v)
      return Number.isNaN(n) ? undefined : n
    }),
  durationDescription: optionalString({ field: 'duração (texto)' }),
  notes: optionalString({ field: 'observações' }),
  ownerId: requiredString({ field: 'ownerId' }),
  status: prescriptionStatusEnum.optional(),
})

export type SavePrescriptionSchema = z.infer<typeof savePrescriptionSchema>

export const savePrescriptionFormSchema = savePrescriptionSchema.omit({
  id: true,
  ownerId: true,
  status: true,
})

export type SavePrescriptionFormSchema = z.infer<
  typeof savePrescriptionFormSchema
>

export const savePrescriptionUseCaseSchema = savePrescriptionSchema

export type SavePrescriptionUseCaseSchema = z.infer<
  typeof savePrescriptionUseCaseSchema
>
