'use client'

import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'

type TableContextType = {
  currentPage: number
  search: string
  itemsPerPage: number
  updateCurrentPage: (page: number) => void
  updateSearch: (search: string) => void
  form: UseFormReturn<{ itemsPerPage: number }>
}

const TableContext = createContext<TableContextType>({} as TableContextType)

const DEFAULT_CURRENT_PAGE = 1
const DEFAULT_SEARCH = ''
const DEFAULT_ITEMS_PER_PAGE = 10

export function TableProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<number>(DEFAULT_CURRENT_PAGE)
  const [search, setSearch] = useState<string>(DEFAULT_SEARCH)

  const form = useForm({
    defaultValues: {
      itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    },
  })

  const itemsPerPage = form.watch('itemsPerPage')

  const pathname = usePathname()

  function updateCurrentPage(page: number) {
    setCurrentPage(page)
  }

  function updateSearch(search: string) {
    setSearch(search)
  }

  useEffect(() => {
    setCurrentPage(DEFAULT_CURRENT_PAGE)
    setSearch(DEFAULT_SEARCH)
    form.reset({
      itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    })
  }, [pathname, form])

  useEffect(() => {
    setCurrentPage(DEFAULT_CURRENT_PAGE)
  }, [search])

  return (
    <TableContext.Provider
      value={{
        currentPage,
        search,
        itemsPerPage,
        updateCurrentPage,
        updateSearch,
        form,
      }}
    >
      {children}
    </TableContext.Provider>
  )
}

export const useTable = () => useContext(TableContext)
