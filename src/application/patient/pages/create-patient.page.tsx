import {
  FormCard,
  FormCardHeader,
} from '@/application/_shared/components/molecules/form/form-card'
import { CreatePatientForm } from '@/application/patient/components/create-patient-form'

export function CreatePatientPage() {
  return (
    <FormCard>
      <FormCardHeader
        title="Informações do Paciente"
        subtitle="Preencha os dados abaixo para cadastrar um novo paciente"
      />
      <CreatePatientForm />
    </FormCard>
  )
}
