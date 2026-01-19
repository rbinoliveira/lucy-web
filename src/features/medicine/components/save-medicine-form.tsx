'use client'

import { Check, Info, Pill } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import {
  AdministrationRoute,
  administrationRouteLabels,
  generateDosage,
  MedicineModel,
  PharmaceuticalForm,
  pharmaceuticalFormLabels,
} from '@/features/medicine/models/medicine.model'
import {
  SaveMedicineFormSchema,
  saveMedicineFormSchema,
} from '@/features/medicine/schemas/save-medicine.schema'
import { CreateMedicineService } from '@/features/medicine/service/create-medicine.service'
import { UpdateMedicineService } from '@/features/medicine/service/update-medicine.service'
import { Button } from '@/shared/components/atoms/button'
import { FormCardFooter } from '@/shared/components/molecules/form/form-card'
import { InputSelect } from '@/shared/components/molecules/form/input-select'
import { InputText } from '@/shared/components/molecules/form/input-text'
import { appRoutes } from '@/shared/constants/app-routes.constant'
import { zodResolver } from '@/shared/libs/zod-resolver'

type SaveMedicineFormProps = {
  medicine?: MedicineModel
}

const pharmaceuticalFormOptions = Object.entries(pharmaceuticalFormLabels).map(
  ([value, label]) => ({ value, label }),
)

const administrationRouteOptions = Object.entries(
  administrationRouteLabels,
).map(([value, label]) => ({ value, label }))

export function SaveMedicineForm({ medicine }: SaveMedicineFormProps) {
  const { control, handleSubmit, setValue, getValues } =
    useForm<SaveMedicineFormSchema>({
      resolver: zodResolver(saveMedicineFormSchema),
      defaultValues: medicine
        ? {
            id: medicine.id,
            name: medicine.name,
            dose: medicine.dose,
            pharmaceuticalForm: medicine.pharmaceuticalForm,
            administrationRoute: medicine.administrationRoute,
            quantity: medicine.quantity,
            intervalHours: medicine.intervalHours,
            durationDays: medicine.durationDays,
            whilePain: medicine.whilePain,
            defaultDosage: medicine.defaultDosage,
          }
        : {
            quantity: 1,
            intervalHours: 8,
            whilePain: false,
          },
    })

  const { push } = useRouter()
  const pathname = usePathname()
  const isEditPage = pathname.includes('editar')

  const { user } = useAuth()
  const { mutate: createMedicine, isPending: isPendingCreateMedicine } =
    CreateMedicineService({
      onSuccess: () => push(appRoutes.medicines),
    })
  const { mutate: updateMedicine, isPending: isPendingUpdateMedicine } =
    UpdateMedicineService({
      onSuccess: () => push(appRoutes.medicines),
    })

  const isLoading = isPendingCreateMedicine || isPendingUpdateMedicine

  const watchedFields = useWatch({
    control,
    name: [
      'pharmaceuticalForm',
      'administrationRoute',
      'quantity',
      'intervalHours',
      'durationDays',
      'whilePain',
    ],
  })

  useEffect(() => {
    const [
      pharmaceuticalForm,
      administrationRoute,
      quantity,
      intervalHours,
      durationDays,
      whilePain,
    ] = watchedFields

    if (
      pharmaceuticalForm &&
      administrationRoute &&
      quantity &&
      intervalHours
    ) {
      const generatedDosage = generateDosage({
        pharmaceuticalForm: pharmaceuticalForm as PharmaceuticalForm,
        administrationRoute: administrationRoute as AdministrationRoute,
        quantity: Number(quantity),
        intervalHours: Number(intervalHours),
        durationDays: durationDays ? Number(durationDays) : undefined,
        whilePain: Boolean(whilePain),
      })
      setValue('defaultDosage', generatedDosage)
    }
  }, [watchedFields, setValue])

  async function onSubmit(data: SaveMedicineFormSchema) {
    const formattedData = {
      ...data,
      ownerId: user?.id ?? '',
    }
    if (isEditPage && medicine?.id) {
      updateMedicine({ ...formattedData, id: medicine.id })
    } else {
      createMedicine(formattedData)
    }
  }

  function handleWhilePainChange(checked: boolean) {
    setValue('whilePain', checked)
    if (checked) {
      setValue('durationDays', undefined)
    }
  }

  function handleDurationDaysChange(value: string) {
    const numValue = value ? Number(value) : undefined
    setValue('durationDays', numValue)
    if (numValue) {
      setValue('whilePain', false)
    }
  }

  const whilePain = getValues('whilePain')

  return (
    <form className="mt-8 flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <InputText
          placeholder="Ex: Amoxicilina"
          label="Princípio Ativo"
          control={control}
          name="name"
          iconBefore={<Pill />}
        />
        <InputText
          placeholder="Ex: 500mg"
          label="Dose"
          control={control}
          name="dose"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <InputSelect
          label="Forma Farmacêutica"
          control={control}
          name="pharmaceuticalForm"
          options={pharmaceuticalFormOptions}
        />
        <InputSelect
          label="Via de Administração"
          control={control}
          name="administrationRoute"
          options={administrationRouteOptions}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <InputText
          placeholder="Ex: 1"
          label="Quantidade"
          control={control}
          name="quantity"
          type="number"
        />
        <InputText
          placeholder="Ex: 8"
          label="Intervalo (horas)"
          control={control}
          name="intervalHours"
          type="number"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Controller
          name="durationDays"
          control={control}
          render={({ field }) => (
            <InputText
              placeholder="Ex: 7"
              label="Duração (dias)"
              control={control}
              type="number"
              disabled={whilePain}
              {...field}
              onChange={(e) => {
                handleDurationDaysChange(e.target.value)
                field.onChange(e)
              }}
            />
          )}
        />
        <div className="flex flex-col justify-end gap-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={whilePain || false}
              onChange={(e) => handleWhilePainChange(e.target.checked)}
              className="border-border-one text-primary focus:ring-primary h-4 w-4 rounded"
            />
            <span className="text-text-one text-sm">Enquanto houver dor</span>
          </label>
          <p className="text-text-two text-xs">
            Marque esta opção se o medicamento deve ser usado enquanto houver
            dor
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-text-one text-sm font-medium">Posologia</label>
        <textarea
          {...control.register('defaultDosage')}
          placeholder="Ex: Tomar 1 comprimido de 8 em 8 horas por 7 dias"
          className="border-border-one focus:border-primary min-h-[100px] w-full resize-none rounded-lg border p-4 text-sm focus:outline-none"
        />
        <p className="text-text-two text-xs">
          Descreva a posologia padrão recomendada para este medicamento
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4">
        <Info className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="text-text-one text-sm font-semibold">
            Informações Importantes
          </span>
          <ul className="text-text-two list-inside list-disc text-xs">
            <li>
              Todos os campos são obrigatórios para o cadastro do medicamento
            </li>
            <li>
              A posologia será usada como padrão nas prescrições, mas poderá ser
              editada
            </li>
            <li>
              Verifique sempre se o medicamento não está com cada uma das
              informações
            </li>
          </ul>
        </div>
      </div>

      <FormCardFooter>
        <Button
          variant="secondary"
          className="max-w-[116px]"
          disabled={isLoading}
          asChild
        >
          <Link href={appRoutes.medicines}>Cancelar</Link>
        </Button>
        <Button
          variant="primary"
          className="max-w-[205px]"
          onClick={handleSubmit(onSubmit)}
          isLoading={isLoading}
          icon={<Check size={16} />}
        >
          {isEditPage ? 'Salvar Alterações' : 'Salvar Medicamento'}
        </Button>
      </FormCardFooter>
    </form>
  )
}
