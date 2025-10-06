import { SquarePen, Trash2 } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/application/_shared/components/atoms/button'
import { useDialog } from '@/application/_shared/hooks/dialog.hook'
import { PatientModel } from '@/application/patient/models/patient.model'
import { DeletePatientService } from '@/application/patient/service/delete-patient.service'

type TablePatientActionsProps = {
  patient: PatientModel
}

export function TablePatientActions({ patient }: TablePatientActionsProps) {
  const { openDialog } = useDialog()
  const { mutate: deletePatient } = DeletePatientService({})

  function handleDelete() {
    openDialog({
      title: 'Excluir paciente',
      description: 'Tem certeza que deseja excluir este paciente?',
      confirmButton: {
        label: 'Excluir',
        onClick: () => deletePatient({ id: patient.id }),
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
