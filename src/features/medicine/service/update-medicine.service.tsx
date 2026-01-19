import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { listMedicinesQueryKey } from '@/features/medicine/service/list-medicines.service'
import { showMedicineQueryKey } from '@/features/medicine/service/show-medicine.service'
import {
  updateMedicineUseCase,
  UpdateMedicineUseCaseInput,
} from '@/features/medicine/use-cases/update-medicine.use-case'
import { handleError } from '@/shared/helpers/error.helper'
import { queryClient } from '@/shared/libs/react-query'
import { ServiceModel } from '@/shared/models/service.model'

export function UpdateMedicineService({ onSuccess }: ServiceModel) {
  const mutation = useMutation({
    mutationFn: (data: UpdateMedicineUseCaseInput) =>
      updateMedicineUseCase(data),
    onSuccess: async () => {
      if (onSuccess) {
        onSuccess()
      }
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === listMedicinesQueryKey,
      })
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === showMedicineQueryKey,
      })
      toast.success('Medicamento atualizado com sucesso!')
    },
    onError: (error) => {
      handleError(error)
    },
  })
  return mutation
}
