import { collection, getDocs, query, where } from 'firebase/firestore'

import { db } from '@/application/_shared/libs/firebase'

export type DashboardMetrics = {
  totalPatients: number
  activePrescriptions: number
  adherenceRate: number
  pendingAlerts: number
}

export type GetDashboardMetricsInput = {
  ownerId: string
}

export async function getDashboardMetricsUseCase({
  ownerId,
}: GetDashboardMetricsInput): Promise<DashboardMetrics> {
  if (!ownerId || ownerId.trim() === '') {
    return {
      totalPatients: 0,
      activePrescriptions: 0,
      adherenceRate: 0,
      pendingAlerts: 0,
    }
  }

  const usersRef = collection(db, 'users')
  const prescriptionsRef = collection(db, 'prescriptions')

  const patientsQuery = query(
    usersRef,
    where('role', '==', 'patient'),
    where('ownerId', '==', ownerId),
  )

  const activePrescriptionsQuery = query(
    prescriptionsRef,
    where('ownerId', '==', ownerId),
    where('status', '==', 'active'),
  )

  const alertsQuery = query(
    prescriptionsRef,
    where('ownerId', '==', ownerId),
    where('hasAlert', '==', true),
  )

  const [patientsSnap, activePrescriptionsSnap, alertsSnap] = await Promise.all(
    [
      getDocs(patientsQuery),
      getDocs(activePrescriptionsQuery),
      getDocs(alertsQuery),
    ],
  )

  const totalPatients = patientsSnap.size
  const activePrescriptions = activePrescriptionsSnap.size
  const pendingAlerts = alertsSnap.size

  let adherenceRate = 0
  if (activePrescriptions > 0) {
    const prescriptionsWithAdherence = activePrescriptionsSnap.docs.filter(
      (doc) => {
        const data = doc.data()
        return data.adherenceRate !== undefined
      },
    )

    if (prescriptionsWithAdherence.length > 0) {
      const totalAdherence = prescriptionsWithAdherence.reduce((sum, doc) => {
        return sum + (doc.data().adherenceRate || 0)
      }, 0)
      adherenceRate = Math.round(
        totalAdherence / prescriptionsWithAdherence.length,
      )
    }
  }

  return {
    totalPatients,
    activePrescriptions,
    adherenceRate,
    pendingAlerts,
  }
}
