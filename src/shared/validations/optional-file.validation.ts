import { z } from 'zod'

type OptionalFileProps = {
  maxSizeInMB: number
}

export const optionalFile = ({ maxSizeInMB }: OptionalFileProps) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024

  const fileSchema =
    typeof window !== 'undefined' && typeof File !== 'undefined'
      ? z.instanceof(File).refine((file) => file.size <= maxSizeInBytes, {
          message: `File must be less than ${maxSizeInMB}MB`,
        })
      : z.any()

  return fileSchema
    .or(
      z.object({
        url: z.string().min(1),
        name: z.string().min(1),
      }),
    )
    .nullable()
}
