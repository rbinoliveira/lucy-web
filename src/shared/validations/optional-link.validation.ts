import { z } from 'zod'

type OptionalLinkProps = {
  field: string
}

export const optionalLink = ({ field }: OptionalLinkProps) => {
  return z
    .string()
    .nullable()
    .optional()
    .transform((value) => (!value ? null : value))
    .refine(
      (value) =>
        value === null || /^(https?:\/\/)[^\s$.?#].[^\s]*$/.test(value),
      { message: `${field} must be a valid URL` },
    )
}
