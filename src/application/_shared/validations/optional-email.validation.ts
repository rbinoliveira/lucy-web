import { z } from 'zod'

export const optionalEmail = () => {
  return z
    .union([
      z.string().email({ message: 'Email must be valid' }),
      z.literal(''),
      z.null(),
    ])
    .optional()
}
