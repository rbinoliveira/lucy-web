import { deleteDoc, doc } from 'firebase/firestore'

import { db } from '@/shared/libs/firebase'

export type DeletePatientUseCaseInput = {
  id: string
}
export type DeletePatientUseCaseOutput = void

export async function deletePatientUseCase(
  params: DeletePatientUseCaseInput,
): Promise<DeletePatientUseCaseOutput> {
  const patientRef = doc(db, 'users', params.id)
  await deleteDoc(patientRef)
}
