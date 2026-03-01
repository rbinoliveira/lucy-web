'use client'

import Link from 'next/link'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import { AlertNotification } from '@/features/dashboard/components/alert-notification'
import { DashboardStatsCards } from '@/features/dashboard/components/dashboard-stats-cards'
import { RecentPrescription } from '@/features/dashboard/components/recent-prescription'
import { GetDashboardMetricsService } from '@/features/dashboard/service/get-dashboard-metrics.service'
import { GetRecentPrescriptionsService } from '@/features/dashboard/service/get-recent-prescriptions.service'
import { formatTimeAgo } from '@/features/dashboard/utils/format-time-ago'
import { appRoutes } from '@/shared/constants/app-routes.constant'

export function DashboardPage() {
  const { user } = useAuth()

  const { data: metrics, isLoading: isLoadingMetrics } =
    GetDashboardMetricsService({
      ownerId: user?.id ?? '',
    })

  const { data: recentPrescriptions, isLoading: isLoadingPrescriptions } =
    GetRecentPrescriptionsService({
      ownerId: user?.id ?? '',
      limitCount: 5,
    })

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
        <div className="glass-card flex flex-col">
          <div className="card-header">
            <div>
              <h2 className="card-title">Últimas Prescrições</h2>
              <p className="card-subtitle">Prescrições recentes</p>
            </div>
            <Link
              href={appRoutes.prescriptions}
              className="text-primary text-sm font-medium hover:text-primary-alternative hover:underline"
            >
              Ver todas
            </Link>
          </div>
          <div className="flex flex-col divide-y divide-border-one">
            {isLoadingPrescriptions ? (
              <p className="text-text-two py-4 text-center text-sm">
                Carregando...
              </p>
            ) : recentPrescriptions && recentPrescriptions.length > 0 ? (
              recentPrescriptions.map((prescription) => (
                <RecentPrescription
                  key={prescription.id}
                  patientName={prescription.patientName}
                  medication={prescription.medication}
                  timeAgo={formatTimeAgo(prescription.createdAt)}
                  status={prescription.status}
                />
              ))
            ) : (
              <p className="text-text-two py-4 text-center text-sm">
                Nenhuma prescrição encontrada
              </p>
            )}
          </div>
        </div>

        <div className="glass-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Alertas</h2>
              <p className="card-subtitle">
                Notificações que requerem sua atenção
              </p>
            </div>
            <Link
              href="#"
              className="text-primary text-sm font-medium hover:text-primary-alternative hover:underline"
            >
              Ver todas
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {metrics?.pendingAlerts === 0 ? (
              <p className="text-text-three text-sm">
                Nenhum alerta pendente no momento.
              </p>
            ) : (
              <>
                <AlertNotification
                  type="danger"
                  title="Maria Silva não confirmou dose há 3 dias"
                  description="Amoxicilina 500mg - Última confirmação: 15/01/2024"
                  onContact={() => {}}
                />
                <AlertNotification
                  type="warning"
                  title="João Santos atrasou dose por 2 horas"
                  description="Ibuprofeno 600mg - Horário previsto: 14:00"
                  onContact={() => {}}
                />
                <AlertNotification
                  type="info"
                  title="Ana Costa perdeu dose de ontem"
                  description="Paracetamol 750mg - Dose não confirmada: 17/01/2024"
                  onContact={() => {}}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
