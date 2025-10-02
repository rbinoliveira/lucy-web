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

import { InputError } from '@/application/_shared/components/molecules/form/input-error'
import { InputLabel } from '@/application/_shared/components/molecules/form/input-label'
import { cn } from '@/application/_shared/libs/tw-merge'

export interface PrimitiveInputSelectProps
  extends React.ComponentProps<'select'> {
  isErrored?: boolean
  variant?: 'base' | 'sm'
  options: { value: string | number; label: string }[]
}

function PrimitiveInputSelect({
  isErrored,
  variant = 'base',
  options,
}: PrimitiveInputSelectProps) {
  const [isFocused, setIsFocused] = React.useState(false)

  const [selected, setSelected] = React.useState(options[0])

  return (
    <Listbox value={selected} onChange={setSelected}>
      <ListboxButton
        className={cn(
          'flex items-center relative w-full text-left gap-4 justify-between',
          'text-sm h-[45px]',
          {
            'border-primary border-t-[1px] border-x-[1px] rounded-t-lg':
              isFocused,
            'border-primary-light border-[1px] rounded-lg': !isFocused,
            '!border-danger border-[1px] rounded-lg': isErrored,
          },
          variant === 'base' ? 'px-4' : 'px-2',
        )}
      >
        {selected.label}
        <ChevronDown
          className="group pointer-events-none text-lg text-text-four"
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
            '[--anchor-gap:-1px] bg-white border-b-[1px] border-x-[1px] w-(--button-width) rounded-b-radius focus:outline-none',
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
                  'first:border-t-[1px] border-border-two',
                  'text-sm leading-[1.285714286] px-4 py-1',
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

export type InputSelectProps<T extends FieldValues> =
  PrimitiveInputSelectProps & {
    name: Path<T>
    control: Control<T>
    defaultValue?: PathValue<T, Path<T>>
    label?: string
    className?: string
    variant?: 'base' | 'sm'
  }

function InputSelect<T extends FieldValues>({
  name,
  control,
  defaultValue = '' as PathValue<T, Path<T>>,
  label,
  className,
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
          <PrimitiveInputSelect id={name} {...field} {...props} />
          <InputError error={error} />
        </div>
      )}
    />
  )
}

export { InputSelect }
