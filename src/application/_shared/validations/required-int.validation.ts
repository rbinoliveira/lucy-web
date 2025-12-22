import { z } from 'zod'

type RequiredIntProps = {
  field: string
  min?: number
  max?: number
}

export const requiredInt = ({ field, min, max }: RequiredIntProps) => {
  const message = `${field} must be an integer${
    min !== undefined && max !== undefined
      ? ` between ${min} and ${max}`
      : min !== undefined
        ? ` greater than or equal to ${min}`
        : max !== undefined
          ? ` less than or equal to ${max}`
          : ''
  }`

  return z
    .string({
      required_error: `${field} é obrigatório`,
      invalid_type_error: `${field} é obrigatório`,
    })
    .refine((value) => /^-?\d+$/.test(value), {
      message: `${field} must be a valid integer`,
    })
    .transform((value) => {
      const parsedValue = parseInt(value, 10)
      return parsedValue
    })
    .refine(
      (value) =>
        (min !== undefined ? value >= min : true) &&
        (max !== undefined ? value <= max : true),
      { message },
    )
    .or(z.number())
}
