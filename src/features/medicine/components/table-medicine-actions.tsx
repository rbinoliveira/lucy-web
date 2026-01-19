import { SquarePen, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { MedicineModel } from '@/features/medicine/models/medicine.model'
import { DeleteMedicineService } from '@/features/medicine/service/delete-medicine.service'
import { listMedicinesQueryKey } from '@/features/medicine/service/list-medicines.service'
import { Button } from '@/shared/components/atoms/button'
import { appRoutes } from '@/shared/constants/app-routes.constant'
import { handleError } from '@/shared/helpers/error.helper'
import { useDialog } from '@/shared/hooks/dialog.hook'
import { queryClient } from '@/shared/libs/react-query'

type TableMedicineActionsProps = {
  medicine: MedicineModel
}

export function TableMedicineActions({ medicine }: TableMedicineActionsProps) {
  const { openDialog, closeDialog } = useDialog()
  const { mutateAsync } = DeleteMedicineService()

  async function deleteMedicine() {
    try {
      await mutateAsync({ id: medicine.id })
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === listMedicinesQueryKey,
      })
      toast.success('Medicamento deletado com sucesso!')
      closeDialog()
    } catch (err) {
      handleError({ err })
    }
  }

  function handleDelete() {
    openDialog({
      title: 'Excluir medicamento',
      description: `Tem certeza que deseja excluir o medicamento "${medicine.name}"?`,
      confirmButton: {
        label: 'Excluir',
        onClick: deleteMedicine,
      },
      cancelButton: {
        label: 'Cancelar',
        onClick: () => {},
      },
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" asChild>
        <Link href={`${appRoutes.medicines}/editar/${medicine.id}`}>
          <SquarePen className="text-primary-alternative" />
        </Link>
      </Button>
      <Button variant="ghost" onClick={handleDelete}>
        <Trash2 className="text-danger-one" />
      </Button>
    </div>
  )
}
