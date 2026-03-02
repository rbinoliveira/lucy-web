import { PrescriptionModel } from '@/features/prescription/models/prescription.model'

type TablePrescriptionDoseProps = {
  prescription: PrescriptionModel
}

export function TablePrescriptionDose({
  prescription,
}: TablePrescriptionDoseProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">{prescription.medicineName}</span>
      <span className="text-text-two text-xs">{prescription.dosage}</span>
    </div>
  )
}
