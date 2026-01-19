import { PrescriptionModel } from '@/features/prescription/models/prescription.model'
import { Avatar } from '@/shared/components/atoms/avatar'

type TablePrescriptionNameProps = {
  prescription: PrescriptionModel
}

export function TablePrescriptionName({
  prescription,
}: TablePrescriptionNameProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar imageUrl={prescription.photo} name={prescription.name} />
      <div className="flex flex-col gap-[0.375rem]">
        <span className="font-semibold">{prescription.name}</span>
        <span className="text-text-six text-xs">{prescription.email}</span>
      </div>
    </div>
  )
}
