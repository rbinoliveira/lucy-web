import { AlertTriangle } from 'lucide-react'
import { ReactNode } from 'react'

import { Skeleton } from '@/application/_shared/components/atoms/skeleton'

type DataHandlerProps = {
  isLoading: boolean
  isError: boolean
  children: ReactNode
  data?: any
  attributeToCheck?: string
  skeleton?: ReactNode
}

export function DataHandler({
  isError,
  isLoading,
  children,
  data,
  attributeToCheck = 'id',
  skeleton,
}: DataHandlerProps) {
  if (isLoading) {
    return skeleton ?? <Skeleton />
  }
  if (isError) {
    return <ErrorComponent />
  }
  if (data && !data[attributeToCheck]) {
    return <ErrorComponent />
  }

  return <>{children}</>
}

function ErrorComponent() {
  return (
    <div className="flex flex-col gap-[0.5625rem] items-center justify-center m-auto">
      <AlertTriangle size={48} />
      <p className="text-sm leading-[2.28] text-center">
        Error loading this content.
        <br />
        Please try refreashing the page.
      </p>
    </div>
  )
}
