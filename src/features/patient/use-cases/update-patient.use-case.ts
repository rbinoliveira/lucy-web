import { remove as removeAccents } from 'diacritics'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'

import { Gender, PatientModel } from '@/features/patient/models/patient.model'
import { SavePatientUseCaseSchema } from '@/features/patient/schemas/save-patient.schema'
import { db } from '@/shared/libs/firebase'

export type UpdatePatientUseCaseInput = SavePatientUseCaseSchema & {
  id: string
}
export type UpdatePatientUseCaseOutput = PatientModel

export async function updatePatientUseCase(
  data: UpdatePatientUseCaseInput,
): Promise<UpdatePatientUseCaseOutput> {
  const patientRef = doc(db, 'users', data.id)

  const nameNormalized = removeAccents(data.name.trim().toLowerCase())
  const phoneNormalized = data.phone.replace(/\D/g, '')

  await updateDoc(patientRef, {
    name: data.name,
    nameNormalized,
    phone: data.phone,
    phoneNormalized,
    dob: new Date(data.dob),
    gender: data.gender,
    email: data.email || null,
    cpf: data.cpf || null,
    susNumber: data.susNumber || null,
    address: data.address || null,
    updatedAt: serverTimestamp(),
  })

  return {
    id: data.id,
    name: data.name,
    nameNormalized,
    phone: data.phone,
    phoneNormalized,
    dob: new Date(data.dob),
    gender: data.gender as Gender,
    role: 'patient',
    ownerId: data.ownerId,
    email: data.email,
    cpf: data.cpf || undefined,
    susNumber: data.susNumber || undefined,
    address: data.address || undefined,
  }
}
