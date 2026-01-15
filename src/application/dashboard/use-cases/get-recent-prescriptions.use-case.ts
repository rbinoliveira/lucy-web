import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'

import { db } from '@/application/_shared/libs/firebase'

export type RecentPrescriptionItem = {
  id: string
  patientName: string
  medication: string
  createdAt: Date
  status: 'synced' | 'pending'
}

export type GetRecentPrescriptionsInput = {
  ownerId: string
  limitCount?: number
}

export async function getRecentPrescriptionsUseCase({
  ownerId,
  limitCount = 5,
}: GetRecentPrescriptionsInput): Promise<RecentPrescriptionItem[]> {
  if (!ownerId || ownerId.trim() === '') {
    return []
  }

  const prescriptionsRef = collection(db, 'prescriptions')

  const recentQuery = query(
    prescriptionsRef,
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  )

  const snapshot = await getDocs(recentQuery)

  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      patientName: data.patientName || 'Paciente',
      medication: data.medication || data.medicineName || 'Medicamento',
      createdAt: data.createdAt?.toDate() || new Date(),
      status: data.syncStatus === 'synced' ? 'synced' : 'pending',
    }
  })
}
