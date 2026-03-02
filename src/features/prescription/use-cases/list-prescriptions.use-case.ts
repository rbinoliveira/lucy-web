import { remove as removeAccents } from 'diacritics'
import { collection, getDocs, query, where } from 'firebase/firestore'

import { PrescriptionModel } from '@/features/prescription/models/prescription.model'
import { db } from '@/shared/libs/firebase'
import { ListPaginatedModel } from '@/shared/models/list-paginated.model'

export type ListPrescriptionsUseCaseInput = {
  ownerId: string
  page: number
  itemsPerPage: number
  search?: string
  patientEmail?: string
}

export type ListPrescriptionsUseCaseOutput =
  ListPaginatedModel<PrescriptionModel>

export async function listPrescriptionsUseCase({
  ownerId,
  page,
  itemsPerPage,
  search,
  patientEmail,
}: ListPrescriptionsUseCaseInput): Promise<ListPrescriptionsUseCaseOutput> {
  if (!ownerId || ownerId.trim() === '') {
    return {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: page,
      itemsPerPage,
    }
  }

  const prescriptionsRef = collection(db, 'prescriptions')

  let baseQuery

  if (patientEmail) {
    baseQuery = query(
      prescriptionsRef,
      where('ownerId', '==', ownerId),
      where('patientEmail', '==', patientEmail),
    )
  } else {
    baseQuery = query(prescriptionsRef, where('ownerId', '==', ownerId))
  }

  if (search && search.trim()) {
    const searchNormalized = removeAccents(search.trim().toLowerCase())

    const endName = searchNormalized.replace(/.$/, (c: string) =>
      String.fromCharCode(c.charCodeAt(0) + 1),
    )

    const queryConditions: Parameters<typeof query> = [
      prescriptionsRef,
      where('ownerId', '==', ownerId),
    ]

    if (patientEmail) {
      queryConditions.push(where('patientEmail', '==', patientEmail))
    }

    const baseQueryForSearch = query(...queryConditions)
    const snapshot = await getDocs(baseQueryForSearch)

    const allDocs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<PrescriptionModel, 'id'>),
    }))

    const filteredDocs = allDocs.filter((doc) => {
      const patientNameNormalized = doc.patientNameNormalized || ''
      const medicineNameNormalized = doc.medicineNameNormalized || ''
      return (
        (patientNameNormalized >= searchNormalized &&
          patientNameNormalized < endName) ||
        (medicineNameNormalized >= searchNormalized &&
          medicineNameNormalized < endName)
      )
    })

    filteredDocs.sort((a, b) => {
      const nameA = a.patientNameNormalized || ''
      const nameB = b.patientNameNormalized || ''
      return nameA.localeCompare(nameB)
    })

    const totalItems = filteredDocs.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    const prescriptions = filteredDocs.slice(start, end)

    return {
      items: prescriptions,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage,
    }
  }

  const snapshot = await getDocs(baseQuery)

  const allPrescriptions = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<PrescriptionModel, 'id'>),
  }))

  allPrescriptions.sort((a, b) => {
    const nameA = a.patientNameNormalized || ''
    const nameB = b.patientNameNormalized || ''
    return nameA.localeCompare(nameB)
  })

  const totalItems = allPrescriptions.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const start = (page - 1) * itemsPerPage
  const end = start + itemsPerPage
  const prescriptions = allPrescriptions.slice(start, end)

  return {
    items: prescriptions,
    totalItems,
    totalPages,
    currentPage: page,
    itemsPerPage,
  }
}
