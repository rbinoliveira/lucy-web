import { usePathname } from 'next/navigation'
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { DialogProps } from '@/application/_shared/components/molecules/dialog'

type DialogContextData = {
  dialogProps: DialogProps | null
  openDialog: (newDialogProps: DialogProps) => void
  closeDialog: () => void
}

type DialogProviderProps = {
  children: ReactNode
}

const DialogContext = createContext<DialogContextData>({} as DialogContextData)

export function DialogProvider({ children }: DialogProviderProps) {
  const [dialogProps, setDialogProps] = useState<DialogProps | null>(null)
  const pathname = usePathname()
  const prevPathnameRef = useRef(pathname)

  const openDialog = useCallback((newDialogProps: DialogProps) => {
    setDialogProps(newDialogProps)
  }, [])

  const closeDialog = useCallback(() => {
    setDialogProps(null)
  }, [])

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname
      if (dialogProps) {
        requestAnimationFrame(() => {
          setDialogProps(null)
        })
      }
    }
  }, [pathname, dialogProps])

  return (
    <DialogContext.Provider
      value={{
        dialogProps,
        openDialog,
        closeDialog,
      }}
    >
      {children}
    </DialogContext.Provider>
  )
}

export const useDialog = () => useContext(DialogContext)
