import { z } from 'zod'

type OptionalStringProps = {
  field: string
  min?: number
  max?: number
  customLengthMessage?: string
}

export const optionalString = ({
  min = 1,
  max,
  field,
  customLengthMessage,
}: OptionalStringProps) => {
  const minMessage =
    min === 1
      ? `${field} é obrigatório`
      : `${field} deve ser preenchido com pelo menos ${min} caracteres`
  const maxMessage = `${field} must have at most ${max} characters`

  const schema = z
    .string()
    .trim()
    .transform((val) => (val === '' ? null : val))
    .refine((val) => !val || val.length >= min, {
      message: customLengthMessage || minMessage,
    })
    .refine((val) => !val || (max !== undefined ? val.length <= max : true), {
      message: customLengthMessage || maxMessage,
    })
    .optional()
    .nullable()

  return schema
}
