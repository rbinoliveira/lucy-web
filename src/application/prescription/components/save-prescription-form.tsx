'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AtSign, Calendar, Check, Phone, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button } from '@/application/_shared/components/atoms/button'
import { FormCardFooter } from '@/application/_shared/components/molecules/form/form-card'
import { InputDate } from '@/application/_shared/components/molecules/form/input-date'
import { InputMaskedText } from '@/application/_shared/components/molecules/form/input-masked-text'
import { InputText } from '@/application/_shared/components/molecules/form/input-text'
import { convertToNumberDate } from '@/application/_shared/helpers/date.helper'
import { useAuth } from '@/application/auth/hooks/auth.hook'
import { PrescriptionModel } from '@/application/prescription/models/prescription.model'
import {
  SavePrescriptionFormSchema,
  savePrescriptionFormSchema,
} from '@/application/prescription/schemas/save-prescription.schema'
import { CreatePrescriptionService } from '@/application/prescription/service/create-prescription.service'
import { UpdatePrescriptionService } from '@/application/prescription/service/update-prescription.service'

type SavePrescriptionFormProps = {
  prescription?: PrescriptionModel
}

export function SavePrescriptionForm({
  prescription,
}: SavePrescriptionFormProps) {
  const { control, handleSubmit } = useForm<SavePrescriptionFormSchema>({
    resolver: zodResolver(savePrescriptionFormSchema),
    defaultValues: prescription,
  })

  const { push } = useRouter()

  const pathname = usePathname()
  const isEditPage = pathname.includes('editar')

  const { user } = useAuth()
  const { mutate: createPrescription, isPending: isPendingCreatePrescription } =
    CreatePrescriptionService({
      onSuccess: () => push('/pacientes'),
    })
  const { mutate: updatePrescription, isPending: isPendingUpdatePrescription } =
    UpdatePrescriptionService({
      onSuccess: () => push('/pacientes'),
    })

  const isLoading = isPendingCreatePrescription || isPendingUpdatePrescription

  async function onSubmit(data: SavePrescriptionFormSchema) {
    const formattedData = {
      ...data,
      password: convertToNumberDate(data.dob),
      ownerId: user?.id ?? '',
    }
    if (isEditPage) {
      updatePrescription(formattedData)
    } else {
      createPrescription(formattedData)
    }
  }

  return (
    <form className="mt-8 flex flex-col gap-6">
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
        <Button
          variant="secondary"
          className="max-w-[116px]"
          disabled={isLoading}
          asChild
        >
          <Link href="/pacientes">Cancelar</Link>
        </Button>
        <Button
          variant="primary"
          className="max-w-[205px]"
          onClick={handleSubmit(onSubmit)}
          isLoading={isLoading}
          icon={<Check size={16} />}
        >
          {isEditPage ? 'Salvar Alterações' : 'Cadastrar Paciente'}
        </Button>
      </FormCardFooter>
    </form>
  )
}
