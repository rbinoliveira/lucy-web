import { ReactNode } from 'react'

import { TableBody } from '@/application/_shared/components/organisms/table/table-body'
import { TableContainer } from '@/application/_shared/components/organisms/table/table-container'
import {
  TableFilter,
  TableFilterProps,
} from '@/application/_shared/components/organisms/table/table-filter'
import { TableHeader } from '@/application/_shared/components/organisms/table/table-header'
import { TablePagination } from '@/application/_shared/components/organisms/table/table-pagination'
import { ListPaginatedModel } from '@/application/_shared/models/list-paginated.model'

export type TWithId<T> = T & {
  id: string
}

export interface Column<T> {
  columnName: string
  columnLabel: string
  render: (row: TWithId<T>) => ReactNode
  className?: string
}

export type TableProps<T extends object> = {
  columns: Column<TWithId<T>>[]
  data: ListPaginatedModel<TWithId<T>>
  actions: TableFilterProps
}

export function Table<T extends object>({
  columns,
  data,
  actions,
}: TableProps<T>) {
  return (
    <div className="flex flex-col gap-6">
      <TableFilter {...actions} />
      <div className="flex flex-col shadow-two rounded-2xl border border-border-one">
        <TableContainer className="bg-transparent">
          <TableHeader columns={columns} />
          <TableBody data={data} columns={columns} />
        </TableContainer>
        <TablePagination
          totalItems={data.totalItems}
          totalPages={data.totalPages}
          currentPage={data.currentPage}
          itemsPerPage={data.itemsPerPage}
        />
      </div>
    </div>
  )
}
