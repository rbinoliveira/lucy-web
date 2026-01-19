import { doc, getDoc } from 'firebase/firestore'

import { MedicineModel } from '@/features/medicine/models/medicine.model'
import { db } from '@/shared/libs/firebase'

export type ShowMedicineUseCaseInput = {
  id: string
}
export type ShowMedicineUseCaseOutput = MedicineModel | null

export async function showMedicineUseCase(
  params: ShowMedicineUseCaseInput,
): Promise<ShowMedicineUseCaseOutput> {
  const medicineRef = doc(db, 'medicines', params.id)
  const snapshot = await getDoc(medicineRef)

  if (!snapshot.exists()) {
    return null
  }

  const data = snapshot.data()
  return {
    id: snapshot.id,
    name: data.name,
    nameNormalized: data.nameNormalized,
    dose: data.dose,
    pharmaceuticalForm: data.pharmaceuticalForm,
    administrationRoute: data.administrationRoute,
    quantity: data.quantity,
    intervalHours: data.intervalHours,
    durationDays: data.durationDays,
    whilePain: data.whilePain,
    defaultDosage: data.defaultDosage,
    ownerId: data.ownerId,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  }
}
