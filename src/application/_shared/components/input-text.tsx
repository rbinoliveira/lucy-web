'use client'

import { Eye, EyeOff } from 'lucide-react'
import * as React from 'react'
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form'

import { UI } from '@/application/_shared/components'
import { InputError } from '@/application/_shared/components/shared/input-error'
import { InputLabel } from '@/application/_shared/components/shared/input-label'
import { cn } from '@/application/_shared/libs/tw-merge'

export interface PrimitiveInputTextProps extends React.ComponentProps<'input'> {
  isErrored?: boolean
  iconBefore?: React.ReactNode
  iconAfter?: React.ReactNode
}

const svgClassName = cn(
  'mx-3 absolute top-1/2 -translate-y-1/2',
  '[&>*]:h-[1.125rem] [&>*]:w-[1.125rem] text-svg-placeholder',
)

const PrimitiveInputText = React.forwardRef<
  HTMLInputElement,
  PrimitiveInputTextProps
>(
  (
    { className, type = 'text', isErrored, iconBefore, iconAfter, ...props },
    ref,
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

    return (
      <div
        className={cn(
          'bg-white rounded-radius text-text-one border-2 flex w-full',
          'placeholder:text-text-two',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'border-border-one rounded-lg h-[60px] relative',
          isErrored && 'border-danger-one',
          isFocused && 'border-primary',
          className,
        )}
      >
        {iconBefore && (
          <span className={cn(svgClassName, 'left-0 pointer-events-none')}>
            {iconBefore}
          </span>
        )}
        <input
          {...props}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          type={
            type === 'password'
              ? isPasswordVisible
                ? 'text'
                : 'password'
              : type
          }
          className={cn(
            'focus:outline-none flex-1 px-3',
            iconBefore && 'pl-10',
            iconAfter && 'pr-10',
          )}
        />
        {iconAfter && type !== 'password' && (
          <span className={cn(svgClassName, 'right-0 pointer-events-none')}>
            {iconAfter}
          </span>
        )}
        {type === 'password' && (
          <UI.Button
            variant="ghost"
            className={cn(svgClassName, 'right-0')}
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? <EyeOff /> : <Eye />}
          </UI.Button>
        )}
      </div>
    )
  },
)

export type InputTextProps<T extends FieldValues> = PrimitiveInputTextProps & {
  name: Path<T>
  control: Control<T>
  defaultValue?: PathValue<T, Path<T>>
  label?: string
  className?: string
}

function InputText<T extends FieldValues>({
  name,
  control,
  defaultValue = '' as PathValue<T, Path<T>>,
  label,
  className,
  ...props
}: InputTextProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('flex w-full flex-col gap-2', className)}>
          <InputLabel label={label} htmlFor={name} />
          <PrimitiveInputText
            id={name}
            isErrored={!!error}
            {...field}
            {...props}
          />
          <InputError error={error} />
        </div>
      )}
    />
  )
}

export { InputText }
