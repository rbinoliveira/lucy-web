'use client'

import { TableMedicineActions } from '@/features/medicine/components/table-medicine-actions'
import { TableMedicineDose } from '@/features/medicine/components/table-medicine-dose'
import { TableMedicineName } from '@/features/medicine/components/table-medicine-name'
import { ListMedicinesService } from '@/features/medicine/service/list-medicines.service'
import { DataHandler } from '@/shared/components/data-handler'
import { Table } from '@/shared/components/organisms/table/table'
import { appRoutes } from '@/shared/constants/app-routes.constant'
import { useTable } from '@/shared/hooks/table.hook'

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
                href: `${appRoutes.medicines}/adicionar`,
              },
            }}
            columns={[
              {
                columnLabel: 'Princípio Ativo',
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
