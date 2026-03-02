'use client'

import { Edit } from 'lucide-react'
import Link from 'next/link'

import { PatientModel } from '@/features/patient/models/patient.model'
import { Button } from '@/shared/components/button'
import { appRoutes } from '@/shared/constants/app-routes.constant'
import {
  convertToDateString,
  getDifferenceInYears,
} from '@/shared/helpers/date.helper'

type PatientProfileHeaderProps = {
  patient: PatientModel
}

export function PatientProfileHeader({ patient }: PatientProfileHeaderProps) {
  const age = getDifferenceInYears(patient.dob)

  return (
    <header className="rounded-2xl border border-white/40 bg-white/60 px-5 py-6 shadow-three backdrop-blur-sm md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-text-one text-2xl font-bold tracking-tight md:text-3xl">
            {patient.name}
          </h1>
          <p className="text-text-two mt-1 text-sm">
            {convertToDateString(patient.dob)} · {age}{' '}
            {age === 1 ? 'ano' : 'anos'}
          </p>
        </div>
        <Button variant="secondary" asChild>
          <Link
            href={`${appRoutes.patients}/${patient.id}/editar`}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Link>
        </Button>
      </div>
    </header>
  )
}
