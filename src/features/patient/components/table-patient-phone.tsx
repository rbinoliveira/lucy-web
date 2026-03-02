import { PatientModel } from '@/features/patient/models/patient.model'

type TablePatientPhoneProps = {
  patient: PatientModel
}

export function TablePatientPhone({ patient }: TablePatientPhoneProps) {
  return <span className="text-sm font-medium">{patient.phone}</span>
}
