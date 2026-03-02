import { useMutation } from '@tanstack/react-query'

import {
  deletePrescriptionUseCase,
  DeletePrescriptionUseCaseInput,
} from '@/features/prescription/use-cases/delete-prescription.use-case'

export function DeletePrescriptionService() {
  const mutation = useMutation({
    mutationFn: (data: DeletePrescriptionUseCaseInput) =>
      deletePrescriptionUseCase(data),
  })
  return mutation
}
