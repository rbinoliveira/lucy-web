import { z } from 'zod'

type OptionalDecimalProps = {
  field: string
  min?: number
  max?: number
}

export const optionalDecimal = ({ field, min, max }: OptionalDecimalProps) => {
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
    .string()
    .nullable()
    .optional()
    .transform((value) => {
      if (value === null || value === undefined || value === '') {
        return null
      }

      const normalizedValue = value.replace(',', '.')
      const parsedValue = parseFloat(normalizedValue)
      return isNaN(parsedValue) || !isFinite(parsedValue) ? null : parsedValue
    })
    .refine(
      (value) =>
        (min !== undefined ? value === null || value >= min : true) &&
        (max !== undefined ? value === null || value <= max : true),
      { message },
    )
    .or(z.number())
}
