'use client'

import React from 'react'
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form'
import { withMask } from 'use-mask-input'

import { InputError } from '@/application/_shared/components/molecules/form/input-error'
import { InputLabel } from '@/application/_shared/components/molecules/form/input-label'
import { cn } from '@/application/_shared/libs/tw-merge'

export interface PrimitiveInputMaskedTextProps {
  isErrored?: boolean
  iconBefore?: React.ReactNode
  elementAfter?: React.ReactNode
  inputSize?: ExtendedInputTextProps['inputSize']
  className?: string
  mask?: 'only-numbers' | 'phone' | 'date'
  id?: string
}

const svgClassName = cn(
  'mx-3 absolute top-1/2 -translate-y-1/2',
  '[&>*]:h-[1.125rem] [&>*]:w-[1.125rem] text-svg-placeholder [&_svg]:h-[1.125rem] [&_svg]:w-[1.125rem]',
)

export const PrimitiveInputMaskedText = React.forwardRef<
  HTMLInputElement,
  PrimitiveInputMaskedTextProps
>(
  (
    {
      className,
      inputSize,
      isErrored,
      iconBefore,
      elementAfter,
      mask,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)

    const setInputRef = React.useCallback(
      (el: HTMLInputElement | null) => {
        if (!el) return
        switch (mask) {
          case 'only-numbers':
            withMask('999999999', {
              placeholder: '',
              showMaskOnFocus: false,
              showMaskOnHover: false,
            })(el)
            break
          case 'phone':
            withMask(['(99) 9999-9999', '(99) 99999-9999'], {
              placeholder: '',
              showMaskOnFocus: false,
              showMaskOnHover: false,
            })(el)
            break
          case 'date':
            withMask('99/99/9999', {
              placeholder: '',
              showMaskOnFocus: false,
              showMaskOnHover: false,
            })(el)
            break
        }

        if (typeof ref === 'function') {
          ref(el)
        } else if (ref) {
          ;(ref as React.MutableRefObject<HTMLInputElement | null>).current = el
        }
      },
      [mask, ref],
    )

    return (
      <div
        className={cn(
          'bg-white rounded-radius text-text-one flex w-full',
          'placeholder:text-text-two',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'border-border-one rounded-lg h-[60px] relative',
          inputSize === 'lg' ? 'h-[60px] border-2' : 'h-[50px] border',
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
          ref={setInputRef}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'focus:outline-none flex-1 px-3',
            iconBefore && 'pl-10',
            elementAfter && 'pr-10',
          )}
        />
        {elementAfter && (
          <span className={cn(svgClassName, 'right-0')}>{elementAfter}</span>
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

export type InputMaskedTextProps<T extends FieldValues> =
  PrimitiveInputMaskedTextProps &
    ExtendedInputTextProps & {
      name: Path<T>
      control: Control<T>
      defaultValue?: PathValue<T, Path<T>>
      placeholder?: string
    }

function InputMaskedText<T extends FieldValues>({
  name,
  control,
  defaultValue = '' as PathValue<T, Path<T>>,
  label,
  className,
  inputSize = 'base',
  ...props
}: InputMaskedTextProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('flex w-full flex-col gap-2', className)}>
          <InputLabel label={label} htmlFor={name} inputSize={inputSize} />
          <PrimitiveInputMaskedText
            {...field}
            {...props}
            isErrored={!!error}
            id={name}
          />
          <InputError error={error} />
        </div>
      )}
    />
  )
}

export { InputMaskedText }
