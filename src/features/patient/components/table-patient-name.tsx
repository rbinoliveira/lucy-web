import { PatientModel } from '@/features/patient/models/patient.model'
import { Avatar } from '@/shared/components/avatar'

type TablePatientNameProps = {
  patient: PatientModel
}

export function TablePatientName({ patient }: TablePatientNameProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar imageUrl={patient.photo} name={patient.name} />
      <div className="flex flex-col gap-[0.375rem]">
        <span className="font-semibold">{patient.name}</span>
        <span className="text-text-six text-xs">{patient.email}</span>
      </div>
    </div>
  )
}
