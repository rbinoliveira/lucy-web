'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import {
  Button,
  ButtonProps,
} from '@/application/_shared/components/atoms/button'
import { cn } from '@/application/_shared/libs/tw-merge'

export type TablePaginationProps = {
  totalItems: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
}

export function TablePagination({
  totalItems,
  totalPages,
  currentPage,
  itemsPerPage,
}: TablePaginationProps) {
  const pagesCountText = `Mostrando ${
    totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  } a
  ${
    currentPage * itemsPerPage < totalItems
      ? currentPage * itemsPerPage
      : totalItems
  } de ${totalItems} resultados`

  return (
    <nav
      className={cn(
        'flex w-full items-center justify-between linear-four rounded-b-2xl',
        'py-[1.25rem] px-6 border-t border-border-three',
      )}
      aria-label="Table navigation"
    >
      <span className="font-medium text-text-seven text-sm">
        {pagesCountText}
      </span>
      <ul className="flex items-center gap-2">
        <TablePaginationButtonsContainer
          totalItems={totalItems}
          totalPages={totalPages}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      </ul>
    </nav>
  )
}

function TablePaginationButtonsContainer({
  totalItems,
  totalPages,
  currentPage,
  itemsPerPage,
}: TablePaginationProps) {
  const [page, setPage] = React.useState(1)

  const siblingsCount = 1
  const previousPages =
    page > 1 ? generatePagesArray(page - 1 - siblingsCount, page - 1) : []
  const nextPages =
    page < totalPages
      ? generatePagesArray(page, Math.min(page + siblingsCount, totalPages))
      : []
  return (
    <>
      <TablePaginationButton
        onClick={() => page > 1 && setPage(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft size={14} className="text-text-six" />
      </TablePaginationButton>

      {page > 1 + siblingsCount && (
        <>
          <TablePaginationButton onClick={() => setPage(1)}>
            1
          </TablePaginationButton>
          {page > 2 + siblingsCount && (
            <TablePaginationButton className="cursor-not-allowed text-gray-300/30">
              ...
            </TablePaginationButton>
          )}
        </>
      )}

      {previousPages.map((previousPage) => (
        <TablePaginationButton
          key={previousPage}
          onClick={() => setPage(previousPage)}
        >
          {previousPage}
        </TablePaginationButton>
      ))}

      <TablePaginationButton isActive>{page}</TablePaginationButton>

      {nextPages.map((nextPage) => (
        <TablePaginationButton key={nextPage} onClick={() => setPage(nextPage)}>
          {nextPage}
        </TablePaginationButton>
      ))}

      {page + siblingsCount < totalPages && (
        <>
          {page + 1 + siblingsCount < totalPages && (
            <TablePaginationButton className="cursor-not-allowed text-gray-300/30">
              ...
            </TablePaginationButton>
          )}
          <TablePaginationButton onClick={() => setPage(totalPages)}>
            {totalPages}
          </TablePaginationButton>
        </>
      )}

      <TablePaginationButton
        onClick={() => page < totalPages && setPage(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRight size={14} className="text-text-six" />
      </TablePaginationButton>
    </>
  )
}

function TablePaginationButton({
  isActive = false,
  className,
  ...props
}: ButtonProps & {
  isActive?: boolean
}) {
  return (
    <Button
      variant="pagination"
      className={cn(
        className,
        isActive && 'bg-primary text-white border-primary',
      )}
      {...props}
    />
  )
}

export function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => from + index + 1)
    .filter((page) => page > 0)
}
