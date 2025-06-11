import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// material-ui
import { Box, Skeleton, Stack, ToggleButton, ToggleButtonGroup, TextField, Typography } from '@mui/material'
import { useTheme, styled } from '@mui/material/styles'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import ItemCard from '@/ui-component/cards/ItemCard'
import { gridSpacing } from '@/store/constant'
import LoginDialog from '@/ui-component/dialog/LoginDialog'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'
import { FlowListTable } from '@/ui-component/table/FlowListTable'
import { StyledButton } from '@/ui-component/button/StyledButton'
import ViewHeader from '@/layout/MainLayout/ViewHeader'
import ErrorBoundary from '@/ErrorBoundary'

// API
import chatflowsApi from '@/api/chatflows'

// Hooks
import useApi from '@/hooks/useApi'

// const
import { baseURL } from '@/store/constant'

// icons
import { IconPlus, IconLayoutGrid, IconList, IconBolt, IconMessage2, IconDashboard, IconRobot } from '@tabler/icons-react'

// ==============================|| CHATFLOWS ||============================== //

const GradientText = styled(Typography)(({ theme }) => ({
    background: 'linear-gradient(90deg, #8D36F9, #C837AB)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    fontWeight: 800,
    fontSize: { xs: '36px', sm: '48px', md: '56px' },
    textAlign: 'center',
    marginTop: '40px',
    textShadow: '0 0 20px rgba(141, 54, 249, 0.2)'
}))

const ChatInput = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.darkLevel1 : theme.palette.grey[100],
        borderRadius: '12px',
        padding: '12px 16px',
        '& fieldset': {
            border: 'none'
        },
        '&:hover fieldset': {
            border: 'none'
        },
        '&.Mui-focused fieldset': {
            border: 'none'
        }
    }
}))

const SendButton = styled(StyledButton)(({ theme }) => ({
    minWidth: '42px',
    height: '42px',
    borderRadius: '50%',
    padding: 0,
    background: 'linear-gradient(135deg, #8D36F9, #C837AB)',
    color: theme.palette.common.white,
    boxShadow: '0 4px 10px rgba(141, 54, 249, 0.3)',
    '&:hover': {
        background: 'linear-gradient(135deg, #7926E8, #B7269A)',
        boxShadow: '0 6px 15px rgba(141, 54, 249, 0.4)'
    }
}))

const ActionButton = styled(Box)(({ theme }) => ({
    minWidth: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[700],
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
    }
}))

const SuggestionCard = styled(Box)(({ theme }) => ({
    padding: '15px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: theme.palette.mode === 'dark' ? theme.palette.darkLevel3 : theme.palette.grey[100],
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        background: theme.palette.mode === 'dark' ? theme.palette.darkLevel2 : theme.palette.grey[200],
        transform: 'translateY(-2px)'
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        opacity: theme.palette.mode === 'dark' ? 0.7 : 0.3,
        pointerEvents: 'none'
    },
    '&:hover .suggestion-gradient': {
        opacity: 1
    },
    '& .content': {
        position: 'relative',
        zIndex: 2
    },
    '& .suggestion-gradient': {
        position: 'absolute',
        inset: 0,
        opacity: 0.3,
        transition: 'opacity 0.3s ease',
        '& .top-right': {
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '40%',
            background: 'radial-gradient(circle, rgba(141, 54, 249, 0.5), transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(20%, -20%)',
            filter: 'blur(20px)'
        },
        '& .bottom-left': {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '40%',
            height: '40%',
            background: 'radial-gradient(circle, rgba(200, 55, 171, 0.5), transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(-20%, 20%)',
            filter: 'blur(20px)'
        }
    }
}))

const WelcomeSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: '24px',
    background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(180deg, rgba(141, 54, 249, 0.1) 0%, rgba(200, 55, 171, 0.1) 100%)'
        : 'linear-gradient(180deg, rgba(141, 54, 249, 0.05) 0%, rgba(200, 55, 171, 0.05) 100%)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    marginBottom: theme.spacing(4)
}))

const FeatureGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: theme.spacing(3),
    marginTop: theme.spacing(4)
}))

const FeatureCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '16px',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    background: theme.palette.mode === 'dark' ? theme.palette.darkLevel3 : theme.palette.background.paper,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        borderColor: theme.palette.primary.main,
        '& .feature-icon': {
            transform: 'scale(1.1)',
            color: theme.palette.primary.main
        }
    },
    '& .feature-icon': {
        transition: 'all 0.3s ease',
        marginBottom: theme.spacing(2),
        color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[700]
    }
}))

const QuickStartButton = styled(StyledButton)(({ theme }) => ({
    background: 'linear-gradient(135deg, #8D36F9, #C837AB)',
    color: theme.palette.common.white,
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(141, 54, 249, 0.3)',
    '&:hover': {
        background: 'linear-gradient(135deg, #7926E8, #B7269A)',
        boxShadow: '0 6px 16px rgba(141, 54, 249, 0.4)'
    }
}))

const Chatflows = () => {
    const navigate = useNavigate()
    const theme = useTheme()

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [images, setImages] = useState({})
    const [search, setSearch] = useState('')
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)
    const [loginDialogProps, setLoginDialogProps] = useState({})
    const [message, setMessage] = useState('')

    const getAllChatflowsApi = useApi(chatflowsApi.getAllChatflows)
    const [view, setView] = useState(localStorage.getItem('flowDisplayStyle') || 'card')

    const handleChange = (event, nextView) => {
        if (nextView === null) return
        localStorage.setItem('flowDisplayStyle', nextView)
        setView(nextView)
    }

    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }

    const handleMessageChange = (event) => {
        setMessage(event.target.value)
    }

    const sendMessage = () => {
        if (!message.trim()) return
        // Handle message sending logic
        console.log('Sending message:', message)
        setMessage('')
    }

    const useSuggestion = (suggestion) => {
        setMessage(suggestion)
    }

    function filterFlows(data) {
        return (
            data.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            (data.category && data.category.toLowerCase().indexOf(search.toLowerCase()) > -1) ||
            data.id.toLowerCase().indexOf(search.toLowerCase()) > -1
        )
    }

    const onLoginClick = (username, password) => {
        localStorage.setItem('username', username)
        localStorage.setItem('password', password)
        navigate(0)
    }

    const addNew = () => {
        navigate('/canvas')
    }

    const goToCanvas = (selectedChatflow) => {
        navigate(`/canvas/${selectedChatflow.id}`)
    }

    useEffect(() => {
        getAllChatflowsApi.request().catch((err) => {
            console.error('Failed to fetch chatflows:', err)
            setLoading(false)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (getAllChatflowsApi.error) {
            if (getAllChatflowsApi.error?.response?.status === 401) {
                setLoginDialogProps({
                    title: 'Login',
                    confirmButtonName: 'Login'
                })
                setLoginDialogOpen(true)
            } else {
                setError(getAllChatflowsApi.error)
            }
        }
    }, [getAllChatflowsApi.error])

    useEffect(() => {
        setLoading(getAllChatflowsApi.loading)
    }, [getAllChatflowsApi.loading])

    useEffect(() => {
        if (getAllChatflowsApi.data) {
            try {
                const chatflows = getAllChatflowsApi.data
                console.log('Chatflows data loaded:', chatflows, 'Length:', chatflows.length)
                const images = {}
                for (let i = 0; i < chatflows.length; i += 1) {
                    const flowDataStr = chatflows[i].flowData
                    const flowData = JSON.parse(flowDataStr)
                    const nodes = flowData.nodes || []
                    images[chatflows[i].id] = []
                    for (let j = 0; j < nodes.length; j += 1) {
                        const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                        if (!images[chatflows[i].id].includes(imageSrc)) {
                            images[chatflows[i].id].push(imageSrc)
                        }
                    }
                }
                setImages(images)
            } catch (e) {
                console.error('Error processing chatflows data:', e)
            }
        } else {
            console.log('No chatflows data available')
        }
    }, [getAllChatflowsApi.data])

    const suggestedPrompts = [
        {
            title: 'Tell me a fun fact',
            description: 'about the Roman Empire',
            type: 'fun'
        },
        {
            title: 'Give me ideas',
            description: "for what to do with my kids' art",
            type: 'ideas'
        },
        {
            title: 'Grammar check',
            description: 'rewrite it for better readability',
            type: 'grammar'
        },
        {
            title: 'Show me a code snippet',
            description: "of a website's sticky header",
            type: 'code'
        }
    ]

    return (
        <MainCard>
            {isLoading ? (
                <Stack spacing={2}>
                    <Skeleton variant="rectangular" height={200} />
                    <Skeleton variant="rectangular" height={100} />
                    <Skeleton variant="rectangular" height={100} />
                </Stack>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Stack spacing={3}>
                    <Box
                        sx={{
                            p: 4,
                            borderRadius: '24px',
                            background: theme.palette.mode === 'dark' 
                                ? 'linear-gradient(180deg, rgba(141, 54, 249, 0.1) 0%, rgba(200, 55, 171, 0.1) 100%)'
                                : 'linear-gradient(180deg, rgba(141, 54, 249, 0.05) 0%, rgba(200, 55, 171, 0.05) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                            mb: 4
                        }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '36px', sm: '48px', md: '56px' },
                                fontWeight: 800,
                                mb: 2,
                                background: 'linear-gradient(90deg, #ff2daf, #ff6a00)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                textFillColor: 'transparent',
                                textAlign: 'center',
                                textShadow: '0 0 20px rgba(141, 54, 249, 0.2)'
                            }}
                        >
                            Welcome to AlvioAgent
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: 'center',
                                mb: 4,
                                maxWidth: '800px',
                                mx: 'auto',
                                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                                fontWeight: 'normal',
                                lineHeight: 1.6
                            }}
                        >
                            Your AI-Powered Agent Builder platform. Create intelligent virtual agents for enterprise and tech-savvy
                            users with our intuitive, futuristic interface.
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <StyledButton
                                variant="contained"
                                onClick={addNew}
                                startIcon={<IconPlus />}
                                sx={{
                                    background: 'linear-gradient(135deg, #8D36F9, #C837AB)',
                                    color: 'white',
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 12px rgba(141, 54, 249, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #7926E8, #B7269A)',
                                        boxShadow: '0 6px 16px rgba(141, 54, 249, 0.4)'
                                    }
                                }}
                            >
                                Create New Flow
                            </StyledButton>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 3,
                            mt: 4
                        }}
                    >
                        <Box
                            onClick={() => navigate('/chatflows')}
                            sx={{
                                p: 3,
                                borderRadius: '16px',
                                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                                background: theme.palette.mode === 'dark' ? theme.palette.darkLevel3 : theme.palette.background.paper,
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                                    borderColor: theme.palette.primary.main
                                }
                            }}
                        >
                            <IconMessage2
                                size={32}
                                style={{
                                    marginBottom: 16,
                                    color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[700]
                                }}
                            />
                            <Typography variant="h6" gutterBottom>
                                Chatflows
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Create and manage conversational AI flows with our intuitive interface
                            </Typography>
                        </Box>

                        <Box
                            onClick={() => navigate('/agentflows')}
                            sx={{
                                p: 3,
                                borderRadius: '16px',
                                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                                background: theme.palette.mode === 'dark' ? theme.palette.darkLevel3 : theme.palette.background.paper,
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                                    borderColor: theme.palette.primary.main
                                }
                            }}
                        >
                            <IconDashboard
                                size={32}
                                style={{
                                    marginBottom: 16,
                                    color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[700]
                                }}
                            />
                            <Typography variant="h6" gutterBottom>
                                Agentflows
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Build and deploy autonomous AI agents for complex tasks
                            </Typography>
                        </Box>

                        <Box
                            onClick={() => navigate('/assistants')}
                            sx={{
                                p: 3,
                                borderRadius: '16px',
                                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                                background: theme.palette.mode === 'dark' ? theme.palette.darkLevel3 : theme.palette.background.paper,
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                                    borderColor: theme.palette.primary.main
                                }
                            }}
                        >
                            <IconRobot
                                size={32}
                                style={{
                                    marginBottom: 16,
                                    color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[700]
                                }}
                            />
                            <Typography variant="h6" gutterBottom>
                                Assistants
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Create and customize AI assistants with advanced capabilities
                            </Typography>
                        </Box>
                    </Box>

                    <ViewHeader
                        onSearchChange={onSearchChange}
                        search={true}
                        searchPlaceholder='Search Name or Category'
                        title='Chatflows'
                        description='Build single-agent systems, chatbots and simple LLM flows'
                    >
                        <ToggleButtonGroup
                            sx={{ borderRadius: '4px', maxHeight: 40 }}
                            value={view}
                            color='primary'
                            exclusive
                            onChange={handleChange}
                        >
                            <ToggleButton
                                sx={{
                                    borderColor: theme.palette.grey[900] + 25,
                                    borderRadius: '4px',
                                    color: theme?.customization?.isDarkMode ? 'white' : 'inherit'
                                }}
                                variant='contained'
                                value='card'
                                title='Card View'
                            >
                                <IconLayoutGrid />
                            </ToggleButton>
                            <ToggleButton
                                sx={{
                                    borderColor: theme.palette.grey[900] + 25,
                                    borderRadius: '4px',
                                    color: theme?.customization?.isDarkMode ? 'white' : 'inherit'
                                }}
                                variant='contained'
                                value='list'
                                title='List View'
                            >
                                <IconList />
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <StyledButton
                            variant='contained'
                            onClick={addNew}
                            startIcon={<IconPlus />}
                            sx={{
                                borderRadius: '4px',
                                height: 40,
                                background: 'linear-gradient(135deg, #8D36F9, #C837AB)',
                                boxShadow: '0 4px 10px rgba(141, 54, 249, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #7926E8, #B7269A)',
                                    boxShadow: '0 6px 15px rgba(141, 54, 249, 0.4)'
                                }
                            }}
                        >
                            Add New
                        </StyledButton>
                    </ViewHeader>
                    {!view || view === 'card' ? (
                        <>
                            {isLoading && !getAllChatflowsApi.data ? (
                                <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                    <Skeleton variant='rounded' height={160} />
                                    <Skeleton variant='rounded' height={160} />
                                    <Skeleton variant='rounded' height={160} />
                                </Box>
                            ) : (
                                <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                    {getAllChatflowsApi.data?.filter(filterFlows).map((data, index) => (
                                        <ItemCard
                                            key={index}
                                            onClick={() => goToCanvas(data)}
                                            data={data}
                                            images={images[data.id]}
                                        />
                                    ))}
                                </Box>
                            )}
                        </>
                    ) : (
                        <FlowListTable
                            data={getAllChatflowsApi.data}
                            images={images}
                            isLoading={isLoading}
                            filterFunction={filterFlows}
                            updateFlowsApi={getAllChatflowsApi}
                            setError={setError}
                        />
                    )}
                </Stack>
            )}

            <LoginDialog show={loginDialogOpen} dialogProps={loginDialogProps} onConfirm={onLoginClick} />
            <ConfirmDialog />
        </MainCard>
    )
}

export default Chatflows
