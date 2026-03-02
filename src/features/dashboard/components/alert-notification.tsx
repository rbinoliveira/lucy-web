import { AlertTriangle, Clock, Phone, XCircle } from 'lucide-react'

import { cn } from '@/shared/libs/tw-merge'

type AlertType = 'danger' | 'warning' | 'info'

type AlertNotificationProps = {
  type: AlertType
  title: string
  description: string
  onContact?: () => void
}

const alertConfig: Record<
  AlertType,
  { bgColor: string; iconBgColor: string; icon: React.ReactNode }
> = {
  danger: {
    bgColor: 'bg-red-50',
    iconBgColor: 'bg-danger',
    icon: <XCircle className="h-5 w-5 text-white" />,
  },
  warning: {
    bgColor: 'bg-yellow-50',
    iconBgColor: 'bg-yellow',
    icon: <Clock className="h-5 w-5 text-white" />,
  },
  info: {
    bgColor: 'bg-orange-50',
    iconBgColor: 'bg-orange-400',
    icon: <AlertTriangle className="h-5 w-5 text-white" />,
  },
}

export function AlertNotification({
  type,
  title,
  description,
  onContact,
}: AlertNotificationProps) {
  const config = alertConfig[type]

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl p-4',
        config.bgColor,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            config.iconBgColor,
          )}
        >
          {config.icon}
        </div>
        <div className="flex flex-col">
          <span className="text-text-one text-sm font-semibold">{title}</span>
          <span className="text-text-two text-xs">{description}</span>
        </div>
      </div>
      {onContact && (
        <button
          onClick={onContact}
          className="bg-primary hover:bg-primary/90 flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
        >
          <Phone className="h-5 w-5 text-white" />
        </button>
      )}
    </div>
  )
}
