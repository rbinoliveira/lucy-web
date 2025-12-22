import { SquarePen, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button } from '@/application/_shared/components/atoms/button'
import { handleError } from '@/application/_shared/helpers/error.helper'
import { useDialog } from '@/application/_shared/hooks/dialog.hook'
import { queryClient } from '@/application/_shared/libs/react-query'
import { PrescriptionModel } from '@/application/prescription/models/prescription.model'
import { DeletePrescriptionService } from '@/application/prescription/service/delete-prescription.service'
import { listPrescriptionsQueryKey } from '@/application/prescription/service/list-prescriptions.service'

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
      await mutateAsync({ id: 'prescription.id' })
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === listPrescriptionsQueryKey,
      })
      toast.success('Paciente deletado com sucesso!')
      closeDialog()
    } catch (err) {
      handleError({ err })
    }
  }

  function handleDelete() {
    openDialog({
      title: 'Excluir paciente',
      description: 'Tem certeza que deseja excluir este paciente?',
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
        <Link href={`/pacientes/editar/${prescription.id}`}>
          <SquarePen className="text-primary-alternative" />
        </Link>
      </Button>
      <Button variant="ghost" onClick={handleDelete}>
        <Trash2 className="text-danger-one" />
      </Button>
    </div>
  )
}
