import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { listPrescriptionsQueryKey } from '@/features/prescription/service/list-prescriptions.service'
import { showPrescriptionQueryKey } from '@/features/prescription/service/show-prescription.service'
import {
  updatePrescriptionUseCase,
  UpdatePrescriptionUseCaseInput,
} from '@/features/prescription/use-cases/update-prescription.use-case'
import { handleError } from '@/shared/helpers/error.helper'
import { queryClient } from '@/shared/libs/react-query'
import { ServiceModel } from '@/shared/models/service.model'

export function UpdatePrescriptionService({ onSuccess }: ServiceModel) {
  const mutation = useMutation({
    mutationFn: (data: UpdatePrescriptionUseCaseInput) =>
      updatePrescriptionUseCase(data),
    onSuccess: async () => {
      if (onSuccess) {
        onSuccess()
      }
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === listPrescriptionsQueryKey,
      })
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === showPrescriptionQueryKey,
      })
      toast.success('Prescrição atualizada com sucesso!')
    },
    onError: (error) => {
      handleError(error)
    },
  })
  return mutation
}
