'use client'

import { useParams } from 'next/navigation'

import { SaveMedicineForm } from '@/features/medicine/components/save-medicine-form'
import { ShowMedicineService } from '@/features/medicine/service/show-medicine.service'
import { DataHandler } from '@/shared/components/data-handler'
import { FormCard, FormCardHeader } from '@/shared/components/form-card'

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
