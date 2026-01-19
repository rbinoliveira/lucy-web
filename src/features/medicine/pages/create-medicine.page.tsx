import { SaveMedicineForm } from '@/features/medicine/components/save-medicine-form'
import {
  FormCard,
  FormCardHeader,
} from '@/shared/components/molecules/form/form-card'

export function CreateMedicinePage() {
  return (
    <FormCard>
      <FormCardHeader
        title="Informações do Medicamento"
        subtitle="Preencha os dados abaixo para cadastrar um novo medicamento"
      />
      <SaveMedicineForm />
    </FormCard>
  )
}
