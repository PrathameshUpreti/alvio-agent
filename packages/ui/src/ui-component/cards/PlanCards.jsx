import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

// Dark Mode Plan Card
export const DarkModePlanCard = styled(Box)({
    padding: '16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(66, 51, 93, 1) 0%, rgba(70, 41, 90, 1) 100%)',
    marginBottom: '16px'
})

// Light Mode Plan Card
export const LightModePlanCard = styled(Box)({
    padding: '16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(227, 210, 255, 1) 0%, rgba(250, 211, 241, 1) 100%)',
    marginBottom: '16px'
})

// Dark Mode Plan Card - Variant 2 (Blue/Purple)
export const DarkModePlanCard2 = styled(Box)({
    padding: '16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(45, 50, 80, 1) 0%, rgba(70, 50, 120, 1) 100%)',
    marginBottom: '16px'
})

// Light Mode Plan Card - Variant 2 (Blue/Purple)
export const LightModePlanCard2 = styled(Box)({
    padding: '16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(210, 220, 255, 1) 0%, rgba(220, 210, 250, 1) 100%)',
    marginBottom: '16px'
})

// Dark Mode Plan Card - Variant 3 (Green/Blue)
export const DarkModePlanCard3 = styled(Box)({
    padding: '16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(35, 60, 80, 1) 0%, rgba(20, 70, 90, 1) 100%)',
    marginBottom: '16px'
})

// Light Mode Plan Card - Variant 3 (Green/Blue)
export const LightModePlanCard3 = styled(Box)({
    padding: '16px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(200, 240, 255, 1) 0%, rgba(210, 250, 230, 1) 100%)',
    marginBottom: '16px'
})

// Dark Mode Current Badge
export const DarkModeCurrentBadge = styled(Box)({
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    color: '#00E676',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '2px 8px'
})

// Light Mode Current Badge
export const LightModeCurrentBadge = styled(Box)({
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    color: '#00C853',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '2px 8px'
})

// Dark Mode Plan Title
export const DarkModePlanTitle = styled(Typography)({
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '18px'
})

// Light Mode Plan Title
export const LightModePlanTitle = styled(Typography)({
    color: '#2d2d2d',
    fontWeight: 'bold',
    fontSize: '18px'
})

// Dark Mode Plan Description
export const DarkModePlanDesc = styled(Typography)({
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    marginBottom: '12px'
})

// Light Mode Plan Description
export const LightModePlanDesc = styled(Typography)({
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: '14px',
    marginBottom: '12px'
})

// Dark Mode Upgrade Button
export const DarkModeUpgradeButton = styled(Box)({
    background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8989 50%, #FF4D8D 100%)',
    color: '#ffffff',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: 600,
    textAlign: 'center',
    cursor: 'pointer'
})

// Light Mode Upgrade Button
export const LightModeUpgradeButton = styled(Box)({
    background: 'linear-gradient(90deg, #FF5E7D 0%, #FF717A 50%, #FF8B8B 100%)',
    color: '#ffffff',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: 600,
    textAlign: 'center',
    cursor: 'pointer'
})

// Dark Mode Upgrade Button - Variant 2 (Blue)
export const DarkModeUpgradeButton2 = styled(Box)({
    background: 'linear-gradient(90deg, #4A6FFF 0%, #5E7DFF 50%, #7289FF 100%)',
    color: '#ffffff',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: 600,
    textAlign: 'center',
    cursor: 'pointer'
})

// Light Mode Upgrade Button - Variant 2 (Blue)
export const LightModeUpgradeButton2 = styled(Box)({
    background: 'linear-gradient(90deg, #3B5EFF 0%, #5270FF 50%, #6580FF 100%)',
    color: '#ffffff',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: 600,
    textAlign: 'center',
    cursor: 'pointer'
})

// Dark Mode Upgrade Button - Variant 3 (Green)
export const DarkModeUpgradeButton3 = styled(Box)({
    background: 'linear-gradient(90deg, #00C853 0%, #00D864 50%, #00E676 100%)',
    color: '#ffffff',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: 600,
    textAlign: 'center',
    cursor: 'pointer'
})

// Light Mode Upgrade Button - Variant 3 (Green)
export const LightModeUpgradeButton3 = styled(Box)({
    background: 'linear-gradient(90deg, #00B344 0%, #00C853 50%, #00D864 100%)',
    color: '#ffffff',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: 600,
    textAlign: 'center',
    cursor: 'pointer'
})

// Example usage components
export const DarkModePlanCardComplete = () => (
    <DarkModePlanCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <DarkModePlanTitle>Free Plan</DarkModePlanTitle>
            <DarkModeCurrentBadge>CURRENT</DarkModeCurrentBadge>
        </Box>
        <DarkModePlanDesc>Get more with Pro plan</DarkModePlanDesc>
        <DarkModeUpgradeButton>Upgrade to Pro</DarkModeUpgradeButton>
    </DarkModePlanCard>
)

export const LightModePlanCardComplete = () => (
    <LightModePlanCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <LightModePlanTitle>Free Plan</LightModePlanTitle>
            <LightModeCurrentBadge>CURRENT</LightModeCurrentBadge>
        </Box>
        <LightModePlanDesc>Get more with Pro plan</LightModePlanDesc>
        <LightModeUpgradeButton>Upgrade to Pro</LightModeUpgradeButton>
    </LightModePlanCard>
)

// Variant 2 examples
export const DarkModePlanCardComplete2 = () => (
    <DarkModePlanCard2>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <DarkModePlanTitle>Free Plan</DarkModePlanTitle>
            <DarkModeCurrentBadge>CURRENT</DarkModeCurrentBadge>
        </Box>
        <DarkModePlanDesc>Get more with Pro plan</DarkModePlanDesc>
        <DarkModeUpgradeButton2>Upgrade to Pro</DarkModeUpgradeButton2>
    </DarkModePlanCard2>
)

export const LightModePlanCardComplete2 = () => (
    <LightModePlanCard2>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <LightModePlanTitle>Free Plan</LightModePlanTitle>
            <LightModeCurrentBadge>CURRENT</LightModeCurrentBadge>
        </Box>
        <LightModePlanDesc>Get more with Pro plan</LightModePlanDesc>
        <LightModeUpgradeButton2>Upgrade to Pro</LightModeUpgradeButton2>
    </LightModePlanCard2>
)

// Variant 3 examples
export const DarkModePlanCardComplete3 = () => (
    <DarkModePlanCard3>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <DarkModePlanTitle>Free Plan</DarkModePlanTitle>
            <DarkModeCurrentBadge>CURRENT</DarkModeCurrentBadge>
        </Box>
        <DarkModePlanDesc>Get more with Pro plan</DarkModePlanDesc>
        <DarkModeUpgradeButton3>Upgrade to Pro</DarkModeUpgradeButton3>
    </DarkModePlanCard3>
)

export const LightModePlanCardComplete3 = () => (
    <LightModePlanCard3>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <LightModePlanTitle>Free Plan</LightModePlanTitle>
            <LightModeCurrentBadge>CURRENT</LightModeCurrentBadge>
        </Box>
        <LightModePlanDesc>Get more with Pro plan</LightModePlanDesc>
        <LightModeUpgradeButton3>Upgrade to Pro</LightModeUpgradeButton3>
    </LightModePlanCard3>
)
