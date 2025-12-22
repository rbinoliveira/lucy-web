import { z } from 'zod'

type RequiredStringProps = {
  field: string
  min?: number
  max?: number
  customLengthMessage?: string
}

export const requiredString = ({
  min = 1,
  max,
  field,
  customLengthMessage,
}: RequiredStringProps) => {
  const minMessage =
    min === 1
      ? `${field} é obrigatório`
      : `${field} deve ser preenchido com pelo menos ${min} caracteres`
  const maxMessage = `${field} must have at most ${max} characters`

  let schema = z
    .string({
      required_error: `${field} é obrigatório`,
      invalid_type_error: `${field} é obrigatório`,
    })
    .trim()
    .min(min, { message: customLengthMessage || minMessage })

  if (max !== undefined) {
    schema = schema.max(max, {
      message: customLengthMessage || maxMessage,
    })
  }

  return schema
}
