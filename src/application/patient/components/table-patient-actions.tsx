import { SquarePen, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button } from '@/application/_shared/components/atoms/button'
import { handleError } from '@/application/_shared/helpers/error.helper'
import { useDialog } from '@/application/_shared/hooks/dialog.hook'
import { queryClient } from '@/application/_shared/libs/react-query'
import { PatientModel } from '@/application/patient/models/patient.model'
import { DeletePatientService } from '@/application/patient/service/delete-patient.service'
import { listPatientsQueryKey } from '@/application/patient/service/list-patients.service'

type TablePatientActionsProps = {
  patient: PatientModel
}

export function TablePatientActions({ patient }: TablePatientActionsProps) {
  const { openDialog, closeDialog } = useDialog()
  const { mutateAsync } = DeletePatientService()

  async function deletePatient() {
    try {
      await mutateAsync({ id: 'patient.id' })
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === listPatientsQueryKey,
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
        onClick: deletePatient,
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
        <Link href={`/pacientes/editar/${patient.id}`}>
          <SquarePen className="text-primary-alternative" />
        </Link>
      </Button>
      <Button variant="ghost" onClick={handleDelete}>
        <Trash2 className="text-danger-one" />
      </Button>
    </div>
  )
}
