import { Avatar } from '@/application/_shared/components/atoms/avatar'
import { PatientModel } from '@/application/patient/models/patient.model'

type TablePatientNameProps = {
  patient: PatientModel
}

export function TablePatientName({ patient }: TablePatientNameProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar imageUrl={patient.photo} name={patient.name} />
      <div className="flex flex-col gap-[0.375rem]">
        <span className="font-semibold">{patient.name}</span>
        <span className="text-xs text-text-six">{patient.email}</span>
      </div>
    </div>
  )
}
