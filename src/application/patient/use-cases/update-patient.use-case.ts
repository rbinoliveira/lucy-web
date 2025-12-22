import api from '@/application/_shared/libs/axios'
import { PatientModel } from '@/application/patient/models/patient.model'
import { SavePatientUseCaseSchema } from '@/application/patient/schemas/save-patient.schema'

export type UpdatePatientUseCaseInput = SavePatientUseCaseSchema
export type UpdatePatientUseCaseOutput = PatientModel

export async function updatePatientUseCase(
  data: UpdatePatientUseCaseInput,
): Promise<UpdatePatientUseCaseOutput> {
  const response = await api.put('/api/patient/update', data)
  return response.data
}
