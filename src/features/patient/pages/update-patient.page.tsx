'use client'

import { useParams } from 'next/navigation'

import { SavePatientForm } from '@/features/patient/components/save-patient-form'
import { ShowPatientService } from '@/features/patient/service/show-patient.service'
import { DataHandler } from '@/shared/components/data-handler'
import { FormCard, FormCardHeader } from '@/shared/components/form-card'

export function UpdatePatientPage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const { data: patient, isError, isLoading } = ShowPatientService({ id })

  return (
    <DataHandler isError={isError} isLoading={isLoading}>
      <FormCard>
        <FormCardHeader
          title="Informações do Paciente"
          subtitle="Preencha os dados abaixo para editar o paciente"
        />
        <SavePatientForm patient={patient} />
      </FormCard>
    </DataHandler>
  )
}
