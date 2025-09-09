import { LoginInformations } from '@/application/auth/components/login-informations'
import { RegisterForm } from '@/application/auth/components/register-form'

export function RegisterPage() {
  return (
    <div className="flex items-center justify-between gap-6 w-full">
      <section className="w-full max-w-[512px] flex flex-col">
        <LoginInformations />
      </section>
      <section className="w-full max-w-[448px] flex flex-col">
        <RegisterForm />
      </section>
    </div>
  )
}
