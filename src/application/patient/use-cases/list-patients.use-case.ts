import { remove as removeAccents } from 'diacritics'
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore'

import { db } from '@/application/_shared/libs/firebase'
import { ListPaginatedModel } from '@/application/_shared/models/list-paginated.model'
import { PatientModel } from '@/application/patient/models/patient.model'

export type ListPatientsUseCaseInput = {
  ownerId: string
  page: number
  itemsPerPage: number
  search?: string
}

export type ListPatientsUseCaseOutput = ListPaginatedModel<PatientModel>

export async function listPatientsUseCase({
  ownerId,
  page,
  itemsPerPage,
  search,
}: ListPatientsUseCaseInput): Promise<ListPatientsUseCaseOutput> {
  if (!ownerId || ownerId.trim() === '') {
    return {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: page,
      itemsPerPage,
    }
  }

  const usersRef = collection(db, 'users')

  const countQuery = query(
    usersRef,
    where('role', '==', 'patient'),
    where('ownerId', '==', ownerId),
  )

  const baseQuery = query(
    usersRef,
    where('role', '==', 'patient'),
    where('ownerId', '==', ownerId),
    orderBy('nameNormalized'),
  )

  if (search && search.trim()) {
    const searchNormalized = removeAccents(search.trim().toLowerCase())
    const searchPhone = search.replace(/\D/g, '')

    const endName = searchNormalized.replace(/.$/, (c: string) =>
      String.fromCharCode(c.charCodeAt(0) + 1),
    )

    const endPhone = searchPhone.replace(/.$/, (c) =>
      String.fromCharCode(c.charCodeAt(0) + 1),
    )

    const queryByName = query(
      usersRef,
      where('role', '==', 'patient'),
      where('ownerId', '==', ownerId),
      orderBy('nameNormalized'),
      where('nameNormalized', '>=', searchNormalized),
      where('nameNormalized', '<', endName),
    )

    const queryByPhone = query(
      usersRef,
      where('role', '==', 'patient'),
      where('ownerId', '==', ownerId),
      orderBy('phoneNormalized'),
      where('phoneNormalized', '>=', searchPhone),
      where('phoneNormalized', '<', endPhone),
    )

    const [snapName, snapPhone] = await Promise.all([
      getDocs(queryByName),
      getDocs(queryByPhone),
    ])

    const allDocs = [...snapName.docs, ...snapPhone.docs]
    const uniqueDocsMap = new Map(allDocs.map((doc) => [doc.id, doc]))
    const uniqueDocs = Array.from(uniqueDocsMap.values())

    const totalItems = uniqueDocs.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    const pageDocs = uniqueDocs.slice(start, end)

    const patients = pageDocs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<PatientModel, 'id'>),
    }))

    return {
      items: patients,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage,
    }
  }

  const countSnapshot = await getDocs(countQuery)
  const totalItems = countSnapshot.size
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

  const patients = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<PatientModel, 'id'>),
  }))

  return {
    items: patients,
    totalItems,
    totalPages,
    currentPage: page,
    itemsPerPage,
  }
}
