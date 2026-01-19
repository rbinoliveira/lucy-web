'use client'

import { useParams } from 'next/navigation'

import { SavePrescriptionForm } from '@/features/prescription/components/save-prescription-form'
import { ShowPrescriptionService } from '@/features/prescription/service/show-prescription.service'
import { DataHandler } from '@/shared/components/molecules/data-handler'
import {
  FormCard,
  FormCardHeader,
} from '@/shared/components/molecules/form/form-card'

export function UpdatePrescriptionPage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const {
    data: prescription,
    isError,
    isLoading,
  } = ShowPrescriptionService({ id })

  return (
    <DataHandler isError={isError} isLoading={isLoading}>
      <FormCard>
        <FormCardHeader
          title="Informações do Medicamento"
          subtitle="Preencha os dados abaixo para editar o medicamento"
        />
        <SavePrescriptionForm prescription={prescription} />
      </FormCard>
    </DataHandler>
  )
}
