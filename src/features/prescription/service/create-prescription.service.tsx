import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { listPrescriptionsQueryKey } from '@/features/prescription/service/list-prescriptions.service'
import {
  createPrescriptionUseCase,
  CreatePrescriptionUseCaseInput,
} from '@/features/prescription/use-cases/create-prescription.use-case'
import { handleError } from '@/shared/helpers/error.helper'
import { queryClient } from '@/shared/libs/react-query'
import { ServiceModel } from '@/shared/models/service.model'

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
      toast.success('Prescrição criada com sucesso!')
    },
    onError: (error) => {
      handleError({ err: error })
    },
  })
  return mutation
}
