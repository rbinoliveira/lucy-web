import {
  FormCard,
  FormCardHeader,
} from '@/application/_shared/components/molecules/form/form-card'
import { SavePrescriptionForm } from '@/application/prescription/components/save-prescription-form'

export function CreatePrescriptionPage() {
  return (
    <FormCard>
      <FormCardHeader
        title="Informações do Medicamento"
        subtitle="Preencha os dados abaixo para cadastrar um novo medicamento"
      />
      <SavePrescriptionForm />
    </FormCard>
  )
}
