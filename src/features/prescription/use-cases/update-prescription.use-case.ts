import { PrescriptionModel } from '@/features/prescription/models/prescription.model'
import { SavePrescriptionUseCaseSchema } from '@/features/prescription/schemas/save-prescription.schema'
import api from '@/shared/libs/axios'

export type UpdatePrescriptionUseCaseInput = SavePrescriptionUseCaseSchema
export type UpdatePrescriptionUseCaseOutput = PrescriptionModel

export async function updatePrescriptionUseCase(
  data: UpdatePrescriptionUseCaseInput,
): Promise<UpdatePrescriptionUseCaseOutput> {
  const response = await api.put('/api/prescription/update', data)
  return response.data
}
