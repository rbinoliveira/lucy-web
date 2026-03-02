'use client'

import Link from 'next/link'

import { RecentPrescription } from '@/features/dashboard/components/recent-prescription'
import { RecentPrescriptionItem } from '@/features/dashboard/use-cases/get-recent-prescriptions.use-case'
import { formatTimeAgo } from '@/features/dashboard/utils/format-time-ago'
import { appRoutes } from '@/shared/constants/app-routes.constant'

type DashboardRecentPrescriptionsCardProps = {
  recentPrescriptions: RecentPrescriptionItem[] | undefined
  isLoading: boolean
}

export function DashboardRecentPrescriptionsCard({
  recentPrescriptions,
  isLoading,
}: DashboardRecentPrescriptionsCardProps) {
  return (
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
        {isLoading ? (
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
  )
}
