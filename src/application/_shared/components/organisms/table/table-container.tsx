import { cn } from '@/application/_shared/libs/tw-merge'

export function TableContainer({
  className,
  ...props
}: React.ComponentProps<'table'>) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn('w-full caption-bottom', className)}
        {...props}
      />
    </div>
  )
}
