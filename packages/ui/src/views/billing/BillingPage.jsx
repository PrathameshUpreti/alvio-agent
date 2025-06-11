import { useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'
import { Box, Typography, Paper, Button, Grid } from '@mui/material'

// icons
import { IconFileText } from '@tabler/icons-react'

// project imports
import MainCard from '@/ui-component/cards/MainCard'

const GradientCard = styled(Paper)(({ theme }) => ({
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative',
    background:
        theme.palette.mode === 'dark'
            ? 'linear-gradient(to bottom right, rgba(40,45,50,0.95), rgba(30,35,40,0.95))'
            : 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' ? 'rgba(128, 128, 128, 0.2)' : 'rgba(200, 200, 200, 0.6)',
    padding: theme.spacing(3),
    height: '100%'
}))

const InfoCard = styled(GradientCard)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: theme.spacing(4)
}))

const PrimaryButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: '4px',
    padding: '8px 16px',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark
    }
}))

const BillingPage = () => {
    const customization = useSelector((state) => state.customization)

    return (
        <MainCard title='Billing & Subscription'>
            <Box sx={{ width: '100%', overflow: 'auto' }}>
                <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2, py: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={8}>
                                <InfoCard elevation={0}>
                                    <Box sx={{ mb: 2 }}>
                                        <IconFileText size={64} color={customization.isDarkMode ? '#aaa' : '#666'} />
                                    </Box>
                                    <Typography variant='h4' gutterBottom sx={{ mb: 1, fontWeight: 600 }}>
                                        No Active Subscription
                                    </Typography>
                                    <Typography variant='body1' color='textSecondary' sx={{ mb: 3 }}>
                                        You don't have an active subscription plan at the moment.
                                    </Typography>
                                    <PrimaryButton variant='contained' href='/upgrade'>
                                        View Available Plans
                                    </PrimaryButton>
                                </InfoCard>
                            </Grid>
                            <Grid item xs={12} lg={4}>
                                <GradientCard elevation={0}>
                                    <Typography variant='h4' gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                                        Account Information
                                    </Typography>
                                    {/* Account details would go here */}
                                </GradientCard>
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 3 }}>
                            <Typography variant='h4' sx={{ mb: 2, fontWeight: 600 }}>
                                Payment History
                            </Typography>
                            <InfoCard elevation={0}>
                                <Box sx={{ mb: 2 }}>
                                    <IconFileText size={48} color={customization.isDarkMode ? '#aaa' : '#666'} />
                                </Box>
                                <Typography variant='body1' color='textSecondary'>
                                    No payment history available yet.
                                </Typography>
                            </InfoCard>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </MainCard>
    )
}

export default BillingPage
