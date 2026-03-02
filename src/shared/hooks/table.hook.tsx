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
  updateItemsPerPage: (value: number) => void
  form: UseFormReturn<{ itemsPerPage: number }>
}

const TableContext = createContext<TableContextType>({} as TableContextType)

const DEFAULT_CURRENT_PAGE = 1
const DEFAULT_SEARCH = ''
const DEFAULT_ITEMS_PER_PAGE = 25

export function TableProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<number>(DEFAULT_CURRENT_PAGE)
  const [search, setSearch] = useState<string>(DEFAULT_SEARCH)
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    DEFAULT_ITEMS_PER_PAGE,
  )

  const form = useForm({
    defaultValues: {
      itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    },
  })

  const pathname = usePathname()

  function updateCurrentPage(page: number) {
    setCurrentPage(page)
  }

  function updateSearch(search: string) {
    setSearch(search)
  }

  function updateItemsPerPage(value: number) {
    setItemsPerPage(value)
    form.setValue('itemsPerPage', value)
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      setCurrentPage(DEFAULT_CURRENT_PAGE)
      setSearch(DEFAULT_SEARCH)
      setItemsPerPage(DEFAULT_ITEMS_PER_PAGE)
      form.reset({
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
      })
    })
  }, [pathname, form])

  useEffect(() => {
    requestAnimationFrame(() => {
      setCurrentPage(DEFAULT_CURRENT_PAGE)
    })
  }, [search])

  return (
    <TableContext.Provider
      value={{
        currentPage,
        search,
        itemsPerPage,
        updateCurrentPage,
        updateSearch,
        updateItemsPerPage,
        form,
      }}
    >
      {children}
    </TableContext.Provider>
  )
}

export const useTable = () => useContext(TableContext)
