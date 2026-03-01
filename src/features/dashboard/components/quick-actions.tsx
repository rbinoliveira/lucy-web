'use client'

import { FileText, Info, UserPlus } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/shared/components/atoms/button'
import { appRoutes } from '@/shared/constants/app-routes.constant'

export function QuickActions() {
  return (
    <div className="glass-card flex flex-col gap-4">
      <h3 className="text-text-one text-lg font-semibold">Ações Rápidas</h3>

      <Button
        variant="primary"
        className="justify-start px-4"
        icon={<FileText className="h-5 w-5" />}
        asChild
      >
        <Link href={appRoutes.prescriptions + '/adicionar'}>
          Nova Prescrição
        </Link>
      </Button>

      <Button
        variant="secondary"
        className="justify-start px-4"
        icon={<UserPlus className="h-5 w-5" />}
        asChild
      >
        <Link href={appRoutes.patients + '/adicionar'}>Novo Paciente</Link>
      </Button>

      <div className="mt-4 flex flex-col gap-2 rounded-xl bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <Info className="text-primary h-4 w-4" />
          <span className="text-text-one text-sm font-semibold">
            Status do Sistema
          </span>
        </div>
        <p className="text-text-two text-xs">
          Todas as prescrições estão sendo sincronizadas automaticamente com os
          aplicativos dos pacientes.
        </p>
        <div className="mt-1 flex items-center gap-2">
          <div className="bg-green h-2 w-2 rounded-full" />
          <span className="text-green text-xs font-medium">Sistema Online</span>
        </div>
      </div>
    </div>
  )
}
