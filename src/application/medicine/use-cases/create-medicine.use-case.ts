import api from '@/application/_shared/libs/axios'
import { MedicineModel } from '@/application/medicine/models/medicine.model'
import { SaveMedicineUseCaseSchema } from '@/application/medicine/schemas/save-medicine.schema'

export type CreateMedicineUseCaseInput = SaveMedicineUseCaseSchema
export type CreateMedicineUseCaseOutput = MedicineModel

export async function createMedicineUseCase(
  data: CreateMedicineUseCaseInput,
): Promise<CreateMedicineUseCaseOutput> {
  const response = await api.post('/api/medicine/create', data)
  return response.data
}
