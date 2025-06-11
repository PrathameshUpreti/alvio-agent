import { useState } from 'react'
import { Box, Stack, Switch, FormControlLabel, Typography, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import {
    DarkModePlanCardComplete,
    LightModePlanCardComplete,
    DarkModePlanCardComplete2,
    LightModePlanCardComplete2,
    DarkModePlanCardComplete3,
    LightModePlanCardComplete3,
    DarkModePlanCard,
    LightModePlanCard,
    DarkModePlanCard2,
    LightModePlanCard2,
    DarkModePlanCard3,
    LightModePlanCard3,
    DarkModePlanTitle,
    LightModePlanTitle,
    DarkModeCurrentBadge,
    LightModeCurrentBadge,
    DarkModePlanDesc,
    LightModePlanDesc,
    DarkModeUpgradeButton,
    LightModeUpgradeButton,
    DarkModeUpgradeButton2,
    LightModeUpgradeButton2,
    DarkModeUpgradeButton3,
    LightModeUpgradeButton3
} from '@/ui-component/cards/PlanCards'

const PlanCardDemo = () => {
    const theme = useTheme()
    const [darkMode, setDarkMode] = useState(true)

    const handleThemeChange = () => {
        setDarkMode(!darkMode)
    }

    return (
        <MainCard title='Subscription Plan Cards - Demo'>
            <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <FormControlLabel
                        control={<Switch checked={darkMode} onChange={handleThemeChange} color='primary' />}
                        label={darkMode ? 'Dark Mode' : 'Light Mode'}
                    />
                </Box>

                <Typography variant='h4' gutterBottom>
                    Complete Cards
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant='h5' align='center' gutterBottom>
                            Variant 1 (Purple/Pink)
                        </Typography>
                        {darkMode ? <DarkModePlanCardComplete /> : <LightModePlanCardComplete />}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant='h5' align='center' gutterBottom>
                            Variant 2 (Blue/Purple)
                        </Typography>
                        {darkMode ? <DarkModePlanCardComplete2 /> : <LightModePlanCardComplete2 />}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant='h5' align='center' gutterBottom>
                            Variant 3 (Green/Blue)
                        </Typography>
                        {darkMode ? <DarkModePlanCardComplete3 /> : <LightModePlanCardComplete3 />}
                    </Grid>
                </Grid>

                <Typography variant='h4' gutterBottom sx={{ mt: 4 }}>
                    Card Backgrounds
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant='body1' gutterBottom>
                                Purple/Pink Gradient
                            </Typography>
                            {darkMode ? (
                                <DarkModePlanCard sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography color='white'>Dark Mode</Typography>
                                </DarkModePlanCard>
                            ) : (
                                <LightModePlanCard sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography color='black'>Light Mode</Typography>
                                </LightModePlanCard>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant='body1' gutterBottom>
                                Blue/Purple Gradient
                            </Typography>
                            {darkMode ? (
                                <DarkModePlanCard2 sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography color='white'>Dark Mode</Typography>
                                </DarkModePlanCard2>
                            ) : (
                                <LightModePlanCard2 sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography color='black'>Light Mode</Typography>
                                </LightModePlanCard2>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant='body1' gutterBottom>
                                Green/Blue Gradient
                            </Typography>
                            {darkMode ? (
                                <DarkModePlanCard3 sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography color='white'>Dark Mode</Typography>
                                </DarkModePlanCard3>
                            ) : (
                                <LightModePlanCard3 sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography color='black'>Light Mode</Typography>
                                </LightModePlanCard3>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                <Typography variant='h4' gutterBottom sx={{ mt: 4 }}>
                    Upgrade Buttons
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant='body1' gutterBottom>
                                Pink Gradient
                            </Typography>
                            {darkMode ? (
                                <DarkModeUpgradeButton>Upgrade to Pro</DarkModeUpgradeButton>
                            ) : (
                                <LightModeUpgradeButton>Upgrade to Pro</LightModeUpgradeButton>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant='body1' gutterBottom>
                                Blue Gradient
                            </Typography>
                            {darkMode ? (
                                <DarkModeUpgradeButton2>Upgrade to Pro</DarkModeUpgradeButton2>
                            ) : (
                                <LightModeUpgradeButton2>Upgrade to Pro</LightModeUpgradeButton2>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant='body1' gutterBottom>
                                Green Gradient
                            </Typography>
                            {darkMode ? (
                                <DarkModeUpgradeButton3>Upgrade to Pro</DarkModeUpgradeButton3>
                            ) : (
                                <LightModeUpgradeButton3>Upgrade to Pro</LightModeUpgradeButton3>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                <Typography variant='h4' gutterBottom sx={{ mt: 4 }}>
                    Other Components
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 2, bgcolor: darkMode ? 'background.paper' : 'background.default' }}>
                            <Typography variant='body1' gutterBottom>
                                Title
                            </Typography>
                            {darkMode ? (
                                <DarkModePlanTitle>Free Plan</DarkModePlanTitle>
                            ) : (
                                <LightModePlanTitle>Free Plan</LightModePlanTitle>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 2, bgcolor: darkMode ? 'background.paper' : 'background.default' }}>
                            <Typography variant='body1' gutterBottom>
                                Current Badge
                            </Typography>
                            {darkMode ? (
                                <DarkModeCurrentBadge>CURRENT</DarkModeCurrentBadge>
                            ) : (
                                <LightModeCurrentBadge>CURRENT</LightModeCurrentBadge>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 2, bgcolor: darkMode ? 'background.paper' : 'background.default' }}>
                            <Typography variant='body1' gutterBottom>
                                Description
                            </Typography>
                            {darkMode ? (
                                <DarkModePlanDesc>Get more with Pro plan</DarkModePlanDesc>
                            ) : (
                                <LightModePlanDesc>Get more with Pro plan</LightModePlanDesc>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Stack>
        </MainCard>
    )
}

export default PlanCardDemo
