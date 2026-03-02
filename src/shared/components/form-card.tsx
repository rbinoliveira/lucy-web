import { Separator } from '@/shared/components/separator'
import { cn } from '@/shared/libs/tw-merge'

type FormCardProps = {
  children: React.ReactNode
  className?: string
}

export function FormCard({ children, className }: FormCardProps) {
  return (
    <div
      className={cn(
        'border-border-one flex flex-col rounded-2xl border bg-white p-8',
        'shadow-three',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function FormCardFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex w-full flex-col items-end', className)}>
      <Separator />
      <div className="mt-6 flex w-full items-center justify-end gap-4">
        {children}
      </div>
    </div>
  )
}

export function FormCardHeader({
  title,
  subtitle,
  className,
}: {
  title: string
  subtitle: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <h1 className="text-xl font-bold">{title}</h1>
      <h2 className="text-text-two">{subtitle}</h2>
    </div>
  )
}
