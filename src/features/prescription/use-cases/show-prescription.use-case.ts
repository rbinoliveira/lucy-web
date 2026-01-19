import { PrescriptionModel } from '@/features/prescription/models/prescription.model'
import api from '@/shared/libs/axios'

export type ShowPrescriptionUseCaseInput = {
  id: string
}
export type ShowPrescriptionUseCaseOutput = PrescriptionModel

export async function showPrescriptionUseCase(
  params: ShowPrescriptionUseCaseInput,
): Promise<ShowPrescriptionUseCaseOutput> {
  const response = await api.get(`/api/prescription/show/${params.id}`)
  return response.data
}
