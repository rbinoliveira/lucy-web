'use client'

import { TablePrescriptionActions } from '@/features/prescription/components/table-prescription-actions'
import { TablePrescriptionDose } from '@/features/prescription/components/table-prescription-dose'
import { TablePrescriptionName } from '@/features/prescription/components/table-prescription-name'
import { ListPrescriptionsService } from '@/features/prescription/service/list-prescriptions.service'
import { DataHandler } from '@/shared/components/molecules/data-handler'
import { Table } from '@/shared/components/organisms/table/table'
import { useTable } from '@/shared/hooks/table.hook'

export function ListPrescriptionsPage() {
  const { itemsPerPage, search, currentPage } = useTable()

  const { data, isError, isLoading } = ListPrescriptionsService({
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
