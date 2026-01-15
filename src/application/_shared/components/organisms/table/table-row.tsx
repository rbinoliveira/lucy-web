import { cn } from '@/application/_shared/libs/tw-merge'

export type TableRowProps = React.ComponentProps<'tr'> & {
  itemsAmount: number
}

export function TableRow({ className, itemsAmount, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'grid w-full',
        itemsAmount === 1 && 'grid-cols-[repeat(1,minmax(200px,1fr))]',
        itemsAmount === 2 && 'grid-cols-[repeat(2,minmax(200px,1fr))]',
        itemsAmount === 3 && 'grid-cols-[repeat(3,minmax(200px,1fr))]',
        itemsAmount === 4 && 'grid-cols-[repeat(4,minmax(200px,1fr))]',
        className,
      )}
      {...props}
    />
  )
}
