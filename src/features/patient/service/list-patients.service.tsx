import { useQuery } from '@tanstack/react-query'

import {
  listPatientsUseCase,
  ListPatientsUseCaseInput,
  ListPatientsUseCaseOutput,
} from '@/features/patient/use-cases/list-patients.use-case'

export const listPatientsQueryKey = 'listPatientsQueryKey'

export function ListPatientsService(params: ListPatientsUseCaseInput) {
  const query = useQuery<ListPatientsUseCaseOutput>({
    queryKey: [
      listPatientsQueryKey,
      params.itemsPerPage,
      params.page,
      params.ownerId,
      params.search,
    ],
    queryFn: async () => listPatientsUseCase(params),
  })
  return query
}
