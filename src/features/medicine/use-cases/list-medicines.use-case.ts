import { remove as removeAccents } from 'diacritics'
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore'

import { MedicineModel } from '@/features/medicine/models/medicine.model'
import { db } from '@/shared/libs/firebase'
import { ListPaginatedModel } from '@/shared/models/list-paginated.model'

export type ListMedicinesUseCaseInput = {
  page: number
  itemsPerPage: number
  search?: string
}

export type ListMedicinesUseCaseOutput = ListPaginatedModel<MedicineModel>

export async function listMedicinesUseCase({
  page,
  itemsPerPage,
  search,
}: ListMedicinesUseCaseInput): Promise<ListMedicinesUseCaseOutput> {
  const usersRef = collection(db, 'medicines')

  const baseQuery = query(
    usersRef,

    orderBy('nameNormalized'),
  )

  if (search && search.trim()) {
    const searchNormalized = removeAccents(search.trim().toLowerCase())

    const endName = searchNormalized.replace(/.$/, (c: string) =>
      String.fromCharCode(c.charCodeAt(0) + 1),
    )

    const queryByName = query(
      usersRef,
      where('nameNormalized', '>=', searchNormalized),
      where('nameNormalized', '<', endName),
      orderBy('nameNormalized'),
    )

    const [snapName] = await Promise.all([getDocs(queryByName)])

    const allDocs = [...snapName.docs]
    const uniqueDocsMap = new Map(allDocs.map((doc) => [doc.id, doc]))
    const uniqueDocs = Array.from(uniqueDocsMap.values())

    const totalItems = uniqueDocs.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    const pageDocs = uniqueDocs.slice(start, end)

    const medicines = pageDocs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<MedicineModel, 'id'>),
    }))

    return {
      items: medicines,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage,
    }
  }

  const countSnap = await getCountFromServer(baseQuery)
  const totalItems = countSnap.data().count
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const skip = (page - 1) * itemsPerPage
  let startAfterDoc = null

  if (skip > 0) {
    const prevSnapshot = await getDocs(query(baseQuery, limit(skip)))
    const docs = prevSnapshot.docs
    if (docs.length > 0) {
      startAfterDoc = docs[docs.length - 1]
    }
  }

  let finalQuery = baseQuery
  if (startAfterDoc) {
    finalQuery = query(baseQuery, startAfter(startAfterDoc))
  }

  const snapshot = await getDocs(query(finalQuery, limit(itemsPerPage)))

  const medicines = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<MedicineModel, 'id'>),
  }))

  return {
    items: medicines,
    totalItems,
    totalPages,
    currentPage: page,
    itemsPerPage,
  }
}
