import api from '@/application/_shared/libs/axios'
import { MedicineModel } from '@/application/medicine/models/medicine.model'
import { SaveMedicineUseCaseSchema } from '@/application/medicine/schemas/save-medicine.schema'

export type UpdateMedicineUseCaseInput = SaveMedicineUseCaseSchema
export type UpdateMedicineUseCaseOutput = MedicineModel

export async function updateMedicineUseCase(
  data: UpdateMedicineUseCaseInput,
): Promise<UpdateMedicineUseCaseOutput> {
  const response = await api.put('/api/medicine/update', data)
  return response.data
}
