'use client'

import { ChevronDown, ChevronUp, LogOut, Menu, Plus, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import { signOut } from '@/features/auth/services/auth-firebase.service'
import { Avatar } from '@/shared/components/avatar'
import { Button, ButtonProps } from '@/shared/components/button'
import { DropdownMenu } from '@/shared/components/dropdown-menu'
import { SidebarContentNav } from '@/shared/components/organisms/sidebar/sidebar-content-nav'
import { sidebarContentNavItems } from '@/shared/components/organisms/sidebar/sidebar-content-nav-items'
import {
  SidebarSheet,
  SidebarSheetContent,
  SidebarSheetDescription,
  SidebarSheetHeader,
  SidebarSheetTitle,
} from '@/shared/components/organisms/sidebar/sidebar-sheet'
import { TooltipProvider } from '@/shared/components/tooltip'
import { appRoutes } from '@/shared/constants/app-routes.constant'
import { getCompoundName } from '@/shared/helpers/name-manipulator.helper'
import { useIsMobile } from '@/shared/helpers/use-mobile'
import { cn } from '@/shared/libs/tw-merge'

const SIDEBAR_WIDTH = '280px'

type SidebarContext = {
  state: 'expanded' | 'collapsed'
  isMobile: boolean
  updateSidebarState: (state: 'expanded' | 'collapsed') => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, style, children, ...props }, ref) => {
  const isMobile = useIsMobile()
  const [state, setState] = React.useState<'expanded' | 'collapsed'>('expanded')
  const pathname = usePathname()

  const updateSidebarState = React.useCallback(
    (state: 'expanded' | 'collapsed') => {
      return setState(state)
    },
    [],
  )

  React.useEffect(() => {
    if (isMobile) {
      setState('collapsed')
    } else {
      setState('expanded')
    }
  }, [pathname, isMobile])

  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      state,
      isMobile,
      updateSidebarState,
    }),
    [state, isMobile, updateSidebarState],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            'group/sidebar-wrapper flex min-h-svh w-full',
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
})

function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right'
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}) {
  const { isMobile, state, updateSidebarState } = useSidebar()

  if (collapsible === 'none') {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          'text-sidebar-foreground flex h-full flex-col',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <SidebarSheet
        open={state === 'expanded'}
        onOpenChange={(open) =>
          updateSidebarState(open ? 'expanded' : 'collapsed')
        }
        {...props}
      >
        <SidebarSheetHeader className="sr-only">
          <SidebarSheetTitle>Sidebar</SidebarSheetTitle>
          <SidebarSheetDescription>
            Displays the mobile sidebar.
          </SidebarSheetDescription>
        </SidebarSheetHeader>
        <SidebarSheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="text-sidebar-foreground w-(--sidebar-width) border-r border-border-one bg-white/90 backdrop-blur-[20px] p-0 [&>button]:hidden"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
            } as React.CSSProperties
          }
          side={side}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </SidebarSheetContent>
      </SidebarSheet>
    )
  }

  return (
    <div
      className="text-sidebar-foreground group peer hidden md:block"
      data-state={state}
      data-collapsible={state === 'expanded' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      <div
        data-slot="sidebar-gap"
        className={cn(
          'relative w-(--sidebar-width-collapsed) bg-transparent',
          'transition-[width] duration-200 ease-linear',
        )}
      />
      <div
        className={cn(
          'fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] duration-200 ease-linear md:flex',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=right]:border-l',
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className={cn(
            'flex h-full w-full flex-col',
            'bg-white/65 backdrop-blur-[20px]',
            'border-r border-black/8',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: Omit<ButtonProps, 'children'>) {
  const { updateSidebarState, state } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      className={cn('h-8 w-8', className)}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        updateSidebarState(state === 'expanded' ? 'collapsed' : 'expanded')
      }}
      {...props}
    >
      <Menu />
      <span className="sr-only">Alternar menu</span>
    </Button>
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  const isMobile = useIsMobile()

  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        'relative flex min-h-svh flex-1 flex-col',
        'peer-data-[variant=inset]:min-h-[calc(100svh-(--spacing(4)))]',
        'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0',
        'md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
        'md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm',
        !isMobile && 'pl-[280px]',
        className,
      )}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn('flex flex-col', className)}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        'flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        'w-(--sidebar-width) transition-[width] duration-200 ease-linear',
        className,
      )}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn('flex flex-col border-t border-white/50 pt-5', className)}
      {...props}
    />
  )
}

function AppSidebarUserProfile() {
  const { user } = useAuth()
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div className="relative" ref={containerRef}>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen((v) => !v)}
        className="tm-user-profile w-full flex items-center gap-3 rounded-xl px-3 py-2 transition-colors"
      >
        <Avatar
          name={user?.name}
          imageUrl={user?.photo}
          size="base"
          roundedFull={false}
          className="rounded-xl"
        />
        <div className="flex min-w-0 flex-1 flex-col text-left">
          <span className="truncate text-sm font-medium">
            {getCompoundName(user?.name)}
          </span>
          <span className="text-text-three text-xs font-semibold">
            {user?.role === 'admin' ? 'Administrador' : 'Dentista'}
          </span>
        </div>
        {open ? (
          <ChevronUp className="text-text-three h-4 w-4 shrink-0" />
        ) : (
          <ChevronDown className="text-text-three h-4 w-4 shrink-0" />
        )}
      </Button>

      {open && (
        <div
          className={cn(
            'absolute bottom-full left-0 right-0 z-50 mb-2',
            'rounded-xl border border-black/8 bg-white/90 backdrop-blur-xl',
            'shadow-two overflow-hidden',
          )}
        >
          <Link
            href="/perfil"
            onClick={() => setOpen(false)}
            className={cn(
              'flex w-full items-center justify-start gap-3 px-4 py-3 rounded-none',
              'text-left text-sm font-medium text-text-two',
              'transition-colors hover:bg-primary/10 hover:text-primary hover:[&_svg]:text-primary',
              '[&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-text-three',
            )}
          >
            <User />
            Meu Perfil
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              signOut()
            }}
            className={cn(
              'flex w-full items-center justify-start gap-3 rounded-none border-t border-black/6 px-4 py-3',
              'text-left text-sm font-medium text-text-two',
              'transition-colors hover:bg-primary/10 hover:text-danger-one hover:[&_svg]:text-danger-one',
              '[&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-text-three',
            )}
          >
            <LogOut />
            Sair
          </button>
        </div>
      )}
    </div>
  )
}

function AppSidebarHeader() {
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const pathname = usePathname()

  const currentScreen = sidebarContentNavItems(user?.role).find((item) =>
    pathname.startsWith(item.href),
  )

  return (
    <nav className="flex items-center justify-between gap-3 mb-6 md:mb-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {isMobile && <SidebarTrigger className="shrink-0" />}
        <div className="flex min-w-0 flex-col">
          <h1 className="text-xl font-semibold leading-tight truncate text-text-one md:text-[28px]">
            {currentScreen?.title ?? 'Lucy'}
          </h1>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        {pathname.startsWith('/dashboard') ? (
          <DropdownMenu
            trigger={
              <span
                className={cn(
                  'flex items-center justify-center rounded-xl bg-primary text-white',
                  'h-10 w-10 md:h-12 md:w-12',
                  'border-2 border-primary shadow-lg shadow-primary/25',
                  'transition-all hover:scale-105 hover:bg-primary-alternative hover:shadow-xl hover:shadow-primary/30',
                  'active:scale-100',
                )}
                aria-hidden
              >
                <Plus className="h-5 w-5 stroke-[2.5] md:h-6 md:w-6" />
              </span>
            }
            items={[
              <Link
                key="prescription"
                href={appRoutes.prescriptions + '/adicionar'}
              >
                Nova Prescrição
              </Link>,
              <Link key="patient" href={appRoutes.patients + '/adicionar'}>
                Novo Paciente
              </Link>,
            ]}
          />
        ) : null}
      </div>
    </nav>
  )
}

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex justify-center border-b border-white/50 px-6 py-[30px]">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
          aria-label="Ir para o dashboard"
        >
          <div
            className="flex h-[45px] w-[45px] items-center justify-center rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #0066CC, #2563EB)',
            }}
          >
            <span className="text-white text-lg font-bold">L</span>
          </div>
          <span
            className="text-[22px] font-semibold"
            style={{
              background: 'linear-gradient(135deg, #0066CC, #2563EB)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Lucy
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="py-[30px]">
        <SidebarContentNav />
      </SidebarContent>
      <SidebarFooter className="px-6 pb-6">
        <AppSidebarUserProfile />
      </SidebarFooter>
    </Sidebar>
  )
}

export {
  AppSidebar,
  AppSidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
}
