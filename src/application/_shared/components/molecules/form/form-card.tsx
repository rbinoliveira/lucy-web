import { Separator } from '@/application/_shared/components/atoms/separator'
import { cn } from '@/application/_shared/libs/tw-merge'

type FormCardProps = {
  children: React.ReactNode
  className?: string
}

export function FormCard({ children, className }: FormCardProps) {
  return (
    <div
      className={cn(
        'border border-border-one flex flex-col bg-white p-8 rounded-2xl',
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
    <div className={cn('w-full flex flex-col items-end', className)}>
      <Separator />
      <div className="flex items-center justify-end gap-4 mt-6 w-full">
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
