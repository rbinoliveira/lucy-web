'use client'

import { Archive, CheckCircle, FileText, Target } from 'lucide-react'

import { MetricCard } from '@/features/dashboard/components/metric-card'
import { PrescriptionModel } from '@/features/prescription/models/prescription.model'
import { ListPaginatedModel } from '@/shared/models/list-paginated.model'

type PatientPrescriptionStatsProps = {
  prescriptionsData: ListPaginatedModel<PrescriptionModel> | undefined
}

export function PatientPrescriptionStats({
  prescriptionsData,
}: PatientPrescriptionStatsProps) {
  const totalPrescriptions = prescriptionsData?.totalItems ?? 0

  return (
    <div className="stats-grid">
      <MetricCard
        icon={<FileText className="h-7 w-7 text-white" />}
        iconBgColor="bg-primary/90"
        value={totalPrescriptions}
        label="Total de Prescrições"
        description="Prescrições cadastradas"
      />
      <MetricCard
        icon={<CheckCircle className="h-7 w-7 text-white" />}
        iconBgColor="bg-primary"
        value={totalPrescriptions}
        label="Prescrições Ativas"
        description="Em tratamento"
      />
      <MetricCard
        icon={<Archive className="h-7 w-7 text-white" />}
        iconBgColor="bg-gray-500"
        value={0}
        label="Prescrições Finalizadas"
        description="Tratamento concluído"
      />
      <MetricCard
        icon={<Target className="h-7 w-7 text-white" />}
        iconBgColor="bg-green"
        value="0%"
        label="Taxa de Adesão"
        description="Aderência às medicações"
      />
    </div>
  )
}
