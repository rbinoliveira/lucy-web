import { cn } from '@/shared/libs/tw-merge'

type InputLabelProps = {
  htmlFor: string
  label: string | undefined
  inputSize?: 'base' | 'lg'
}

export function InputLabel({ htmlFor, label, inputSize }: InputLabelProps) {
  return (
    <>
      {label && (
        <label
          htmlFor={htmlFor}
          className={cn(
            'text-sm font-semibold whitespace-pre-line',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            inputSize === 'lg' && 'text-text-seven',
          )}
        >
          {label}
        </label>
      )}
    </>
  )
}
