import { PrescriptionModel } from '@/features/prescription/models/prescription.model'
import api from '@/shared/libs/axios'

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
