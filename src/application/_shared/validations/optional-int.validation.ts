import { z } from 'zod'

type OptionalIntProps = {
  field: string
  min?: number
  max?: number
}

export const optionalInt = ({ field, min, max }: OptionalIntProps) => {
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
    .string()
    .nullable()
    .optional()
    .transform((value) => {
      if (value === null || value === undefined || value === '') {
        return null
      }

      const normalizedValue = value.replace(',', '.')
      const parsedValue = parseFloat(normalizedValue)
      return isNaN(parsedValue) || !isFinite(parsedValue)
        ? null
        : Math.floor(parsedValue)
    })
    .refine(
      (value) =>
        (value === null || Number.isInteger(value)) &&
        (min !== undefined ? value === null || value >= min : true) &&
        (max !== undefined ? value === null || value <= max : true),
      { message },
    )
    .or(z.number().int())
}
