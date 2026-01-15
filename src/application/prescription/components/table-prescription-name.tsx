import { Avatar } from '@/application/_shared/components/atoms/avatar'
import { PrescriptionModel } from '@/application/prescription/models/prescription.model'

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
