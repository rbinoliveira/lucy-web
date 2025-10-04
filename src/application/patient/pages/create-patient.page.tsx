import {
  FormCard,
  FormCardHeader,
} from '@/application/_shared/components/molecules/form/form-card'
import { SavePatientForm } from '@/application/patient/components/save-patient-form'

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
