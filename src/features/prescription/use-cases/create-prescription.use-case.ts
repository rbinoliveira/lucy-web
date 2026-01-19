import { PrescriptionModel } from '@/features/prescription/models/prescription.model'
import { SavePrescriptionUseCaseSchema } from '@/features/prescription/schemas/save-prescription.schema'
import api from '@/shared/libs/axios'

export type CreatePrescriptionUseCaseInput = SavePrescriptionUseCaseSchema
export type CreatePrescriptionUseCaseOutput = PrescriptionModel

export async function createPrescriptionUseCase(
  data: CreatePrescriptionUseCaseInput,
): Promise<CreatePrescriptionUseCaseOutput> {
  const response = await api.post('/api/prescription/create', data)
  return response.data
}
