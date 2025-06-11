import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// material-ui
import { Box, Typography, TextField, Button, InputAdornment, IconButton, Tabs, Tab, Divider, Alert } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'

// icons
import { IconEye, IconEyeOff, IconMail, IconLock, IconArrowRight } from '@tabler/icons-react'
import GoogleIcon from '@mui/icons-material/Google'

// project imports
import {
    DarkModePlanCardComplete,
    LightModePlanCardComplete,
    DarkModePlanCardComplete2,
    LightModePlanCardComplete2,
    DarkModePlanCardComplete3,
    LightModePlanCardComplete3
} from '@/ui-component/cards/PlanCards'

// ==============================|| AUTH PAGE ||============================== //

const AuthContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    background: theme.palette.mode === 'dark' ? theme.palette.darkBackground : '#f5f5f7',
    overflow: 'hidden',
    position: 'relative'
}))

const LeftPanel = styled(Box)(({ theme }) => ({
    flex: '0 0 40%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '40px',
    backgroundImage: 'linear-gradient(135deg, rgba(155, 93, 229, 0.2), rgba(239, 71, 111, 0.2))',
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
    borderRadius: '16px',
    padding: '32px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
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
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.darkLevel1 : theme.palette.grey[100],
        color: theme.palette.primary.main
    }
}))

const InputField = styled(TextField)(({ theme }) => ({
    marginBottom: '20px',
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.darkLevel1 : theme.palette.grey[100],
        '& fieldset': {
            border: 'none'
        }
    }
}))

const SocialButton = styled(Button)(({ theme }) => ({
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
    }
}))

const SubmitButton = styled(Button)(({ theme }) => ({
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '16px',
    marginTop: '12px',
    backgroundColor: '#9B5DE5',
    '&:hover': {
        backgroundColor: '#8445d7'
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
        if (!formData.email || !formData.password) {
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

    const PlanCard =
        activeTab === 0 ? (
            theme.palette.mode === 'dark' ? (
                <DarkModePlanCardComplete />
            ) : (
                <LightModePlanCardComplete />
            )
        ) : theme.palette.mode === 'dark' ? (
            <DarkModePlanCardComplete2 />
        ) : (
            <LightModePlanCardComplete2 />
        )

    return (
        <AuthContainer>
            <LeftPanel>
                <PlansContainer>
                    <Typography variant='h3' fontWeight='bold' color='white' textAlign='center' mb={4}>
                        Choose Your Plan
                    </Typography>

                    {theme.palette.mode === 'dark' ? (
                        <>
                            <DarkModePlanCardComplete />
                            <DarkModePlanCardComplete2 />
                            <DarkModePlanCardComplete3 />
                        </>
                    ) : (
                        <>
                            <LightModePlanCardComplete />
                            <LightModePlanCardComplete2 />
                            <LightModePlanCardComplete3 />
                        </>
                    )}
                </PlansContainer>
            </LeftPanel>

            <RightPanel>
                <FormCard>
                    <TabsWrapper value={activeTab} onChange={handleTabChange} centered>
                        <TabItem label='Sign in' />
                        <TabItem label='Create account' />
                    </TabsWrapper>

                    {authError && (
                        <Alert severity='error' sx={{ mb: 3 }}>
                            {authError}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <SocialButton startIcon={<GoogleIcon />} onClick={handleGoogleSignIn} sx={{ mb: 3 }}>
                            Continue with Google
                        </SocialButton>

                        <Divider sx={{ my: 2 }}>
                            <Typography variant='body2' color='textSecondary'>
                                OR
                            </Typography>
                        </Divider>

                        <InputField
                            fullWidth
                            placeholder='Email'
                            name='email'
                            type='email'
                            value={formData.email}
                            onChange={handleInputChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <IconMail size={20} />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <InputField
                            fullWidth
                            placeholder='Password'
                            name='password'
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleInputChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <IconLock size={20} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton onClick={handleTogglePasswordVisibility} edge='end'>
                                            {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        {activeTab === 1 && (
                            <InputField
                                fullWidth
                                placeholder='Confirm Password'
                                name='confirmPassword'
                                type={showPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <IconLock size={20} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        )}

                        <SubmitButton type='submit' variant='contained' endIcon={<IconArrowRight size={20} />}>
                            {activeTab === 0 ? 'Sign in' : 'Create account'}
                        </SubmitButton>

                        {activeTab === 0 && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Typography variant='body2' color='textSecondary'>
                                    Forgot password?
                                </Typography>
                            </Box>
                        )}
                    </form>

                    <Box sx={{ mt: 4, display: { xs: 'block', md: 'none' } }}>
                        <Typography variant='h6' fontWeight='bold' mb={2}>
                            Selected Plan
                        </Typography>
                        {PlanCard}
                    </Box>
                </FormCard>
            </RightPanel>
        </AuthContainer>
    )
}

export default AuthPage
