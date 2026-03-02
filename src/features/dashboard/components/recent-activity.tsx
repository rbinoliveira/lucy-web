import { FileText, Pill, UserPlus } from 'lucide-react'

import { cn } from '@/shared/libs/tw-merge'

export type ActivityType = 'prescription' | 'patient' | 'medicine'

type RecentActivityProps = {
  type: ActivityType
  description: string
  timeAgo: string
}

const activityConfig: Record<
  ActivityType,
  { icon: React.ReactNode; bgColor: string }
> = {
  prescription: {
    icon: <FileText className="text-primary h-4 w-4" />,
    bgColor: 'bg-primary/10',
  },
  patient: {
    icon: <UserPlus className="text-green h-4 w-4" />,
    bgColor: 'bg-green/10',
  },
  medicine: {
    icon: <Pill className="h-4 w-4 text-blue-500" />,
    bgColor: 'bg-blue-500/10',
  },
}

export function RecentActivity({
  type,
  description,
  timeAgo,
}: RecentActivityProps) {
  const config = activityConfig[type]

  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg',
          config.bgColor,
        )}
      >
        {config.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-text-one truncate text-sm">{description}</p>
        <span className="text-text-two text-xs">{timeAgo}</span>
      </div>
    </div>
  )
}
