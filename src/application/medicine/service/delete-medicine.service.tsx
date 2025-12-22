import { useMutation } from '@tanstack/react-query'

import {
  deleteMedicineUseCase,
  DeleteMedicineUseCaseInput,
} from '@/application/medicine/use-cases/delete-medicine.use-case'

export function DeleteMedicineService() {
  const mutation = useMutation({
    mutationFn: (data: DeleteMedicineUseCaseInput) =>
      deleteMedicineUseCase(data),
  })
  return mutation
}
