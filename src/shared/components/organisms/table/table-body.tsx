import { TableRow } from '@/shared/components/organisms/table/table-row'
import { cn } from '@/shared/libs/tw-merge'

export type TableBodyProps<T = { id: string } & Record<string, unknown>> =
  React.ComponentProps<'tbody'> & {
    data: { items: T[] }
    columns: { columnName: string; render: (row: T) => React.ReactNode }[]
  }

export function TableBody<T extends { id: string } & Record<string, unknown>>({
  className,
  data,
  columns,
  ...props
}: TableBodyProps<T>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('bg-white', className)}
      {...props}
    >
      {data.items.map((row) => (
        <TableRow
          key={row.id}
          className={cn('border-border-one border-t px-6 py-[1.4063rem]')}
          itemsAmount={columns.length}
        >
          {columns.map((column) => (
            <TableCell key={column.columnName}>{column.render(row)}</TableCell>
          ))}
        </TableRow>
      ))}
    </tbody>
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn('flex items-center', className)}
      {...props}
    />
  )
}
