import { SavePatientForm } from '@/features/patient/components/save-patient-form'
import { FormCard, FormCardHeader } from '@/shared/components/form-card'

export function CreatePatientPage() {
  return (
    <FormCard>
      <FormCardHeader
        title="Informações do Paciente"
        subtitle="Preencha os dados abaixo para cadastrar um novo paciente"
      />
      <SavePatientForm />
    </FormCard>
  )
}
