'use client'

import { ChevronDown, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { Avatar } from '@/application/_shared/components/atoms/avatar'
import {
  Button,
  ButtonProps,
} from '@/application/_shared/components/atoms/button'
import { DropdownMenu } from '@/application/_shared/components/atoms/dropdown-menu'
import { TooltipProvider } from '@/application/_shared/components/atoms/tooltip'
import { SidebarContentNav } from '@/application/_shared/components/organisms/sidebar/sidebar-content-nav'
import { sidebarContentNavItems } from '@/application/_shared/components/organisms/sidebar/sidebar-content-nav-items'
import {
  SidebarSheet,
  SidebarSheetContent,
  SidebarSheetDescription,
  SidebarSheetHeader,
  SidebarSheetTitle,
} from '@/application/_shared/components/organisms/sidebar/sidebar-sheet'
import { getCompoundName } from '@/application/_shared/helpers/name-manipulator.helper'
import { useIsMobile } from '@/application/_shared/helpers/use-mobile'
import { cn } from '@/application/_shared/libs/tw-merge'
import { useAuth } from '@/application/auth/hooks/auth.hook'
import { signOut } from '@/application/auth/services/auth-firebase.service'

const SIDEBAR_WIDTH = '256px'

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

  // Helper to toggle the sidebar.
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
          className="text-sidebar-foreground w-(--sidebar-width) border-r border-yellow-500 p-0 [&>button]:hidden"
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
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          'relative bg-transparent w-(--sidebar-width-collapsed)',
          'transition-[width] duration-200 ease-linear',
        )}
      />
      <div
        className={cn(
          'fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] duration-200 ease-linear md:flex',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          // Adjust the padding for floating and inset variants.
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
            'group-data-[variant=floating]:border-sidebar-border ',
            'flex h-full w-full flex-col bg-white',
            'border-r border-border-one',
            'group-data-[variant=floating]:rounded-radius',
            'group-data-[variant=floating]:border',
            'group-data-[variant=floating]:shadow-sm',
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
      className={cn('h-7 w-7', className)}
      onClick={(event: any) => {
        onClick?.(event)
        updateSidebarState(state === 'expanded' ? 'collapsed' : 'expanded')
      }}
      {...props}
    >
      <Sun />
      <span className="sr-only">Toggle Sidebar</span>
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
        !isMobile && 'pl-[256px]',
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
        'transition-[width] duration-200 ease-linear w-(--sidebar-width)',
        className,
      )}
      {...props}
    />
  )
}

function AppSidebarHeader() {
  const { user } = useAuth()

  const isMobile = useIsMobile()

  const pathname = usePathname()

  const currentScreen = sidebarContentNavItems(user?.role).find((item) =>
    pathname.includes(item.href),
  )

  return (
    <header
      className={cn(
        'border-border-one bg-white flex h-[85px] w-full items-center',
        'justify-between border-b px-6 transition-[width,height] ease-linear',
      )}
    >
      {!isMobile && (
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{currentScreen?.title}</h1>
          <h2 className="text-sm text-text-two">
            {currentScreen?.description}
          </h2>
        </div>
      )}
      {isMobile && <SidebarTrigger />}
      <DropdownMenu
        trigger={
          <div className="flex items-center gap-3">
            <Avatar name={user?.name} imageUrl={user?.photo} />
            <div className="flex flex-col items-start">
              <p className="line-clamp-1 text-left text-sm font-semibold">
                {getCompoundName(user?.name)}
              </p>
              {user?.email && (
                <span className="text-text-six line-clamp-1 text-left text-xs">
                  CRO: {user?.cro}
                </span>
              )}
            </div>
            <ChevronDown />
          </div>
        }
        items={[
          <button key="logout" onClick={signOut}>
            Sair
          </button>,
        ]}
      />
    </header>
  )
}

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex h-[85px] justify-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-[33px] h-[44px] bg-primary rounded-lg" />
          <div className="flex flex-col">
            <p className="text-xl font-bold">Lucy</p>
            <p className="text-text-six text-sm">Sistema de Prescrições</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-6 shadow-two">
        <SidebarContentNav />
      </SidebarContent>
    </Sidebar>
  )
}

export {
  AppSidebar,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
  AppSidebarHeader,
}
