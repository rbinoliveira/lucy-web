import { PrescriptionModel } from '@/application/prescription/models/prescription.model'

type TablePrescriptionDoseProps = {
  prescription: PrescriptionModel
}

export function TablePrescriptionDose({
  prescription,
}: TablePrescriptionDoseProps) {
  return <span className="text-sm font-medium">{prescription.phone}</span>
}
