import { Avatar } from '@/application/_shared/components/atoms/avatar'
import { cn } from '@/application/_shared/libs/tw-merge'

type SyncStatus = 'synced' | 'pending'

type RecentPrescriptionProps = {
  patientName: string
  medication: string
  timeAgo: string
  status: SyncStatus
}

const statusConfig: Record<SyncStatus, { label: string; className: string }> = {
  synced: {
    label: 'Sincronizado',
    className: 'bg-green/10 text-green',
  },
  pending: {
    label: 'Pendente',
    className: 'bg-yellow/10 text-yellow',
  },
}

export function RecentPrescription({
  patientName,
  medication,
  timeAgo,
  status,
}: RecentPrescriptionProps) {
  const config = statusConfig[status]

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Avatar name={patientName} />
        <div className="flex flex-col">
          <span className="text-text-one text-sm font-semibold">
            {patientName}
          </span>
          <span className="text-text-two text-xs">
            {medication} - {timeAgo}
          </span>
        </div>
      </div>
      <span
        className={cn(
          'rounded-full px-3 py-1 text-xs font-medium',
          config.className,
        )}
      >
        {config.label}
      </span>
    </div>
  )
}
