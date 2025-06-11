import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { styled } from '@mui/material/styles'
import {
    Box,
    Button,
    Typography,
    Paper,
    TextField,
    Select,
    MenuItem,
    Switch,
    Divider,
    Dialog,
    DialogContent,
    IconButton,
    FormControl,
    Avatar
} from '@mui/material'

// icons
import {
    IconSettings,
    IconDevices,
    IconCloud,
    IconUser,
    IconVolume,
    IconMessages,
    IconUserCircle,
    IconX,
    IconSearch,
    IconUpload,
    IconDownload,
    IconArchive,
    IconTrash
} from '@tabler/icons-react'

// project imports
import { SET_DARKMODE } from '@/store/actions'

const SettingsDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '12px',
        overflowY: 'auto',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
            display: 'none'
        },
        msOverflowStyle: 'none' /* IE and Edge */,
        scrollbarWidth: 'none' /* Firefox */,
        maxWidth: '600px',
        width: '100%',
        height: '100vh',
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#ffffff'
    }
}))

const GradientCard = styled(Paper)(({ theme }) => ({
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
            ? 'linear-gradient(to bottom right, rgba(40,45,50,0.95), rgba(30,35,40,0.95))'
            : 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' ? 'rgba(128, 128, 128, 0.2)' : 'rgba(200, 200, 200, 0.6)'
}))

const GradientOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    inset: 0,
    opacity: 0.5,
    pointerEvents: 'none'
}))

const PinkBall = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '90%',
    background: theme.palette.mode === 'dark' ? '#ff2daf' : '#ff64c7',
    borderRadius: '9999px',
    filter: 'blur(80px)',
    transform: 'translate(-10%, 60%)'
}))

const OrangeBall = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
    height: '90%',
    background: theme.palette.mode === 'dark' ? '#ff6a00' : '#ff9142',
    borderRadius: '9999px',
    filter: 'blur(80px)',
    transform: 'translate(10%, 60%)'
}))

const TabContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '180px',
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
        width: '100%',
        flexDirection: 'row',
        overflowX: 'auto',
        paddingRight: 0,
        marginBottom: theme.spacing(2),
        '&::-webkit-scrollbar': {
            display: 'none'
        },
        msOverflowStyle: 'none' /* IE and Edge */,
        scrollbarWidth: 'none' /* Firefox */
    }
}))

const TabItem = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'selected'
})(({ theme, selected }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    textAlign: 'left',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    borderRadius: '8px',
    color: selected
        ? theme.palette.mode === 'dark'
            ? theme.palette.common.white
            : theme.palette.common.black
        : theme.palette.mode === 'dark'
        ? theme.palette.grey[600]
        : theme.palette.grey[400],
    backgroundColor: selected ? (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') : 'transparent',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black
    },
    [theme.breakpoints.down('md')]: {
        minWidth: 'fit-content',
        marginRight: theme.spacing(1),
        marginBottom: 0
    }
}))

const ContentContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    maxHeight: '32rem',
    overflowY: 'auto',
    padding: theme.spacing(0, 1),
    '&::-webkit-scrollbar': {
        display: 'none'
    },
    msOverflowStyle: 'none' /* IE and Edge */,
    scrollbarWidth: 'none' /* Firefox */
}))

const SettingRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0)
}))

const SaveButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    color: theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.common.white,
    borderRadius: '24px',
    padding: '6px 16px',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[900]
    }
}))

const Settings = ({ open, onClose }) => {
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState('general')
    const customization = useSelector((state) => state.customization)

    // State for settings
    const [settingsState, setSettingsState] = useState({
        theme: customization.isDarkMode ? 'dark' : 'light',
        language: localStorage.getItem('language') || 'en-US',
        notifications: localStorage.getItem('notifications') === 'true' || false,
        systemPrompt: localStorage.getItem('systemPrompt') || '',
        chatBubbleUI: localStorage.getItem('chatBubbleUI') === 'true' || true,
        displayUsername: localStorage.getItem('displayUsername') === 'true' || false,
        widescreenMode: localStorage.getItem('widescreenMode') === 'true' || false,
        chatDirection: localStorage.getItem('chatDirection') || 'LTR',
        notificationSound: localStorage.getItem('notificationSound') === 'true' || true,
        titleAutoGeneration: localStorage.getItem('titleAutoGeneration') === 'true' || true,
        chatTagsAutoGeneration: localStorage.getItem('chatTagsAutoGeneration') === 'true' || true,
        autoCopyResponse: localStorage.getItem('autoCopyResponse') === 'true' || false,
        name: localStorage.getItem('username') || 'User',
        notificationWebhook: localStorage.getItem('notificationWebhook') || '',
        sttEngine: localStorage.getItem('sttEngine') || '',
        instantAutoSend: localStorage.getItem('instantAutoSend') === 'true' || false,
        ttsEngine: localStorage.getItem('ttsEngine') || '',
        autoPlaybackResponse: localStorage.getItem('autoPlaybackResponse') === 'true' || false,
        speechPlaybackSpeed: localStorage.getItem('speechPlaybackSpeed') || '1',
        voice: localStorage.getItem('voice') || '',
        allowNonLocalVoices: localStorage.getItem('allowNonLocalVoices') === 'true' || false,
        memoryEnabled: localStorage.getItem('memoryEnabled') === 'true' || false
    })

    const handleTabChange = (tab) => {
        setActiveTab(tab)
    }

    const handleSettingChange = (key, value) => {
        setSettingsState({
            ...settingsState,
            [key]: value
        })
    }

    const handleSave = () => {
        // Update Redux store for theme/dark mode
        if (settingsState.theme === 'dark') {
            dispatch({ type: SET_DARKMODE, isDarkMode: true })
            localStorage.setItem('isDarkMode', 'true')
        } else if (settingsState.theme === 'light') {
            dispatch({ type: SET_DARKMODE, isDarkMode: false })
            localStorage.setItem('isDarkMode', 'false')
        } else if (settingsState.theme === 'system') {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
            dispatch({ type: SET_DARKMODE, isDarkMode: prefersDarkMode })
            localStorage.setItem('isDarkMode', prefersDarkMode ? 'true' : 'false')
        }

        // Save all other settings to localStorage
        Object.entries(settingsState).forEach(([key, value]) => {
            if (key !== 'theme') {
                // Theme is handled separately above
                localStorage.setItem(key, value.toString())
            }
        })

        // Close settings dialog
        onClose()
    }

    const tabs = [
        { id: 'general', label: 'General', icon: <IconSettings size={18} /> },
        { id: 'interface', label: 'Interface', icon: <IconDevices size={18} /> },
        { id: 'connections', label: 'Connections', icon: <IconCloud size={18} /> },
        { id: 'personalization', label: 'Personalization', icon: <IconUser size={18} /> },
        { id: 'audio', label: 'Audio', icon: <IconVolume size={18} /> },
        { id: 'chats', label: 'Chats', icon: <IconMessages size={18} /> },
        { id: 'account', label: 'Account', icon: <IconUserCircle size={18} /> }
    ]

    return (
        <SettingsDialog open={open} onClose={onClose} fullWidth maxWidth='md'>
            <DialogContent sx={{ padding: 3, overflowY: 'auto' }}>
                <GradientCard elevation={0} sx={{ height: '100%' }}>
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
                                px: 2.5,
                                pt: 2,
                                pb: 0.5
                            }}
                        >
                            <Typography variant='h4' sx={{ fontWeight: 500 }}>
                                Settings
                            </Typography>
                            <IconButton onClick={onClose} size='small'>
                                <IconX size={20} />
                            </IconButton>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                px: 2,
                                pt: 0.5,
                                pb: 2
                            }}
                        >
                            <TabContainer>
                                <Box
                                    sx={{
                                        display: { xs: 'none', md: 'flex' },
                                        width: '100%',
                                        alignItems: 'center',
                                        gap: 1,
                                        mb: 0.5,
                                        px: 0.5
                                    }}
                                >
                                    <IconSearch size={16} />
                                    <TextField
                                        placeholder='Search'
                                        variant='standard'
                                        fullWidth
                                        InputProps={{ disableUnderline: true }}
                                        sx={{ '& input': { py: 0.75, fontSize: '0.875rem' } }}
                                    />
                                </Box>

                                {tabs.map((tab) => (
                                    <TabItem key={tab.id} selected={activeTab === tab.id} onClick={() => handleTabChange(tab.id)} fullWidth>
                                        <Box sx={{ mr: 1.5, display: 'flex' }}>{tab.icon}</Box>
                                        <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                            {tab.label}
                                        </Typography>
                                    </TabItem>
                                ))}
                            </TabContainer>

                            <ContentContainer>
                                {activeTab === 'general' && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                        <Box sx={{ overflowY: 'auto', maxHeight: '28rem' }}>
                                            <Box>
                                                <Typography variant='body1' sx={{ mb: 1, fontWeight: 500 }}>
                                                    Settings
                                                </Typography>

                                                <SettingRow>
                                                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                                        Theme
                                                    </Typography>
                                                    <FormControl sx={{ minWidth: 120 }}>
                                                        <Select
                                                            value={settingsState.theme}
                                                            onChange={(e) => handleSettingChange('theme', e.target.value)}
                                                            variant='standard'
                                                            sx={{
                                                                fontSize: '0.75rem',
                                                                backgroundColor: 'transparent',
                                                                '& .MuiSelect-select': { pr: 4, py: 1, textAlign: 'right' }
                                                            }}
                                                        >
                                                            <MenuItem value='system'>⚙ System</MenuItem>
                                                            <MenuItem value='dark'>🌑 Dark</MenuItem>
                                                            <MenuItem value='light'>☀ Light</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </SettingRow>

                                                <SettingRow>
                                                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                                        Language
                                                    </Typography>
                                                    <FormControl sx={{ minWidth: 120 }}>
                                                        <Select
                                                            value={settingsState.language}
                                                            onChange={(e) => handleSettingChange('language', e.target.value)}
                                                            variant='standard'
                                                            sx={{
                                                                fontSize: '0.75rem',
                                                                backgroundColor: 'transparent',
                                                                '& .MuiSelect-select': { pr: 4, py: 1, textAlign: 'right' }
                                                            }}
                                                        >
                                                            <MenuItem value='en-US'>English (US)</MenuItem>
                                                            <MenuItem value='en-GB'>English (GB)</MenuItem>
                                                            <MenuItem value='fr-FR'>French (France)</MenuItem>
                                                            <MenuItem value='de-DE'>German (Deutsch)</MenuItem>
                                                            <MenuItem value='es-ES'>Spanish (Español)</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </SettingRow>

                                                <SettingRow>
                                                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                                        Notifications
                                                    </Typography>
                                                    <Switch
                                                        size='small'
                                                        checked={settingsState.notifications}
                                                        onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                                                    />
                                                </SettingRow>
                                            </Box>

                                            <Divider sx={{ my: 1.5 }} />

                                            <Box>
                                                <Typography variant='body1' sx={{ my: 1.5, fontWeight: 500 }}>
                                                    System Prompt
                                                </Typography>
                                                <TextField
                                                    multiline
                                                    rows={4}
                                                    fullWidth
                                                    placeholder='Enter system prompt'
                                                    variant='outlined'
                                                    value={settingsState.systemPrompt}
                                                    onChange={(e) => handleSettingChange('systemPrompt', e.target.value)}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '8px'
                                                        }
                                                    }}
                                                />
                                            </Box>

                                            <Box sx={{ mt: 2, mb: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant='body1' sx={{ fontWeight: 500 }}>
                                                        Advanced Parameters
                                                    </Typography>
                                                    <Button
                                                        variant='text'
                                                        size='small'
                                                        sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.75rem' }}
                                                    >
                                                        Show
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                            <SaveButton onClick={handleSave}>Save</SaveButton>
                                        </Box>
                                    </Box>
                                )}

                                {activeTab === 'interface' && (
                                    <Box
                                        component='form'
                                        sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
                                    >
                                        <Box sx={{ overflowY: 'hidden', maxHeight: '28rem' }}>
                                            <Box>
                                                <Typography variant='body1' sx={{ mb: 1.5, fontWeight: 500 }}>
                                                    UI
                                                </Typography>

                                                <SettingRow>
                                                    <Typography variant='body2'>Landing Page Mode</Typography>
                                                    <Button size='small' variant='text'>
                                                        Default
                                                    </Button>
                                                </SettingRow>

                                                <SettingRow>
                                                    <Typography variant='body2'>Chat Bubble UI</Typography>
                                                    <Button
                                                        size='small'
                                                        variant='text'
                                                        onClick={() => handleSettingChange('chatBubbleUI', !settingsState.chatBubbleUI)}
                                                    >
                                                        {settingsState.chatBubbleUI ? 'On' : 'Off'}
                                                    </Button>
                                                </SettingRow>

                                                <SettingRow>
                                                    <Typography variant='body2'>Display the username instead of You in the Chat</Typography>
                                                    <Button
                                                        size='small'
                                                        variant='text'
                                                        onClick={() =>
                                                            handleSettingChange('displayUsername', !settingsState.displayUsername)
                                                        }
                                                    >
                                                        {settingsState.displayUsername ? 'On' : 'Off'}
                                                    </Button>
                                                </SettingRow>

                                                <SettingRow>
                                                    <Typography variant='body2'>Widescreen Mode</Typography>
                                                    <Button
                                                        size='small'
                                                        variant='text'
                                                        onClick={() => handleSettingChange('widescreenMode', !settingsState.widescreenMode)}
                                                    >
                                                        {settingsState.widescreenMode ? 'On' : 'Off'}
                                                    </Button>
                                                </SettingRow>

                                                <SettingRow>
                                                    <Typography variant='body2'>Chat direction</Typography>
                                                    <Button
                                                        size='small'
                                                        variant='text'
                                                        onClick={() =>
                                                            handleSettingChange(
                                                                'chatDirection',
                                                                settingsState.chatDirection === 'LTR' ? 'RTL' : 'LTR'
                                                            )
                                                        }
                                                    >
                                                        {settingsState.chatDirection}
                                                    </Button>
                                                </SettingRow>

                                                <SettingRow>
                                                    <Typography variant='body2'>Notification Sound</Typography>
                                                    <Button
                                                        size='small'
                                                        variant='text'
                                                        onClick={() =>
                                                            handleSettingChange('notificationSound', !settingsState.notificationSound)
                                                        }
                                                    >
                                                        {settingsState.notificationSound ? 'On' : 'Off'}
                                                    </Button>
                                                </SettingRow>

                                                <Typography variant='body1' sx={{ my: 1.5, fontWeight: 500 }}>
                                                    Chat
                                                </Typography>

                                                <SettingRow>
                                                    <Typography variant='body2'>Title Auto-Generation</Typography>
                                                    <Button
                                                        size='small'
                                                        variant='text'
                                                        onClick={() =>
                                                            handleSettingChange('titleAutoGeneration', !settingsState.titleAutoGeneration)
                                                        }
                                                    >
                                                        {settingsState.titleAutoGeneration ? 'On' : 'Off'}
                                                    </Button>
                                                </SettingRow>

                                                <SettingRow>
                                                    <Typography variant='body2'>Chat Tags Auto-Generation</Typography>
                                                    <Button
                                                        size='small'
                                                        variant='text'
                                                        onClick={() =>
                                                            handleSettingChange(
                                                                'chatTagsAutoGeneration',
                                                                !settingsState.chatTagsAutoGeneration
                                                            )
                                                        }
                                                    >
                                                        {settingsState.chatTagsAutoGeneration ? 'On' : 'Off'}
                                                    </Button>
                                                </SettingRow>

                                                <SettingRow>
                                                    <Typography variant='body2'>Auto-Copy Response to Clipboard</Typography>
                                                    <Button
                                                        size='small'
                                                        variant='text'
                                                        onClick={() =>
                                                            handleSettingChange('autoCopyResponse', !settingsState.autoCopyResponse)
                                                        }
                                                    >
                                                        {settingsState.autoCopyResponse ? 'On' : 'Off'}
                                                    </Button>
                                                </SettingRow>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                            <SaveButton onClick={handleSave}>Save</SaveButton>
                                        </Box>
                                    </Box>
                                )}

                                {activeTab === 'connections' && (
                                    <Box
                                        component='form'
                                        sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
                                    >
                                        <Box sx={{ overflowY: 'hidden', maxHeight: '28rem' }}>
                                            <Box sx={{ pr: 1.5 }}>
                                                <Box>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            mb: 0.5
                                                        }}
                                                    >
                                                        <Typography variant='body1' sx={{ fontWeight: 500 }}>
                                                            Manage Direct Connections
                                                        </Typography>
                                                        <IconButton size='small'>
                                                            <IconX size={16} />
                                                        </IconButton>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                                        {/* Connection items would go here */}
                                                    </Box>
                                                </Box>

                                                <Box sx={{ my: 1.5 }}>
                                                    <Typography variant='body2' color='textSecondary' sx={{ fontSize: '0.75rem' }}>
                                                        Connect to your own OpenAI compatible API endpoints.
                                                        <br />
                                                        CORS must be properly configured by the provider to allow requests from Flowise.
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                            <SaveButton onClick={handleSave}>Save</SaveButton>
                                        </Box>
                                    </Box>
                                )}

                                {activeTab === 'personalization' && (
                                    <Box
                                        component='form'
                                        sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
                                    >
                                        <Box sx={{ overflowY: 'hidden', maxHeight: '28rem' }}>
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant='body1' sx={{ fontWeight: 500 }}>
                                                        Memory{' '}
                                                        <Typography component='span' variant='caption' color='textSecondary'>
                                                            (Experimental)
                                                        </Typography>
                                                    </Typography>
                                                    <Switch
                                                        size='small'
                                                        checked={settingsState.memoryEnabled}
                                                        onChange={(e) => handleSettingChange('memoryEnabled', e.target.checked)}
                                                    />
                                                </Box>

                                                <Typography variant='body2' color='textSecondary' sx={{ fontSize: '0.75rem' }}>
                                                    You can personalize your interactions with LLMs by adding memories, making them more
                                                    helpful and tailored to you.
                                                </Typography>

                                                <Box sx={{ mt: 3, mb: 1, ml: 1 }}>
                                                    <Button
                                                        variant='outlined'
                                                        sx={{
                                                            borderRadius: '24px',
                                                            textTransform: 'none',
                                                            borderColor: 'rgba(128,128,128,0.3)'
                                                        }}
                                                    >
                                                        Manage
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                            <SaveButton onClick={handleSave}>Save</SaveButton>
                                        </Box>
                                    </Box>
                                )}

                                {activeTab === 'audio' && (
                                    <Box
                                        component='form'
                                        sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}
                                    >
                                        <Box sx={{ overflowY: 'hidden', maxHeight: '28rem' }}>
                                            <Box>
                                                <Typography variant='body1' sx={{ mb: 1, fontWeight: 500 }}>
                                                    STT Settings
                                                </Typography>

                                                <SettingRow>
                                                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                                        Speech-to-Text Engine
                                                    </Typography>
                                                    <FormControl sx={{ minWidth: 120 }}>
                                                        <Select
                                                            value={settingsState.sttEngine}
                                                            onChange={(e) => handleSettingChange('sttEngine', e.target.value)}
                                                            displayEmpty
                                                            variant='standard'
                                                            sx={{
                                                                fontSize: '0.75rem',
                                                                backgroundColor: 'transparent',
                                                                '& .MuiSelect-select': { pr: 4, py: 1, textAlign: 'right' }
                                                            }}
                                                        >
                                                            <MenuItem value=''>Default</MenuItem>
                                                            <MenuItem value='web'>Web API</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </SettingRow>

                                                <SettingRow>
                                                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                                        Instant Auto-Send After Voice Transcription
                                                    </Typography>
                                                    <Button
                                                        size='small'
                                                        variant='text'
                                                        onClick={() =>
                                                            handleSettingChange('instantAutoSend', !settingsState.instantAutoSend)
                                                        }
                                                    >
                                                        {settingsState.instantAutoSend ? 'On' : 'Off'}
                                                    </Button>
                                                </SettingRow>

                                                <Typography variant='body1' sx={{ mb: 1, mt: 2, fontWeight: 500 }}>
                                                    TTS Settings
                                                </Typography>

                                                <SettingRow>
                                                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                                        Text-to-Speech Engine
                                                    </Typography>
                                                    <FormControl sx={{ minWidth: 120 }}>
                                                        <Select
                                                            value={settingsState.ttsEngine}
                                                            onChange={(e) => handleSettingChange('ttsEngine', e.target.value)}
                                                            displayEmpty
                                                            variant='standard'
                                                            sx={{
                                                                fontSize: '0.75rem',
                                                                backgroundColor: 'transparent',
                                                                '& .MuiSelect-select': { pr: 4, py: 1, textAlign: 'right' }
                                                            }}
                                                        >
                                                            <MenuItem value=''>Default</MenuItem>
                                                            <MenuItem value='browser-kokoro'>Kokoro.js (Browser)</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </SettingRow>

                                                <SettingRow>
                                                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                                        Auto-playback response
                                                    </Typography>
                                                    <Button
                                                        size='small'
                                                        variant='text'
                                                        onClick={() =>
                                                            handleSettingChange('autoPlaybackResponse', !settingsState.autoPlaybackResponse)
                                                        }
                                                    >
                                                        {settingsState.autoPlaybackResponse ? 'On' : 'Off'}
                                                    </Button>
                                                </SettingRow>

                                                <SettingRow>
                                                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                                                        Speech Playback Speed
                                                    </Typography>
                                                    <FormControl sx={{ minWidth: 120 }}>
                                                        <Select
                                                            value={settingsState.speechPlaybackSpeed}
                                                            onChange={(e) => handleSettingChange('speechPlaybackSpeed', e.target.value)}
                                                            variant='standard'
                                                            sx={{
                                                                fontSize: '0.75rem',
                                                                backgroundColor: 'transparent',
                                                                '& .MuiSelect-select': { pr: 4, py: 1, textAlign: 'right' }
                                                            }}
                                                        >
                                                            <MenuItem value='2'>2x</MenuItem>
                                                            <MenuItem value='1.75'>1.75x</MenuItem>
                                                            <MenuItem value='1.5'>1.5x</MenuItem>
                                                            <MenuItem value='1.25'>1.25x</MenuItem>
                                                            <MenuItem value='1'>1x</MenuItem>
                                                            <MenuItem value='0.75'>0.75x</MenuItem>
                                                            <MenuItem value='0.5'>0.5x</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </SettingRow>

                                                <Divider sx={{ my: 1.5 }} />

                                                <Box>
                                                    <Typography variant='body1' sx={{ mb: 2.5, fontWeight: 500 }}>
                                                        Set Voice
                                                    </Typography>
                                                    <FormControl fullWidth>
                                                        <Select
                                                            value={settingsState.voice}
                                                            onChange={(e) => handleSettingChange('voice', e.target.value)}
                                                            displayEmpty
                                                            sx={{
                                                                borderRadius: '8px',
                                                                '& .MuiSelect-select': { py: 1.5, px: 2 }
                                                            }}
                                                        >
                                                            <MenuItem value=''>Default</MenuItem>
                                                            <MenuItem value='Microsoft David - English (United States)'>
                                                                Microsoft David - English (United States)
                                                            </MenuItem>
                                                            <MenuItem value='Microsoft Zira - English (United States)'>
                                                                Microsoft Zira - English (United States)
                                                            </MenuItem>
                                                        </Select>
                                                    </FormControl>

                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            my: 1.5
                                                        }}
                                                    >
                                                        <Typography variant='body2'>Allow non-local voices</Typography>
                                                        <Switch
                                                            size='small'
                                                            checked={settingsState.allowNonLocalVoices}
                                                            onChange={(e) => handleSettingChange('allowNonLocalVoices', e.target.checked)}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                            <SaveButton onClick={handleSave}>Save</SaveButton>
                                        </Box>
                                    </Box>
                                )}

                                {activeTab === 'chats' && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                        <Box sx={{ overflowY: 'hidden', maxHeight: '28rem' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Button
                                                    startIcon={<IconUpload size={18} />}
                                                    sx={{
                                                        justifyContent: 'flex-start',
                                                        textTransform: 'none',
                                                        py: 1.5,
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    <Typography sx={{ ml: 1, fontWeight: 500 }}>Import Chats</Typography>
                                                </Button>

                                                <Button
                                                    startIcon={<IconDownload size={18} />}
                                                    sx={{
                                                        justifyContent: 'flex-start',
                                                        textTransform: 'none',
                                                        py: 1.5,
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    <Typography sx={{ ml: 1, fontWeight: 500 }}>Export Chats</Typography>
                                                </Button>
                                            </Box>

                                            <Divider sx={{ my: 1.5 }} />

                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Button
                                                    startIcon={<IconArchive size={18} />}
                                                    sx={{
                                                        justifyContent: 'flex-start',
                                                        textTransform: 'none',
                                                        py: 1.5,
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    <Typography sx={{ ml: 1, fontWeight: 500 }}>Archive All Chats</Typography>
                                                </Button>

                                                <Button
                                                    startIcon={<IconTrash size={18} />}
                                                    sx={{
                                                        justifyContent: 'flex-start',
                                                        textTransform: 'none',
                                                        py: 1.5,
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    <Typography sx={{ ml: 1, fontWeight: 500 }}>Delete All Chats</Typography>
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                )}

                                {activeTab === 'account' && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                        <Box sx={{ overflowY: 'hidden', maxHeight: '28rem' }}>
                                            <Box sx={{ space: 1 }}>
                                                <Box sx={{ display: 'flex', space: 5 }}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                        <Box sx={{ alignSelf: 'center', mt: 2 }}>
                                                            <Button
                                                                sx={{
                                                                    borderRadius: '50%',
                                                                    p: 0,
                                                                    position: 'relative',
                                                                    overflow: 'hidden'
                                                                }}
                                                            >
                                                                <Avatar sx={{ width: 64, height: 64 }}>
                                                                    <IconUser size={40} />
                                                                </Avatar>
                                                                <Box
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        top: 0,
                                                                        left: 0,
                                                                        right: 0,
                                                                        bottom: 0,
                                                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        opacity: 0,
                                                                        transition: 'opacity 0.2s',
                                                                        '&:hover': {
                                                                            opacity: 1
                                                                        }
                                                                    }}
                                                                >
                                                                    <IconUpload size={20} color='white' />
                                                                </Box>
                                                            </Button>
                                                        </Box>
                                                    </Box>

                                                    <Box
                                                        sx={{
                                                            flex: 1,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignSelf: 'center',
                                                            gap: 0.5,
                                                            ml: 2
                                                        }}
                                                    >
                                                        <Typography variant='body1' sx={{ mb: 0.5, fontWeight: 500 }}>
                                                            Profile Image
                                                        </Typography>
                                                        <Box>
                                                            <Button
                                                                variant='contained'
                                                                size='small'
                                                                sx={{
                                                                    mr: 1,
                                                                    textTransform: 'none',
                                                                    borderRadius: '24px',
                                                                    backgroundColor: 'rgba(200, 200, 200, 0.3)',
                                                                    color: 'text.primary',
                                                                    '&:hover': {
                                                                        backgroundColor: 'rgba(200, 200, 200, 0.5)'
                                                                    }
                                                                }}
                                                            >
                                                                Use Initials
                                                            </Button>
                                                            <Button
                                                                variant='contained'
                                                                size='small'
                                                                sx={{
                                                                    textTransform: 'none',
                                                                    borderRadius: '24px',
                                                                    backgroundColor: 'rgba(200, 200, 200, 0.3)',
                                                                    color: 'text.primary',
                                                                    '&:hover': {
                                                                        backgroundColor: 'rgba(200, 200, 200, 0.5)'
                                                                    }
                                                                }}
                                                            >
                                                                Use Gravatar
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ pt: 0.5 }}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                        <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                                                            Name
                                                        </Typography>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            value={settingsState.name}
                                                            onChange={(e) => handleSettingChange('name', e.target.value)}
                                                            size='small'
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    borderRadius: '8px'
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>

                                                <Box sx={{ pt: 2 }}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                        <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                                                            Notification Webhook
                                                        </Typography>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            value={settingsState.notificationWebhook}
                                                            onChange={(e) => handleSettingChange('notificationWebhook', e.target.value)}
                                                            placeholder='Enter your webhook URL'
                                                            size='small'
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    borderRadius: '8px'
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Box sx={{ py: 0.5 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant='body1' sx={{ fontWeight: 500 }}>
                                                        Change Password
                                                    </Typography>
                                                    <Button
                                                        variant='text'
                                                        size='small'
                                                        sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.75rem' }}
                                                    >
                                                        Show
                                                    </Button>
                                                </Box>
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant='body1' sx={{ fontWeight: 500 }}>
                                                    API keys
                                                </Typography>
                                                <Button
                                                    variant='text'
                                                    size='small'
                                                    sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.75rem' }}
                                                >
                                                    Show
                                                </Button>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                            <SaveButton onClick={handleSave}>Save</SaveButton>
                                        </Box>
                                    </Box>
                                )}
                            </ContentContainer>
                        </Box>
                    </Box>
                </GradientCard>
            </DialogContent>
        </SettingsDialog>
    )
}

export default Settings
