import api from '@/application/_shared/libs/axios'
import { MedicineModel } from '@/application/medicine/models/medicine.model'

export type DeleteMedicineUseCaseInput = {
  id: string
}
export type DeleteMedicineUseCaseOutput = MedicineModel

export async function deleteMedicineUseCase(
  params: DeleteMedicineUseCaseInput,
): Promise<DeleteMedicineUseCaseOutput> {
  const response = await api.delete(`/api/medicine/delete/${params.id}`)
  return response.data
}
