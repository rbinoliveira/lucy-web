export type ListPaginatedModel<T> = {
  items: T[]
  totalItems: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
}
