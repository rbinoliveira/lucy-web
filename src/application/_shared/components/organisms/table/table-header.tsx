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
        'w-full linear-one rounded-t-2xl py-[1.25rem] px-6 table-cell',
        className,
      )}
      {...props}
    >
      <TableRow>
        {columns.map((column) => (
          <TableHead key={column.columnName}>{column.columnLabel}</TableHead>
        ))}
        <TableHead>Actions</TableHead>
      </TableRow>
    </thead>
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'text-sm font-semibold leading-[1.42] text-left text-white',
        className,
      )}
      {...props}
    />
  )
}
