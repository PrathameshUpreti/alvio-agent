import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { keyframes } from '@mui/system'

// material-ui
import { Chip, Box, Skeleton, ToggleButton, ToggleButtonGroup, Fab, InputBase, Typography } from '@mui/material'
import { useTheme, styled } from '@mui/material/styles'

// project imports
import LoginDialog from '@/ui-component/dialog/LoginDialog'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'
import { FlowListTable } from '@/ui-component/table/FlowListTable'
import { StyledButton } from '@/ui-component/button/StyledButton'
import ErrorBoundary from '@/ErrorBoundary'

// API
import chatflowsApi from '@/api/chatflows'

// Hooks
import useApi from '@/hooks/useApi'

// const
import { baseURL, AGENTFLOW_ICONS } from '@/store/constant'

// icons
import { IconPlus, IconLayoutGrid, IconList } from '@tabler/icons-react'

// Styled components for new UI
const SplitLayout = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    minHeight: 'calc(100vh - 56px)',
    marginTop: 0,
    background:
        theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, #181A1B 60%, #232627 100%)'
            : 'linear-gradient(90deg, #f7f7fa 60%, #fff 100%)',
    borderRadius: '8px',
    boxShadow: 'none',
    overflow: 'visible',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        minHeight: 'auto'
    }
}))

const LeftPanel = styled(Box)(({ theme }) => ({
    width: 300,
    minWidth: 220,
    maxWidth: 340,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRight: `1px solid ${theme.palette.divider}`,
    background: theme.palette.mode === 'dark' ? '#181A1B' : '#f7f7fa',
    [theme.breakpoints.down('md')]: {
        width: '100%',
        maxWidth: '100%',
        borderRight: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        alignItems: 'center',
        padding: theme.spacing(1)
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        borderRight: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        alignItems: 'stretch',
        padding: theme.spacing(1)
    }
}))

const RightPanel = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(1)
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        padding: theme.spacing(1)
    }
}))

const MinimalCard = styled(Box)(({ theme }) => ({
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 24,
    background: theme.palette.mode === 'dark' ? '#232627' : '#fff',
    padding: theme.spacing(3),
    minHeight: 180,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: theme.spacing(1),
    transition: 'box-shadow 0.2s, border-color 0.2s',
    cursor: 'pointer',
    boxShadow: 'none',
    '&:hover': {
        borderColor: theme.palette.secondary.main,
        boxShadow: `0 0 0 4px ${theme.palette.secondary.main}22`
    }
}))

const VerticalToolbar = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    width: '100%',
    marginTop: theme.spacing(4),
    alignItems: 'stretch'
}))

const PillInput = styled(InputBase)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? '#232627' : '#f5f5f7',
    borderRadius: 20,
    padding: '8px 18px',
    fontSize: 16,
    minWidth: 180,
    boxShadow: 'none',
    border: `1.5px solid ${theme.palette.divider}`
}))

const pulse = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(141,54,249,0.3); }
    70% { box-shadow: 0 0 0 12px rgba(141,54,249,0); }
    100% { box-shadow: 0 0 0 0 rgba(141,54,249,0); }
`

const AnimatedFab = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: 40,
    right: 40,
    zIndex: 1200,
    background: theme.palette.primary.main,
    color: '#fff',
    fontWeight: 700,
    animation: `${pulse} 1.8s infinite`,
    '&:hover': {
        background: theme.palette.secondary.main
    }
}))

const EngagingEmptyState = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '30vh',
    width: '100%',
    padding: theme.spacing(6, 2),
    color: theme.palette.text.secondary,
    opacity: 0.9
}))

const PulseEmoji = styled('span')`
    display: inline-block;
    font-size: 3rem;
    animation: pulse 1.5s infinite;
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0.7;
        }
        50% {
            transform: scale(1.12);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0.7;
        }
    }
`

const Agentflows = () => {
    const navigate = useNavigate()
    const theme = useTheme()

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [images, setImages] = useState({})
    const [icons, setIcons] = useState({})
    const [search, setSearch] = useState('')
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)
    const [loginDialogProps, setLoginDialogProps] = useState({})

    const getAllAgentflows = useApi(chatflowsApi.getAllAgentflows)
    const [view, setView] = useState(localStorage.getItem('flowDisplayStyle') || 'card')
    const [agentflowVersion, setAgentflowVersion] = useState(localStorage.getItem('agentFlowVersion') || 'v2')

    const handleChange = (event, nextView) => {
        if (nextView === null) return
        localStorage.setItem('flowDisplayStyle', nextView)
        setView(nextView)
    }

    const handleVersionChange = (event, nextView) => {
        if (nextView === null) return
        localStorage.setItem('agentFlowVersion', nextView)
        setAgentflowVersion(nextView)
        getAllAgentflows.request(nextView === 'v2' ? 'AGENTFLOW' : 'MULTIAGENT')
    }

    const onSearchChange = (event) => {
        setSearch(event.target.value)
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
        if (agentflowVersion === 'v2') {
            navigate('/v2/agentcanvas')
        } else {
            navigate('/agentcanvas')
        }
    }

    const goToCanvas = (selectedAgentflow) => {
        if (selectedAgentflow.type === 'AGENTFLOW') {
            navigate(`/v2/agentcanvas/${selectedAgentflow.id}`)
        } else {
            navigate(`/agentcanvas/${selectedAgentflow.id}`)
        }
    }

    useEffect(() => {
        getAllAgentflows.request(agentflowVersion === 'v2' ? 'AGENTFLOW' : 'MULTIAGENT')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (getAllAgentflows.error) {
            if (getAllAgentflows.error?.response?.status === 401) {
                setLoginDialogProps({
                    title: 'Login',
                    confirmButtonName: 'Login'
                })
                setLoginDialogOpen(true)
            } else {
                setError(getAllAgentflows.error)
            }
        }
    }, [getAllAgentflows.error])

    useEffect(() => {
        setLoading(getAllAgentflows.loading)
    }, [getAllAgentflows.loading])

    useEffect(() => {
        if (getAllAgentflows.data) {
            try {
                const agentflows = getAllAgentflows.data
                const images = {}
                const icons = {}
                for (let i = 0; i < agentflows.length; i += 1) {
                    const flowDataStr = agentflows[i].flowData
                    const flowData = JSON.parse(flowDataStr)
                    const nodes = flowData.nodes || []
                    images[agentflows[i].id] = []
                    icons[agentflows[i].id] = []
                    for (let j = 0; j < nodes.length; j += 1) {
                        const foundIcon = AGENTFLOW_ICONS.find((icon) => icon.name === nodes[j].data.name)
                        if (foundIcon) {
                            icons[agentflows[i].id].push(foundIcon)
                        } else {
                            const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                            if (!images[agentflows[i].id].includes(imageSrc)) {
                                images[agentflows[i].id].push(imageSrc)
                            }
                        }
                    }
                }
                setImages(images)
                setIcons(icons)
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllAgentflows.data])

    // Refactor the UI to match the marketplace split layout and responsive grid
    return (
        <SplitLayout>
            {/* Left Panel: Hero + Toolbar */}
            <LeftPanel>
                <Typography variant='h4' sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
                    Agentflows
                </Typography>
                <Typography
                    variant='subtitle1'
                    sx={{ color: 'text.secondary', fontWeight: 400, mb: 2, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
                >
                    Multi-agent systems, workflow orchestration
                </Typography>
                <VerticalToolbar sx={{ gap: { xs: 1, sm: 2 } }}>
                    <PillInput
                        placeholder='Search Name or Category'
                        value={search}
                        onChange={onSearchChange}
                        sx={{ fontSize: { xs: 14, sm: 16 }, minWidth: { xs: 120, sm: 180 } }}
                    />
                    <ToggleButtonGroup
                        orientation={window.innerWidth < 600 ? 'horizontal' : 'vertical'}
                        sx={{ borderRadius: '20px', width: '100%', flexDirection: { xs: 'row', sm: 'column' }, mb: { xs: 1, sm: 0 } }}
                        value={agentflowVersion}
                        color='primary'
                        exclusive
                        onChange={handleVersionChange}
                    >
                        <ToggleButton
                            sx={{ borderRadius: '20px', fontWeight: 600, mb: { xs: 0, sm: 1 }, fontSize: { xs: 13, sm: 16 } }}
                            variant='outlined'
                            value='v2'
                            title='V2'
                        >
                            <Chip sx={{ mr: 1 }} label='NEW' size='small' color='primary' />
                            V2
                        </ToggleButton>
                        <ToggleButton
                            sx={{ borderRadius: '20px', fontWeight: 600, fontSize: { xs: 13, sm: 16 } }}
                            variant='outlined'
                            value='v1'
                            title='V1'
                        >
                            V1
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <ToggleButtonGroup
                        orientation='vertical'
                        sx={{ borderRadius: '20px', width: '100%' }}
                        value={view}
                        color='primary'
                        exclusive
                        onChange={handleChange}
                    >
                        <ToggleButton sx={{ borderRadius: '20px', mb: 1 }} variant='outlined' value='card' title='Card View'>
                            <IconLayoutGrid /> Card View
                        </ToggleButton>
                        <ToggleButton sx={{ borderRadius: '20px' }} variant='outlined' value='list' title='List View'>
                            <IconList /> List View
                        </ToggleButton>
                    </ToggleButtonGroup>
                </VerticalToolbar>
            </LeftPanel>
            {/* Right Panel: Content */}
            <RightPanel>
                {error ? (
                    <ErrorBoundary error={error} />
                ) : !view || view === 'card' ? (
                    <>
                        {isLoading && !getAllAgentflows.data ? (
                            <Box display='grid' gridTemplateColumns='repeat(auto-fit, minmax(320px, 1fr))' gap={4}>
                                <MinimalCard>
                                    <Skeleton variant='text' width='80%' height={32} />
                                </MinimalCard>
                                <MinimalCard>
                                    <Skeleton variant='text' width='80%' height={32} />
                                </MinimalCard>
                                <MinimalCard>
                                    <Skeleton variant='text' width='80%' height={32} />
                                </MinimalCard>
                            </Box>
                        ) : getAllAgentflows.data?.filter(filterFlows).length === 0 ? (
                            <EngagingEmptyState>
                                <PulseEmoji>🤖</PulseEmoji>
                                <Typography variant='h5' sx={{ fontWeight: 700, mb: 1, mt: 2 }}>
                                    You&apos;re just one click away from creating your first agent!
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'text.secondary', mb: 3 }}>
                                    Agentflows let you orchestrate powerful multi-agent workflows. Get started now!
                                </Typography>
                                <StyledButton
                                    variant='contained'
                                    onClick={addNew}
                                    startIcon={<IconPlus />}
                                    sx={{ borderRadius: 2, height: 44, fontWeight: 700 }}
                                >
                                    Create Agentflow
                                </StyledButton>
                            </EngagingEmptyState>
                        ) : (
                            <Box display='grid' gridTemplateColumns='repeat(auto-fit, minmax(320px, 1fr))' gap={4}>
                                {getAllAgentflows.data?.filter(filterFlows).map((data, index) => (
                                    <MinimalCard key={index} onClick={() => goToCanvas(data)}>
                                        <Box sx={{ fontSize: 36, mb: 1 }}>
                                            {data.iconSrc ? (
                                                <img src={data.iconSrc} alt='' style={{ width: 36, height: 36, borderRadius: '50%' }} />
                                            ) : (
                                                '🧩'
                                            )}
                                        </Box>
                                        <Typography variant='h6' sx={{ fontWeight: 700, mb: 0.5, color: 'primary.main' }}>
                                            {data.templateName || data.name}
                                        </Typography>
                                        <Typography variant='body2' sx={{ color: 'text.secondary', mb: 1 }}>
                                            {data.category || 'Uncategorized'}
                                        </Typography>
                                        <Typography variant='caption' sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>
                                            {data.id}
                                        </Typography>
                                    </MinimalCard>
                                ))}
                            </Box>
                        )}
                    </>
                ) : (
                    <FlowListTable
                        isAgentCanvas={true}
                        data={getAllAgentflows.data}
                        images={images}
                        icons={icons}
                        isLoading={isLoading}
                        filterFunction={filterFlows}
                        updateFlowsApi={getAllAgentflows}
                        setError={setError}
                    />
                )}
            </RightPanel>
            {/* Floating Add New Button */}
            <AnimatedFab aria-label='add' onClick={addNew} title='Add New Agentflow'>
                <IconPlus size={28} />
            </AnimatedFab>
            <LoginDialog show={loginDialogOpen} dialogProps={loginDialogProps} onConfirm={onLoginClick} />
            <ConfirmDialog />
        </SplitLayout>
    )
}

export default Agentflows
