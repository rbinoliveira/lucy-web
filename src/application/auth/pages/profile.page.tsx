'use client'

import { ProfileForm } from '@/application/auth/components/profile-form'

export function ProfilePage() {
  return (
    <div className="flex w-full items-start justify-center pt-8">
      <ProfileForm />
    </div>
  )
}
