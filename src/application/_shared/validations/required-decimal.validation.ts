import { z } from 'zod'

type RequiredDecimalProps = {
  field: string
  min?: number
  max?: number
}
export const requiredDecimal = ({ field, min, max }: RequiredDecimalProps) => {
  const message = `${field} must be a number${
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
    .transform((value) => {
      const normalizedValue = value.replace(',', '.')
      const parsedValue = parseFloat(normalizedValue)
      if (isNaN(parsedValue) || !isFinite(parsedValue)) {
        return 0
      }
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
