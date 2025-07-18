import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// material-ui
import { Button, Card, CardContent, Stack, Typography, Box } from '@mui/material'
import { useTheme, styled } from '@mui/material/styles'

// project imports
import MainCard from '@/ui-component/cards/MainCard'

// icons
import { IconRobotFace, IconBrandOpenai, IconBrandAzure } from '@tabler/icons-react'

const cards = [
    {
        title: 'Custom Assistant',
        description: 'Create custom assistant using your choice of LLMs',
        icon: <IconRobotFace style={{ fontSize: 40 }} />, // Larger icon
        iconText: 'Custom',
        available: true
    },
    {
        title: 'OpenAI Assistant',
        description: 'Create assistant using OpenAI Assistant API',
        icon: <IconBrandOpenai style={{ fontSize: 40 }} />, // Larger icon
        iconText: 'OpenAI',
        available: true
    },
    {
        title: 'Azure Assistant (Coming Soon)',
        description: 'Create assistant using Azure Assistant API',
        icon: <IconBrandAzure style={{ fontSize: 40 }} />, // Larger icon
        iconText: 'Azure',
        available: false
    }
]

const StyledCard = styled(Card, { shouldForwardProp: (prop) => prop !== '$available' })(({ theme, $available }) => ({
    height: '260px',
    background: theme.palette.background.paper,
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: $available ? 'pointer' : 'not-allowed',
    opacity: $available ? 1 : 0.6,
    border: `1.5px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '&:hover': $available
        ? {
              boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
              transform: 'translateY(-2px) scale(1.02)'
          }
        : {}
}))

const FeatureIcon = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 12,
    color: theme.palette.primary.main
}))

const FeatureCards = () => {
    const navigate = useNavigate()
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const onCardClick = (index) => {
        if (index === 0) navigate('/assistants/custom')
        if (index === 1) navigate('/assistants/openai')
    }

    return (
        <Stack spacing={3} direction='row' sx={{ width: '100%', justifyContent: 'space-between' }}>
            {cards.map((card, index) => (
                <StyledCard key={index} $available={card.available} onClick={() => card.available && onCardClick(index)}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <FeatureIcon>
                            {card.icon}
                            <Typography
                                variant='caption'
                                sx={{ textTransform: 'uppercase', fontWeight: 600, color: theme.palette.text.secondary }}
                            >
                                {card.iconText}
                            </Typography>
                        </FeatureIcon>
                        <Typography
                            variant='h6'
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                                color: customization.isDarkMode ? theme.palette.common.white : theme.palette.text.primary
                            }}
                        >
                            {card.title}
                        </Typography>
                        <Typography variant='body2' sx={{ color: theme.palette.text.secondary, flexGrow: 1 }}>
                            {card.description}
                        </Typography>
                        {card.available ? (
                            <Button
                                variant='contained'
                                color='primary'
                                sx={{
                                    mt: 2,
                                    alignSelf: 'flex-start',
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    boxShadow: 'none',
                                    textTransform: 'none'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onCardClick(index)
                                }}
                            >
                                Create
                            </Button>
                        ) : (
                            <Button
                                variant='outlined'
                                color='inherit'
                                sx={{
                                    mt: 2,
                                    alignSelf: 'flex-start',
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    boxShadow: 'none',
                                    textTransform: 'none',
                                    pointerEvents: 'none',
                                    opacity: 0.7
                                }}
                                disabled
                            >
                                Coming Soon
                            </Button>
                        )}
                    </CardContent>
                </StyledCard>
            ))}
        </Stack>
    )
}

// ==============================|| ASSISTANTS ||============================== //

const Assistants = () => {
    return (
        <MainCard sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack flexDirection='column' sx={{ gap: 2 }}>
                <Box sx={{ mb: 1 }}>
                    <Typography variant='h4' sx={{ fontWeight: 800, mb: 0.5 }}>
                        Assistants
                    </Typography>
                    <Typography variant='subtitle1' sx={{ color: 'text.secondary', fontWeight: 400 }}>
                        Build and manage AI assistants for your team.
                    </Typography>
                </Box>
                <FeatureCards />
            </Stack>
        </MainCard>
    )
}

export default Assistants
