import { Avatar } from '@/application/_shared/components/atoms/avatar'
import { MedicineModel } from '@/application/medicine/models/medicine.model'

type TableMedicineNameProps = {
  medicine: MedicineModel
}

export function TableMedicineName({ medicine }: TableMedicineNameProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar imageUrl={medicine.photo} name={medicine.name} />
      <div className="flex flex-col gap-[0.375rem]">
        <span className="font-semibold">{medicine.name}</span>
        <span className="text-xs text-text-six">{medicine.email}</span>
      </div>
    </div>
  )
}
