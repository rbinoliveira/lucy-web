import { z } from 'zod'

import { optionalString } from '@/application/_shared/validations/optional-string.validation'
import { requiredString } from '@/application/_shared/validations/required-string.validation'

export const profileSchema = z.object({
  name: requiredString({ field: 'Nome' }),
  cro: optionalString({ field: 'CRO' }),
  phone: optionalString({ field: 'Telefone' }),
})

export type ProfileSchema = z.infer<typeof profileSchema>
