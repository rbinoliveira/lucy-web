import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { handleError } from '@/application/_shared/helpers/error.helper'
import { queryClient } from '@/application/_shared/libs/react-query'
import { ServiceModel } from '@/application/_shared/models/service.model'
import { listPatientsQueryKey } from '@/application/patient/service/list-patients.service'
import {
  createPatientUseCase,
  CreatePatientUseCaseInput,
} from '@/application/patient/use-cases/create-patient.use-case copy'

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
      toast('Patient created successfully!')
    },
    onError: (error) => {
      handleError(error)
    },
  })
  return mutation
}
