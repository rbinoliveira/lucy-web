import { cn } from '@/shared/libs/tw-merge'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-neutral-900/10', className)}
      {...props}
    />
  )
}

export { Skeleton }
