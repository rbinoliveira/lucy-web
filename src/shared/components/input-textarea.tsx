'use client'

import * as React from 'react'
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form'

import { InputError } from '@/shared/components/input-error'
import { InputLabel } from '@/shared/components/input-label'
import { cn } from '@/shared/libs/tw-merge'

export type ExtendedInputTextareaProps = {
  label?: string
  className?: string
  inputSize?: 'base' | 'lg'
  rows?: number
}

export type InputTextareaProps<T extends FieldValues> =
  ExtendedInputTextareaProps & {
    name: Path<T>
    control: Control<T>
    defaultValue?: PathValue<T, Path<T>>
    placeholder?: string
    disabled?: boolean
  }

function InputTextarea<T extends FieldValues>({
  name,
  control,
  defaultValue = '' as PathValue<T, Path<T>>,
  label,
  className,
  inputSize = 'base',
  rows = 4,
  placeholder,
  disabled,
}: InputTextareaProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('flex w-full flex-col gap-2', className)}>
          <InputLabel label={label} htmlFor={name} inputSize={inputSize} />
          <textarea
            {...field}
            id={name}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            value={field.value ?? ''}
            className={cn(
              'border-border-one text-text-one placeholder:text-placeholder',
              'focus:border-primary focus:ring-primary',
              'w-full rounded-xl border px-4 py-3',
              'text-sm outline-none transition-colors resize-none',
              inputSize === 'lg' ? 'border-2' : 'border',
              error && 'border-danger-one',
            )}
          />
          <InputError error={error} />
        </div>
      )}
    />
  )
}

export { InputTextarea }
