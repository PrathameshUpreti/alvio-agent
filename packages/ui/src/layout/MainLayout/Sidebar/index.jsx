import PropTypes from 'prop-types'
import { useState } from 'react'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Box, Drawer, useMediaQuery } from '@mui/material'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'
import { BrowserView, MobileView } from 'react-device-detect'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

// project imports
import MenuList from './MenuList'
import LogoSection from '../LogoSection'
import { drawerWidth, headerHeight } from '@/store/constant'

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
    const theme = useTheme()
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))
    // Remove isHovered state
    const [miniSidebar, setMiniSidebar] = useState(false)

    const handleMiniSidebarToggle = () => {
        setMiniSidebar((prev) => !prev)
    }

    const showFullSidebar = !miniSidebar

    const drawer = (
        <>
            <Box
                sx={{
                    display: { xs: 'block', md: 'none' },
                    height: '80px'
                }}
            >
                <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
                    <LogoSection />
                </Box>
            </Box>
            {/* Collapse/Expand Button */}
            {matchUpMd && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', px: 1, py: 1 }}>
                    <Box
                        sx={{
                            background: theme.palette.background.paper,
                            borderRadius: '50%',
                            boxShadow: 1,
                            cursor: 'pointer',
                            p: 0.5,
                            transition: 'background 0.2s',
                            '&:hover': { background: theme.palette.action.hover }
                        }}
                        onClick={handleMiniSidebarToggle}
                    >
                        {miniSidebar ? <IconChevronRight size={20} /> : <IconChevronLeft size={20} />}
                    </Box>
                </Box>
            )}
            <BrowserView>
                <PerfectScrollbar
                    component='div'
                    style={{
                        height: !matchUpMd ? 'calc(100vh - 56px)' : `calc(100vh - ${headerHeight}px)`,
                        paddingLeft: showFullSidebar ? '16px' : '0px',
                        paddingRight: showFullSidebar ? '16px' : '0px',
                        transition: 'padding 0.2s'
                    }}
                >
                    <MenuList miniSidebar={miniSidebar} />
                </PerfectScrollbar>
            </BrowserView>
            <MobileView>
                <Box sx={{ px: 2 }}>
                    <MenuList miniSidebar={false} />
                </Box>
            </MobileView>
        </>
    )

    const container = window !== undefined ? () => window.document.body : undefined

    return (
        <Box
            component='nav'
            sx={{
                flexShrink: { md: 0 },
                width: matchUpMd ? (miniSidebar ? '64px' : drawerWidth) : 'auto',
                height: '100vh',
                zIndex: 1000,
                transition: 'width 0.2s',
                borderRadius: { md: '16px' },
                boxShadow: { md: 3 },
                overflow: 'hidden',
                background: theme.palette.background.default
            }}
            aria-label='mailbox folders'
        >
            <Drawer
                container={container}
                variant={matchUpMd ? 'persistent' : 'temporary'}
                anchor='left'
                open={drawerOpen}
                onClose={drawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: matchUpMd ? (miniSidebar ? '64px' : drawerWidth) : drawerWidth,
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        [theme.breakpoints.up('md')]: {
                            top: `${headerHeight}px`
                        },
                        borderRight: drawerOpen ? '1px solid' : 'none',
                        borderColor: drawerOpen ? theme.palette.primary[200] + 75 : 'transparent',
                        zIndex: 1000,
                        borderRadius: '16px',
                        boxShadow: 3,
                        transition: 'width 0.2s, border-radius 0.2s'
                    }
                }}
                ModalProps={{ keepMounted: true }}
                color='inherit'
            >
                {drawer}
            </Drawer>
        </Box>
    )
}

Sidebar.propTypes = {
    drawerOpen: PropTypes.bool,
    drawerToggle: PropTypes.func,
    window: PropTypes.object
}

export default Sidebar
