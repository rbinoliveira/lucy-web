'use client'

import {
  Calendar,
  CheckCircle,
  Edit,
  FilePlus,
  FileText,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  User,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { MetricCard } from '@/features/dashboard/components/metric-card'
import { genderLabels } from '@/features/patient/models/patient.model'
import { ShowPatientService } from '@/features/patient/service/show-patient.service'
import { Button } from '@/shared/components/atoms/button'
import { DataHandler } from '@/shared/components/molecules/data-handler'
import { appRoutes } from '@/shared/constants/app-routes.constant'
import {
  convertToDateString,
  getDifferenceInYears,
} from '@/shared/helpers/date.helper'

export function ViewPatientProfilePage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const { data: patient, isError, isLoading } = ShowPatientService({ id })

  if (!patient) {
    return null
  }

  const age = getDifferenceInYears(patient.dob)
  const formattedDob = convertToDateString(patient.dob)

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

  return (
    <DataHandler isError={isError} isLoading={isLoading}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-text-one text-2xl font-bold">{patient.name}</h1>
            <p className="text-text-two text-sm">
              {formattedDob} ({age} {age === 1 ? 'ano' : 'anos'})
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" asChild>
              <Link href={`${appRoutes.patients}/editar/${patient.id}`}>
                <Edit className="h-4 w-4" />
                Editar
              </Link>
            </Button>
            <Button variant="primary" asChild>
              <Link
                href={`${appRoutes.prescriptions}/adicionar?patientId=${patient.id}`}
              >
                <FilePlus className="h-4 w-4" />
                Nova Prescrição
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<FileText className="h-7 w-7 text-white" />}
            iconBgColor="bg-blue-500"
            value={0}
            label="Total de Prescrições"
            description="Prescrições cadastradas"
          />
          <MetricCard
            icon={<CheckCircle className="h-7 w-7 text-white" />}
            iconBgColor="bg-primary"
            value={0}
            label="Prescrições Ativas"
            description="Em tratamento"
          />
          <MetricCard
            icon={<XCircle className="h-7 w-7 text-white" />}
            iconBgColor="bg-gray-500"
            value={0}
            label="Prescrições Finalizadas"
            description="Tratamento concluído"
          />
          <MetricCard
            icon={<TrendingUp className="h-7 w-7 text-white" />}
            iconBgColor="bg-green"
            value="0%"
            label="Taxa de Adesão"
            description="Aderência às medicações"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <section className="shadow-one flex flex-col gap-4 rounded-2xl bg-white p-6">
              <h2 className="text-text-one text-lg font-semibold">
                Histórico de Prescrições
              </h2>
              <div className="divide-border-one flex flex-col divide-y">
                <p className="text-text-two py-4 text-center text-sm">
                  Nenhuma prescrição encontrada
                </p>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <section className="shadow-one flex flex-col gap-4 rounded-2xl bg-white p-6">
              <h2 className="text-text-one text-lg font-semibold">
                Informações do Paciente
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <User className="text-text-three mt-0.5 h-5 w-5" />
                  <div className="flex flex-col">
                    <span className="text-text-two text-xs">Nome</span>
                    <span className="text-text-one text-sm font-medium">
                      {patient.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="text-text-three mt-0.5 h-5 w-5" />
                  <div className="flex flex-col">
                    <span className="text-text-two text-xs">
                      Data de Nascimento
                    </span>
                    <span className="text-text-one text-sm font-medium">
                      {formattedDob} ({age} {age === 1 ? 'ano' : 'anos'})
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="text-text-three mt-0.5 h-5 w-5" />
                  <div className="flex flex-col">
                    <span className="text-text-two text-xs">Gênero</span>
                    <span className="text-text-one text-sm font-medium">
                      {genderLabels[patient.gender]}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="text-text-three mt-0.5 h-5 w-5" />
                  <div className="flex flex-col">
                    <span className="text-text-two text-xs">Telefone</span>
                    <span className="text-text-one text-sm font-medium">
                      {patient.phone}
                    </span>
                  </div>
                </div>
                {patient.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="text-text-three mt-0.5 h-5 w-5" />
                    <div className="flex flex-col">
                      <span className="text-text-two text-xs">E-mail</span>
                      <span className="text-text-one text-sm font-medium">
                        {patient.email}
                      </span>
                    </div>
                  </div>
                )}
                {patient.cpf && (
                  <div className="flex items-start gap-3">
                    <User className="text-text-three mt-0.5 h-5 w-5" />
                    <div className="flex flex-col">
                      <span className="text-text-two text-xs">CPF</span>
                      <span className="text-text-one text-sm font-medium">
                        {patient.cpf}
                      </span>
                    </div>
                  </div>
                )}
                {patient.susNumber && (
                  <div className="flex items-start gap-3">
                    <User className="text-text-three mt-0.5 h-5 w-5" />
                    <div className="flex flex-col">
                      <span className="text-text-two text-xs">
                        Número do SUS
                      </span>
                      <span className="text-text-one text-sm font-medium">
                        {patient.susNumber}
                      </span>
                    </div>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-text-three mt-0.5 h-5 w-5" />
                    <div className="flex flex-col">
                      <span className="text-text-two text-xs">Endereço</span>
                      <span className="text-text-one text-sm font-medium">
                        {formatAddress()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </DataHandler>
  )
}
