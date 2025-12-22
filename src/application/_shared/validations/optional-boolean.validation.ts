import { z } from 'zod'

export const optionalBoolean = () => {
  return z.boolean().optional().nullable()
}
