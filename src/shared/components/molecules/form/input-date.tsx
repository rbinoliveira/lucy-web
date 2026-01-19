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

import { InputError } from '@/shared/components/molecules/form/input-error'
import { toCalendarDate, toNativeDate } from '@/shared/helpers/date.helper'
import { cn } from '@/shared/libs/tw-merge'

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
                  'text-sm font-semibold whitespace-pre-line',
                  'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                )}
              >
                {label}
              </Label>
            )}

            <div className="relative w-full">
              {iconBefore && (
                <span
                  className={cn(svgClassName, 'pointer-events-none left-0')}
                >
                  {iconBefore}
                </span>
              )}

              <DateInput
                className={cn(
                  'react-aria-DateInput',
                  'border-border-one h-[50px] rounded-xl',
                  'flex w-full items-center',
                  'border bg-white',
                  iconBefore && 'pl-10',
                  iconAfter && 'pr-10',
                  !!error && 'border-danger-one',
                  isFocused && 'border-primary',
                  disabled && 'cursor-not-allowed opacity-50',
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
