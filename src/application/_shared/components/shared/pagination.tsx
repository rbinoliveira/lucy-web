import { ChevronDown, ChevronLeft } from 'lucide-react'
import * as React from 'react'

import { UI } from '@/application/_shared/components'
import { ButtonProps } from '@/application/_shared/components/button'
import { cn } from '@/application/_shared/libs/tw-merge'

export type PaginationProps = {
  totalItems: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
}

export function Pagination({
  totalItems,
  totalPages,
  currentPage,
  itemsPerPage,
}: PaginationProps) {
  const [page, setPage] = React.useState(1)

  function renderTablePagination() {
    const siblingsCount = 1
    const previousPages =
      page > 1 ? generatePagesArray(page - 1 - siblingsCount, page - 1) : []
    const nextPages =
      page < totalPages
        ? generatePagesArray(page, Math.min(page + siblingsCount, totalPages))
        : []
    return (
      <>
        <PaginationButton
          onClick={() => page > 1 && setPage(page - 1)}
          className={`${
            page === 1 ? 'cursor-not-allowed text-gray-300/30' : 'text-gray-300'
          }`}
        >
          <ChevronLeft />
        </PaginationButton>

        {page > 1 + siblingsCount && (
          <>
            <PaginationButton onClick={() => setPage(1)}>1</PaginationButton>
            {page > 2 + siblingsCount && (
              <PaginationButton className="cursor-not-allowed text-gray-300/30">
                ...
              </PaginationButton>
            )}
          </>
        )}

        {previousPages.map((previousPage) => (
          <PaginationButton
            key={previousPage}
            onClick={() => setPage(previousPage)}
          >
            {previousPage}
          </PaginationButton>
        ))}

        <PaginationButton isActive>{page}</PaginationButton>

        {nextPages.map((nextPage) => (
          <PaginationButton key={nextPage} onClick={() => setPage(nextPage)}>
            {nextPage}
          </PaginationButton>
        ))}

        {page + siblingsCount < totalPages && (
          <>
            {page + 1 + siblingsCount < totalPages && (
              <PaginationButton className="cursor-not-allowed text-gray-300/30">
                ...
              </PaginationButton>
            )}
            <PaginationButton onClick={() => setPage(totalPages)}>
              {totalPages}
            </PaginationButton>
          </>
        )}

        <PaginationButton
          onClick={() => page < totalPages && setPage(page + 1)}
          className={`${
            page === totalPages
              ? 'cursor-not-allowed text-gray-300/30'
              : 'text-gray-300'
          }`}
        >
          <ChevronDown />
        </PaginationButton>
      </>
    )
  }

  const pagesCountText = `Exibindo ${
    totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  } -
  ${
    currentPage * itemsPerPage < totalItems
      ? currentPage * itemsPerPage
      : totalItems
  } de ${totalItems}`

  return (
    <nav
      className="flex w-full items-center justify-between"
      aria-label="Table navigation"
    >
      <span className="font-medium">{pagesCountText}</span>
      <ul className="flex items-center rounded-[11px]">
        {renderTablePagination()}
      </ul>
    </nav>
  )
}

export function PaginationButton({
  children,
  isActive = false,
  className,
}: ButtonProps & {
  children: React.ReactNode
  isActive?: boolean
  className?: string
}) {
  return (
    <UI.Button className={cn(className, isActive && 'bg-primary')}>
      {children}
    </UI.Button>
  )
}

export function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => from + index + 1)
    .filter((page) => page > 0)
}
