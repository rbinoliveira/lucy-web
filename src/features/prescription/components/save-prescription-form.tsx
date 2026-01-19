'use client'

import { AtSign, Calendar, Check, Phone, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import { PrescriptionModel } from '@/features/prescription/models/prescription.model'
import {
  SavePrescriptionFormSchema,
  savePrescriptionFormSchema,
} from '@/features/prescription/schemas/save-prescription.schema'
import { CreatePrescriptionService } from '@/features/prescription/service/create-prescription.service'
import { UpdatePrescriptionService } from '@/features/prescription/service/update-prescription.service'
import { Button } from '@/shared/components/atoms/button'
import { FormCardFooter } from '@/shared/components/molecules/form/form-card'
import { InputDate } from '@/shared/components/molecules/form/input-date'
import { InputMaskedText } from '@/shared/components/molecules/form/input-masked-text'
import { InputText } from '@/shared/components/molecules/form/input-text'
import { convertToNumberDate } from '@/shared/helpers/date.helper'
import { zodResolver } from '@/shared/libs/zod-resolver'

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
