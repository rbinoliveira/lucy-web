import { PatientModel } from '@/features/patient/models/patient.model'
import api from '@/shared/libs/axios'

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
