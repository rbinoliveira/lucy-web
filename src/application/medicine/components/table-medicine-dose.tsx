import { MedicineModel } from '@/application/medicine/models/medicine.model'

type TableMedicineDoseProps = {
  medicine: MedicineModel
}

export function TableMedicineDose({ medicine }: TableMedicineDoseProps) {
  return <span className="text-sm font-medium">{medicine.dose}</span>
}
