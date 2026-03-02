'use client'

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react'
import { ChevronDown } from 'lucide-react'
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

export type PrimitiveInputSelectProps = {
  isErrored?: boolean
  variant?: 'base' | 'sm'
  options: { value: string | number; label: string }[]
  value: string | number
  onChange: (value: string | number) => void
  id: string
}

function PrimitiveInputSelect({
  isErrored,
  variant = 'base',
  options,
  value,
  onChange,
}: PrimitiveInputSelectProps) {
  const [isFocused, setIsFocused] = React.useState(false)

  const selectedValue =
    options.find((option) => option.value === value)?.label || value

  return (
    <Listbox value={value} onChange={onChange}>
      <ListboxButton
        className={cn(
          'relative flex w-full items-center justify-between gap-4 text-left',
          'h-[45px] text-sm',
          {
            'border-primary rounded-t-lg border-x-[1px] border-t-[1px]':
              isFocused,
            'border-border-one rounded-lg border-[1px]': !isFocused,
            '!border-danger rounded-lg border-[1px]': isErrored,
          },
          variant === 'base' ? 'px-4' : 'px-2',
        )}
      >
        {selectedValue}
        <ChevronDown
          className="group text-text-four pointer-events-none text-lg"
          aria-hidden="true"
        />
      </ListboxButton>
      <Transition
        as={React.Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterEnter={() => setIsFocused(true)}
        afterLeave={() => setIsFocused(false)}
      >
        <ListboxOptions
          anchor="bottom"
          transition
          className={cn(
            'rounded-b-radius w-(--button-width) border-x-[1px] border-b-[1px] bg-white [--anchor-gap:-1px] focus:outline-none',
            {
              'border-primary': isFocused,
              'border-primary-light': !isFocused,
              '!border-danger': isErrored,
            },
          )}
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className={({ selected, focus }) =>
                cn(
                  'group flex cursor-default items-center select-none',
                  'border-border-two first:border-t-[1px]',
                  'px-4 py-1 text-sm leading-[1.285714286]',
                  variant === 'base' ? 'px-4' : 'px-2',
                  selected && 'font-bold',
                  focus && 'bg-primary text-primary-contrast',
                )
              }
            >
              {option.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Transition>
    </Listbox>
  )
}

export type InputSelectProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  defaultValue?: PathValue<T, Path<T>>
  label?: string
  className?: string
  variant?: 'base' | 'sm'
  options: { value: string | number; label: string }[]
  onChange?: (value: string | number) => void
}

function InputSelect<T extends FieldValues>({
  name,
  control,
  defaultValue = '' as PathValue<T, Path<T>>,
  label,
  className,
  onChange,
  ...props
}: InputSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('flex w-full flex-col gap-2', className)}>
          <InputLabel label={label} htmlFor={name} />
          <PrimitiveInputSelect
            {...field}
            {...props}
            id={name}
            onChange={(value) => {
              field.onChange(value)
              onChange?.(value)
            }}
          />
          <InputError error={error} />
        </div>
      )}
    />
  )
}

export { InputSelect }
