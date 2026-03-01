'use client'

import {
  Archive,
  Calendar,
  CheckCircle,
  Edit,
  FilePlus,
  FileText,
  Mail,
  MapPin,
  Phone,
  Target,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import { MetricCard } from '@/features/dashboard/components/metric-card'
import { genderLabels } from '@/features/patient/models/patient.model'
import { PatientAdherenceBehavior } from '@/features/patient/components/patient-adherence-behavior'
import { ShowPatientService } from '@/features/patient/service/show-patient.service'
import { TablePrescriptionActions } from '@/features/prescription/components/table-prescription-actions'
import { TablePrescriptionName } from '@/features/prescription/components/table-prescription-name'
import { ListPrescriptionsService } from '@/features/prescription/service/list-prescriptions.service'
import { Button } from '@/shared/components/atoms/button'
import { DataHandler } from '@/shared/components/molecules/data-handler'
import { appRoutes } from '@/shared/constants/app-routes.constant'
import { convertToDateString, getDifferenceInYears } from '@/shared/helpers/date.helper'
import { useTable } from '@/shared/hooks/table.hook'

export function ViewPatientProfilePage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const { itemsPerPage, currentPage } = useTable()

  const { data: patient, isError, isLoading } = ShowPatientService({ id })

  const { user } = useAuth()

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

  if (!patient) {
    return null
  }

  const age = getDifferenceInYears(patient.dob)

  const formatAddress = () => {
    if (!patient.address) return 'Não informado'
    const addr = patient.address
    const parts = [
      addr.street && addr.number && `${addr.street}, ${addr.number}`,
      addr.complement,
      addr.neighborhood,
      addr.city && addr.state && `${addr.city} - ${addr.state}`,
      addr.zipCode,
    ].filter(Boolean)
    return parts.length > 0 ? parts.join(', ') : 'Não informado'
  }

  const totalPrescriptions = prescriptionsData?.totalItems ?? 0
  const activePrescriptions = totalPrescriptions
  const finishedPrescriptions = 0
  const adherenceRate = 0

  const adherenceBehavior = null

  return (
    <DataHandler isError={isError} isLoading={isLoading}>
      <div className="flex flex-col gap-8">
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

        <section className="glass-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Informações do Paciente</h2>
              <p className="card-subtitle">Dados cadastrais</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl bg-black/2 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="text-text-three text-xs">Nome</span>
                <p className="text-text-one font-medium">{patient.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-black/2 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="text-text-three text-xs">
                  Data de Nascimento
                </span>
                <p className="text-text-one font-medium">
                  {convertToDateString(patient.dob)} ({age}{' '}
                  {age === 1 ? 'ano' : 'anos'})
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-black/2 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="text-text-three text-xs">Gênero</span>
                <p className="text-text-one font-medium">
                  {genderLabels[patient.gender]}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-black/2 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="text-text-three text-xs">Telefone</span>
                <p className="text-text-one font-medium">{patient.phone}</p>
              </div>
            </div>
            {patient.email && (
              <div className="flex items-start gap-3 rounded-xl bg-black/2 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-text-three text-xs">E-mail</span>
                  <p className="text-text-one font-medium">{patient.email}</p>
                </div>
              </div>
            )}
            {patient.address && (
              <div className="flex items-start gap-3 rounded-xl bg-black/2 p-3 sm:col-span-2 lg:col-span-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-text-three text-xs">Endereço</span>
                  <p className="text-text-one font-medium">{formatAddress()}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="stats-grid">
          <MetricCard
            icon={<FileText className="h-7 w-7 text-white" />}
            iconBgColor="bg-primary/90"
            value={totalPrescriptions}
            label="Total de Prescrições"
            description="Prescrições cadastradas"
          />
          <MetricCard
            icon={<CheckCircle className="h-7 w-7 text-white" />}
            iconBgColor="bg-primary"
            value={activePrescriptions}
            label="Prescrições Ativas"
            description="Em tratamento"
          />
          <MetricCard
            icon={<Archive className="h-7 w-7 text-white" />}
            iconBgColor="bg-gray-500"
            value={finishedPrescriptions}
            label="Prescrições Finalizadas"
            description="Tratamento concluído"
          />
          <MetricCard
            icon={<Target className="h-7 w-7 text-white" />}
            iconBgColor="bg-green"
            value={`${adherenceRate}%`}
            label="Taxa de Adesão"
            description="Aderência às medicações"
          />
        </div>

        <section className="glass-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Comportamento de adesão</h2>
              <p className="card-subtitle">
                Como o paciente está tomando as medicações
              </p>
            </div>
          </div>
          <PatientAdherenceBehavior counts={adherenceBehavior} />
        </section>

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
          <DataHandler
            isError={isErrorPrescriptions}
            isLoading={isLoadingPrescriptions}
          >
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
      </div>
    </DataHandler>
  )
}
