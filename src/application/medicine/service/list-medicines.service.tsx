import { useQuery } from '@tanstack/react-query'

import {
  listMedicinesUseCase,
  ListMedicinesUseCaseInput,
  ListMedicinesUseCaseOutput,
} from '@/application/medicine/use-cases/list-medicines.use-case'

export const listMedicinesQueryKey = 'listMedicinesQueryKey'

export function ListMedicinesService(params: ListMedicinesUseCaseInput) {
  const query = useQuery<ListMedicinesUseCaseOutput>({
    queryKey: [
      listMedicinesQueryKey,
      params.itemsPerPage,
      params.page,
      params.search,
    ],
    queryFn: async () => listMedicinesUseCase(params),
  })
  return query
}
