'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import {
  generateDosage,
  MedicineModel,
} from '@/features/medicine/models/medicine.model'
import { PatientModel } from '@/features/patient/models/patient.model'
import { MedicineCombobox } from '@/features/prescription/components/medicine-combobox'
import { PatientCombobox } from '@/features/prescription/components/patient-combobox'
import { PrescriptionModel } from '@/features/prescription/models/prescription.model'
import {
  SavePrescriptionFormSchema,
  savePrescriptionFormSchema,
} from '@/features/prescription/schemas/save-prescription.schema'
import { CreatePrescriptionService } from '@/features/prescription/service/create-prescription.service'
import { UpdatePrescriptionService } from '@/features/prescription/service/update-prescription.service'
import { Button } from '@/shared/components/button'
import { FormCardFooter } from '@/shared/components/form-card'
import { InputText } from '@/shared/components/input-text'
import { InputTextarea } from '@/shared/components/input-textarea'
import { appRoutes } from '@/shared/constants/app-routes.constant'
import { zodResolver } from '@/shared/libs/zod-resolver'

type SavePrescriptionFormProps = {
  prescription?: PrescriptionModel
}

export function SavePrescriptionForm({
  prescription,
}: SavePrescriptionFormProps) {
  const searchParams = useSearchParams()
  const patientName = searchParams.get('patientName')

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SavePrescriptionFormSchema>({
    resolver: zodResolver(savePrescriptionFormSchema),
    defaultValues: prescription
      ? {
          patientId: prescription.patientId,
          patientEmail: prescription.patientEmail,
          patientName: prescription.patientName,
          medicineId: prescription.medicineId,
          medicineName: prescription.medicineName,
          dosage: prescription.dosage,
          durationDays: prescription.durationDays ?? undefined,
          durationDescription: prescription.durationDescription ?? '',
          notes: prescription.notes ?? '',
        }
      : {
          patientId: '',
          patientEmail: '',
          patientName: '',
          medicineId: '',
          medicineName: '',
          dosage: '',
          durationDays: undefined,
          durationDescription: '',
          notes: '',
        },
  })

  useEffect(() => {
    if (patientName && !prescription) {
      setValue('patientName', patientName)
    }
  }, [patientName, prescription, setValue])

  function handlePatientSelect(patient: PatientModel | null) {
    if (patient) {
      setValue('patientId', patient.id, {
        shouldValidate: true,
        shouldDirty: true,
      })
      setValue('patientEmail', patient.email ?? '', {
        shouldValidate: true,
        shouldDirty: true,
      })
      setValue('patientName', patient.name, {
        shouldValidate: true,
        shouldDirty: true,
      })
    } else {
      setValue('patientId', '', { shouldValidate: true, shouldDirty: true })
      setValue('patientEmail', '', { shouldValidate: true, shouldDirty: true })
      setValue('patientName', '', { shouldValidate: true, shouldDirty: true })
    }
  }

  function handleMedicineSelect(medicine: MedicineModel | null) {
    if (medicine) {
      setValue('medicineId', medicine.id, {
        shouldValidate: true,
        shouldDirty: true,
      })
      setValue('medicineName', medicine.name, {
        shouldValidate: true,
        shouldDirty: true,
      })
      const currentDosage = watch('dosage')
      if (!currentDosage || currentDosage.trim() === '') {
        const generatedDosage = generateDosage(medicine)
        setValue('dosage', generatedDosage, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
    } else {
      setValue('medicineId', '', { shouldValidate: true, shouldDirty: true })
      setValue('medicineName', '', { shouldValidate: true, shouldDirty: true })
    }
  }

  const { push } = useRouter()
  const pathname = usePathname()
  const isEditPage = pathname.includes('editar')

  const { user } = useAuth()
  const { mutate: createPrescription, isPending: isPendingCreatePrescription } =
    CreatePrescriptionService({
      onSuccess: () => push(appRoutes.prescriptions),
    })
  const { mutate: updatePrescription, isPending: isPendingUpdatePrescription } =
    UpdatePrescriptionService({
      onSuccess: () => push(appRoutes.prescriptions),
    })

  const isLoading = isPendingCreatePrescription || isPendingUpdatePrescription

  function onError(errors: unknown) {
    console.error('Form validation errors:', errors)
  }

  async function onSubmit(data: SavePrescriptionFormSchema) {
    const formattedData = {
      ...data,
      ownerId: user?.id ?? '',
      status: prescription?.status ?? 'active',
    }
    if (isEditPage && prescription?.id) {
      updatePrescription({ ...formattedData, id: prescription.id })
    } else {
      createPrescription(formattedData)
    }
  }

  return (
    <form
      className="mt-8 flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      {errors.patientId && (
        <p className="text-danger-one text-xs">{errors.patientId.message}</p>
      )}
      {errors.patientEmail && (
        <p className="text-danger-one text-xs">{errors.patientEmail.message}</p>
      )}
      {errors.medicineId && (
        <p className="text-danger-one text-xs">{errors.medicineId.message}</p>
      )}
      {errors.medicineName && (
        <p className="text-danger-one text-xs">{errors.medicineName.message}</p>
      )}
      {errors.dosage && (
        <p className="text-danger-one text-xs">{errors.dosage.message}</p>
      )}
      <PatientCombobox
        control={control}
        onPatientSelect={handlePatientSelect}
        initialPatientName={patientName ?? undefined}
      />
      <MedicineCombobox
        control={control}
        onMedicineSelect={handleMedicineSelect}
      />
      <InputTextarea
        label="Posologia"
        placeholder="Ex: Tomar 1 comprimido de 8 em 8 horas por 7 dias"
        control={control}
        name="dosage"
        rows={4}
      />
      <InputText
        label="Duração (dias)"
        placeholder="Ex: 7"
        control={control}
        name="durationDays"
        type="number"
        min={0}
      />
      <InputText
        label="Duração (texto)"
        placeholder="Ex: Enquanto houver dor"
        control={control}
        name="durationDescription"
      />
      <InputTextarea
        label="Observações"
        placeholder="Informações adicionais para o paciente"
        control={control}
        name="notes"
        rows={3}
      />
      <FormCardFooter>
        <Button
          variant="secondary"
          className="max-w-[116px]"
          disabled={isLoading}
          asChild
        >
          <Link href={appRoutes.prescriptions}>Cancelar</Link>
        </Button>
        <Button
          variant="primary"
          type="submit"
          className="max-w-[205px]"
          isLoading={isLoading}
          icon={<Check size={16} />}
        >
          {isEditPage ? 'Salvar Alterações' : 'Criar Prescrição'}
        </Button>
      </FormCardFooter>
    </form>
  )
}
