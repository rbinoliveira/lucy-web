'use client'

import { DataHandler } from '@/application/_shared/components/molecules/data-handler'
import { Table } from '@/application/_shared/components/organisms/table/table'
import { useTable } from '@/application/_shared/hooks/table.hook'
import { useAuth } from '@/application/auth/hooks/auth.hook'
import { TablePatientActions } from '@/application/patient/components/table-patient-actions'
import { TablePatientDob } from '@/application/patient/components/table-patient-dob'
import { TablePatientName } from '@/application/patient/components/table-patient-name'
import { TablePatientPhone } from '@/application/patient/components/table-patient-phone'
import { ListPatientsService } from '@/application/patient/service/list-patients.service'

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
