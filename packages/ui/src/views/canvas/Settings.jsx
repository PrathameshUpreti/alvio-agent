import PropTypes from 'prop-types'

// material-ui
import { useTheme, styled } from '@mui/material/styles'
import { Popper, ClickAwayListener, Paper, List, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material'
import Fade from '@mui/material/Fade'

// icons
import {
    IconSettings,
    IconTrash,
    IconMessages,
    IconDatabaseImport,
    IconUpload,
    IconDownload,
    IconUserCircle,
    IconCopy,
    IconTemplate
} from '@tabler/icons-react'

// ==============================|| CANVAS SETTINGS ||============================== //

// Styled components to match dashboard styling
const GlassGradientPaper = styled(Paper)(({ theme }) => ({
    width: '100%',
    borderRadius: '18px',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    background: theme.palette.background.paper,
    border: '1.5px solid',
    borderColor: theme.palette.mode === 'dark' ? 'rgba(128, 128, 128, 0.25)' : 'rgba(14, 165, 233, 0.18)',
    boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(141,54,249,0.18)' : '0 8px 32px rgba(141,54,249,0.10)'
}))

const GradientOverlay = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
    opacity: theme.palette.mode === 'dark' ? 0.8 : 0.5
}))

const PinkBall = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '60%',
    height: '90%',
    background: 'linear-gradient(to top left, #8D36F9, transparent)',
    borderRadius: '9999px',
    filter: 'blur(80px)',
    transform: 'translate(-20%, 25%)'
}))

const OrangeBall = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '60%',
    height: '90%',
    background: 'linear-gradient(to top right, #C837AB, transparent)',
    borderRadius: '9999px',
    filter: 'blur(80px)',
    transform: 'translate(20%, 25%)'
}))

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: '10px',
    margin: '4px 0',
    transition: 'background 0.18s, box-shadow 0.18s',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(141,54,249,0.10)' : 'rgba(141,54,249,0.08)',
        boxShadow: '0 2px 8px rgba(141,54,249,0.10)'
    },
    '&:focus': {
        outline: '2px solid ' + theme.palette.primary.main
    }
}))

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#f0f4f8' : '#0f172a'
}))

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
    '& .MuiTypography-root': {
        color: theme.palette.mode === 'dark' ? '#f0f4f8' : '#0f172a'
    }
}))

const Settings = ({ chatflow, isSettingsOpen, anchorEl, onClose, onSettingsItemClick, onUploadFile, isAgentCanvas }) => {
    const theme = useTheme()

    const handleFileUpload = (event) => {
        const fileObj = event.target.files && event.target.files[0]
        if (!fileObj) {
            return
        }

        const reader = new FileReader()
        reader.readAsText(fileObj, 'UTF-8')
        reader.onload = (evt) => {
            const readerResult = evt.target.result
            onUploadFile(readerResult)
        }
        event.target.value = null
    }

    return (
        <Popper
            open={isSettingsOpen}
            role={undefined}
            transition
            disablePortal={false}
            placement='bottom-end'
            anchorEl={anchorEl}
            modifiers={[
                {
                    name: 'offset',
                    options: {
                        offset: [0, 10]
                    }
                }
            ]}
            style={{ zIndex: 1300 }}
        >
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={200}>
                    <Paper
                        elevation={4}
                        sx={{
                            p: 2,
                            width: 300,
                            maxHeight: '80vh',
                            borderRadius: '10px',
                            background: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.shadows[2]
                        }}
                    >
                        <Box sx={{ position: 'relative' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}
                            >
                                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                                    Settings
                                </Typography>
                            </Box>

                            <ClickAwayListener onClickAway={onClose}>
                                <List component='nav' sx={{ p: 0 }}>
                                    {chatflow?.id && (
                                        <>
                                            <ListItemButton onClick={() => onSettingsItemClick('chatflowConfiguration')}>
                                                <ListItemIcon>
                                                    <IconSettings stroke={1.5} size='1.3rem' />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={isAgentCanvas ? 'Agents Configuration' : 'Chatflow Configuration'}
                                                    primaryTypographyProps={{ fontWeight: 500 }}
                                                />
                                            </ListItemButton>
                                            <ListItemButton onClick={() => onSettingsItemClick('viewMessages')}>
                                                <ListItemIcon>
                                                    <IconMessages stroke={1.5} size='1.3rem' />
                                                </ListItemIcon>
                                                <ListItemText primary='View Messages' primaryTypographyProps={{ fontWeight: 500 }} />
                                            </ListItemButton>
                                            {!isAgentCanvas && (
                                                <ListItemButton onClick={() => onSettingsItemClick('viewLeads')}>
                                                    <ListItemIcon>
                                                        <IconUserCircle stroke={1.5} size='1.3rem' />
                                                    </ListItemIcon>
                                                    <ListItemText primary='View Leads' primaryTypographyProps={{ fontWeight: 500 }} />
                                                </ListItemButton>
                                            )}
                                            <ListItemButton onClick={() => onSettingsItemClick('viewUpsertHistory')}>
                                                <ListItemIcon>
                                                    <IconDatabaseImport stroke={1.5} size='1.3rem' />
                                                </ListItemIcon>
                                                <ListItemText primary='View Upsert History' primaryTypographyProps={{ fontWeight: 500 }} />
                                            </ListItemButton>
                                            <Divider sx={{ my: 1.5 }} />
                                        </>
                                    )}
                                    <ListItemButton onClick={() => onSettingsItemClick('duplicateChatflow')}>
                                        <ListItemIcon>
                                            <IconCopy stroke={1.5} size='1.3rem' />
                                        </ListItemIcon>
                                        <ListItemText primary='Duplicate' primaryTypographyProps={{ fontWeight: 500 }} />
                                    </ListItemButton>
                                    <ListItemButton onClick={() => onSettingsItemClick('exportChatflow')}>
                                        <ListItemIcon>
                                            <IconDownload stroke={1.5} size='1.3rem' />
                                        </ListItemIcon>
                                        <ListItemText primary='Export' primaryTypographyProps={{ fontWeight: 500 }} />
                                    </ListItemButton>
                                    <ListItemButton component='label'>
                                        <ListItemIcon>
                                            <IconUpload stroke={1.5} size='1.3rem' />
                                        </ListItemIcon>
                                        <ListItemText primary='Import' primaryTypographyProps={{ fontWeight: 500 }} />
                                        <input type='file' onChange={handleFileUpload} hidden accept='.json' />
                                    </ListItemButton>
                                    {chatflow?.id && (
                                        <>
                                            <ListItemButton onClick={() => onSettingsItemClick('saveAsTemplate')}>
                                                <ListItemIcon>
                                                    <IconTemplate stroke={1.5} size='1.3rem' />
                                                </ListItemIcon>
                                                <ListItemText primary='Save as Template' primaryTypographyProps={{ fontWeight: 500 }} />
                                            </ListItemButton>
                                            <Divider sx={{ my: 1.5 }} />
                                            <ListItemButton
                                                onClick={() => onSettingsItemClick('deleteChatflow')}
                                                sx={{ color: 'error.main' }}
                                            >
                                                <ListItemIcon sx={{ color: 'error.main' }}>
                                                    <IconTrash stroke={1.5} size='1.3rem' />
                                                </ListItemIcon>
                                                <ListItemText primary='Delete' primaryTypographyProps={{ fontWeight: 500 }} />
                                            </ListItemButton>
                                        </>
                                    )}
                                </List>
                            </ClickAwayListener>
                        </Box>
                    </Paper>
                </Fade>
            )}
        </Popper>
    )
}

Settings.propTypes = {
    chatflow: PropTypes.object,
    isSettingsOpen: PropTypes.bool,
    anchorEl: PropTypes.object,
    onClose: PropTypes.func,
    onSettingsItemClick: PropTypes.func,
    onUploadFile: PropTypes.func,
    isAgentCanvas: PropTypes.bool
}

export default Settings
