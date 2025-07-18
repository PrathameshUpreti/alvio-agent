import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

// material-ui
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Grid,
    Paper,
    Switch,
    FormControlLabel,
    Button,
    Divider,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import { SET_DARKMODE } from '@/store/actions'

// Helper function for accessibility props
function a11yProps(index) {
    return {
        id: `settings-tab-${index}`,
        'aria-controls': `settings-tabpanel-${index}`
    }
}

// TabPanel component
function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    value: PropTypes.any.isRequired,
    index: PropTypes.number.isRequired
}

// 2. Add styled components for glassy card, pill tabs, and section cards
const GlassyMainCard = styled(MainCard)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? 'rgba(30,34,44,0.92)' : 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(16px)',
    borderRadius: 18,
    boxShadow: theme.shadows[24],
    border: `1px solid ${theme.palette.divider}`,
    transition: 'background 0.3s'
}))
const PillTabs = styled(Tabs)(({ theme }) => ({
    borderRadius: 999,
    minHeight: 40,
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    '& .MuiTabs-indicator': {
        height: 4,
        borderRadius: 2,
        background: theme.palette.primary.main
    }
}))
const PillTab = styled(Tab)(({ theme }) => ({
    borderRadius: 999,
    minHeight: 36,
    minWidth: 90,
    fontWeight: 600,
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
        color: theme.palette.primary.main,
        background: theme.palette.action.selected
    },
    transition: 'background 0.2s, color 0.2s'
}))
const GlassySectionCard = styled(Paper)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? 'rgba(40,45,50,0.85)' : 'rgba(245,245,245,0.85)',
    borderRadius: 14,
    boxShadow: theme.shadows[2],
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    transition: 'background 0.2s'
}))

const SettingsPage = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const customization = useSelector((state) => state.customization)

    const [value, setValue] = useState(0)
    const [displayName, setDisplayName] = useState('User')
    const [email, setEmail] = useState('user@example.com')
    const [language, setLanguage] = useState('english')

    // Use redux isDarkMode directly for consistency
    const isDark = customization.isDarkMode

    const handleTabChange = (event, newValue) => {
        setValue(newValue)
    }

    const changeDarkMode = () => {
        dispatch({ type: SET_DARKMODE, isDarkMode: !isDark })
        localStorage.setItem('isDarkMode', !isDark)
    }

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value)
    }

    const handleDisplayNameChange = (event) => {
        setDisplayName(event.target.value)
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    return (
        <GlassyMainCard title='Settings'>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <PillTabs value={value} onChange={handleTabChange} aria-label='settings tabs' textColor='primary' indicatorColor='primary'>
                    <PillTab label='General' {...a11yProps(0)} />
                    <PillTab label='Appearance' {...a11yProps(1)} />
                    <PillTab label='API Keys' {...a11yProps(2)} />
                    <PillTab label='Notifications' {...a11yProps(3)} />
                    <PillTab label='Security' {...a11yProps(4)} />
                </PillTabs>
            </Box>

            {/* General Settings Tab */}
            <TabPanel value={value} index={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <GlassySectionCard>
                            <Typography variant='h4' gutterBottom>
                                User Profile
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label='Display Name'
                                        variant='outlined'
                                        value={displayName}
                                        onChange={handleDisplayNameChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label='Email'
                                        variant='outlined'
                                        type='email'
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant='outlined'>
                                        <InputLabel id='language-select-label'>Language</InputLabel>
                                        <Select
                                            labelId='language-select-label'
                                            value={language}
                                            onChange={handleLanguageChange}
                                            label='Language'
                                        >
                                            <MenuItem value='english'>English</MenuItem>
                                            <MenuItem value='spanish'>Spanish</MenuItem>
                                            <MenuItem value='french'>French</MenuItem>
                                            <MenuItem value='german'>German</MenuItem>
                                            <MenuItem value='japanese'>Japanese</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant='contained' color='primary' sx={{ mt: 2 }}>
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </GlassySectionCard>
                    </Grid>
                </Grid>
            </TabPanel>

            {/* Appearance Tab */}
            <TabPanel value={value} index={1}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <GlassySectionCard>
                            <Typography variant='h4' gutterBottom>
                                Theme Settings
                            </Typography>
                            <Divider sx={{ mb: 3, mt: 1 }} />

                            <FormControlLabel
                                control={<Switch checked={isDark} onChange={changeDarkMode} color='primary' />}
                                label='Dark Mode'
                            />
                        </GlassySectionCard>
                    </Grid>
                </Grid>
            </TabPanel>

            {/* API Keys Tab */}
            <TabPanel value={value} index={2}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <GlassySectionCard>
                            <Typography variant='h4' gutterBottom>
                                API Keys
                            </Typography>
                            <Divider sx={{ mb: 3, mt: 1 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label='OpenAI API Key'
                                        placeholder='Enter your OpenAI API key'
                                        variant='outlined'
                                        type='password'
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label='Google Maps API Key'
                                        placeholder='Enter your Google Maps API key'
                                        variant='outlined'
                                        type='password'
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label='Hugging Face API Key'
                                        placeholder='Enter your Hugging Face API key'
                                        variant='outlined'
                                        type='password'
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant='contained' color='primary' sx={{ mt: 2 }}>
                                        Save API Keys
                                    </Button>
                                </Grid>
                            </Grid>
                        </GlassySectionCard>
                    </Grid>
                </Grid>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel value={value} index={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <GlassySectionCard>
                            <Typography variant='h4' gutterBottom>
                                Notification Settings
                            </Typography>
                            <Divider sx={{ mb: 3, mt: 1 }} />

                            <FormControlLabel control={<Switch defaultChecked color='primary' />} label='Email Notifications' />
                            <FormControlLabel control={<Switch defaultChecked color='primary' />} label='Push Notifications' />
                            <FormControlLabel control={<Switch color='primary' />} label='SMS Notifications' />
                            <FormControlLabel control={<Switch defaultChecked color='primary' />} label='Chat Flow Updates' />
                            <FormControlLabel control={<Switch defaultChecked color='primary' />} label='System Notifications' />
                        </GlassySectionCard>
                    </Grid>
                </Grid>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={value} index={4}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <GlassySectionCard>
                            <Typography variant='h4' gutterBottom>
                                Security Settings
                            </Typography>
                            <Divider sx={{ mb: 3, mt: 1 }} />

                            <Typography variant='h5' gutterBottom>
                                Change Password
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12}>
                                    <TextField fullWidth label='Current Password' type='password' variant='outlined' />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label='New Password' type='password' variant='outlined' />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label='Confirm New Password' type='password' variant='outlined' />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant='contained' color='primary' sx={{ mt: 2 }}>
                                        Update Password
                                    </Button>
                                </Grid>
                            </Grid>

                            <Typography variant='h5' sx={{ mt: 4, mb: 2 }}>
                                Two-Factor Authentication
                            </Typography>
                            <FormControlLabel control={<Switch color='primary' />} label='Enable Two-Factor Authentication' />
                            <Typography variant='body2' color='textSecondary' sx={{ mt: 1 }}>
                                Improve your account security by enabling two-factor authentication.
                            </Typography>
                        </GlassySectionCard>
                    </Grid>
                </Grid>
            </TabPanel>
        </GlassyMainCard>
    )
}

SettingsPage.propTypes = {
    children: PropTypes.node,
    value: PropTypes.any,
    index: PropTypes.number
}

export default SettingsPage
