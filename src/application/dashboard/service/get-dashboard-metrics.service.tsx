import { useQuery } from '@tanstack/react-query'

import {
  DashboardMetrics,
  GetDashboardMetricsInput,
  getDashboardMetricsUseCase,
} from '@/application/dashboard/use-cases/get-dashboard-metrics.use-case'

export const getDashboardMetricsQueryKey = 'getDashboardMetricsQueryKey'

export function GetDashboardMetricsService(params: GetDashboardMetricsInput) {
  const query = useQuery<DashboardMetrics>({
    queryKey: [getDashboardMetricsQueryKey, params.ownerId],
    queryFn: async () => getDashboardMetricsUseCase(params),
    enabled: !!params.ownerId,
  })
  return query
}
