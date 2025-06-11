import PropTypes from 'prop-types'

// material-ui
import { useTheme, styled } from '@mui/material/styles'
import { Popper, ClickAwayListener, Paper, List, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material'

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
const GradientPaper = styled(Paper)(({ theme }) => ({
    width: '100%',
    borderRadius: '12px',
    overflowY: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
        display: 'none'
    },
    msOverflowStyle: 'none' /* IE and Edge */,
    scrollbarWidth: 'none' /* Firefox */,
    position: 'relative',
    background:
        theme.palette.mode === 'dark'
            ? 'linear-gradient(to bottom right, rgb(40, 45, 50), rgb(30, 35, 40))'
            : 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' ? 'rgba(128, 128, 128, 0.2)' : 'rgba(14, 165, 233, 0.15)',
    boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)'
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
    borderRadius: '8px',
    margin: '4px 0',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(14, 165, 233, 0.1)'
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
            disablePortal
            placement={undefined} // optional
            anchorEl={null} // remove anchor positioning
            style={{
                zIndex: 1000,
                position: 'fixed',
                top: '70px',
                right: '25px'
            }}
        >
            <GradientPaper
                elevation={16}
                sx={{
                    p: 2,
                    width: 280,
                    maxHeight: '80vh'
                }}
            >
                <GradientOverlay>
                    <PinkBall />
                    <OrangeBall />
                </GradientOverlay>

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2
                        }}
                    >
                        <Typography variant='h5' sx={{ fontWeight: 600 }}>
                            Settings
                        </Typography>
                    </Box>

                    <ClickAwayListener onClickAway={onClose}>
                        <List component='nav' sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
                            {chatflow?.id && (
                                <>
                                    <StyledListItemButton onClick={() => onSettingsItemClick('chatflowConfiguration')}>
                                        <StyledListItemIcon>
                                            <IconSettings stroke={1.5} size='1.3rem' />
                                        </StyledListItemIcon>
                                        <StyledListItemText
                                            primary={isAgentCanvas ? 'Agents Configuration' : 'Chatflow Configuration'}
                                            primaryTypographyProps={{ fontWeight: 500 }}
                                        />
                                    </StyledListItemButton>
                                    <StyledListItemButton onClick={() => onSettingsItemClick('viewMessages')}>
                                        <StyledListItemIcon>
                                            <IconMessages stroke={1.5} size='1.3rem' />
                                        </StyledListItemIcon>
                                        <StyledListItemText primary='View Messages' primaryTypographyProps={{ fontWeight: 500 }} />
                                    </StyledListItemButton>
                                    {!isAgentCanvas && (
                                        <StyledListItemButton onClick={() => onSettingsItemClick('viewLeads')}>
                                            <StyledListItemIcon>
                                                <IconUserCircle stroke={1.5} size='1.3rem' />
                                            </StyledListItemIcon>
                                            <StyledListItemText primary='View Leads' primaryTypographyProps={{ fontWeight: 500 }} />
                                        </StyledListItemButton>
                                    )}
                                    <StyledListItemButton onClick={() => onSettingsItemClick('viewUpsertHistory')}>
                                        <StyledListItemIcon>
                                            <IconDatabaseImport stroke={1.5} size='1.3rem' />
                                        </StyledListItemIcon>
                                        <StyledListItemText primary='View Upsert History' primaryTypographyProps={{ fontWeight: 500 }} />
                                    </StyledListItemButton>
                                    <Divider sx={{ my: 1.5 }} />
                                </>
                            )}
                            <StyledListItemButton onClick={() => onSettingsItemClick('duplicateChatflow')}>
                                <StyledListItemIcon>
                                    <IconCopy stroke={1.5} size='1.3rem' />
                                </StyledListItemIcon>
                                <StyledListItemText primary='Duplicate' primaryTypographyProps={{ fontWeight: 500 }} />
                            </StyledListItemButton>
                            <StyledListItemButton onClick={() => onSettingsItemClick('exportChatflow')}>
                                <StyledListItemIcon>
                                    <IconDownload stroke={1.5} size='1.3rem' />
                                </StyledListItemIcon>
                                <StyledListItemText primary='Export' primaryTypographyProps={{ fontWeight: 500 }} />
                            </StyledListItemButton>
                            <StyledListItemButton component='label'>
                                <StyledListItemIcon>
                                    <IconUpload stroke={1.5} size='1.3rem' />
                                </StyledListItemIcon>
                                <StyledListItemText primary='Import' primaryTypographyProps={{ fontWeight: 500 }} />
                                <input type='file' onChange={handleFileUpload} hidden accept='.json' />
                            </StyledListItemButton>
                            {chatflow?.id && (
                                <>
                                    <StyledListItemButton onClick={() => onSettingsItemClick('saveAsTemplate')}>
                                        <StyledListItemIcon>
                                            <IconTemplate stroke={1.5} size='1.3rem' />
                                        </StyledListItemIcon>
                                        <StyledListItemText primary='Save as Template' primaryTypographyProps={{ fontWeight: 500 }} />
                                    </StyledListItemButton>
                                    <Divider sx={{ my: 1.5 }} />
                                    <StyledListItemButton
                                        onClick={() => onSettingsItemClick('deleteChatflow')}
                                        sx={{ color: 'error.main' }}
                                    >
                                        <StyledListItemIcon sx={{ color: 'error.main' }}>
                                            <IconTrash stroke={1.5} size='1.3rem' />
                                        </StyledListItemIcon>
                                        <StyledListItemText primary='Delete' primaryTypographyProps={{ fontWeight: 500 }} />
                                    </StyledListItemButton>
                                </>
                            )}
                        </List>
                    </ClickAwayListener>
                </Box>
            </GradientPaper>
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
