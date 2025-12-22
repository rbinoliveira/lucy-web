import { useQuery } from '@tanstack/react-query'

import {
  showMedicineUseCase,
  ShowMedicineUseCaseInput,
  ShowMedicineUseCaseOutput,
} from '@/application/medicine/use-cases/show-medicine.use-case'

export const showMedicineQueryKey = 'showMedicineQueryKey'

export function ShowMedicineService(params: ShowMedicineUseCaseInput) {
  const query = useQuery<ShowMedicineUseCaseOutput>({
    queryKey: [showMedicineQueryKey, params.id],
    queryFn: async () => showMedicineUseCase(params),
  })
  return query
}
