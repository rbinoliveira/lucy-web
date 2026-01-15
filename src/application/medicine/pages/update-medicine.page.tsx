'use client'

import { useParams } from 'next/navigation'

import { DataHandler } from '@/application/_shared/components/molecules/data-handler'
import {
  FormCard,
  FormCardHeader,
} from '@/application/_shared/components/molecules/form/form-card'
import { SaveMedicineForm } from '@/application/medicine/components/save-medicine-form'
import { ShowMedicineService } from '@/application/medicine/service/show-medicine.service'

export function UpdateMedicinePage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const { data: medicine, isError, isLoading } = ShowMedicineService({ id })

  return (
    <DataHandler isError={isError} isLoading={isLoading}>
      <FormCard>
        <FormCardHeader
          title="Informações do Medicamento"
          subtitle="Preencha os dados abaixo para editar o medicamento"
        />
        <SaveMedicineForm medicine={medicine ?? undefined} />
      </FormCard>
    </DataHandler>
  )
}
