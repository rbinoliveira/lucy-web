import { z } from 'zod'

export const requiredBoolean = () => {
  return z.boolean()
}
