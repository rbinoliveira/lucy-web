import { remove as removeAccents } from 'diacritics'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'

import {
  generateDosage,
  MedicineModel,
} from '@/features/medicine/models/medicine.model'
import { SaveMedicineUseCaseSchema } from '@/features/medicine/schemas/save-medicine.schema'
import { db } from '@/shared/libs/firebase'

export type UpdateMedicineUseCaseInput = SaveMedicineUseCaseSchema & {
  id: string
}
export type UpdateMedicineUseCaseOutput = MedicineModel

export async function updateMedicineUseCase(
  data: UpdateMedicineUseCaseInput,
): Promise<UpdateMedicineUseCaseOutput> {
  const medicineRef = doc(db, 'medicines', data.id)

  const nameNormalized = removeAccents(data.name.trim().toLowerCase())
  const defaultDosage = data.defaultDosage || generateDosage(data)

  await updateDoc(medicineRef, {
    name: data.name,
    nameNormalized,
    dose: data.dose,
    pharmaceuticalForm: data.pharmaceuticalForm,
    administrationRoute: data.administrationRoute,
    quantity: data.quantity,
    intervalHours: data.intervalHours,
    durationDays: data.durationDays,
    whilePain: data.whilePain || false,
    defaultDosage,
    updatedAt: serverTimestamp(),
  })

  return {
    id: data.id,
    name: data.name,
    nameNormalized,
    dose: data.dose,
    pharmaceuticalForm: data.pharmaceuticalForm,
    administrationRoute: data.administrationRoute,
    quantity: data.quantity,
    intervalHours: data.intervalHours,
    durationDays: data.durationDays,
    whilePain: data.whilePain || false,
    defaultDosage,
    ownerId: data.ownerId,
  }
}
