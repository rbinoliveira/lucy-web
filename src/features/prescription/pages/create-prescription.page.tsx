import { Suspense } from 'react'

import { SavePrescriptionForm } from '@/features/prescription/components/save-prescription-form'
import { FormCard, FormCardHeader } from '@/shared/components/form-card'

export function CreatePrescriptionPage() {
  return (
    <FormCard>
      <FormCardHeader
        title="Nova Prescrição"
        subtitle="Preencha os dados abaixo para criar uma nova prescrição"
      />
      <Suspense>
        <SavePrescriptionForm />
      </Suspense>
    </FormCard>
  )
}
