import api from '@/application/_shared/libs/axios'
import { PrescriptionModel } from '@/application/prescription/models/prescription.model'

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
