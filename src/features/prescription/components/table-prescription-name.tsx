import { PrescriptionModel } from '@/features/prescription/models/prescription.model'
import { Avatar } from '@/shared/components/avatar'

type TablePrescriptionNameProps = {
  prescription: PrescriptionModel
}

export function TablePrescriptionName({
  prescription,
}: TablePrescriptionNameProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar imageUrl={undefined} name={prescription.patientName} />
      <div className="flex flex-col gap-[0.375rem]">
        <span className="font-semibold">{prescription.patientName}</span>
        <span className="text-text-six text-xs">
          {prescription.patientEmail}
        </span>
      </div>
    </div>
  )
}
