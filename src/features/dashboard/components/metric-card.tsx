import { cn } from '@/shared/libs/tw-merge'

type MetricCardProps = {
  icon: React.ReactNode
  iconBgColor: string
  value: string | number
  label: string
  description: string
  className?: string
}

export function MetricCard({
  icon,
  iconBgColor,
  value,
  label,
  description,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn('glass-card flex items-center justify-between', className)}
    >
      <div className="flex flex-col gap-1">
        <span className="text-text-one text-4xl font-bold">{value}</span>
        <span className="text-text-one text-base font-semibold">{label}</span>
        <span className="text-text-two text-sm">{description}</span>
      </div>
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-xl',
          iconBgColor,
        )}
      >
        {icon}
      </div>
    </div>
  )
}
