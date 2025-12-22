'use client'

import { useParams } from 'next/navigation'

import { DataHandler } from '@/application/_shared/components/molecules/data-handler'
import {
  FormCard,
  FormCardHeader,
} from '@/application/_shared/components/molecules/form/form-card'
import { SavePatientForm } from '@/application/patient/components/save-patient-form'
import { ShowPatientService } from '@/application/patient/service/show-patient.service'

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
