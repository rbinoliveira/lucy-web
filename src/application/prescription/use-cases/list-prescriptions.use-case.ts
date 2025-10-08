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

import { db } from '@/application/_shared/libs/firebase'
import { ListPaginatedModel } from '@/application/_shared/models/list-paginated.model'
import { PrescriptionModel } from '@/application/prescription/models/prescription.model'

export type ListPrescriptionsUseCaseInput = {
  page: number
  itemsPerPage: number
  search?: string
}

export type ListPrescriptionsUseCaseOutput =
  ListPaginatedModel<PrescriptionModel>

export async function listPrescriptionsUseCase({
  page,
  itemsPerPage,
  search,
}: ListPrescriptionsUseCaseInput): Promise<ListPrescriptionsUseCaseOutput> {
  const prescriptionsRef = collection(db, 'prescriptions')

  const baseQuery = query(
    prescriptionsRef,

    orderBy('nameNormalized'),
  )

  console.log(baseQuery)

  // 🔹 Se tiver busca, normalizamos nome e telefone
  if (search && search.trim()) {
    const searchNormalized = removeAccents(search.trim().toLowerCase())

    const endName = searchNormalized.replace(/.$/, (c: string) =>
      String.fromCharCode(c.charCodeAt(0) + 1),
    )

    // 🔹 Query por nome
    const queryByName = query(
      prescriptionsRef,
      where('nameNormalized', '>=', searchNormalized),
      where('nameNormalized', '<', endName),
      orderBy('nameNormalized'),
    )

    // 🔹 Buscar os dois conjuntos e unir IDs (evita duplicados)
    const [snapName] = await Promise.all([getDocs(queryByName)])

    const allDocs = [...snapName.docs]
    const uniqueDocsMap = new Map(allDocs.map((doc) => [doc.id, doc]))
    const uniqueDocs = Array.from(uniqueDocsMap.values())

    // 🔹 Paginação manual
    const totalItems = uniqueDocs.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    const pageDocs = uniqueDocs.slice(start, end)

    const prescriptions = pageDocs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<PrescriptionModel, 'id'>),
    }))

    return {
      items: prescriptions,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage,
    }
  }

  console.log('baseQuery')

  // 🔹 Caso não tenha busca
  const countSnap = await getCountFromServer(baseQuery)

  console.log(countSnap)

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

  const prescriptions = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<PrescriptionModel, 'id'>),
  }))

  console.log(prescriptions)

  return {
    items: prescriptions,
    totalItems,
    totalPages,
    currentPage: page,
    itemsPerPage,
  }
}
