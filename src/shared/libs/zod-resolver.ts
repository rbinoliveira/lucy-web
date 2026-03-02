import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form'
import type { ZodError, ZodSchema } from 'zod'

function parseZodErrors<T extends FieldValues>(
  error: ZodError,
): FieldErrors<T> {
  const errors: FieldErrors<T> = {}

  for (const issue of error.issues) {
    const path = issue.path.join('.')
    if (path) {
      ;(errors as Record<string, { type: string; message: string }>)[path] = {
        type: 'validation',
        message: issue.message,
      }
    }
  }

  return errors
}

export function zodResolver<T extends FieldValues>(
  schema: ZodSchema<T>,
): Resolver<T> {
  return async (values) => {
    const result = schema.safeParse(values)

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      }
    }

    return {
      values: {},
      errors: parseZodErrors<T>(result.error),
    }
  }
}
