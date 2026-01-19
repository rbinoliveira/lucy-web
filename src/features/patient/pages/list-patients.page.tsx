'use client'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import { TablePatientActions } from '@/features/patient/components/table-patient-actions'
import { TablePatientDob } from '@/features/patient/components/table-patient-dob'
import { TablePatientName } from '@/features/patient/components/table-patient-name'
import { TablePatientPhone } from '@/features/patient/components/table-patient-phone'
import { ListPatientsService } from '@/features/patient/service/list-patients.service'
import { DataHandler } from '@/shared/components/molecules/data-handler'
import { Table } from '@/shared/components/organisms/table/table'
import { useTable } from '@/shared/hooks/table.hook'

export function ListPatientsPage() {
  const { user } = useAuth()
  const { itemsPerPage, search, currentPage } = useTable()

  const { data, isError, isLoading } = ListPatientsService({
    ownerId: user?.id || '',
    page: currentPage,
    itemsPerPage,
    search,
  })

  return (
    <div className="flex flex-col gap-6">
      <DataHandler isError={isError} isLoading={isLoading}>
        {data && (
          <Table
            actions={{
              search: {
                placeholder: 'Buscar pacientes...',
              },
              add: {
                label: 'Adicionar Paciente',
                href: '/pacientes/adicionar',
              },
            }}
            columns={[
              {
                columnLabel: 'Paciente',
                columnName: 'name',
                render: (row) => <TablePatientName patient={row} />,
              },
              {
                columnLabel: 'Data de Nascimento',
                columnName: 'dob',
                render: (row) => <TablePatientDob patient={row} />,
              },
              {
                columnLabel: 'Telefone',
                columnName: 'phone',
                render: (row) => <TablePatientPhone patient={row} />,
              },
              {
                columnLabel: 'Ações',
                columnName: 'actions',
                render: (row) => <TablePatientActions patient={row} />,
              },
            ]}
            data={data}
          />
        )}
      </DataHandler>
    </div>
  )
}
