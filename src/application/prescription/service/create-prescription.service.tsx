import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { handleError } from '@/application/_shared/helpers/error.helper'
import { queryClient } from '@/application/_shared/libs/react-query'
import { ServiceModel } from '@/application/_shared/models/service.model'
import { listPrescriptionsQueryKey } from '@/application/prescription/service/list-prescriptions.service'
import {
  createPrescriptionUseCase,
  CreatePrescriptionUseCaseInput,
} from '@/application/prescription/use-cases/create-prescription.use-case'

export function CreatePrescriptionService({ onSuccess }: ServiceModel) {
  const mutation = useMutation({
    mutationFn: (data: CreatePrescriptionUseCaseInput) =>
      createPrescriptionUseCase(data),
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === listPrescriptionsQueryKey,
      })
      toast.success('Medicamento criado com sucesso!')
    },
    onError: (error) => {
      handleError({ err: error })
    },
  })
  return mutation
}
