import api from '@/application/_shared/libs/axios'
import { PrescriptionModel } from '@/application/prescription/models/prescription.model'
import { SavePrescriptionUseCaseSchema } from '@/application/prescription/schemas/save-prescription.schema'

export type UpdatePrescriptionUseCaseInput = SavePrescriptionUseCaseSchema
export type UpdatePrescriptionUseCaseOutput = PrescriptionModel

export async function updatePrescriptionUseCase(
  data: UpdatePrescriptionUseCaseInput,
): Promise<UpdatePrescriptionUseCaseOutput> {
  const response = await api.put('/api/prescription/update', data)
  return response.data
}
