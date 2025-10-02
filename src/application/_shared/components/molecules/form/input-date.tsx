'use client'

import { ptBR } from 'date-fns/locale/pt-BR'
import { Calendar } from 'lucide-react'
import * as React from 'react'
import ReactDatePicker, {
  DatePickerProps,
  registerLocale,
} from 'react-datepicker'
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
import { PrimitiveInputMaskedText } from '@/application/_shared/components/molecules/form/input-masked-text'
import { cn } from '@/application/_shared/libs/tw-merge'
registerLocale('pt-BR', ptBR)

export type PrimitiveInputDateProps = DatePickerProps & {
  isErrored?: boolean
  iconBefore?: React.ReactNode
  inputSize?: ExtendedInputDateProps['inputSize']
}

function PrimitiveInputDate({ ...props }: PrimitiveInputDateProps) {
  return <ReactDatePicker {...props} locale="pt-BR" dateFormat="P" />
}

export type ExtendedInputDateProps = {
  label?: string
  className?: string
  inputSize?: 'base' | 'lg'
}

export type InputDateProps<T extends FieldValues> = PrimitiveInputDateProps &
  ExtendedInputDateProps & {
    name: Path<T>
    control: Control<T>
    defaultValue?: PathValue<T, Path<T>>
  }

function InputDate<T extends FieldValues>({
  name,
  control,
  defaultValue = '' as PathValue<T, Path<T>>,
  label,
  className,
  inputSize = 'base',
  ...props
}: InputDateProps<T>) {
  const [open, setOpen] = React.useState(false)

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={cn('flex w-full flex-col gap-2', className)}>
          <InputLabel label={label} htmlFor={name} inputSize={inputSize} />
          <div className="flex w-full [&>div]:w-full [&>div:nth-child(2)]:w-0">
            <PrimitiveInputDate
              {...props}
              customInput={
                <PrimitiveInputMaskedText
                  elementAfter={
                    <Button variant="ghost" onClick={() => setOpen(true)}>
                      <Calendar />
                    </Button>
                  }
                  iconBefore={
                    <Calendar className="text-icon" fill="currentColor" />
                  }
                  className="w-full"
                  mask="date"
                />
              }
              className="w-full"
              id={name}
              isErrored={!!error}
              inputSize={inputSize}
              onChange={onChange}
              selected={value}
              open={open}
              onClickOutside={() => setOpen(false)}
              onSelect={(date) => {
                setOpen(false)
                onChange(date)
              }}
            />
          </div>
          <InputError error={error} />
        </div>
      )}
    />
  )
}

export { InputDate }
