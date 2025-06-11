import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import PropTypes from 'prop-types'

const ProtectedRoute = ({ children }) => {
    const location = useLocation()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // ❌ Avoid storing passwords! Use token or flag instead.
        const username = localStorage.getItem('username')
        const password = localStorage.getItem('password')

        const authenticated = !!(username && password)
        setIsAuthenticated(authenticated)
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to='/login' state={{ from: location }} replace />
    }

    return children
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
}

export default ProtectedRoute
