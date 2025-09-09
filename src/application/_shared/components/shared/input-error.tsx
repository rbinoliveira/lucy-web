import { FieldError } from 'react-hook-form'

type InputErrorProps = {
  error: FieldError | undefined
  customError?: string
}

export function InputError({ error, customError }: InputErrorProps) {
  return (
    <>
      {(error?.message || (customError && error)) && (
        <span className="text-xs text-danger-one">
          {customError || error?.message}
        </span>
      )}
    </>
  )
}
