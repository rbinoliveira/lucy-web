import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'

import { ActivityType } from '@/features/dashboard/components/recent-activity'
import { db } from '@/shared/libs/firebase'

export type RecentActivityItem = {
  id: string
  type: ActivityType
  description: string
  createdAt: Date
}

export type GetRecentActivitiesInput = {
  ownerId: string
  limitCount?: number
}

export async function getRecentActivitiesUseCase({
  ownerId,
  limitCount = 5,
}: GetRecentActivitiesInput): Promise<RecentActivityItem[]> {
  if (!ownerId || ownerId.trim() === '') {
    return []
  }

  const activitiesRef = collection(db, 'activities')

  const recentQuery = query(
    activitiesRef,
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  )

  try {
    const snapshot = await getDocs(recentQuery)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        type: data.type || 'prescription',
        description: data.description || 'Atividade do sistema',
        createdAt: data.createdAt?.toDate() || new Date(),
      }
    })
  } catch {
    return []
  }
}
