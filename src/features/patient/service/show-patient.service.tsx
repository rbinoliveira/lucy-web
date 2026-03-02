import { useQuery } from '@tanstack/react-query'

import {
  showPatientUseCase,
  ShowPatientUseCaseInput,
  ShowPatientUseCaseOutput,
} from '@/features/patient/use-cases/show-patient.use-case'

export const showPatientQueryKey = 'showPatientQueryKey'

export function ShowPatientService(params: ShowPatientUseCaseInput) {
  const query = useQuery<ShowPatientUseCaseOutput>({
    queryKey: [showPatientQueryKey, params.id],
    queryFn: async () => showPatientUseCase(params),
  })
  return query
}
