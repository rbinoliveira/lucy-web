import api from '@/application/_shared/libs/axios'
import { PrescriptionModel } from '@/application/prescription/models/prescription.model'

export type DeletePrescriptionUseCaseInput = {
  id: string
}
export type DeletePrescriptionUseCaseOutput = PrescriptionModel

export async function deletePrescriptionUseCase(
  params: DeletePrescriptionUseCaseInput,
): Promise<DeletePrescriptionUseCaseOutput> {
  const response = await api.delete(`/api/prescription/delete/${params.id}`)
  return response.data
}
