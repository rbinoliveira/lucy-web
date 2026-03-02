import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { listPatientsQueryKey } from '@/features/patient/service/list-patients.service'
import { showPatientQueryKey } from '@/features/patient/service/show-patient.service'
import {
  updatePatientUseCase,
  UpdatePatientUseCaseInput,
} from '@/features/patient/use-cases/update-patient.use-case'
import { handleError } from '@/shared/helpers/error.helper'
import { queryClient } from '@/shared/libs/react-query'
import { ServiceModel } from '@/shared/models/service.model'

export function UpdatePatientService({ onSuccess }: ServiceModel) {
  const mutation = useMutation({
    mutationFn: (data: UpdatePatientUseCaseInput) => updatePatientUseCase(data),
    onSuccess: async () => {
      if (onSuccess) {
        onSuccess()
      }
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === listPatientsQueryKey,
      })
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === showPatientQueryKey,
      })
      toast.success('Paciente atualizado com sucesso!')
    },
    onError: (error) => {
      handleError(error)
    },
  })
  return mutation
}
