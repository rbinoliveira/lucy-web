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

import { Button } from '@/application/_shared/components/atoms/button'
import { InputError } from '@/application/_shared/components/molecules/form/input-error'
import { InputLabel } from '@/application/_shared/components/molecules/form/input-label'
import { cn } from '@/application/_shared/libs/tw-merge'

export interface PrimitiveInputTextProps extends React.ComponentProps<'input'> {
  isErrored?: boolean
  iconBefore?: React.ReactNode
  iconAfter?: React.ReactNode
  inputSize?: ExtendedInputTextProps['inputSize']
}

const svgClassName = cn(
  'mx-3 absolute top-1/2 -translate-y-1/2',
  '[&>*]:h-[1.125rem] [&>*]:w-[1.125rem] text-icon',
)

const PrimitiveInputText = React.forwardRef<
  HTMLInputElement,
  PrimitiveInputTextProps
>(
  (
    {
      className,
      type = 'text',
      inputSize,
      isErrored,
      iconBefore,
      iconAfter,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

    return (
      <div
        className={cn(
          'bg-white rounded-xl text-text-one flex w-full',
          'border-border-one h-[60px] relative',
          inputSize === 'lg' ? 'h-[60px] border-2' : 'h-[50px] border',
          isErrored && 'border-danger-one',
          isFocused && 'border-primary',
          disabled && 'opacity-50 cursor-not-allowed border-border-one',
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
          disabled={disabled}
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
            'placeholder:text-placeholder',
            disabled && 'opacity-50 cursor-not-allowed',
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
          <Button
            variant="ghost"
            className={cn(svgClassName, 'right-0')}
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            icon={isPasswordVisible ? <EyeOff /> : <Eye />}
          />
        )}
      </div>
    )
  },
)

export type ExtendedInputTextProps = {
  label?: string
  className?: string
  inputSize?: 'base' | 'lg'
}

export type InputTextProps<T extends FieldValues> = PrimitiveInputTextProps &
  ExtendedInputTextProps & {
    name: Path<T>
    control: Control<T>
    defaultValue?: PathValue<T, Path<T>>
  }

function InputText<T extends FieldValues>({
  name,
  control,
  defaultValue = '' as PathValue<T, Path<T>>,
  label,
  className,
  inputSize = 'base',
  ...props
}: InputTextProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('flex w-full flex-col gap-2', className)}>
          <InputLabel label={label} htmlFor={name} inputSize={inputSize} />
          <PrimitiveInputText
            id={name}
            isErrored={!!error}
            inputSize={inputSize}
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
