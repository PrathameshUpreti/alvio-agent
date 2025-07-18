import PropTypes from 'prop-types'
import { forwardRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery, Tooltip, Box } from '@mui/material'

// project imports
import { MENU_OPEN, SET_MENU } from '@/store/actions'
import config from '@/config'

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level, navType, onClick, onUploadFile, miniSidebar }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const customization = useSelector((state) => state.customization)
    const matchesSM = useMediaQuery(theme.breakpoints.down('lg'))

    const Icon = item.icon
    const itemIcon = item?.icon ? (
        <Icon stroke={1.5} size='1.3rem' />
    ) : (
        <FiberManualRecordIcon
            sx={{
                width: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
                height: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6
            }}
            fontSize={level > 0 ? 'inherit' : 'medium'}
        />
    )

    let itemTarget = '_self'
    if (item.target) {
        itemTarget = '_blank'
    }

    let listItemProps = {
        component: forwardRef(function ListItemPropsComponent(props, ref) {
            return <Link ref={ref} {...props} to={`${config.basename}${item.url}`} target={itemTarget} />
        })
    }
    if (item?.external) {
        listItemProps = { component: 'a', href: item.url, target: itemTarget }
    }
    if (item?.id === 'loadChatflow') {
        listItemProps.component = 'label'
    }

    const handleFileUpload = (e) => {
        if (!e.target.files) return

        const file = e.target.files[0]

        const reader = new FileReader()
        reader.onload = (evt) => {
            if (!evt?.target?.result) {
                return
            }
            const { result } = evt.target
            onUploadFile(result)
        }
        reader.readAsText(file)
    }

    const itemHandler = (id) => {
        if (id === 'signout') {
            localStorage.removeItem('username')
            localStorage.removeItem('password')
            window.location.href = '/login'
            return
        }
        if (navType === 'SETTINGS' && id !== 'loadChatflow') {
            onClick(id)
        } else {
            dispatch({ type: MENU_OPEN, id })
            if (matchesSM) dispatch({ type: SET_MENU, opened: false })
        }
    }

    // active menu item on page load
    useEffect(() => {
        if (navType === 'MENU') {
            const currentIndex = document.location.pathname
                .toString()
                .split('/')
                .findIndex((id) => id === item.id)
            if (currentIndex > -1) {
                dispatch({ type: MENU_OPEN, id: item.id })
            }
            if (!document.location.pathname.toString().split('/')[1]) {
                itemHandler('chatflows')
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navType])

    const buttonContent = (
        <ListItemButton
            {...listItemProps}
            disabled={item.disabled}
            sx={{
                borderRadius: `${customization.borderRadius}px`,
                mb: 0.5,
                alignItems: 'flex-start',
                backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                py: level > 1 ? 1 : 1.25,
                pl: `${level * 24}px`,
                justifyContent: miniSidebar ? 'center' : 'flex-start',
                minHeight: miniSidebar ? '48px' : undefined,
                ...(customization.isOpen.findIndex((id) => id === item.id) > -1 && {
                    background: (theme.palette?.primary?.main || theme.colors?.primaryMain || '#1976d2') + '22',
                    boxShadow: '0 2px 8px 0 rgba(32, 40, 45, 0.08)'
                })
            }}
            selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
            onClick={() => itemHandler(item.id)}
        >
            {item.id === 'loadChatflow' && <input type='file' hidden accept='.json' onChange={(e) => handleFileUpload(e)} />}
            <ListItemIcon
                sx={{
                    my: 'auto',
                    minWidth: 36,
                    justifyContent: 'center',
                    color:
                        customization.isOpen.findIndex((id) => id === item.id) > -1
                            ? theme.palette?.primary?.main || theme.colors?.primaryMain || '#1976d2'
                            : undefined
                }}
            >
                {itemIcon}
            </ListItemIcon>
            {!miniSidebar && (
                <ListItemText
                    primary={
                        <Typography
                            variant={customization.isOpen.findIndex((id) => id === item.id) > -1 ? 'h5' : 'body1'}
                            color='inherit'
                            sx={{ my: 0.5 }}
                        >
                            {item.title}
                        </Typography>
                    }
                    secondary={
                        item.caption && (
                            <Typography
                                variant='caption'
                                sx={{ ...theme.typography.subMenuCaption, mt: -0.6 }}
                                display='block'
                                gutterBottom
                            >
                                {item.caption}
                            </Typography>
                        )
                    }
                    sx={{ my: 'auto' }}
                />
            )}
            {!miniSidebar && item.chip && (
                <Chip
                    color={item.chip.color}
                    variant={item.chip.variant}
                    size={item.chip.size}
                    label={item.chip.label}
                    avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                />
            )}
            {!miniSidebar && item.isBeta && (
                <Chip
                    sx={{
                        my: 'auto',
                        width: 'max-content',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        background: theme.palette.teal.main,
                        color: 'white'
                    }}
                    label={'BETA'}
                />
            )}
        </ListItemButton>
    )
    return miniSidebar ? (
        <Tooltip title={item.title} placement='right' arrow>
            <Box sx={{ position: 'relative', width: '100%' }}>
                {customization.isOpen.findIndex((id) => id === item.id) > -1 && (
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 0,
                            top: 6,
                            bottom: 6,
                            width: '4px',
                            borderRadius: '4px',
                            background: theme.palette?.primary?.main || theme.colors?.primaryMain || '#1976d2',
                            zIndex: 1
                        }}
                    />
                )}
                {buttonContent}
            </Box>
        </Tooltip>
    ) : (
        <Box sx={{ position: 'relative', width: '100%' }}>
            {customization.isOpen.findIndex((id) => id === item.id) > -1 && (
                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: 6,
                        bottom: 6,
                        width: '4px',
                        borderRadius: '4px',
                        background: theme.palette?.primary?.main || theme.colors?.primaryMain || '#1976d2',
                        zIndex: 1
                    }}
                />
            )}
            {buttonContent}
        </Box>
    )
}

NavItem.propTypes = {
    item: PropTypes.object,
    level: PropTypes.number,
    navType: PropTypes.string,
    onClick: PropTypes.func,
    onUploadFile: PropTypes.func,
    miniSidebar: PropTypes.bool
}

export default NavItem
