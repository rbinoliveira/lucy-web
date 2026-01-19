import { SavePrescriptionForm } from '@/features/prescription/components/save-prescription-form'
import {
  FormCard,
  FormCardHeader,
} from '@/shared/components/molecules/form/form-card'

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
