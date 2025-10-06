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
  const usersRef = collection(db, 'users')

  let baseQuery = query(
    usersRef,
    where('role', '==', 'patient'),
    where('ownerId', '==', ownerId),
    orderBy('name'),
  )

  if (search && search.trim()) {
    const end = search.replace(/.$/, (c) =>
      String.fromCharCode(c.charCodeAt(0) + 1),
    )
    baseQuery = query(
      usersRef,
      where('role', '==', 'patient'),
      where('ownerId', '==', ownerId),
      orderBy('name'),
      where('name', '>=', search),
      where('name', '<', end),
    )
  }

  // 📊 Contagem total
  const countSnap = await getCountFromServer(baseQuery)
  const totalItems = countSnap.data().count
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // 📄 Paginação
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
