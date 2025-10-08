import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { handleError } from '@/application/_shared/helpers/error.helper'
import { queryClient } from '@/application/_shared/libs/react-query'
import { ServiceModel } from '@/application/_shared/models/service.model'
import { listMedicinesQueryKey } from '@/application/medicine/service/list-medicines.service'
import {
  createMedicineUseCase,
  CreateMedicineUseCaseInput,
} from '@/application/medicine/use-cases/create-medicine.use-case'

export function CreateMedicineService({ onSuccess }: ServiceModel) {
  const mutation = useMutation({
    mutationFn: (data: CreateMedicineUseCaseInput) =>
      createMedicineUseCase(data),
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === listMedicinesQueryKey,
      })
      toast.success('Medicamento criado com sucesso!')
    },
    onError: (error) => {
      handleError({ err: error })
    },
  })
  return mutation
}
