import { useQuery } from '@tanstack/react-query'

import {
  showPrescriptionUseCase,
  ShowPrescriptionUseCaseInput,
  ShowPrescriptionUseCaseOutput,
} from '@/application/prescription/use-cases/show-prescription.use-case'

export const showPrescriptionQueryKey = 'showPrescriptionQueryKey'

export function ShowPrescriptionService(params: ShowPrescriptionUseCaseInput) {
  const query = useQuery<ShowPrescriptionUseCaseOutput>({
    queryKey: [showPrescriptionQueryKey, params.id],
    queryFn: async () => showPrescriptionUseCase(params),
  })
  return query
}
