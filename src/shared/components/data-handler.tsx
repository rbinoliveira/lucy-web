import { AlertTriangle } from 'lucide-react'
import { ReactNode } from 'react'

import { Skeleton } from '@/shared/components/skeleton'

type DataHandlerProps = {
  isLoading: boolean
  isError: boolean
  children: ReactNode
  data?: Record<string, unknown>
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
    <div className="m-auto flex flex-col items-center justify-center gap-[0.5625rem]">
      <AlertTriangle size={48} />
      <p className="text-center text-sm leading-[2.28]">
        Error loading this content.
        <br />
        Please try refreashing the page.
      </p>
    </div>
  )
}
