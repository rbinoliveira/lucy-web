'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AtSign, Calendar, Check, Phone, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button } from '@/application/_shared/components/atoms/button'
import { FormCardFooter } from '@/application/_shared/components/molecules/form/form-card'
import { InputDate } from '@/application/_shared/components/molecules/form/input-date'
import { InputMaskedText } from '@/application/_shared/components/molecules/form/input-masked-text'
import { InputText } from '@/application/_shared/components/molecules/form/input-text'
import { convertToNumberDate } from '@/application/_shared/helpers/date.helper'
import { useAuth } from '@/application/auth/hooks/auth.hook'
import { PatientModel } from '@/application/patient/models/patient.model'
import {
  SavePatientFormSchema,
  savePatientFormSchema,
} from '@/application/patient/schemas/save-patient.schema'
import { CreatePatientService } from '@/application/patient/service/create-patient.service'
import { UpdatePatientService } from '@/application/patient/service/update-patient.service'

type SavePatientFormProps = {
  patient?: PatientModel
}

export function SavePatientForm({ patient }: SavePatientFormProps) {
  const { control, handleSubmit } = useForm<SavePatientFormSchema>({
    resolver: zodResolver(savePatientFormSchema),
    defaultValues: patient,
  })

  const pathname = usePathname()
  const isEditPage = pathname.includes('editar')

  const { user } = useAuth()
  const { mutate: createPatient } = CreatePatientService({})
  const { mutate: updatePatient } = UpdatePatientService({})

  async function onSubmit(data: SavePatientFormSchema) {
    const formattedData = {
      ...data,
      password: convertToNumberDate(data.dob),
      ownerId: user?.id ?? '',
    }
    isEditPage ? updatePatient(formattedData) : createPatient(formattedData)
  }

  return (
    <form className="flex flex-col mt-8 gap-6">
      <InputText
        placeholder="Ex: Maria da Silva Santos"
        label="Nome Completo"
        control={control}
        name="name"
        iconBefore={<User />}
      />
      <InputText
        placeholder="Ex: maria.silva.santos@gmail.com"
        label="E-mail"
        control={control}
        name="email"
        iconBefore={<AtSign />}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputMaskedText
          label="Telefone"
          mask="phone"
          control={control}
          name="phone"
          iconBefore={<Phone />}
          placeholder="(11) 99999-9999"
        />
        <InputDate
          label="Data de Nascimento"
          control={control}
          name="dob"
          iconBefore={<Calendar />}
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
        >
          <Check size={16} />
          Completar
        </Button>
      </FormCardFooter>
    </form>
  )
}
