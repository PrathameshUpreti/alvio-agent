import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Avatar, Box, ButtonBase, MenuItem, Tooltip, Typography, Divider, Paper, Menu, Fade } from '@mui/material'
import { styled } from '@mui/material/styles'

// project imports
import LogoSection from '../LogoSection'

// assets
import { IconSettings, IconArchive, IconCreditCard, IconLogout, IconSun, IconMoon, IconUser } from '@tabler/icons-react'

// store
import { SET_DARKMODE } from '@/store/actions'

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const GradientButton = styled(ButtonBase)(({ theme }) => ({
    background: 'linear-gradient(135deg, #4f8cff 0%, #7b2ff2 50%, #f357a8 100%)',
    color: theme.palette.common.white,
    padding: '13px 18px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 600,
    textTransform: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&:hover': {
        background: 'linear-gradient(135deg, #4f8cff 0%, #7b2ff2 50%, #f357a8 100%)',
        filter: 'brightness(0.95)'
    }
}))

const ThemeToggleButton = styled(ButtonBase)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.darkLevel1 : theme.palette.grey[100],
    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    padding: '12px',
    borderRadius: '4px',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.darkLevel2 : theme.palette.grey[400]
    }
}))

const ProfileButton = styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px',
    padding: '2px 8px 2px 6px',
    border: '2px solid',
    borderColor: theme.palette.mode === 'dark' ? 'rgba(128, 128, 128, 0.4)' : 'rgba(200, 200, 200, 1)',
    backgroundColor: 'transparent',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(128, 128, 128, 0.15)' : 'rgba(200, 200, 200, 0.15)'
    }
}))

const UserMenuCard = styled(Paper)(({ theme }) => ({
    width: '280px',
    maxWidth: '280px',
    borderRadius: '6px',
    padding: '6px',
    backgroundColor: 'white',
    background: theme.palette.mode === 'dark' ? 'linear-gradient(to bottom right, #232627, #1A1D1E)' : 'white',
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' ? 'rgba(128, 128, 128, 0.2)' : 'rgb(229, 231, 235)', // border-gray-200
    position: 'relative',
    overflow: 'hidden',
    zIndex: 50,
    boxShadow: theme.palette.mode === 'dark' ? '0 10px 20px rgba(0, 0, 0, 0.4)' : '0 10px 20px rgba(0, 0, 0, 0.08)'
}))

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    '&:hover': {
        backgroundColor:
            theme.palette.mode === 'dark'
                ? 'rgba(31, 41, 55, 0.5)' // dark:hover:bg-gray-800/50
                : 'rgb(249, 250, 251)' // hover:bg-gray-50
    }
}))

const GradientOverlay = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    position: 'absolute',
    inset: 0,
    opacity: '0.7',
    pointerEvents: 'none',
    zIndex: 0
}))

const OrangeBall = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '320px',
    height: '240px',
    background: 'linear-gradient(to top right, #C837AB, transparent)',
    borderRadius: '9999px',
    filter: 'blur(24px)',
    transform: 'translate(50%, 50%)'
}))

const PinkBall = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '320px',
    height: '240px',
    background: 'linear-gradient(to top left, #8D36F9, transparent)',
    borderRadius: '9999px',
    filter: 'blur(24px)',
    transform: 'translate(-50%, 50%)'
}))

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const customization = useSelector((state) => state.customization)

    const [isDark, setIsDark] = useState(customization.isDarkMode)
    const [open, setOpen] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [archivedOpen, setArchivedOpen] = useState(false)
    const anchorRef = useRef(null)
    const [profileMenuAnchor, setProfileMenuAnchor] = useState(null)
    const isProfileMenuOpen = Boolean(profileMenuAnchor)
    const handleProfileMenuOpen = (event) => {
        setProfileMenuAnchor(event.currentTarget)
    }
    const handleProfileMenuClose = () => {
        setProfileMenuAnchor(null)
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }
        setOpen(false)
    }

    const prevOpen = useRef(open)
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus()
        }
        prevOpen.current = open
    }, [open])

    const changeDarkMode = () => {
        dispatch({ type: SET_DARKMODE, isDarkMode: !isDark })
        setIsDark((isDark) => !isDark)
        localStorage.setItem('isDarkMode', !isDark)
    }

    const signOutClicked = () => {
        localStorage.removeItem('username')
        localStorage.removeItem('password')
        navigate('/login', { replace: true })
    }

    const handleSignIn = () => {
        navigate('/login')
    }

    const handleUpgradeClick = () => {
        navigate('/upgrade')
    }

    const handleMenuAction = (action) => {
        setOpen(false)
        if (action === 'settings') {
            setSettingsOpen(true)
        } else if (action === 'archived') {
            setArchivedOpen(true)
        } else if (action === 'billing') {
            navigate('/billing')
        } else if (action === 'signout') {
            signOutClicked()
        }
    }

    const handleSettingsClose = () => {
        setSettingsOpen(false)
    }

    const handleArchivedClose = () => {
        setArchivedOpen(false)
    }

    // Get username from localStorage or use default
    const username = localStorage.getItem('username') || 'User'
    const email = localStorage.getItem('email') || `${username.toLowerCase()}`

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', md: 'space-between' },
                    p: { xs: 1, sm: 2 },
                    minHeight: { xs: 56, sm: 64 },
                    gap: { xs: 1, sm: 2 }
                }}
            >
                <Box
                    component='span'
                    sx={{ display: { xs: 'block', md: 'block' }, flexGrow: { xs: 0, md: 1 }, textAlign: { xs: 'center', md: 'left' } }}
                >
                    <LogoSection />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                    <GradientButton onClick={handleUpgradeClick} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                        <IconCreditCard size={18} />
                        <Box component='span' sx={{ display: { xs: 'none', sm: 'inline' } }}>
                            Upgrade Plan
                        </Box>
                    </GradientButton>

                    <Tooltip title={isDark ? 'Light Mode' : 'Dark Mode'}>
                        <ThemeToggleButton onClick={changeDarkMode}>
                            {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
                        </ThemeToggleButton>
                    </Tooltip>

                    {/* Profile Dropdown - always visible, icon only on xs */}
                    <ButtonBase
                        onClick={handleProfileMenuOpen}
                        sx={{
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(128,128,128,0.2)' : 'rgba(200,200,200,0.7)',
                            width: 40,
                            height: 40,
                            boxShadow: theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                            background: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
                            p: 0,
                            ml: { xs: 0, sm: 1 },
                            transition: 'box-shadow 0.2s, border-color 0.2s',
                            '&:hover': {
                                boxShadow: theme.palette.mode === 'dark' ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.12)',
                                borderColor: theme.palette.primary.main
                            }
                        }}
                        aria-controls={isProfileMenuOpen ? 'profile-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={isProfileMenuOpen ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main, color: '#fff', fontWeight: 700 }}>
                            <IconUser size={20} />
                        </Avatar>
                    </ButtonBase>
                    <Menu
                        id='profile-menu'
                        anchorEl={profileMenuAnchor}
                        open={isProfileMenuOpen}
                        onClose={handleProfileMenuClose}
                        TransitionComponent={Fade}
                        PaperProps={{
                            elevation: 8,
                            sx: {
                                borderRadius: 3,
                                minWidth: 220,
                                p: 1,
                                mt: 1.5,
                                boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.12)',
                                background: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff'
                            }
                        }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <Box sx={{ px: 2, py: 1, mb: 1, borderBottom: '1px solid', borderColor: theme.palette.divider }}>
                            <Typography variant='subtitle1' fontWeight={700} sx={{ color: theme.palette.text.primary }}>
                                {username}
                            </Typography>
                            <Typography variant='caption' sx={{ color: theme.palette.text.secondary }}>
                                {email}
                            </Typography>
                        </Box>
                        <MenuItem
                            onClick={() => {
                                handleProfileMenuClose()
                                navigate('/settings')
                            }}
                        >
                            <IconSettings size={18} style={{ marginRight: 10 }} /> Settings
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleProfileMenuClose()
                                navigate('/archived-chats')
                            }}
                        >
                            <IconArchive size={18} style={{ marginRight: 10 }} /> Archived Chats
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleProfileMenuClose()
                                navigate('/billing')
                            }}
                        >
                            <IconCreditCard size={18} style={{ marginRight: 10 }} /> Billing & Subscription
                        </MenuItem>
                        <Divider sx={{ my: 1 }} />
                        <MenuItem
                            onClick={() => {
                                handleProfileMenuClose()
                                signOutClicked()
                            }}
                            sx={{ color: theme.palette.error.main }}
                        >
                            <IconLogout size={18} style={{ marginRight: 10 }} /> Sign Out
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>
        </>
    )
}

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
}

export default Header
