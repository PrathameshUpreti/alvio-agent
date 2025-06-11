import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Avatar, Box, ButtonBase, MenuItem, Tooltip, Typography, Divider, Paper, Popper, ClickAwayListener } from '@mui/material'
import { styled } from '@mui/material/styles'

// project imports
import LogoSection from '../LogoSection'
import Settings from '@/views/settings'
import ArchivedChats from '@/views/archived/ArchivedChats'

// assets
import {
    IconMenu2,
    IconSettings,
    IconArchive,
    IconCreditCard,
    IconLogout,
    IconSun,
    IconMoon,
    IconChevronDown,
    IconUser
} from '@tabler/icons-react'

// store
import { SET_DARKMODE } from '@/store/actions'

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const GradientButton = styled(ButtonBase)(({ theme }) => ({
    background: 'linear-gradient(90deg, #00E676, #00E699)',
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
        background: 'linear-gradient(90deg, #00C853, #00BA88)'
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
                    justifyContent: 'space-between',
                    p: 2
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', gap: '15px' }}>
                    <ButtonBase sx={{ borderRadius: '4px', overflow: 'hidden' }}>
                        <Avatar
                            variant='rounded'
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                overflow: 'hidden',
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.mode === 'dark' ? theme.palette.darkLevel1 : theme.palette.secondary.light,
                                color: theme.palette.mode === 'dark' ? theme.palette.secondary.lighter : theme.palette.secondary.dark,
                                '&:hover': {
                                    background: theme.palette.mode === 'dark' ? theme.palette.darkLevel1 : theme.palette.secondary.dark,
                                    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.secondary.light
                                }
                            }}
                            onClick={handleLeftDrawerToggle}
                            color='inherit'
                        >
                            <IconMenu2 stroke={1.5} size='1.3rem' />
                        </Avatar>
                    </ButtonBase>
                    <Box component='span' sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                        <LogoSection />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GradientButton onClick={handleUpgradeClick} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                        <IconCreditCard size={18} />
                        Upgrade Plan
                    </GradientButton>

                    <Tooltip title={isDark ? 'Light Mode' : 'Dark Mode'}>
                        <ThemeToggleButton onClick={changeDarkMode}>
                            {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
                        </ThemeToggleButton>
                    </Tooltip>

                    {/* Profile Button */}
                    <ProfileButton
                        ref={anchorRef}
                        aria-controls={open ? 'profile-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleToggle}
                    >
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                border: '2px solid',
                                borderColor: theme.palette.mode === 'dark' ? 'rgba(128, 128, 128, 0.4)' : 'rgba(200, 200, 200, 1)',
                                mr: 1
                            }}
                        >
                            <IconUser size={20} />
                        </Avatar>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography variant='caption' sx={{ fontWeight: 500, color: theme.palette.mode === 'dark' ? '#fff' : '#333' }}>
                                {username}
                            </Typography>
                            <Typography variant='caption' sx={{ fontSize: '10px', color: theme.palette.mode === 'dark' ? '#bbb' : '#666' }}>
                                {email}
                            </Typography>
                        </Box>
                        <Box sx={{ ml: 1, color: theme.palette.mode === 'dark' ? '#999' : '#666', display: 'flex', alignItems: 'center' }}>
                            <IconChevronDown size={14} />
                        </Box>
                    </ProfileButton>

                    <Popper
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        placement='bottom'
                        transition
                        popperOptions={{
                            modifiers: [
                                {
                                    name: 'offset',
                                    options: {
                                        offset: [0, 10]
                                    }
                                },
                                {
                                    name: 'preventOverflow',
                                    options: {
                                        altAxis: true,
                                        rootBoundary: 'viewport'
                                    }
                                }
                            ]
                        }}
                        sx={{
                            zIndex: 1500,
                            transformOrigin: 'top center',
                            position: 'fixed',
                            right: '30px !important',
                            top: '70px !important'
                        }}
                    >
                        <ClickAwayListener onClickAway={handleClose}>
                            <UserMenuCard>
                                <GradientOverlay>
                                    <OrangeBall />
                                    <PinkBall />
                                </GradientOverlay>

                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <MenuItemStyled onClick={() => handleMenuAction('settings')}>
                                        <IconSettings size={20} stroke={theme.palette.mode === 'dark' ? '#fff' : '#000'} strokeWidth={2} />
                                        <Typography sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000') }}>
                                            Settings
                                        </Typography>
                                    </MenuItemStyled>

                                    <MenuItemStyled onClick={() => handleMenuAction('archived')}>
                                        <IconArchive size={20} stroke={theme.palette.mode === 'dark' ? '#fff' : '#000'} strokeWidth={2} />
                                        <Typography sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000') }}>
                                            Archived Chats
                                        </Typography>
                                    </MenuItemStyled>

                                    <MenuItemStyled onClick={() => handleMenuAction('billing')}>
                                        <IconCreditCard
                                            size={20}
                                            stroke={theme.palette.mode === 'dark' ? '#fff' : '#000'}
                                            strokeWidth={2}
                                        />
                                        <Typography sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000') }}>
                                            Billing & Subscription
                                        </Typography>
                                    </MenuItemStyled>

                                    <Divider
                                        sx={{
                                            my: 1,
                                            borderColor: theme.palette.mode === 'dark' ? 'rgba(107, 114, 128, 0.5)' : 'rgb(243, 244, 246)'
                                        }}
                                    />

                                    <MenuItemStyled onClick={() => handleMenuAction('signout')}>
                                        <IconLogout size={20} stroke={theme.palette.mode === 'dark' ? '#fff' : '#000'} strokeWidth={2} />
                                        <Typography sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#000') }}>
                                            Sign Out
                                        </Typography>
                                    </MenuItemStyled>
                                </Box>
                            </UserMenuCard>
                        </ClickAwayListener>
                    </Popper>

                    {/* Settings Dialog */}
                    <Settings open={settingsOpen} onClose={handleSettingsClose} />

                    {/* Archived Chats Dialog */}
                    <ArchivedChats open={archivedOpen} onClose={handleArchivedClose} />
                </Box>
            </Box>
        </>
    )
}

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
}

export default Header
