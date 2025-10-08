import { useMutation } from '@tanstack/react-query'

import {
  deletePrescriptionUseCase,
  DeletePrescriptionUseCaseInput,
} from '@/application/prescription/use-cases/delete-prescription.use-case'

export function DeletePrescriptionService() {
  const mutation = useMutation({
    mutationFn: (data: DeletePrescriptionUseCaseInput) =>
      deletePrescriptionUseCase(data),
  })
  return mutation
}
