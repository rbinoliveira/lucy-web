export type PrescriptionStatus = 'active' | 'finished' | 'cancelled'

export type PrescriptionModel = {
  id: string
  patientId: string
  patientEmail: string
  patientName: string
  patientNameNormalized: string
  medicineId: string
  medicineName: string
  medicineNameNormalized: string
  dosage: string
  durationDays?: number | null
  durationDescription?: string | null
  notes?: string | null
  ownerId: string
  status: PrescriptionStatus
  createdAt?: Date | string
  updatedAt?: Date | string
}

export const prescriptionStatusLabels: Record<PrescriptionStatus, string> = {
  active: 'Ativa',
  finished: 'Finalizada',
  cancelled: 'Cancelada',
}
