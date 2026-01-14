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
  // 🔹 Validação: se ownerId estiver vazio, retorna resultado vazio
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

  // 🔹 Query para contagem (sem orderBy - não precisa de índice composto)
  const countQuery = query(
    usersRef,
    where('role', '==', 'patient'),
    where('ownerId', '==', ownerId),
  )

  // 🔹 Query para buscar documentos (com orderBy)
  const baseQuery = query(
    usersRef,
    where('role', '==', 'patient'),
    where('ownerId', '==', ownerId),
    orderBy('nameNormalized'),
  )

  // 🔹 Se tiver busca, normalizamos nome e telefone
  if (search && search.trim()) {
    const searchNormalized = removeAccents(search.trim().toLowerCase())
    const searchPhone = search.replace(/\D/g, '')

    const endName = searchNormalized.replace(/.$/, (c: string) =>
      String.fromCharCode(c.charCodeAt(0) + 1),
    )

    const endPhone = searchPhone.replace(/.$/, (c) =>
      String.fromCharCode(c.charCodeAt(0) + 1),
    )

    // 🔹 Query por nome
    const queryByName = query(
      usersRef,
      where('role', '==', 'patient'),
      where('ownerId', '==', ownerId),
      orderBy('nameNormalized'),
      where('nameNormalized', '>=', searchNormalized),
      where('nameNormalized', '<', endName),
    )

    // 🔹 Query por telefone
    const queryByPhone = query(
      usersRef,
      where('role', '==', 'patient'),
      where('ownerId', '==', ownerId),
      orderBy('phoneNormalized'),
      where('phoneNormalized', '>=', searchPhone),
      where('phoneNormalized', '<', endPhone),
    )

    // 🔹 Buscar os dois conjuntos e unir IDs (evita duplicados)
    const [snapName, snapPhone] = await Promise.all([
      getDocs(queryByName),
      getDocs(queryByPhone),
    ])

    const allDocs = [...snapName.docs, ...snapPhone.docs]
    const uniqueDocsMap = new Map(allDocs.map((doc) => [doc.id, doc]))
    const uniqueDocs = Array.from(uniqueDocsMap.values())

    // 🔹 Paginação manual
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

  // 🔹 Caso não tenha busca
  // 🔹 Como as regras de segurança não permitem getCountFromServer no cliente,
  // 🔹 buscamos todos os documentos para contar (alternativa: criar API route no servidor)
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
