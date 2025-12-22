'use client'

import { DataHandler } from '@/application/_shared/components/molecules/data-handler'
import { Table } from '@/application/_shared/components/organisms/table/table'
import { useTable } from '@/application/_shared/hooks/table.hook'
import { TableMedicineActions } from '@/application/medicine/components/table-medicine-actions'
import { TableMedicineDose } from '@/application/medicine/components/table-medicine-dose'
import { TableMedicineName } from '@/application/medicine/components/table-medicine-name'
import { ListMedicinesService } from '@/application/medicine/service/list-medicines.service'

export function ListMedicinesPage() {
  const { itemsPerPage, search, currentPage } = useTable()

  const { data, isError, isLoading } = ListMedicinesService({
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
                placeholder: 'Buscar medicamentos...',
              },
              add: {
                label: 'Adicionar Medicamento',
                href: '/medicamentos/adicionar',
              },
            }}
            columns={[
              {
                columnLabel: 'Nome',
                columnName: 'name',
                render: (row) => <TableMedicineName medicine={row} />,
              },
              {
                columnLabel: 'Dose',
                columnName: 'dose',
                render: (row) => <TableMedicineDose medicine={row} />,
              },
              {
                columnLabel: 'Ações',
                columnName: 'actions',
                render: (row) => <TableMedicineActions medicine={row} />,
              },
            ]}
            data={data}
          />
        )}
      </DataHandler>
    </div>
  )
}
