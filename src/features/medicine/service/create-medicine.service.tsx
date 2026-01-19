import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { listMedicinesQueryKey } from '@/features/medicine/service/list-medicines.service'
import {
  createMedicineUseCase,
  CreateMedicineUseCaseInput,
} from '@/features/medicine/use-cases/create-medicine.use-case'
import { handleError } from '@/shared/helpers/error.helper'
import { queryClient } from '@/shared/libs/react-query'
import { ServiceModel } from '@/shared/models/service.model'

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
