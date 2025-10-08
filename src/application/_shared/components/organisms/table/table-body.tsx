import { TableRow } from '@/application/_shared/components/organisms/table/table-row'
import { cn } from '@/application/_shared/libs/tw-merge'

export type TableBodyProps = React.ComponentProps<'tbody'> & {
  data: { items: any[] }
  columns: { columnName: string; render: (row: any) => React.ReactNode }[]
}

export function TableBody({
  className,
  data,
  columns,
  ...props
}: TableBodyProps) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('bg-white', className)}
      {...props}
    >
      {data.items.map((row) => (
        <TableRow
          key={row.id}
          className={cn('px-6 py-[1.4063rem] border-t border-border-one')}
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
