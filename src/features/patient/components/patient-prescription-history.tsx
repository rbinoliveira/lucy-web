'use client'

import { FilePlus } from 'lucide-react'
import Link from 'next/link'

import { PatientModel } from '@/features/patient/models/patient.model'
import { TablePrescriptionActions } from '@/features/prescription/components/table-prescription-actions'
import { TablePrescriptionName } from '@/features/prescription/components/table-prescription-name'
import { PrescriptionModel } from '@/features/prescription/models/prescription.model'
import { Button } from '@/shared/components/button'
import { DataHandler } from '@/shared/components/data-handler'
import { appRoutes } from '@/shared/constants/app-routes.constant'
import { ListPaginatedModel } from '@/shared/models/list-paginated.model'

type PatientPrescriptionHistoryProps = {
  patient: PatientModel
  prescriptionsData: ListPaginatedModel<PrescriptionModel> | undefined
  isError: boolean
  isLoading: boolean
}

export function PatientPrescriptionHistory({
  patient,
  prescriptionsData,
  isError,
  isLoading,
}: PatientPrescriptionHistoryProps) {
  return (
    <section className="glass-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Histórico de Prescrições</h2>
          <p className="card-subtitle">Prescrições vinculadas ao paciente</p>
        </div>
        <Button variant="primary" asChild>
          <Link
            href={`${appRoutes.prescriptions}/adicionar?patientName=${encodeURIComponent(patient.name)}`}
          >
            <FilePlus className="h-4 w-4" />
            Nova Prescrição
          </Link>
        </Button>
      </div>
      <DataHandler isError={isError} isLoading={isLoading}>
        {prescriptionsData && prescriptionsData.items.length > 0 ? (
          <div className="divide-border-one flex flex-col divide-y rounded-xl">
            {prescriptionsData.items.map((prescription) => (
              <div
                key={prescription.id}
                className="flex items-center justify-between gap-4 px-1 py-4 first:pt-0"
              >
                <TablePrescriptionName prescription={prescription} />
                <TablePrescriptionActions prescription={prescription} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-two py-8 text-center text-sm">
            Nenhuma prescrição encontrada
          </p>
        )}
      </DataHandler>
    </section>
  )
}
