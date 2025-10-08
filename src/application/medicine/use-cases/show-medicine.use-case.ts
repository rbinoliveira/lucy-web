import api from '@/application/_shared/libs/axios'
import { MedicineModel } from '@/application/medicine/models/medicine.model'

export type ShowMedicineUseCaseInput = {
  id: string
}
export type ShowMedicineUseCaseOutput = MedicineModel

export async function showMedicineUseCase(
  params: ShowMedicineUseCaseInput,
): Promise<ShowMedicineUseCaseOutput> {
  const response = await api.get(`/api/medicine/show/${params.id}`)
  return response.data
}
