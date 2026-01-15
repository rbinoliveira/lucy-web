'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import {
  Button,
  ButtonProps,
} from '@/application/_shared/components/atoms/button'
import { useTable } from '@/application/_shared/hooks/table.hook'
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
}: TablePaginationProps) {
  const { currentPage, itemsPerPage } = useTable()

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
        'linear-four flex w-full items-center justify-between rounded-b-2xl',
        'border-border-three border-t px-6 py-[1.25rem]',
      )}
      aria-label="Table navigation"
    >
      <span className="text-text-seven text-sm font-medium">
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

function TablePaginationButtonsContainer({ totalPages }: TablePaginationProps) {
  const { updateCurrentPage, currentPage } = useTable()

  const siblingsCount = 1
  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : []
  const nextPages =
    currentPage < totalPages
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, totalPages),
        )
      : []
  return (
    <>
      <TablePaginationButton
        onClick={() => updateCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={14} className="text-text-six" />
      </TablePaginationButton>

      {currentPage > 1 + siblingsCount && (
        <>
          <TablePaginationButton onClick={() => updateCurrentPage(1)}>
            1
          </TablePaginationButton>
          {currentPage > 2 + siblingsCount && (
            <TablePaginationButton className="cursor-not-allowed text-gray-300/30">
              ...
            </TablePaginationButton>
          )}
        </>
      )}

      {previousPages.map((previousPage) => (
        <TablePaginationButton
          key={previousPage}
          onClick={() => updateCurrentPage(previousPage)}
        >
          {previousPage}
        </TablePaginationButton>
      ))}

      <TablePaginationButton isActive>{currentPage}</TablePaginationButton>

      {nextPages.map((nextPage) => (
        <TablePaginationButton
          key={nextPage}
          onClick={() => updateCurrentPage(nextPage)}
        >
          {nextPage}
        </TablePaginationButton>
      ))}

      {currentPage + siblingsCount < totalPages && (
        <>
          {currentPage + 1 + siblingsCount < totalPages && (
            <TablePaginationButton className="cursor-not-allowed text-gray-300/30">
              ...
            </TablePaginationButton>
          )}
          <TablePaginationButton onClick={() => updateCurrentPage(totalPages)}>
            {totalPages}
          </TablePaginationButton>
        </>
      )}

      <TablePaginationButton
        onClick={() =>
          currentPage < totalPages && updateCurrentPage(currentPage + 1)
        }
        disabled={currentPage === totalPages}
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
        isActive && 'bg-primary border-primary text-white',
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
