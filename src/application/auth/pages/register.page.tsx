import { LoginInformations } from '@/application/auth/components/login-informations'
import { RegisterForm } from '@/application/auth/components/register-form'

export function RegisterPage() {
  return (
    <div className="flex w-full items-center justify-between gap-6">
      <section className="flex w-full max-w-[512px] flex-col">
        <LoginInformations />
      </section>
      <section className="flex w-full max-w-[448px] flex-col">
        <RegisterForm />
      </section>
    </div>
  )
}
