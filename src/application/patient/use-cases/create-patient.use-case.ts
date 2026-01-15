import { remove as removeAccents } from 'diacritics'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

import { db } from '@/application/_shared/libs/firebase'
import {
  Gender,
  PatientModel,
} from '@/application/patient/models/patient.model'
import { SavePatientUseCaseSchema } from '@/application/patient/schemas/save-patient.schema'

export type CreatePatientUseCaseInput = SavePatientUseCaseSchema
export type CreatePatientUseCaseOutput = PatientModel

export async function createPatientUseCase(
  data: CreatePatientUseCaseInput,
): Promise<CreatePatientUseCaseOutput> {
  const usersRef = collection(db, 'users')

  const nameNormalized = removeAccents(data.name.trim().toLowerCase())
  const phoneNormalized = data.phone.replace(/\D/g, '')

  const docRef = await addDoc(usersRef, {
    name: data.name,
    nameNormalized,
    phone: data.phone,
    phoneNormalized,
    dob: new Date(data.dob),
    gender: data.gender,
    role: 'patient',
    ownerId: data.ownerId,
    email: data.email || null,
    cpf: data.cpf || null,
    susNumber: data.susNumber || null,
    address: data.address || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return {
    id: docRef.id,
    name: data.name,
    nameNormalized,
    phone: data.phone,
    phoneNormalized,
    dob: new Date(data.dob),
    gender: data.gender as Gender,
    role: 'patient',
    ownerId: data.ownerId,
    email: data.email || undefined,
    cpf: data.cpf || undefined,
    susNumber: data.susNumber || undefined,
    address: data.address || undefined,
  }
}
