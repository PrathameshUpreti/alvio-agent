import { lazy } from 'react'

// project imports
import Loadable from '@/ui-component/loading/Loadable'
import MinimalLayout from '@/layout/MinimalLayout'

// authentication pages
const AuthPage = Loadable(lazy(() => import('@/views/auth/AuthPage')))

// ==============================|| AUTHENTICATION ROUTES ||============================== //

const AuthRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/auth',
            element: <AuthPage />
        },
        {
            path: '/login',
            element: <AuthPage />
        },
        {
            path: '/register',
            element: <AuthPage />
        }
    ]
}

export default AuthRoutes
