import { z } from 'zod'

import { optionalString } from '@/application/_shared/validations/optional-string.validation'
import { requiredString } from '@/application/_shared/validations/required-string.validation'

const pharmaceuticalFormEnum = z.enum([
  'solucao_oral',
  'suspensao_oral',
  'comprimido',
  'capsula',
  'pilula',
  'pastilha',
  'dragea',
  'xarope',
  'gotas',
  'pomada',
  'creme',
  'pasta',
  'spray',
])

const administrationRouteEnum = z.enum(['oral', 'sublingual', 'topica'])

const baseMedicineSchema = z.object({
  id: optionalString({ field: 'id' }),
  name: requiredString({ field: 'princípio ativo' }),
  dose: requiredString({ field: 'dose' }),
  pharmaceuticalForm: pharmaceuticalFormEnum,
  administrationRoute: administrationRouteEnum,
  quantity: z.coerce.number().min(1, 'Quantidade deve ser pelo menos 1'),
  intervalHours: z.coerce
    .number()
    .min(1, 'Intervalo deve ser pelo menos 1 hora'),
  durationDays: z.coerce.number().optional(),
  whilePain: z.boolean().optional(),
  defaultDosage: optionalString({ field: 'posologia' }),
})

export const saveMedicineFormSchema = baseMedicineSchema.refine(
  (data) => {
    if (!data.whilePain && !data.durationDays) {
      return false
    }
    return true
  },
  {
    message: 'Informe a duração em dias ou marque "enquanto houver dor"',
    path: ['durationDays'],
  },
)

export type SaveMedicineFormSchema = z.infer<typeof saveMedicineFormSchema>

export const saveMedicineUseCaseSchema = baseMedicineSchema.extend({
  ownerId: requiredString({ field: 'ownerId' }),
  nameNormalized: optionalString({ field: 'nameNormalized' }),
})

export type SaveMedicineUseCaseSchema = z.infer<
  typeof saveMedicineUseCaseSchema
>
