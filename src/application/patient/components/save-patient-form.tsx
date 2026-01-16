'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Calendar,
  Check,
  CreditCard,
  FileText,
  Info,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/application/_shared/components/atoms/button'
import { FormCardFooter } from '@/application/_shared/components/molecules/form/form-card'
import { InputDate } from '@/application/_shared/components/molecules/form/input-date'
import { InputMaskedText } from '@/application/_shared/components/molecules/form/input-masked-text'
import { InputSelect } from '@/application/_shared/components/molecules/form/input-select'
import { InputText } from '@/application/_shared/components/molecules/form/input-text'
import { appRoutes } from '@/application/_shared/constants/app-routes.constant'
import { useAuth } from '@/application/auth/hooks/auth.hook'
import {
  genderLabels,
  PatientModel,
} from '@/application/patient/models/patient.model'
import {
  SavePatientFormSchema,
  savePatientFormSchema,
} from '@/application/patient/schemas/save-patient.schema'
import { CreatePatientService } from '@/application/patient/service/create-patient.service'
import { UpdatePatientService } from '@/application/patient/service/update-patient.service'

type SavePatientFormProps = {
  patient?: PatientModel
}

const genderOptions = Object.entries(genderLabels).map(([value, label]) => ({
  value,
  label,
}))

export function SavePatientForm({ patient }: SavePatientFormProps) {
  const [showOptionalFields, setShowOptionalFields] = useState(
    !!(
      patient?.email ||
      patient?.cpf ||
      patient?.susNumber ||
      patient?.address
    ),
  )

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
          susNumber: patient.susNumber,
          address: patient.address,
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

      <button
        type="button"
        onClick={() => setShowOptionalFields(!showOptionalFields)}
        className="text-primary text-left text-sm font-medium hover:underline"
      >
        {showOptionalFields
          ? '− Ocultar campos opcionais'
          : '+ Mostrar campos opcionais (email, CPF, endereço, SUS)'}
      </button>

      {showOptionalFields && (
        <div className="border-border-one flex flex-col gap-6 border-t pt-4">
          <h4 className="text-text-one text-sm font-semibold">
            Informações Opcionais
          </h4>

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

          <InputText
            placeholder="Ex: 123456789012345"
            label="Número do SUS"
            control={control}
            name="susNumber"
            iconBefore={<FileText />}
          />

          <h4 className="text-text-one mt-2 text-sm font-semibold">Endereço</h4>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <InputText
                placeholder="Ex: Rua das Flores"
                label="Rua"
                control={control}
                name="address.street"
                iconBefore={<MapPin />}
              />
            </div>
            <InputText
              placeholder="Ex: 123"
              label="Número"
              control={control}
              name="address.number"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InputText
              placeholder="Ex: Apto 101"
              label="Complemento"
              control={control}
              name="address.complement"
            />
            <InputText
              placeholder="Ex: Centro"
              label="Bairro"
              control={control}
              name="address.neighborhood"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <InputText
              placeholder="Ex: São Paulo"
              label="Cidade"
              control={control}
              name="address.city"
            />
            <InputText
              placeholder="Ex: SP"
              label="Estado"
              control={control}
              name="address.state"
            />
            <InputMaskedText
              label="CEP"
              mask="cep"
              control={control}
              name="address.zipCode"
              placeholder="00000-000"
            />
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4">
        <Info className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="text-text-one text-sm font-semibold">
            Informações Importantes
          </span>
          <ul className="text-text-two list-inside list-disc text-xs">
            <li>
              Todos os campos são obrigatórios para o cadastro do paciente
            </li>
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
