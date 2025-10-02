'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Check, Phone, User } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/application/_shared/components/atoms/button'
import { FormCardFooter } from '@/application/_shared/components/molecules/form/form-card'
import { InputDate } from '@/application/_shared/components/molecules/form/input-date'
import { InputMaskedText } from '@/application/_shared/components/molecules/form/input-masked-text'
import { InputText } from '@/application/_shared/components/molecules/form/input-text'
import { UserSchema, userSchema } from '@/application/auth/schemas/user.schema'

export function CreatePatientForm() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
  })

  function onSubmit(data: UserSchema) {
    console.log(data)
  }

  return (
    <form className="flex flex-col mt-8 gap-6">
      <InputText
        placeholder="Ex: Maria da Silva Santos"
        label="Nome Completo"
        control={control}
        name="name"
        iconBefore={<User className="text-icon" fill="currentColor" />}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputMaskedText
          label="Telefone"
          mask="phone"
          control={control}
          name="phone"
          iconBefore={<Phone className="text-icon" fill="currentColor" />}
          placeholder="(11) 99999-9999"
        />
        <InputDate
          label="Data de Nascimento"
          control={control}
          name="dob"
          iconBefore={<Calendar className="text-icon" fill="currentColor" />}
        />
      </div>
      <FormCardFooter>
        <Button variant="secondary" className="max-w-[116px]">
          Cancelar
        </Button>
        <Button
          variant="primary"
          className="max-w-[205px]"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          <Check size={16} />
          Completar
        </Button>
      </FormCardFooter>
    </form>
  )
}
