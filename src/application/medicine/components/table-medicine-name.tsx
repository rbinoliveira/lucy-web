import { Pill } from 'lucide-react'

import {
  administrationRouteLabels,
  MedicineModel,
} from '@/application/medicine/models/medicine.model'

type TableMedicineNameProps = {
  medicine: MedicineModel
}

export function TableMedicineName({ medicine }: TableMedicineNameProps) {
  const routeLabel = administrationRouteLabels[medicine.administrationRoute]

  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
        <Pill className="text-primary h-5 w-5" />
      </div>
      <div className="flex flex-col gap-[0.375rem]">
        <span className="font-semibold">{medicine.name}</span>
        <span className="text-text-six text-xs">{routeLabel}</span>
      </div>
    </div>
  )
}
