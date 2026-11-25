import { lazy } from 'react'
import { CalendarDays, LayoutGrid, UsersRound, Wallet } from 'lucide-react'
import { RoutePath } from '@/app/enums/RoutePath'

export const sectionRoutes = [
  { path: RoutePath.Overview, key: 'overview', icon: LayoutGrid, component: lazy(() => import('@/modules/overview/pages/OverviewPage')) },
  { path: RoutePath.Calendar, key: 'calendar', icon: CalendarDays, component: lazy(() => import('@/modules/calendar/pages/CalendarPage')) },
  { path: RoutePath.Clients, key: 'clients', icon: UsersRound, component: lazy(() => import('@/modules/clients/pages/ClientsPage')) },
  { path: RoutePath.Finances, key: 'finances', icon: Wallet, component: lazy(() => import('@/modules/finances/pages/FinancesPage')) },
] as const

export const routes = [
  ...sectionRoutes,
  { path: RoutePath.Account, key: 'account', component: lazy(() => import('@/modules/account/pages/AccountPage')) },
] as const
