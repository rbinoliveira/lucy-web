import { Table } from '@/application/_shared/components/organisms/table/table'

export function ListPatientsPage() {
  return (
    <div className="flex flex-col gap-6">
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
            render: (row) => row.id,
          },
          {
            columnLabel: 'Data de Nascimento',
            columnName: 'dob',
            render: (row) => row.id,
          },
          {
            columnLabel: 'Telefone',
            columnName: 'phone',
            render: (row) => row.id,
          },
        ]}
        data={{
          currentPage: 1,
          items: [
            {
              id: '1',
            },
          ],
          totalItems: 1,
          totalPages: 1,
          itemsPerPage: 10,
        }}
      />
    </div>
  )
}
