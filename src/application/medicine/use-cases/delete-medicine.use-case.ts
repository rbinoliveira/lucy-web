import { deleteDoc, doc } from 'firebase/firestore'

import { db } from '@/application/_shared/libs/firebase'

export type DeleteMedicineUseCaseInput = {
  id: string
}
export type DeleteMedicineUseCaseOutput = void

export async function deleteMedicineUseCase(
  params: DeleteMedicineUseCaseInput,
): Promise<DeleteMedicineUseCaseOutput> {
  const medicineRef = doc(db, 'medicines', params.id)
  await deleteDoc(medicineRef)
}
