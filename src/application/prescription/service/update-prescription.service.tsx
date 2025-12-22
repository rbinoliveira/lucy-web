import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { handleError } from '@/application/_shared/helpers/error.helper'
import { queryClient } from '@/application/_shared/libs/react-query'
import { ServiceModel } from '@/application/_shared/models/service.model'
import { listPrescriptionsQueryKey } from '@/application/prescription/service/list-prescriptions.service'
import { showPrescriptionQueryKey } from '@/application/prescription/service/show-prescription.service'
import {
  updatePrescriptionUseCase,
  UpdatePrescriptionUseCaseInput,
} from '@/application/prescription/use-cases/update-prescription.use-case'

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
      toast.success('Medicamento atualizado com sucesso!')
    },
    onError: (error) => {
      handleError(error)
    },
  })
  return mutation
}
