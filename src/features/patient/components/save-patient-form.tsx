'use client'

import {
  Calendar,
  Check,
  CreditCard,
  Info,
  Mail,
  Phone,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import {
  genderLabels,
  PatientModel,
} from '@/features/patient/models/patient.model'
import {
  SavePatientFormSchema,
  savePatientFormSchema,
} from '@/features/patient/schemas/save-patient.schema'
import { CreatePatientService } from '@/features/patient/service/create-patient.service'
import { UpdatePatientService } from '@/features/patient/service/update-patient.service'
import { Button } from '@/shared/components/button'
import { FormCardFooter } from '@/shared/components/form-card'
import { InputDate } from '@/shared/components/input-date'
import { InputMaskedText } from '@/shared/components/input-masked-text'
import { InputSelect } from '@/shared/components/input-select'
import { InputText } from '@/shared/components/input-text'
import { appRoutes } from '@/shared/constants/app-routes.constant'
import { zodResolver } from '@/shared/libs/zod-resolver'

type SavePatientFormProps = {
  patient?: PatientModel
}

const genderOptions = Object.entries(genderLabels).map(([value, label]) => ({
  value,
  label,
}))

export function SavePatientForm({ patient }: SavePatientFormProps) {
  const { control, handleSubmit } = useForm<SavePatientFormSchema>({
    resolver: zodResolver(savePatientFormSchema),
    defaultValues: patient
      ? {
          id: patient.id,
          name: patient.name,
          phone: patient.phone,
          dob: patient.dob,
          gender: patient.gender,
          email: patient.email,
          cpf: patient.cpf,
        }
      : {
          gender: 'male',
        },
  })

  const { push } = useRouter()
  const pathname = usePathname()
  const isEditPage = pathname.includes('editar')

  const { user } = useAuth()
  const { mutate: createPatient, isPending: isPendingCreatePatient } =
    CreatePatientService({
      onSuccess: () => push(appRoutes.patients),
    })
  const { mutate: updatePatient, isPending: isPendingUpdatePatient } =
    UpdatePatientService({
      onSuccess: () => push(appRoutes.patients),
    })

  const isLoading = isPendingCreatePatient || isPendingUpdatePatient

  async function onSubmit(data: SavePatientFormSchema) {
    const formattedData = {
      ...data,
      ownerId: user?.id ?? '',
    }
    if (isEditPage && patient?.id) {
      updatePatient({ ...formattedData, id: patient.id })
    } else {
      createPatient(formattedData)
    }
  }

  return (
    <form className="mt-8 flex flex-col gap-6">
      <InputText
        placeholder="Ex: Maria da Silva Santos"
        label="Nome Completo"
        control={control}
        name="name"
        iconBefore={<User />}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <InputMaskedText
          label="Telefone"
          mask="phone"
          control={control}
          name="phone"
          iconBefore={<Phone />}
          placeholder="(11) 99999-9999"
        />
        <InputDate
          label="Data de Nascimento"
          control={control}
          name="dob"
          iconBefore={<Calendar />}
        />
      </div>

      <InputSelect
        label="Gênero"
        control={control}
        name="gender"
        options={genderOptions}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <InputText
          placeholder="Ex: maria@email.com"
          label="E-mail"
          control={control}
          name="email"
          iconBefore={<Mail />}
        />
        <InputMaskedText
          label="CPF"
          mask="cpf"
          control={control}
          name="cpf"
          iconBefore={<CreditCard />}
          placeholder="000.000.000-00"
        />
      </div>

      <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4">
        <Info className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="text-text-one text-sm font-semibold">
            Informações Importantes
          </span>
          <ul className="text-text-two list-inside list-disc text-xs">
            <li>E-mail é obrigatório para o cadastro do paciente</li>
            <li>
              O telefone será usado para envio de notificações sobre
              medicamentos
            </li>
            <li>
              Após o cadastro, você poderá criar prescrições para este paciente
            </li>
            <li>Verifique se o paciente já não está cadastrado no sistema</li>
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
          <Link href={appRoutes.patients}>Cancelar</Link>
        </Button>
        <Button
          variant="primary"
          className="max-w-[205px]"
          onClick={handleSubmit(onSubmit)}
          isLoading={isLoading}
          icon={<Check size={16} />}
        >
          {isEditPage ? 'Salvar Alterações' : 'Salvar Paciente'}
        </Button>
      </FormCardFooter>
    </form>
  )
}
