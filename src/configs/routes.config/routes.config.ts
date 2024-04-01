import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
  // Dashboard
  {
    key: 'home',
    path: '/home',
    component: lazy(() => import('@/views/sales/SalesDashboard')),
    authority: [],
  },
  // Academy
  {
    key: 'academy',
    path: '/academy',
    component: lazy(() => import('@/views/academies/Academy.component')),
    authority: ['USER', 'ADMIN'],
  },
  {
    key: 'academy',
    path: '/:academyType/course/:courseId',
    component: lazy(() => import('@/views/academies/previews/PreviewAcademy.component')),
    authority: ['USER', 'ADMIN'],
  },
  {
    key: 'academy',
    path: '/:academyType/course/:courseId/lesson/:lessonId',
    component: lazy(() => import('@/views/video')),
    authority: ['USER','ADMIN'],
  },
  {
    key: 'academy',
    path: '/:academyType/course/:courseId/live/:lessonId',
    component: lazy(() => import('@/views/video')),
    authority: ['USER', 'ADMIN'],
  },
  // Membership
  {
    key: 'memberships',
    path: '/subscriptions',
    component: lazy(() => import('@/views/memberships')),
    authority: ['USER', 'STARTER'],
  },
  // Uninivel
  {
    key: 'order-list',
    path: '/order-list',
    component: lazy(() => import('@/views/sales/OrderList')),
    authority: ['USER'],
  },
  // Binario
  {
    key: 'binary',
    path: '/binary',
    component: lazy(() => import('@/views/binary-tree')),
    authority: ['USER'],
  },
  // Mapa
  {
    key: 'report-sanguine-map',
    path: '/report-sanguine-map',
    component: lazy(() => import('@/views/users/reports/map-sanguine')),
    authority: ['USER'],
  },
  // Rango
  {
    key: 'rank',
    path: '/rank',
    component: lazy(() => import('@/views/rank')),
    authority: ['USER'],
  },
  // Historial de Pagos
  {
    key: 'user-payroll-history',
    path: '/payroll/history',
    component: lazy(() => import('@/views/Payroll/')),
    authority: ['USER'],
  },
  // Top Shop
  {
    key: 'shop',
    path: '/shop',
    component: lazy(() => import('@/views/shop/index')),
    authority: [],
  },
  // Concursos DISABLED
  // Marketplace DISABLED
  // Beneficios supreme DISABLED
  // Herramientas DISABLED
  // Sistema de liderazgo
  {
    key: 'academy-leadership',
    path: '/academy-leadership',
    component: lazy(() => import('@/views/academies/AcademyLeadership.component')),
    authority: ['USER', 'STARTER', 'ADMIN'],
  },
  {
    key: 'academy-leadership',
    path: '/academy-leadership/courses-leadership/:courseId',
    component: lazy(() => import('@/views/academy-leadership-course/index')),
    authority: ['USER', 'STARTER', 'ADMIN'],
  },
  {
    key: 'academy-leadership',
    path: '/academy-leadership/courses-leadership/:courseId/lesson/:lessonId',
    component: lazy(() => import('@/views/video')),
    authority: ['USER', 'STARTER', 'ADMIN'],
  },
  {
    key: 'academy-leadership',
    path: '/academy-leadership/courses-leadership/:courseId/live/:lessonId',
    component: lazy(() => import('@/views/video')),
    authority: ['USER', 'STARTER', 'ADMIN'],
  },
  // Historial DISABLED
  // Retiros DISABLED
  // ADMIN: Pagos
  {
    key: 'admin-payroll',
    path: '/admin-payroll/pays',
    component: lazy(() => import('@/views/AdminPayroll')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-payroll-withdraw',
    path: '/admin-payroll/withdraw',
    component: lazy(() => import('@/views/AdminPayroll/withdraw')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-payroll-history',
    path: '/admin-payroll/history',
    component: lazy(() => import('@/views/AdminPayroll/history')),
    authority: ['ADMIN'],
  },
  // ADMIN: Academy
  {
    key: 'admin-academy',
    path: '/academy/agregar',
    component: lazy(() => import('@/views/videos')),
    authority: ['ADMIN', 'EDUCATOR'],
  },
  {
    key: 'admin-academy-course',
    path: '/academy/admin-course',
    component: lazy(() => import('@/views/academies/admin/AdminAcademy.component')),
    authority: ['ADMIN', 'EDUCATOR'],
  },
  {
    key: 'editCourse',
    path: 'academy/admin/edit/:courseId',
    component: lazy(() => import('@/views/academies/admin/EditCourse.component')),
    authority: ['ADMIN', 'EDUCATOR'],
  },
  // ADMIN: Sistema de liderazgo
  {
    key: 'admin-academy-leadership',
    path: '/academy-leadership/agregar',
    component: lazy(() => import('@/views/leadership')),
    authority: ['ADMIN', 'EDUCATOR'],
  },
  {
    key: 'admin-academy-leadership-course',
    path: '/academy-leadership/admin-course',
    component: lazy(() => import('@/views/academies/admin/AdminLeadership.component')),
    authority: ['ADMIN', 'EDUCATOR'],
  },
  {
    key: 'edit-courses-leadership',
    path: 'academy-leadership/admin/edit/:courseId',
    component: lazy(() => import('@/views/academies/admin/EditCourse.component')),
    authority: ['ADMIN', 'EDUCATOR'],
  },
  // ADMIN: Usuarios
  {
    key: 'report-earnings',
    path: '/report-earnings',
    component: lazy(() => import('@/views/users/reports/earnings')),
    authority: ['ADMIN'],
  },
  {
    key: 'report-referrals',
    path: '/report-referrals',
    component: lazy(() => import('@/views/users/reports/referrals')),
    authority: ['ADMIN'],
  },
  {
    key: 'report-map',
    path: '/report-map',
    component: lazy(() => import('@/views/users/reports/map')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-register',
    path: '/admin-register',
    component: lazy(() => import('@/views/auth/AdminSignUp')),
    authority: ['ADMIN'],
  },
  {
    key: 'payments-history',
    path: '/payments-history',
    component: lazy(() => import('@/views/payments-history/index')),
    authority: ['ADMIN'],
  },
  {
      key: 'search-users',
      path: '/search-users',
      component: lazy(() => import('@/views/users/index')),
      authority: ['ADMIN'],
  },
  {
    key: 'enter-as-user',
    path: '/admin/enter-as-user',
    component: lazy(() => import('@/views/admin/enter-as-user')),
    authority: ['ADMIN', 'SUPPORT'],
  },
  // User Info
  {
    key: 'profile',
    path: '/profile',
    component: lazy(() => import('@/views/account')),
    authority: ['USER'],
  },
  {
    key: 'password',
    path: '/password',
    component: lazy(() => import('@/views/account')),
    authority: ['USER'],
  },
  {
    key: 'billing',
    path: '/billing',
    component: lazy(() => import('@/views/account')),
    authority: ['USER'],
  },
]

export const payRoute = [
  {
    key: 'pay',
    path: '/home',
    component: lazy(() => import('@/views/memberships')),
    authority: [],
  },
]
