import { LoginForm } from '@/features/auth/components/login-form'
import { LoginInformations } from '@/features/auth/components/login-informations'

export function LoginPage() {
  return (
    <div className="flex w-full items-center justify-between gap-6">
      <section className="flex w-full max-w-[512px] flex-col">
        <LoginInformations />
      </section>
      <section className="flex w-full max-w-[448px] flex-col">
        <LoginForm />
      </section>
    </div>
  )
}
