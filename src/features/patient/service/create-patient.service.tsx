import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { listPatientsQueryKey } from '@/features/patient/service/list-patients.service'
import {
  createPatientUseCase,
  CreatePatientUseCaseInput,
} from '@/features/patient/use-cases/create-patient.use-case'
import { handleError } from '@/shared/helpers/error.helper'
import { queryClient } from '@/shared/libs/react-query'
import { ServiceModel } from '@/shared/models/service.model'

export function CreatePatientService({ onSuccess }: ServiceModel) {
  const mutation = useMutation({
    mutationFn: (data: CreatePatientUseCaseInput) => createPatientUseCase(data),
    onSuccess: () => {
      if (onSuccess) {
        onSuccess()
      }
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === listPatientsQueryKey,
      })
      toast.success('Paciente criado com sucesso!')
    },
    onError: (error) => {
      handleError({ err: error })
    },
  })
  return mutation
}
