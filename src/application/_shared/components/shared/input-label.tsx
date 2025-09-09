import { cn } from '@/application/_shared/libs/tw-merge'

type InputLabelProps = {
  htmlFor: string
  label: string | undefined
}

export function InputLabel({ htmlFor, label }: InputLabelProps) {
  return (
    <>
      {label && (
        <label
          htmlFor={htmlFor}
          className={cn(
            'whitespace-pre-line text-text-seven font-semibold text-sm',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          )}
        >
          {label}
        </label>
      )}
    </>
  )
}
