import './App.css'
import { useEffect } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'
import HeroSection from './pages/HeroSection'
import Profile from './pages/user/Profile'
import SearchPage from './pages/SearchPage'
import RestaurantDetails from './pages/user/RestaurantDetails'
import Cart from './pages/user/Cart'
import Restaurant from './pages/admin/Restaurant'
import AddMenu from './pages/admin/AddMenu'
import Orders from './pages/admin/Orders'
import OrderSucccess from './pages/user/OrderSucccess'
import Loading from './pages/Loading'
import MainLayout from './layout/MainLayout'
import { useUserStore } from './store/useUserStore'
import { useThemeStore } from './store/useThemeStore'

const ProtectedRoutes = ({children} : {children : React.ReactNode}) => {
    const {isAuthenticated, user} = useUserStore();
    if(!isAuthenticated){
        return <Navigate to="/login" replace />
    }
    if(!user?.isVerified){
        return <Navigate to="/verify-email" replace />
    }
    return children;
}

const AuthenticatedUser = ({children} : {children : React.ReactNode}) => {
    const {isAuthenticated, user} = useUserStore(); //cannot go back to login and signup page if a user is authenticated
    if(isAuthenticated && user?.isVerified){
        return <Navigate to="/" replace />
    }
    return children;
}

const AdminProtectedRoute = ({children} : {children : React.ReactNode}) => {
    const {isAuthenticated, user} = useUserStore();
    if(!isAuthenticated){
        return <Navigate to="/login" replace />
    }
    if(!user?.admin){
        return <Navigate to="/" replace />
    }
    return children;
}


const appRouter = createBrowserRouter([
    {
        path : "/",
        element : <ProtectedRoutes>
            <MainLayout />
            </ProtectedRoutes>,
        children : [
            {
                path : "/",
                element : <HeroSection />,
            },
            {
                path : "/profile",
                element : <Profile />,
            },
            {
                path : "/search/:text",
                element : <SearchPage />,
            },
            {
                path : "/restaurant/:id",
                element : <RestaurantDetails />,
            },
            {
                path : "/cart",
                element : <Cart />,
            },
            {
                path : "/order/status",
                element : <OrderSucccess />,
            },
            {
                path : "/admin/restaurant",
                element : <AdminProtectedRoute><Restaurant /></AdminProtectedRoute>,
            },
            {
                path : "/admin/menu",
                element : <AdminProtectedRoute><AddMenu /></AdminProtectedRoute>,
            },
            {
                path : "/admin/orders",
                element : <AdminProtectedRoute><Orders /></AdminProtectedRoute>,
            },
        ]
    },
    {
        path : "/login",
        element : <AuthenticatedUser><Login /></AuthenticatedUser>,
    },
    {
        path : "/signup",
        element : <AuthenticatedUser><Signup /></AuthenticatedUser>,
    },
    {
        path : "/forgot-password",
        element : <ForgotPassword />,
    },
    {
        path : "/reset-password/:resetToken",
        element : <ResetPassword />,
    },
    {
        path : "/verify-email",
        element : <AuthenticatedUser><VerifyEmail /></AuthenticatedUser>,
    },
])


function App() {
    const {initializeTheme} = useThemeStore();
    const {checkAuthentication, isCheckingAuth} = useUserStore();
    
    useEffect(() => {
        checkAuthentication()
        initializeTheme();
    }, [checkAuthentication])

    if(isCheckingAuth){
        return <Loading />
    }
  return (
    <main>
        <RouterProvider router={appRouter}>
    
        </RouterProvider>
    </main>
  )
}

export default App
