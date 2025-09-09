'use client'

import { Plus } from 'lucide-react'

import { UI } from '@/application/_shared/components'
import { useAuth } from '@/application/auth/hooks/auth.hook'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-[1.9375rem] font-bold leading-[1.19]">Dashboard</h1>
        <div className="flex items-center gap-6">
          <p>{user?.name}</p>
          <UI.Button variant="secondary">View Etalage</UI.Button>
          <UI.Button variant="secondary">Set at once</UI.Button>
          <UI.Button>
            Products
            <Plus />
          </UI.Button>
        </div>
      </div>
    </>
  )
}
