import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { handleError } from '@/application/_shared/helpers/error.helper'
import { queryClient } from '@/application/_shared/libs/react-query'
import { ServiceModel } from '@/application/_shared/models/service.model'
import { listPatientsQueryKey } from '@/application/patient/service/list-patients.service'
import {
  deletePatientUseCase,
  DeletePatientUseCaseInput,
} from '@/application/patient/use-cases/delete-patient.use-case'

export function DeletePatientService({ onSuccess }: ServiceModel) {
  const mutation = useMutation({
    mutationFn: (data: DeletePatientUseCaseInput) => deletePatientUseCase(data),
    onSuccess: async () => {
      if (onSuccess) {
        onSuccess()
      }
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === listPatientsQueryKey,
      })
      toast('Paciente deletado com sucesso!')
    },
    onError: (error) => {
      handleError(error)
    },
  })
  return mutation
}
