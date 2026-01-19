import { remove as removeAccents } from 'diacritics'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

import {
  generateDosage,
  MedicineModel,
} from '@/features/medicine/models/medicine.model'
import { SaveMedicineUseCaseSchema } from '@/features/medicine/schemas/save-medicine.schema'
import { db } from '@/shared/libs/firebase'

export type CreateMedicineUseCaseInput = SaveMedicineUseCaseSchema
export type CreateMedicineUseCaseOutput = MedicineModel

export async function createMedicineUseCase(
  data: CreateMedicineUseCaseInput,
): Promise<CreateMedicineUseCaseOutput> {
  const medicinesRef = collection(db, 'medicines')

  const nameNormalized = removeAccents(data.name.trim().toLowerCase())
  const defaultDosage = data.defaultDosage || generateDosage(data)

  const docRef = await addDoc(medicinesRef, {
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
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return {
    id: docRef.id,
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
