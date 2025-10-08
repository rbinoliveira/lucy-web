import api from '@/application/_shared/libs/axios'
import { PrescriptionModel } from '@/application/prescription/models/prescription.model'
import { SavePrescriptionUseCaseSchema } from '@/application/prescription/schemas/save-prescription.schema'

export type CreatePrescriptionUseCaseInput = SavePrescriptionUseCaseSchema
export type CreatePrescriptionUseCaseOutput = PrescriptionModel

export async function createPrescriptionUseCase(
  data: CreatePrescriptionUseCaseInput,
): Promise<CreatePrescriptionUseCaseOutput> {
  const response = await api.post('/api/prescription/create', data)
  return response.data
}
