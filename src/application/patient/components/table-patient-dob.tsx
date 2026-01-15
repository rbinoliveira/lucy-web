import {
  convertToDateString,
  getDifferenceInYears,
} from '@/application/_shared/helpers/date.helper'
import { PatientModel } from '@/application/patient/models/patient.model'

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
