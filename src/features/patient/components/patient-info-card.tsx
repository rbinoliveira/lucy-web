'use client'

import { Calendar, Mail, MapPin, Phone, User } from 'lucide-react'

import {
  genderLabels,
  PatientModel,
} from '@/features/patient/models/patient.model'
import {
  convertToDateString,
  getDifferenceInYears,
} from '@/shared/helpers/date.helper'

type PatientInfoCardProps = {
  patient: PatientModel
}

function formatAddress(patient: PatientModel): string {
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

function InfoItem({
  icon,
  label,
  value,
  colSpan,
}: {
  icon: React.ReactNode
  label: string
  value: string
  colSpan?: string
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl bg-black/2 p-3 ${colSpan ?? ''}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <span className="text-text-three text-xs">{label}</span>
        <p className="text-text-one font-medium">{value}</p>
      </div>
    </div>
  )
}

export function PatientInfoCard({ patient }: PatientInfoCardProps) {
  const age = getDifferenceInYears(patient.dob)

  return (
    <section className="glass-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Informações do Paciente</h2>
          <p className="card-subtitle">Dados cadastrais</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <InfoItem
          icon={<User className="h-5 w-5" />}
          label="Nome"
          value={patient.name}
        />
        <InfoItem
          icon={<Calendar className="h-5 w-5" />}
          label="Data de Nascimento"
          value={`${convertToDateString(patient.dob)} (${age} ${age === 1 ? 'ano' : 'anos'})`}
        />
        <InfoItem
          icon={<User className="h-5 w-5" />}
          label="Gênero"
          value={genderLabels[patient.gender]}
        />
        <InfoItem
          icon={<Phone className="h-5 w-5" />}
          label="Telefone"
          value={patient.phone}
        />
        {patient.email && (
          <InfoItem
            icon={<Mail className="h-5 w-5" />}
            label="E-mail"
            value={patient.email}
          />
        )}
        {patient.address && (
          <InfoItem
            icon={<MapPin className="h-5 w-5" />}
            label="Endereço"
            value={formatAddress(patient)}
            colSpan="sm:col-span-2 lg:col-span-3"
          />
        )}
      </div>
    </section>
  )
}
