'use client'

import { ChevronDown, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { PRIMITIVE, UI } from '@/application/_shared/components'
import { ButtonProps } from '@/application/_shared/components/button'
import { SidebarContentNav } from '@/application/_shared/components/shared/sidebar-content-nav'
import { SidebarUserInfo } from '@/application/_shared/components/shared/sidebar-user-info'
import { getCompoundName } from '@/application/_shared/helpers/name-manipulator.helper'
import { useIsMobile } from '@/application/_shared/helpers/use-mobile'
import { cn } from '@/application/_shared/libs/tw-merge'
import { useAuth } from '@/application/auth/hooks/auth.hook'

const SIDEBAR_WIDTH = '256px'
const SIDEBAR_WIDTH_COLLAPSED = '88px'

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
  const [state, setState] = React.useState<'expanded' | 'collapsed'>(
    'collapsed',
  )
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
      <PRIMITIVE.TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-collapsed': SIDEBAR_WIDTH_COLLAPSED,
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
      </PRIMITIVE.TooltipProvider>
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
      <PRIMITIVE.Sheet
        open={state === 'expanded'}
        onOpenChange={(open) =>
          updateSidebarState(open ? 'expanded' : 'collapsed')
        }
        {...props}
      >
        <PRIMITIVE.SheetHeader className="sr-only">
          <PRIMITIVE.SheetTitle>Sidebar</PRIMITIVE.SheetTitle>
          <PRIMITIVE.SheetDescription>
            Displays the mobile sidebar.
          </PRIMITIVE.SheetDescription>
        </PRIMITIVE.SheetHeader>
        <PRIMITIVE.SheetContent
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
        </PRIMITIVE.SheetContent>
      </PRIMITIVE.Sheet>
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
          className="group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-radius group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
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
    <UI.Button
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
    </UI.Button>
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  const { isMobile, updateSidebarState, state } = useSidebar()

  return (
    <main
      onMouseEnter={() =>
        !isMobile && state === 'expanded' && updateSidebarState('collapsed')
      }
      data-slot="sidebar-inset"
      className={cn(
        'relative flex min-h-svh flex-1 flex-col',
        'peer-data-[variant=inset]:min-h-[calc(100svh-(--spacing(4)))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm',
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

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { isMobile, updateSidebarState, state } = useSidebar()

  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        'bg-background flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        'transition-[width] duration-200 ease-linear',
        state === 'expanded'
          ? 'w-(--sidebar-width)'
          : 'w-(--sidebar-width-collapsed)',
        className,
      )}
      onMouseEnter={() =>
        !isMobile && state === 'collapsed' && updateSidebarState('expanded')
      }
      {...props}
    />
  )
}

function AppSidebarHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="border-border-one bg-background flex h-[80px] w-full items-center justify-end border-b pr-8 transition-[width,height] ease-linear">
      <SidebarTrigger />
      <PRIMITIVE.DropdownMenu
        trigger={
          <div className="flex items-center gap-2">
            <UI.Avatar name={user?.name} />
            <div className="flex max-w-[150px] flex-col items-start gap-1">
              <p className="line-clamp-1 text-left font-semibold leading-[1.1875]">
                {getCompoundName(user?.name)}
              </p>
              <span className="text-text-two line-clamp-1 text-left text-xs leading-[1.16]">
                {user?.email}
              </span>
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
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-border-one flex h-[80px] justify-center border-b px-7">
        {state === 'expanded' ? (
          <UI.Image
            src={'/logo-icon-text.png'}
            alt="Logo"
            className="h-[32px] w-[164px]"
          />
        ) : (
          <UI.Image
            src={'/logo.png'}
            alt="Logo"
            className="h-[32px] w-[32px]"
          />
        )}
      </SidebarHeader>
      <SidebarContent className="border-border-one border-r py-10">
        <SidebarUserInfo />
        <div className="my-6 flex px-4">
          <UI.Separator />
        </div>
        <SidebarContentNav />
      </SidebarContent>
      <SidebarFooter className="border-border-one border-r"></SidebarFooter>
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
