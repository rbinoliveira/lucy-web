import { z } from 'zod'

let fileSchema:
  | ((
      maxSize: number,
    ) => z.ZodEffects<z.ZodType<File, z.ZodTypeDef, File>, File, File>)
  | null = null

if (typeof window !== 'undefined' && typeof File !== 'undefined') {
  fileSchema = (maxSize: number) =>
    z.instanceof(File).refine(
      (file) => {
        if (file.size > maxSize) {
          return false
        }
        return true
      },
      {
        message: `File must be less than ${maxSize / (1024 * 1024)}MB`,
      },
    )
}

type RequiredFileProps = {
  maxSizeInMB: number
}

export const requiredFile = ({ maxSizeInMB }: RequiredFileProps) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  const schema = fileSchema ? fileSchema(maxSizeInBytes) : z.any()

  return schema.or(
    z.object({
      url: z.string().min(1),
      name: z.string().min(1),
    }),
  )
}
