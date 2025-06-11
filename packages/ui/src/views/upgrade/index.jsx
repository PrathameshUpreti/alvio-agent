import { useState } from 'react'

// material-ui
import { Box, Typography, Grid, Card, CardContent, Button, Stack, Divider, Chip, Switch, FormControlLabel } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import MainCard from '@/ui-component/cards/MainCard'

// assets
import { IconCheck, IconX } from '@tabler/icons-react'

// ==============================|| PRICING CARD COMPONENT ||============================== //

const PricingCard = ({
    title,
    price,
    yearlyPrice,
    isYearly,
    features,
    buttonText,
    popular,
    recommendedForYou,
    buttonVariant = 'contained',
    isPro = false
}) => {
    const theme = useTheme()

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 1,
                boxShadow: popular ? `0 8px 24px ${theme.palette.primary.light}` : 'none',
                border: popular
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(229, 231, 235, 0.2)' : theme.palette.divider}`,
                position: 'relative',
                overflow: 'visible',
                background: theme.palette.mode === 'dark' ? 'rgb(51, 51, 51) !important' : 'white',
                backgroundColor: theme.palette.mode === 'dark' ? 'transparent !important' : 'white',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    transition: 'all 0.2s ease',
                    boxShadow: theme.palette.mode === 'dark' ? '0 10px 20px rgba(0, 0, 0, 0.5)' : '0 10px 20px rgba(0, 0, 0, 0.12)'
                }
            }}
        >
            {(popular || recommendedForYou) && (
                <Chip
                    label={popular ? 'Most Popular' : 'Recommended For You'}
                    color='primary'
                    sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontWeight: 600
                    }}
                />
            )}

            <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
                <Typography variant='h4' sx={{ mb: 1, textAlign: 'center' }}>
                    {title}
                </Typography>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography
                        variant='h2'
                        component='span'
                        sx={{
                            fontWeight: 700,
                            ...(theme.palette.mode === 'dark'
                                ? {
                                      background: 'linear-gradient(to right, #ff6a00, #ff2daf)',
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent',
                                      backgroundClip: 'text',
                                      color: 'transparent'
                                  }
                                : {
                                      color: theme.palette.primary.dark
                                  })
                        }}
                    >
                        ${isYearly ? yearlyPrice : price}
                    </Typography>
                    <Typography variant='body1' component='span' color='textSecondary'>
                        {isYearly ? '/year' : '/month'}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ flexGrow: 1 }}>
                    <Stack spacing={2} sx={{ mb: 3 }}>
                        {features.map((feature, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                {feature.included ? (
                                    <IconCheck color={theme.palette.success.main} size={20} />
                                ) : (
                                    <IconX color={theme.palette.error.main} size={20} />
                                )}
                                <Typography variant='body1' sx={{ ml: 1.5 }} color={!feature.included ? 'text.secondary' : 'inherit'}>
                                    {feature.text}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>

                {isPro ? (
                    <Button
                        fullWidth
                        sx={{
                            py: 2,
                            px: 4,
                            borderRadius: '8px',
                            fontWeight: 500,
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            transition: 'all 0.3s',
                            position: 'relative',
                            background: 'linear-gradient(to right, #ff6a00, #ff2daf)',
                            color: 'white',
                            '&:hover': {
                                opacity: 0.9
                            }
                        }}
                    >
                        {buttonText}
                    </Button>
                ) : (
                    <Button
                        variant={buttonVariant}
                        color='primary'
                        fullWidth
                        sx={{
                            py: 1.5,
                            borderRadius: 1,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1rem'
                        }}
                    >
                        {buttonText}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

// ==============================|| UPGRADE PAGE ||============================== //

const UpgradePage = () => {
    const theme = useTheme()
    const [isYearly, setIsYearly] = useState(false)

    const handleBillingChange = () => {
        setIsYearly(!isYearly)
    }

    const freePlanFeatures = [
        { text: 'Up to 3 flows', included: true },
        { text: 'Basic components', included: true },
        { text: 'Community support', included: true },
        { text: 'API access', included: false },
        { text: 'Custom branding', included: false },
        { text: 'Advanced analytics', included: false },
        { text: 'Priority support', included: false }
    ]

    const proPlanFeatures = [
        { text: 'Up to 10 flows', included: true },
        { text: 'All components', included: true },
        { text: 'Community support', included: true },
        { text: 'API access', included: true },
        { text: 'Custom branding', included: true },
        { text: 'Advanced analytics', included: false },
        { text: 'Priority support', included: false }
    ]

    const teamsPlanFeatures = [
        { text: 'Unlimited flows', included: true },
        { text: 'All components', included: true },
        { text: 'Community support', included: true },
        { text: 'API access', included: true },
        { text: 'Custom branding', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Priority support', included: true },
        { text: 'Team collaboration', included: true },
        { text: 'Access controls', included: true }
    ]

    return (
        <MainCard>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant='h2' sx={{ mb: 2 }}>
                    Choose the Right Plan for Your Needs
                </Typography>
                <Typography variant='body1' color='textSecondary' sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
                    Select the perfect plan to enhance your workflow and unlock premium features. All plans include updates and community
                    support.
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                    <Typography variant='body1' sx={{ mr: 1 }}>
                        Monthly
                    </Typography>
                    <FormControlLabel control={<Switch checked={isYearly} onChange={handleBillingChange} color='primary' />} label='' />
                    <Typography variant='body1' sx={{ ml: 1 }}>
                        Yearly
                    </Typography>
                    <Chip label='Save 20%' color='primary' size='small' sx={{ ml: 1, backgroundColor: theme.palette.success.main }} />
                </Box>
            </Box>

            <Grid container spacing={3} justifyContent='center'>
                <Grid item xs={12} sm={6} md={4}>
                    <PricingCard
                        title='Free'
                        price='0'
                        yearlyPrice='0'
                        isYearly={isYearly}
                        features={freePlanFeatures}
                        buttonText='Get Started'
                        buttonVariant='outlined'
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <PricingCard
                        title='Pro'
                        price='19'
                        yearlyPrice='190'
                        isYearly={isYearly}
                        features={proPlanFeatures}
                        buttonText='Upgrade to Pro'
                        popular={true}
                        isPro={true}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <PricingCard
                        title='Teams'
                        price='49'
                        yearlyPrice='490'
                        isYearly={isYearly}
                        features={teamsPlanFeatures}
                        buttonText='Upgrade to Teams'
                    />
                </Grid>
            </Grid>

            <Box
                sx={{
                    mt: 8,
                    textAlign: 'center',
                    p: 3,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 1,
                    border: theme.palette.mode === 'dark' ? '1px solid rgba(229, 231, 235, 0.2)' : 'none'
                }}
            >
                <Typography variant='h4' sx={{ mb: 2 }}>
                    Need a Custom Solution?
                </Typography>
                <Typography variant='body1' sx={{ mb: 3 }}>
                    Contact our sales team for a tailored plan that meets your specific requirements
                </Typography>
                <Button
                    variant='contained'
                    color='primary'
                    sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 1,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem'
                    }}
                >
                    Contact Sales
                </Button>
            </Box>
        </MainCard>
    )
}

export default UpgradePage
