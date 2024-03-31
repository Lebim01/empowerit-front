import { Suspense, useEffect, useState } from 'react'
import Loading from '@/components/shared/Loading'
import { protectedRoutes, publicRoutes } from '@/configs/routes.config'
import appConfig from '@/configs/app.config'
import PageContainer from '@/components/template/PageContainer'
import { Routes, Route, Navigate } from 'react-router-dom'
import { setUser, useAppDispatch, useAppSelector } from '@/store'
import ProtectedRoute from '@/components/route/ProtectedRoute'
import PublicRoute from '@/components/route/PublicRoute'
import AuthorityGuard from '@/components/route/AuthorityGuard'
import AppRoute from '@/components/route/AppRoute'
import type { LayoutType } from '@/@types/theme'
import dayjs from 'dayjs'
import { payRoute } from '@/configs/routes.config/routes.config'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import GlobalComponents from './GlobalComponents'

interface ViewsProps {
  pageContainerType?: 'default' | 'gutterless' | 'contained'
  layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const { authenticatedEntryPath } = appConfig

const AllRoutes = (props: AllRoutesProps) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  const userAuthority = useAppSelector((state) => state.auth.user.authority)

  const expires = useAppSelector(
    (state) =>
      state.auth.user.subscription?.pro?.expires_at ||
      state.auth.user.subscription?.starter?.expires_at ||
      null
  )

  const isAdmin = useAppSelector((state) =>
    state.auth.user.authority?.includes('ADMIN')
  )

  const [redirectToPay, setRedirectToPay] = useState(false)

  useEffect(() => {
    if (!isAdmin) {
      if (!expires || dayjs().isAfter(dayjs(expires.seconds * 1000))) {
        // ya vencio la membresia
        setRedirectToPay(true)
      } else {
        setRedirectToPay(false)
      }
    } else {
      setRedirectToPay(false)
    }
  }, [expires, isAdmin])

  useEffect(() => {
    if (user.uid) {
      const unsubs = onSnapshot(doc(db, 'users/' + user.uid), (snap) => {
        const data: any = snap.data()
        dispatch(setUser({ uid: user.uid, ...data }))
      })
      return () => {
        unsubs()
      }
    }
  }, [user.uid])

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
        <Route
          path="/"
          element={<Navigate replace to={authenticatedEntryPath} />}
        />
        {redirectToPay &&
          payRoute.map((route, index) => (
            <Route
              key={route.key + index}
              path={route.path}
              element={
                <AuthorityGuard
                  userAuthority={userAuthority}
                  authority={route.authority}
                >
                  <PageContainer {...props} {...route.meta}>
                    <AppRoute
                      routeKey={route.key}
                      component={route.component}
                      {...route.meta}
                    />
                  </PageContainer>
                </AuthorityGuard>
              }
            />
          ))}
        {!redirectToPay &&
          protectedRoutes.map((route, index) => (
            <Route
              key={route.key + index}
              path={route.path}
              element={
                <AuthorityGuard
                  userAuthority={userAuthority}
                  authority={route.authority}
                >
                  <PageContainer {...props} {...route.meta}>
                    <AppRoute
                      routeKey={route.key}
                      component={route.component}
                      {...route.meta}
                    />
                  </PageContainer>
                </AuthorityGuard>
              }
            />
          ))}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
      <Route path="/" element={<PublicRoute />}>
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <AppRoute
                routeKey={route.key}
                component={route.component}
                {...route.meta}
              />
            }
          />
        ))}
      </Route>
    </Routes>
  )
}

const Views = (props: ViewsProps) => {
  return (
    <Suspense fallback={<Loading loading={true} />}>
      <AllRoutes {...props} />
      <GlobalComponents />
    </Suspense>
  )
}

export default Views
