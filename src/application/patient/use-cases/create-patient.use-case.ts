import api from '@/application/_shared/libs/axios'
import { PatientModel } from '@/application/patient/models/patient.model'
import { SavePatientUseCaseSchema } from '@/application/patient/schemas/save-patient.schema'

export type CreatePatientUseCaseInput = SavePatientUseCaseSchema
export type CreatePatientUseCaseOutput = PatientModel

export async function createPatientUseCase(
  data: CreatePatientUseCaseInput,
): Promise<CreatePatientUseCaseOutput> {
  const response = await api.post('/api/patient/create', data)
  return response.data
}
