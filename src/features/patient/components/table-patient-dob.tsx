import { PatientModel } from '@/features/patient/models/patient.model'
import {
  convertToDateString,
  getDifferenceInYears,
} from '@/shared/helpers/date.helper'

type TablePatientDobProps = {
  patient: PatientModel
}

export function TablePatientDob({ patient }: TablePatientDobProps) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium">
        {convertToDateString(patient.dob)}
      </span>
      <span className="text-text-six text-xs">
        {getDifferenceInYears(patient.dob)} anos
      </span>
    </div>
  )
}
