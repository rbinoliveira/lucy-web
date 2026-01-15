'use client'

import { AlertTriangle, CheckCircle, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

import { appRoutes } from '@/application/_shared/constants/app-routes.constant'
import { useAuth } from '@/application/auth/hooks/auth.hook'
import { AlertNotification } from '@/application/dashboard/components/alert-notification'
import { MetricCard } from '@/application/dashboard/components/metric-card'
import { QuickActions } from '@/application/dashboard/components/quick-actions'
import { RecentActivity } from '@/application/dashboard/components/recent-activity'
import { RecentPrescription } from '@/application/dashboard/components/recent-prescription'
import { GetDashboardMetricsService } from '@/application/dashboard/service/get-dashboard-metrics.service'
import { GetRecentActivitiesService } from '@/application/dashboard/service/get-recent-activities.service'
import { GetRecentPrescriptionsService } from '@/application/dashboard/service/get-recent-prescriptions.service'
import { formatTimeAgo } from '@/application/dashboard/utils/format-time-ago'

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

  const { data: recentActivities, isLoading: isLoadingActivities } =
    GetRecentActivitiesService({
      ownerId: user?.id ?? '',
      limitCount: 5,
    })

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Metric Cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Users className="h-7 w-7 text-white" />}
          iconBgColor="bg-blue-500"
          value={isLoadingMetrics ? '-' : (metrics?.totalPatients ?? 0)}
          label="Total de Pacientes"
          description="Pacientes cadastrados"
        />
        <MetricCard
          icon={<CheckCircle className="h-7 w-7 text-white" />}
          iconBgColor="bg-primary"
          value={isLoadingMetrics ? '-' : (metrics?.activePrescriptions ?? 0)}
          label="Prescrições Ativas"
          description="Em tratamento"
        />
        <MetricCard
          icon={<TrendingUp className="h-7 w-7 text-white" />}
          iconBgColor="bg-green"
          value={isLoadingMetrics ? '-' : `${metrics?.adherenceRate ?? 0}%`}
          label="Adesão Média"
          description="Aderência às medicações"
        />
        <MetricCard
          icon={<AlertTriangle className="h-7 w-7 text-white" />}
          iconBgColor="bg-danger"
          value={isLoadingMetrics ? '-' : (metrics?.pendingAlerts ?? 0)}
          label="Alertas Pendentes"
          description="Requerem atenção"
        />
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Alerts and Prescriptions */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Alert Notifications */}
          <section className="shadow-one flex flex-col gap-4 rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-text-one text-lg font-semibold">
                Notificações de Alerta
              </h3>
              <Link
                href="#"
                className="text-primary text-sm font-medium hover:underline"
              >
                Ver todos
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {metrics?.pendingAlerts === 0 ? (
                <p className="text-text-two py-4 text-center text-sm">
                  Nenhum alerta pendente
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
          </section>

          {/* Recent Prescriptions */}
          <section className="shadow-one flex flex-col gap-4 rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-text-one text-lg font-semibold">
                Últimas Prescrições
              </h3>
              <Link
                href={appRoutes.prescriptions}
                className="text-primary text-sm font-medium hover:underline"
              >
                Ver todas
              </Link>
            </div>

            <div className="divide-border-one flex flex-col divide-y">
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
          </section>
        </div>

        {/* Right Column - Quick Actions and Activities */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <QuickActions />

          {/* Recent Activities */}
          <section className="shadow-one flex flex-col gap-4 rounded-2xl bg-white p-6">
            <h3 className="text-text-one text-lg font-semibold">
              Últimas Atividades
            </h3>

            <div className="divide-border-one flex flex-col divide-y">
              {isLoadingActivities ? (
                <p className="text-text-two py-4 text-center text-sm">
                  Carregando...
                </p>
              ) : recentActivities && recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <RecentActivity
                    key={activity.id}
                    type={activity.type}
                    description={activity.description}
                    timeAgo={formatTimeAgo(activity.createdAt)}
                  />
                ))
              ) : (
                <p className="text-text-two py-4 text-center text-sm">
                  Nenhuma atividade recente
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
