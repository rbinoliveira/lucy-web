import api from '@/application/_shared/libs/axios'
import { PatientModel } from '@/application/patient/models/patient.model'

export type ShowPatientUseCaseInput = {
  id: string
}
export type ShowPatientUseCaseOutput = PatientModel

export async function showPatientUseCase(
  params: ShowPatientUseCaseInput,
): Promise<ShowPatientUseCaseOutput> {
  const response = await api.get(`/api/patient/show/${params.id}`)
  return response.data
}
