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
      <span className="font-medium text-sm">
        {convertToDateString(patient.dob)}
      </span>
      <span className="text-xs text-text-six">
        {getDifferenceInYears(patient.dob)} anos
      </span>
    </div>
  )
}
