'use client'

import * as React from 'react'
import { DateField, DateInput, DateSegment, Label } from 'react-aria-components'
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form'

import { InputError } from '@/application/_shared/components/molecules/form/input-error'
import {
  toCalendarDate,
  toNativeDate,
} from '@/application/_shared/helpers/date.helper'
import { cn } from '@/application/_shared/libs/tw-merge'

const svgClassName = cn(
  'mx-3 absolute top-1/2 -translate-y-1/2',
  '[&>*]:h-[1.125rem] [&>*]:w-[1.125rem] text-icon',
)

export type ExtendedInputDateProps = {
  label?: string
  className?: string
}

export type InputDateProps<T extends FieldValues> = ExtendedInputDateProps & {
  name: Path<T>
  control: Control<T>
  defaultValue?: PathValue<T, Path<T>>
  iconBefore?: React.ReactNode
  iconAfter?: React.ReactNode
  disabled?: boolean
}

function InputDate<T extends FieldValues>({
  name,
  control,
  defaultValue = null as PathValue<T, Path<T>>,
  label,
  className,
  disabled,
  iconBefore,
  iconAfter,
}: InputDateProps<T>) {
  const [isFocused, setIsFocused] = React.useState(false)
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => {
        return (
          <DateField
            {...field}
            value={field.value ? toCalendarDate(field.value) : undefined}
            onChange={(dateValue) => {
              field.onChange(toNativeDate(dateValue))
            }}
            className={cn('flex w-full flex-col gap-2', className)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false)
              field.onBlur()
            }}
          >
            {label && (
              <Label
                className={cn(
                  'whitespace-pre-line font-semibold text-sm',
                  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                )}
              >
                {label}
              </Label>
            )}

            <div className="relative w-full">
              {iconBefore && (
                <span
                  className={cn(svgClassName, 'left-0 pointer-events-none')}
                >
                  {iconBefore}
                </span>
              )}

              <DateInput
                className={cn(
                  'react-aria-DateInput',
                  'border-border-one rounded-xl h-[50px]',
                  'flex items-center w-full',
                  'border bg-white',
                  iconBefore && 'pl-10',
                  iconAfter && 'pr-10',
                  !!error && 'border-danger-one',
                  isFocused && 'border-primary',
                  disabled && 'opacity-50 cursor-not-allowed',
                )}
              >
                {(segment) => <DateSegment segment={segment} />}
              </DateInput>

              {iconAfter && (
                <span className={cn(svgClassName, 'right-0 cursor-pointer')}>
                  {iconAfter}
                </span>
              )}
            </div>

            <InputError error={error} />
          </DateField>
        )
      }}
    />
  )
}

export { InputDate }
