import { useQuery } from '@tanstack/react-query'

import {
  GetRecentPrescriptionsInput,
  getRecentPrescriptionsUseCase,
  RecentPrescriptionItem,
} from '@/application/dashboard/use-cases/get-recent-prescriptions.use-case'

export const getRecentPrescriptionsQueryKey = 'getRecentPrescriptionsQueryKey'

export function GetRecentPrescriptionsService(
  params: GetRecentPrescriptionsInput,
) {
  const query = useQuery<RecentPrescriptionItem[]>({
    queryKey: [
      getRecentPrescriptionsQueryKey,
      params.ownerId,
      params.limitCount,
    ],
    queryFn: async () => getRecentPrescriptionsUseCase(params),
    enabled: !!params.ownerId,
  })
  return query
}
