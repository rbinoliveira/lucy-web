import { useQuery } from '@tanstack/react-query'

import {
  listPrescriptionsUseCase,
  ListPrescriptionsUseCaseInput,
  ListPrescriptionsUseCaseOutput,
} from '@/application/prescription/use-cases/list-prescriptions.use-case'

export const listPrescriptionsQueryKey = 'listPrescriptionsQueryKey'

export function ListPrescriptionsService(
  params: ListPrescriptionsUseCaseInput,
) {
  const query = useQuery<ListPrescriptionsUseCaseOutput>({
    queryKey: [
      listPrescriptionsQueryKey,
      params.itemsPerPage,
      params.page,
      params.search,
    ],
    queryFn: async () => listPrescriptionsUseCase(params),
  })
  return query
}
