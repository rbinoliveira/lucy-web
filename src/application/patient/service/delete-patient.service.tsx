import { useMutation } from '@tanstack/react-query'

import {
  deletePatientUseCase,
  DeletePatientUseCaseInput,
} from '@/application/patient/use-cases/delete-patient.use-case'

export function DeletePatientService() {
  const mutation = useMutation({
    mutationFn: (data: DeletePatientUseCaseInput) => deletePatientUseCase(data),
  })
  return mutation
}
