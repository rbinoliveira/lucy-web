'use client'

import { DataHandler } from '@/application/_shared/components/molecules/data-handler'
import { Table } from '@/application/_shared/components/organisms/table/table'
import { useTable } from '@/application/_shared/hooks/table.hook'
import { TablePrescriptionActions } from '@/application/prescription/components/table-prescription-actions'
import { TablePrescriptionDose } from '@/application/prescription/components/table-prescription-dose'
import { TablePrescriptionName } from '@/application/prescription/components/table-prescription-name'
import { ListPrescriptionsService } from '@/application/prescription/service/list-prescriptions.service'

export function ListPrescriptionsPage() {
  const { itemsPerPage, search, currentPage } = useTable()

  const { data, isError, isLoading, error } = ListPrescriptionsService({
    page: currentPage,
    itemsPerPage,
    search,
  })

  console.log(error)

  return (
    <div className="flex flex-col gap-6">
      <DataHandler isError={isError} isLoading={isLoading}>
        {data && (
          <Table
            actions={{
              search: {
                placeholder: 'Buscar prescrições...',
              },
              add: {
                label: 'Adicionar Prescrição',
                href: '/prescricoes/adicionar',
              },
            }}
            columns={[
              {
                columnLabel: 'Nome',
                columnName: 'name',
                render: (row) => <TablePrescriptionName prescription={row} />,
              },
              {
                columnLabel: 'Dose',
                columnName: 'dose',
                render: (row) => <TablePrescriptionDose prescription={row} />,
              },
              {
                columnLabel: 'Ações',
                columnName: 'actions',
                render: (row) => (
                  <TablePrescriptionActions prescription={row} />
                ),
              },
            ]}
            data={data}
          />
        )}
      </DataHandler>
    </div>
  )
}
