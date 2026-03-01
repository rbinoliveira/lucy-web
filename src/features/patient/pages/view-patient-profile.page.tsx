'use client'

import { useParams } from 'next/navigation'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import { PatientAdherenceBehavior } from '@/features/patient/components/patient-adherence-behavior'
import { PatientInfoCard } from '@/features/patient/components/patient-info-card'
import { PatientPrescriptionHistory } from '@/features/patient/components/patient-prescription-history'
import { PatientPrescriptionStats } from '@/features/patient/components/patient-prescription-stats'
import { PatientProfileHeader } from '@/features/patient/components/patient-profile-header'
import { ShowPatientService } from '@/features/patient/service/show-patient.service'
import { ListPrescriptionsService } from '@/features/prescription/service/list-prescriptions.service'
import { DataHandler } from '@/shared/components/data-handler'
import { useTable } from '@/shared/hooks/table.hook'

export function ViewPatientProfilePage() {
  const params = useParams<{ id: string }>()
  const { itemsPerPage, currentPage } = useTable()
  const { user } = useAuth()

  const {
    data: patient,
    isError,
    isLoading,
  } = ShowPatientService({ id: params.id })

  const {
    data: prescriptionsData,
    isError: isErrorPrescriptions,
    isLoading: isLoadingPrescriptions,
  } = ListPrescriptionsService({
    ownerId: user?.id ?? '',
    page: currentPage,
    itemsPerPage,
    patientEmail: patient?.email ?? undefined,
  })

  if (!patient) return null

  return (
    <DataHandler isError={isError} isLoading={isLoading}>
      <div className="flex flex-col gap-8">
        <PatientProfileHeader patient={patient} />
        <PatientInfoCard patient={patient} />
        <PatientPrescriptionStats prescriptionsData={prescriptionsData} />
        <section className="glass-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Comportamento de adesão</h2>
              <p className="card-subtitle">
                Como o paciente está tomando as medicações
              </p>
            </div>
          </div>
          <PatientAdherenceBehavior counts={null} />
        </section>
        <PatientPrescriptionHistory
          patient={patient}
          prescriptionsData={prescriptionsData}
          isError={isErrorPrescriptions}
          isLoading={isLoadingPrescriptions}
        />
      </div>
    </DataHandler>
  )
}
