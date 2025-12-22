'use client'

import { useParams } from 'next/navigation'

import { DataHandler } from '@/application/_shared/components/molecules/data-handler'
import {
  FormCard,
  FormCardHeader,
} from '@/application/_shared/components/molecules/form/form-card'
import { SavePrescriptionForm } from '@/application/prescription/components/save-prescription-form'
import { ShowPrescriptionService } from '@/application/prescription/service/show-prescription.service'

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
