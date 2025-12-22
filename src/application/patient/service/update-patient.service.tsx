import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { handleError } from '@/application/_shared/helpers/error.helper'
import { queryClient } from '@/application/_shared/libs/react-query'
import { ServiceModel } from '@/application/_shared/models/service.model'
import { listPatientsQueryKey } from '@/application/patient/service/list-patients.service'
import { showPatientQueryKey } from '@/application/patient/service/show-patient.service'
import {
  updatePatientUseCase,
  UpdatePatientUseCaseInput,
} from '@/application/patient/use-cases/update-patient.use-case'

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
