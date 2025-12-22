import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { handleError } from '@/application/_shared/helpers/error.helper'
import { queryClient } from '@/application/_shared/libs/react-query'
import { ServiceModel } from '@/application/_shared/models/service.model'
import { listMedicinesQueryKey } from '@/application/medicine/service/list-medicines.service'
import { showMedicineQueryKey } from '@/application/medicine/service/show-medicine.service'
import {
  updateMedicineUseCase,
  UpdateMedicineUseCaseInput,
} from '@/application/medicine/use-cases/update-medicine.use-case'

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
