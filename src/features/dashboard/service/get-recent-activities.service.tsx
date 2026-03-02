import { useQuery } from '@tanstack/react-query'

import {
  GetRecentActivitiesInput,
  getRecentActivitiesUseCase,
  RecentActivityItem,
} from '@/features/dashboard/use-cases/get-recent-activities.use-case'

export const getRecentActivitiesQueryKey = 'getRecentActivitiesQueryKey'

export function GetRecentActivitiesService(params: GetRecentActivitiesInput) {
  const query = useQuery<RecentActivityItem[]>({
    queryKey: [getRecentActivitiesQueryKey, params.ownerId, params.limitCount],
    queryFn: async () => getRecentActivitiesUseCase(params),
    enabled: !!params.ownerId,
  })
  return query
}
