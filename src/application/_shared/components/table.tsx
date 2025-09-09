'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'

import { InputSelect } from '@/application/_shared/components/input-select'
import { InputText } from '@/application/_shared/components/input-text'
import { Pagination } from '@/application/_shared/components/shared/pagination'
import { cn } from '@/application/_shared/libs/tw-merge'
import { ListPaginatedModel } from '@/application/_shared/models/list-paginated.model'

export type TWithId<T> = T & {
  id: string
}

export interface Column<T> {
  columnName: string
  columnLabel: string
  render: (row: TWithId<T>) => React.ReactNode
  className?: string
}

export type TableProps<T extends object> = {
  columns: Column<TWithId<T>>[]
  data: ListPaginatedModel<TWithId<T>>
  addButton?: { label: string; onClick: () => void }
  noResultsData?: {
    label: string
    resetStates?: () => void
    hasSearch: boolean
  }
}

function Table<T extends object>({
  columns,
  data,
  // addButton,
  // noResultsData,
}: TableProps<T>) {
  const { control } = useForm()

  return (
    <div className="flex flex-col gap-6">
      <TableFilter>
        <InputText
          variant="sm"
          control={control}
          name="search"
          placeholder="Search"
          className="max-w-[421px]"
        />
        <InputSelect
          control={control}
          name="select"
          className="max-w-[150px]"
          variant="sm"
        />
      </TableFilter>
      <TableContainer className="flex flex-col">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.columnName}>
                {column.columnLabel}
              </TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((row) => (
            <TableRow
              key={row.id}
              className="px-6 py-[1.4063rem] border-t border-border-two"
            >
              {columns.map((column) => (
                <TableCell key={column.columnName}>
                  {column.render(row)}
                </TableCell>
              ))}
              <TableCell>action</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="grid-cols-1">
            <Pagination
              totalItems={data.totalItems}
              totalPages={data.totalPages}
              currentPage={data.currentPage}
              itemsPerPage={data.itemsPerPage}
            />
          </TableRow>
        </TableFooter>
      </TableContainer>
    </div>
  )
}

function TableContainer({
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

function TableFilter({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 w-full bg-white rounded-radius py-[0.9375rem] px-4',
        className,
      )}
      {...props}
    />
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        'w-full bg-white rounded-x-radius rounded-t-radius py-[1.4063rem] px-6',
        className,
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('bg-white', className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'bg-white py-[0.9375rem] px-6 rounded-b-radius border-t border-border-two',
        className,
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn('w-full grid grid-cols-4', className)}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'text-base font-bold leading-[1.1875] text-left',
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return <td data-slot="table-cell" className={cn('', className)} {...props} />
}

export {
  Table,
  TableContainer,
  TableFilter,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
}
