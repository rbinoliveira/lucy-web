import { TableRow } from '@/application/_shared/components/organisms/table/table-row'
import { cn } from '@/application/_shared/libs/tw-merge'

export type TableHeaderProps = React.ComponentProps<'thead'> & {
  columns: { columnName: string; columnLabel: string }[]
}

export function TableHeader({
  className,
  columns,
  ...props
}: TableHeaderProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        'linear-one table-cell w-full rounded-t-2xl px-6 py-[1.25rem]',
        className,
      )}
      {...props}
    >
      <TableRow itemsAmount={columns.length}>
        {columns.map((column) => (
          <TableHead key={column.columnName}>{column.columnLabel}</TableHead>
        ))}
      </TableRow>
    </thead>
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'text-left text-sm leading-[1.42] font-semibold text-white',
        className,
      )}
      {...props}
    />
  )
}
