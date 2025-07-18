import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// material-ui
import { Box, Typography, TextField, Button, InputAdornment, IconButton, Tabs, Tab, Alert } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'

// icons
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import GoogleIcon from '@mui/icons-material/Google'

// project imports

// ==============================|| AUTH PAGE ||============================== //

const AuthContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    background: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[100],
    overflow: 'hidden',
    height: '100vh'
}))

const LeftPanel = styled(Box)(({ theme }) => ({
    flex: '0 0 40%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    padding: '48px 40px',
    background:
        theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #23272f 0%, #7b2ff2 60%, #f357a8 100%)'
            : 'linear-gradient(135deg, #4f8cff 0%, #7b2ff2 50%, #f357a8 100%)',
    color: '#fff',
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
}))

const RightPanel = styled(Box)(({ theme }) => ({
    flex: '0 0 60%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    [theme.breakpoints.down('md')]: {
        flex: '0 0 100%'
    }
}))

const FormCard = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: '20px',
    padding: '40px 32px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px 0 rgba(31, 38, 135, 0.22)' : '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
    border: `1.5px solid ${theme.palette.divider}`,
    backdropFilter: 'blur(6px)'
}))

const TabsWrapper = styled(Tabs)(({ theme }) => ({
    marginBottom: '32px',
    '& .MuiTabs-indicator': {
        display: 'none'
    }
}))

const TabItem = styled(Tab)(({ theme }) => ({
    fontSize: '16px',
    fontWeight: 600,
    textTransform: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    color: theme.palette.text.primary,
    '&.Mui-selected': {
        backgroundColor: theme.palette.action.selected,
        color: theme.palette.primary.main
    }
}))

const InputField = styled(TextField)(({ theme }) => ({
    marginBottom: '20px',
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#fff',
        boxShadow: theme.palette.mode === 'dark' ? '0 1px 2px 0 rgba(16, 24, 40, 0.10)' : '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
        '&:hover': {
            backgroundColor: theme.palette.action.hover
        },
        '& fieldset': {
            border: `1.5px solid ${theme.palette.divider}`
        }
    },
    '& .MuiInputBase-input': {
        color: theme.palette.text.primary
    },
    '& .MuiInputLabel-root': {
        color: theme.palette.text.secondary
    }
}))

const CenteredFormWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: 400,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent'
}))

const GoogleButton = styled(Button)(({ theme }) => ({
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    background: theme.palette.mode === 'dark' ? theme.palette.background.default : '#fff',
    color: theme.palette.text.primary,
    border: `1.5px solid ${theme.palette.divider}`,
    boxShadow: 'none',
    marginTop: 12,
    '&:hover': {
        background: theme.palette.action.hover,
        boxShadow: 'none'
    }
}))

const SignInButton = styled(Button)(({ theme }) => ({
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '16px',
    marginTop: '8px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: 'none'
    }
}))

const LogoContainer = styled(Box)(({ theme }) => ({
    width: '300px',
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, rgba(239, 71, 111, 0.7), rgba(255, 209, 102, 0.7))',
    borderRadius: '30%',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        width: '70%',
        height: '70%',
        background: theme.palette.mode === 'dark' ? theme.palette.darkBackground : '#0f0f13',
        borderRadius: '30%',
        zIndex: 0
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        width: '40%',
        height: '40%',
        background: 'linear-gradient(135deg, #9B5DE5, #EF476F)',
        borderRadius: '30%',
        zIndex: 1
    }
}))

const PlansContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    marginTop: '40px'
}))

const AuthPage = () => {
    const theme = useTheme()
    const navigate = useNavigate()

    // 0 = Sign In, 1 = Sign Up
    const [activeTab, setActiveTab] = useState(0)
    const [showPassword, setShowPassword] = useState(false)
    const [authError, setAuthError] = useState('')
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })

    // Check if already logged in
    useEffect(() => {
        const username = localStorage.getItem('username')
        const password = localStorage.getItem('password')
        if (username && password) {
            navigate('/')
        }
    }, [navigate])

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
        setAuthError('')
        setFormData({ email: '', password: '', confirmPassword: '' })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleGoogleSignIn = () => {
        // Implement Google sign-in logic here
        console.log('Google sign-in clicked')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Form validation
        if (!formData.email || !formData.password || (activeTab === 1 && !formData.confirmPassword)) {
            setAuthError('Please fill in all required fields')
            return
        }
        if (activeTab === 1 && formData.password !== formData.confirmPassword) {
            setAuthError('Passwords do not match')
            return
        }
        // For demo purposes, we'll store in localStorage as that's what the app uses
        // In a real app, this would be a proper API call
        localStorage.setItem('username', formData.email)
        localStorage.setItem('password', formData.password)
        // Navigate to dashboard
        navigate('/')
    }

    return (
        <AuthContainer>
            <LeftPanel>
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%'
                    }}
                >
                    {/* Heading */}
                    <Typography variant='h3' fontWeight='bold' color='inherit' sx={{ mb: 2, textAlign: 'center' }}>
                        Join Alvio Agent
                    </Typography>
                    {/* Subtitle */}
                    <Typography variant='body1' color='inherit' sx={{ mb: 4, opacity: 0.85, textAlign: 'center' }}>
                        Create an account to access personalized search experiences powered by advanced AI.
                    </Typography>
                    {/* Feature List */}
                    <Box sx={{ mb: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ color: '#00e676', mr: 1 }}>
                                <svg width='22' height='22' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                    <circle cx='12' cy='12' r='12' fill='#00e676' />
                                    <path
                                        d='M8 12.5L11 15.5L16 10.5'
                                        stroke='white'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </svg>
                            </Box>
                            <Typography color='inherit' fontSize={18}>
                                Advanced AI-powered search
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ color: '#00e676', mr: 1 }}>
                                <svg width='22' height='22' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                    <circle cx='12' cy='12' r='12' fill='#00e676' />
                                    <path
                                        d='M8 12.5L11 15.5L16 10.5'
                                        stroke='white'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </svg>
                            </Box>
                            <Typography color='inherit' fontSize={18}>
                                Personalized search history
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ color: '#00e676', mr: 1 }}>
                                <svg width='22' height='22' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                    <circle cx='12' cy='12' r='12' fill='#00e676' />
                                    <path
                                        d='M8 12.5L11 15.5L16 10.5'
                                        stroke='white'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </svg>
                            </Box>
                            <Typography color='inherit' fontSize={18}>
                                Secure and private experience
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                {/* Copyright */}
                <Typography variant='caption' color='inherit' sx={{ opacity: 0.7, width: '100%', textAlign: 'center' }}>
                    © 2025 Alvio Agent. All rights reserved.
                </Typography>
            </LeftPanel>

            <RightPanel>
                <CenteredFormWrapper>
                    <Typography variant='h4' fontWeight='bold' sx={{ mb: 1, color: theme.palette.text.primary, textAlign: 'center' }}>
                        {activeTab === 0 ? 'Welcome back' : 'Create your account'}
                    </Typography>
                    <Typography variant='body1' sx={{ mb: 3, color: theme.palette.text.secondary, textAlign: 'center' }}>
                        {activeTab === 0 ? 'Welcome back! Please enter your details.' : 'Sign up to get started.'}
                    </Typography>
                    {authError && (
                        <Alert severity='error' sx={{ mb: 2 }}>
                            {authError}
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <Typography variant='subtitle2' sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                            Email
                        </Typography>
                        <InputField
                            fullWidth
                            placeholder='Enter your email'
                            name='email'
                            type='email'
                            value={formData.email}
                            onChange={handleInputChange}
                            InputProps={{
                                startAdornment: null,
                                style: { color: theme.palette.text.primary }
                            }}
                        />
                        <Typography variant='subtitle2' sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                            Password
                        </Typography>
                        <InputField
                            fullWidth
                            placeholder='********'
                            name='password'
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleInputChange}
                            InputProps={{
                                startAdornment: null,
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton onClick={handleTogglePasswordVisibility} edge='end'>
                                            {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                style: { color: theme.palette.text.primary }
                            }}
                        />
                        {activeTab === 1 && (
                            <>
                                <Typography variant='subtitle2' sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
                                    Confirm Password
                                </Typography>
                                <InputField
                                    fullWidth
                                    placeholder='********'
                                    name='confirmPassword'
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        startAdornment: null,
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton onClick={handleTogglePasswordVisibility} edge='end'>
                                                    {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        style: { color: theme.palette.text.primary }
                                    }}
                                />
                            </>
                        )}
                        {activeTab === 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <input type='checkbox' id='remember' style={{ marginRight: 6 }} />
                                    <label htmlFor='remember' style={{ color: theme.palette.text.secondary, fontSize: 14 }}>
                                        Remember for 30 days
                                    </label>
                                </Box>
                                <Button
                                    variant='text'
                                    sx={{ color: theme.palette.primary.main, fontSize: 14, textTransform: 'none', minWidth: 0, p: 0 }}
                                >
                                    Forgot password
                                </Button>
                            </Box>
                        )}
                        <SignInButton type='submit' variant='contained'>
                            {activeTab === 0 ? 'Sign in' : 'Sign up'}
                        </SignInButton>
                        <GoogleButton startIcon={<GoogleIcon />}>
                            {activeTab === 0 ? 'Sign in with Google' : 'Sign up with Google'}
                        </GoogleButton>
                    </form>
                    <Typography variant='body2' sx={{ color: theme.palette.text.secondary, mt: 3, textAlign: 'center' }}>
                        {activeTab === 0 ? (
                            <>
                                Don&apos;t have an account?{' '}
                                <Button
                                    variant='text'
                                    sx={{ color: theme.palette.primary.main, fontSize: 14, textTransform: 'none', minWidth: 0, p: 0 }}
                                    onClick={() => setActiveTab(1)}
                                >
                                    Sign up
                                </Button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <Button
                                    variant='text'
                                    sx={{ color: theme.palette.primary.main, fontSize: 14, textTransform: 'none', minWidth: 0, p: 0 }}
                                    onClick={() => setActiveTab(0)}
                                >
                                    Sign in
                                </Button>
                            </>
                        )}
                    </Typography>
                </CenteredFormWrapper>
            </RightPanel>
        </AuthContainer>
    )
}

export default AuthPage
