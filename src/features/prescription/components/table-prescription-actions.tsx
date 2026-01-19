import { SquarePen, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { PrescriptionModel } from '@/features/prescription/models/prescription.model'
import { DeletePrescriptionService } from '@/features/prescription/service/delete-prescription.service'
import { listPrescriptionsQueryKey } from '@/features/prescription/service/list-prescriptions.service'
import { Button } from '@/shared/components/atoms/button'
import { handleError } from '@/shared/helpers/error.helper'
import { useDialog } from '@/shared/hooks/dialog.hook'
import { queryClient } from '@/shared/libs/react-query'

type TablePrescriptionActionsProps = {
  prescription: PrescriptionModel
}

export function TablePrescriptionActions({
  prescription,
}: TablePrescriptionActionsProps) {
  const { openDialog, closeDialog } = useDialog()
  const { mutateAsync } = DeletePrescriptionService()

  async function deletePrescription() {
    try {
      await mutateAsync({ id: prescription.id })
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === listPrescriptionsQueryKey,
      })
      toast.success('Prescrição deletada com sucesso!')
      closeDialog()
    } catch (err) {
      handleError({ err })
    }
  }

  function handleDelete() {
    openDialog({
      title: 'Excluir prescrição',
      description: `Tem certeza que deseja excluir esta prescrição?`,
      confirmButton: {
        label: 'Excluir',
        onClick: deletePrescription,
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
        <Link href={`/prescricoes/editar/${prescription.id}`}>
          <SquarePen className="text-primary-alternative" />
        </Link>
      </Button>
      <Button variant="ghost" onClick={handleDelete}>
        <Trash2 className="text-danger-one" />
      </Button>
    </div>
  )
}
