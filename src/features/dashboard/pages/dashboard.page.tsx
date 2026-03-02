'use client'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import { DashboardAlertsCard } from '@/features/dashboard/components/dashboard-alerts-card'
import { DashboardRecentPrescriptionsCard } from '@/features/dashboard/components/dashboard-recent-prescriptions-card'
import { DashboardStatsCards } from '@/features/dashboard/components/dashboard-stats-cards'
import { GetDashboardMetricsService } from '@/features/dashboard/service/get-dashboard-metrics.service'
import { GetRecentPrescriptionsService } from '@/features/dashboard/service/get-recent-prescriptions.service'

export function DashboardPage() {
  const { user } = useAuth()

  const { data: metrics, isLoading: isLoadingMetrics } =
    GetDashboardMetricsService({ ownerId: user?.id ?? '' })

  const { data: recentPrescriptions, isLoading: isLoadingPrescriptions } =
    GetRecentPrescriptionsService({ ownerId: user?.id ?? '', limitCount: 5 })

  return (
    <div className="flex flex-col gap-4 md:gap-[30px]">
      <DashboardStatsCards
        activePrescriptions={metrics?.activePrescriptions ?? 0}
        totalPatients={metrics?.totalPatients ?? 0}
        adherenceRate={metrics?.adherenceRate ?? 0}
        pendingAlerts={metrics?.pendingAlerts ?? 0}
        isLoading={isLoadingMetrics}
      />
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-[30px]">
        <DashboardRecentPrescriptionsCard
          recentPrescriptions={recentPrescriptions}
          isLoading={isLoadingPrescriptions}
        />
        <DashboardAlertsCard pendingAlerts={metrics?.pendingAlerts} />
      </section>
    </div>
  )
}
