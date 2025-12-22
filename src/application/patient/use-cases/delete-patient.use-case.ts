import api from '@/application/_shared/libs/axios'
import { PatientModel } from '@/application/patient/models/patient.model'

export type DeletePatientUseCaseInput = {
  id: string
}
export type DeletePatientUseCaseOutput = PatientModel

export async function deletePatientUseCase(
  params: DeletePatientUseCaseInput,
): Promise<DeletePatientUseCaseOutput> {
  const response = await api.delete(`/api/patient/delete/${params.id}`)
  return response.data
}
