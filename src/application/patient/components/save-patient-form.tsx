'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AtSign, Calendar, Check, Phone, User } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/application/_shared/components/atoms/button'
import { FormCardFooter } from '@/application/_shared/components/molecules/form/form-card'
import { InputDate } from '@/application/_shared/components/molecules/form/input-date'
import { InputMaskedText } from '@/application/_shared/components/molecules/form/input-masked-text'
import { InputText } from '@/application/_shared/components/molecules/form/input-text'
import { convertToNumberDate } from '@/application/_shared/helpers/date.helper'
import {
  SavePatientSchema,
  savePatientSchema,
} from '@/application/patient/schemas/save-patient.schema'

export function SavePatientForm() {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SavePatientSchema>({
    resolver: zodResolver(savePatientSchema),
  })

  function onSubmit(data: SavePatientSchema) {
    const formattedData = { ...data, password: convertToNumberDate(data.dob) }
    console.log(formattedData)
  }

  return (
    <form className="flex flex-col mt-8 gap-6">
      <InputText
        placeholder="Ex: Maria da Silva Santos"
        label="Nome Completo"
        control={control}
        name="name"
        iconBefore={<User className="text-icon" fill="currentColor" />}
      />
      <InputText
        placeholder="Ex: maria.silva.santos@gmail.com"
        label="E-mail"
        control={control}
        name="email"
        iconBefore={<AtSign className="text-icon" />}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputMaskedText
          label="Telefone"
          mask="phone"
          control={control}
          name="phone"
          iconBefore={<Phone className="text-icon" fill="currentColor" />}
          placeholder="(11) 99999-9999"
        />
        <InputDate
          label="Data de Nascimento"
          control={control}
          name="dob"
          iconBefore={<Calendar className="text-icon" fill="currentColor" />}
        />
      </div>
      <FormCardFooter>
        <Button variant="secondary" className="max-w-[116px]">
          Cancelar
        </Button>
        <Button
          variant="primary"
          className="max-w-[205px]"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          <Check size={16} />
          Completar
        </Button>
      </FormCardFooter>
    </form>
  )
}
