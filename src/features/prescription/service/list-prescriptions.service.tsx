import { useQuery, UseQueryOptions } from '@tanstack/react-query'

import {
  listPrescriptionsUseCase,
  ListPrescriptionsUseCaseInput,
  ListPrescriptionsUseCaseOutput,
} from '@/features/prescription/use-cases/list-prescriptions.use-case'

export const listPrescriptionsQueryKey = 'listPrescriptionsQueryKey'

export function ListPrescriptionsService(
  params: ListPrescriptionsUseCaseInput,
  options?: Omit<
    UseQueryOptions<ListPrescriptionsUseCaseOutput>,
    'queryKey' | 'queryFn'
  >,
) {
  const query = useQuery<ListPrescriptionsUseCaseOutput>({
    queryKey: [
      listPrescriptionsQueryKey,
      params.ownerId,
      params.itemsPerPage,
      params.page,
      params.search,
      params.patientEmail,
    ],
    queryFn: async () => listPrescriptionsUseCase(params),
    ...options,
  })
  return query
}
