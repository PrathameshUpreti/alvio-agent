import * as React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// Import futuristic styles
import './futuristic-styles.css'

// material-ui
import {
    Box,
    Stack,
    Badge,
    ToggleButton,
    InputLabel,
    FormControl,
    Select,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Skeleton,
    FormControlLabel,
    ToggleButtonGroup,
    MenuItem,
    Button,
    Tabs,
    Tab,
    Typography,
    Paper
} from '@mui/material'
import { useTheme, styled } from '@mui/material/styles'
import { IconLayoutGrid, IconList, IconX, IconSparkles, IconRocket, IconBolt } from '@tabler/icons-react'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import ItemCard from '@/ui-component/cards/ItemCard'
import WorkflowEmptySVG from '@/assets/images/workflow_empty.svg'
import ToolDialog from '@/views/tools/ToolDialog'
import { MarketplaceTable } from '@/ui-component/table/MarketplaceTable'
import ViewHeader from '@/layout/MainLayout/ViewHeader'
import ErrorBoundary from '@/ErrorBoundary'
import { TabPanel } from '@/ui-component/tabs/TabPanel'
import { closeSnackbar as closeSnackbarAction, enqueueSnackbar as enqueueSnackbarAction } from '@/store/actions'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'

// API
import marketplacesApi from '@/api/marketplaces'

// Hooks
import useApi from '@/hooks/useApi'
import useConfirm from '@/hooks/useConfirm'

// const
import { baseURL, AGENTFLOW_ICONS } from '@/store/constant'
import { gridSpacing } from '@/store/constant'
import useNotifier from '@/utils/useNotifier'

const badges = ['POPULAR', 'NEW']
const types = ['Chatflow', 'Agentflow', 'AgentflowV2', 'Tool']
const framework = ['Langchain', 'LlamaIndex']
const MenuProps = {
    PaperProps: {
        style: {
            width: 160,
            background: 'linear-gradient(135deg, #8a01a1 0%, #ab02c9 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 143, 0, 0.2)'
        }
    }
}

// Custom styled components for futuristic design
const FuturisticContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background:
        theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0a0a0b 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0a0a0b 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 25%, #f1f3f6 50%, #ffffff 75%, #f8f9fa 100%)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
            radial-gradient(circle at 20% 20%, rgba(255, 143, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(171, 2, 201, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(138, 1, 161, 0.05) 0%, transparent 50%)
        `,
        zIndex: 1,
        pointerEvents: 'none'
    }
}))

const GlassmorphismCard = styled(MainCard)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? 'rgba(138, 1, 161, 0.1)' : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 143, 0, 0.2)',
    borderRadius: '20px',
    boxShadow:
        theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 143, 0, 0.1)'
            : '0 8px 32px rgba(138, 1, 161, 0.1), inset 0 1px 0 rgba(255, 143, 0, 0.2)',
    position: 'relative',
    zIndex: 2,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow:
            theme.palette.mode === 'dark'
                ? '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 143, 0, 0.2)'
                : '0 20px 40px rgba(138, 1, 161, 0.2), inset 0 1px 0 rgba(255, 143, 0, 0.3)'
    }
}))

const NeonHeader = styled(Typography)(({ theme }) => ({
    background: 'linear-gradient(45deg, #ff8f00 30%, #ffd700 70%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 800,
    fontSize: '3rem',
    textAlign: 'center',
    marginBottom: '1rem',
    position: 'relative',
    textShadow: theme.palette.mode === 'dark' ? '0 0 20px rgba(255, 143, 0, 0.5)' : 'none',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100px',
        height: '3px',
        background: 'linear-gradient(90deg, #ff8f00, #ffd700, #ab02c9)',
        borderRadius: '2px'
    }
}))

const FuturisticButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #ff8f00 30%, #ab02c9 90%)',
    border: 'none',
    borderRadius: '25px',
    color: 'white',
    fontWeight: 600,
    padding: '12px 24px',
    textTransform: 'none',
    boxShadow: '0 4px 15px rgba(255, 143, 0, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
        transition: 'left 0.5s'
    },
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(255, 143, 0, 0.4)',
        '&::before': {
            left: '100%'
        }
    }
}))

const FuturisticSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 143, 0, 0.3)',
        borderRadius: '15px',
        transition: 'all 0.3s ease'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ff8f00',
        boxShadow: '0 0 10px rgba(255, 143, 0, 0.2)'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ab02c9',
        boxShadow: '0 0 15px rgba(171, 2, 201, 0.3)'
    },
    '& .MuiSelect-select': {
        background: theme.palette.mode === 'dark' ? 'rgba(138, 1, 161, 0.1)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)'
    }
}))

const AnimatedToggleButton = styled(ToggleButton)(({ theme }) => ({
    border: '1px solid rgba(255, 143, 0, 0.3)',
    borderRadius: '12px',
    background: theme.palette.mode === 'dark' ? 'rgba(138, 1, 161, 0.1)' : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        background: 'rgba(255, 143, 0, 0.1)',
        borderColor: '#ff8f00',
        transform: 'scale(1.05)'
    },
    '&.Mui-selected': {
        background: 'linear-gradient(45deg, #ff8f00 30%, #ab02c9 90%)',
        color: 'white',
        borderColor: 'transparent',
        '&:hover': {
            background: 'linear-gradient(45deg, #ff8f00 30%, #ab02c9 90%)'
        }
    }
}))

const GlowingTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTabs-indicator': {
        background: 'linear-gradient(90deg, #ff8f00, #ffd700)',
        height: '3px',
        borderRadius: '2px',
        boxShadow: '0 0 10px rgba(255, 143, 0, 0.5)'
    },
    '& .MuiTab-root': {
        fontWeight: 600,
        fontSize: '1.1rem',
        textTransform: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
            color: '#ff8f00',
            textShadow: '0 0 8px rgba(255, 143, 0, 0.5)'
        },
        '&.Mui-selected': {
            color: '#ff8f00',
            textShadow: '0 0 8px rgba(255, 143, 0, 0.5)'
        }
    }
}))

const FloatingUsecaseChip = styled(FormControlLabel)(({ theme, disabled }) => ({
    margin: '4px',
    '& .MuiFormControlLabel-label': {
        background: disabled
            ? 'rgba(128, 128, 128, 0.2)'
            : 'linear-gradient(45deg, rgba(255, 143, 0, 0.1) 30%, rgba(171, 2, 201, 0.1) 90%)',
        backdropFilter: 'blur(10px)',
        border: disabled ? '1px solid rgba(128, 128, 128, 0.3)' : '1px solid rgba(255, 143, 0, 0.3)',
        borderRadius: '20px',
        padding: '8px 16px',
        fontSize: '0.9rem',
        fontWeight: 500,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        '&:hover': {
            background: disabled
                ? 'rgba(128, 128, 128, 0.2)'
                : 'linear-gradient(45deg, rgba(255, 143, 0, 0.2) 30%, rgba(171, 2, 201, 0.2) 90%)',
            borderColor: disabled ? 'rgba(128, 128, 128, 0.3)' : '#ff8f00',
            transform: disabled ? 'none' : 'translateY(-2px)',
            boxShadow: disabled ? 'none' : '0 4px 15px rgba(255, 143, 0, 0.2)'
        }
    },
    '& .MuiCheckbox-root': {
        display: 'none'
    }
}))

const PulsingIcon = styled(Box)(({ theme }) => ({
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    '@keyframes pulse': {
        '0%, 100%': {
            opacity: 1
        },
        '50%': {
            opacity: 0.5
        }
    }
}))

// ==============================|| Futuristic Marketplace ||============================== //

const Marketplace = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useNotifier()

    const theme = useTheme()

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [images, setImages] = useState({})
    const [icons, setIcons] = useState({})
    const [usecases, setUsecases] = useState([])
    const [eligibleUsecases, setEligibleUsecases] = useState([])
    const [selectedUsecases, setSelectedUsecases] = useState([])

    const [showToolDialog, setShowToolDialog] = useState(false)
    const [toolDialogProps, setToolDialogProps] = useState({})

    const getAllTemplatesMarketplacesApi = useApi(marketplacesApi.getAllTemplatesFromMarketplaces)

    const [view, setView] = React.useState(localStorage.getItem('mpDisplayStyle') || 'card')
    const [search, setSearch] = useState('')
    const [badgeFilter, setBadgeFilter] = useState([])
    const [typeFilter, setTypeFilter] = useState([])
    const [frameworkFilter, setFrameworkFilter] = useState([])

    const getAllCustomTemplatesApi = useApi(marketplacesApi.getAllCustomTemplates)
    const [activeTabValue, setActiveTabValue] = useState(0)
    const [templateImages, setTemplateImages] = useState({})
    const [templateIcons, setTemplateIcons] = useState({})
    const [templateUsecases, setTemplateUsecases] = useState([])
    const [eligibleTemplateUsecases, setEligibleTemplateUsecases] = useState([])
    const [selectedTemplateUsecases, setSelectedTemplateUsecases] = useState([])
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))
    const { confirm } = useConfirm()

    const getSelectStyles = (borderColor, isDarkMode) => ({
        '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: 15,
            borderColor: borderColor,
            transition: 'all 0.3s ease'
        },
        '& .MuiSvgIcon-root': {
            color: isDarkMode ? '#fff' : 'inherit'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ff8f00',
            boxShadow: '0 0 10px rgba(255, 143, 0, 0.2)'
        }
    })

    const handleTabChange = (event, newValue) => {
        if (newValue === 1 && !getAllCustomTemplatesApi.data) {
            getAllCustomTemplatesApi.request()
        }
        setActiveTabValue(newValue)
    }

    const clearAllUsecases = () => {
        if (activeTabValue === 0) setSelectedUsecases([])
        else setSelectedTemplateUsecases([])
    }

    const handleBadgeFilterChange = (event) => {
        const {
            target: { value }
        } = event
        setBadgeFilter(typeof value === 'string' ? value.split(',') : value)
        const data = activeTabValue === 0 ? getAllTemplatesMarketplacesApi.data : getAllCustomTemplatesApi.data
        getEligibleUsecases(data, {
            typeFilter,
            badgeFilter: typeof value === 'string' ? value.split(',') : value,
            frameworkFilter,
            search
        })
    }

    const handleTypeFilterChange = (event) => {
        const {
            target: { value }
        } = event
        setTypeFilter(typeof value === 'string' ? value.split(',') : value)
        const data = activeTabValue === 0 ? getAllTemplatesMarketplacesApi.data : getAllCustomTemplatesApi.data
        getEligibleUsecases(data, {
            typeFilter: typeof value === 'string' ? value.split(',') : value,
            badgeFilter,
            frameworkFilter,
            search
        })
    }

    const handleFrameworkFilterChange = (event) => {
        const {
            target: { value }
        } = event
        setFrameworkFilter(typeof value === 'string' ? value.split(',') : value)
        const data = activeTabValue === 0 ? getAllTemplatesMarketplacesApi.data : getAllCustomTemplatesApi.data
        getEligibleUsecases(data, {
            typeFilter,
            badgeFilter,
            frameworkFilter: typeof value === 'string' ? value.split(',') : value,
            search
        })
    }

    const handleViewChange = (event, nextView) => {
        if (nextView === null) return
        localStorage.setItem('mpDisplayStyle', nextView)
        setView(nextView)
    }

    const onSearchChange = (event) => {
        setSearch(event.target.value)
        const data = activeTabValue === 0 ? getAllTemplatesMarketplacesApi.data : getAllCustomTemplatesApi.data
        getEligibleUsecases(data, { typeFilter, badgeFilter, frameworkFilter, search: event.target.value })
    }

    const onDeleteCustomTemplate = async (template) => {
        const confirmPayload = {
            title: `Delete`,
            description: `Delete Custom Template ${template.name}?`,
            confirmButtonName: 'Delete',
            cancelButtonName: 'Cancel'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            try {
                const deleteResp = await marketplacesApi.deleteCustomTemplate(template.id)
                if (deleteResp.data) {
                    enqueueSnackbar({
                        message: 'Custom Template deleted successfully!',
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success',
                            action: (key) => (
                                <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                    <IconX />
                                </Button>
                            )
                        }
                    })
                    getAllCustomTemplatesApi.request()
                }
            } catch (error) {
                enqueueSnackbar({
                    message: `Failed to delete custom template: ${
                        typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                    }`,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
            }
        }
    }

    function filterFlows(data) {
        return (
            (data.categories ? data.categories.join(',') : '').toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            data.templateName.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            (data.description && data.description.toLowerCase().indexOf(search.toLowerCase()) > -1)
        )
    }

    function filterByBadge(data) {
        return badgeFilter.length > 0 ? badgeFilter.includes(data.badge) : true
    }

    function filterByType(data) {
        return typeFilter.length > 0 ? typeFilter.includes(data.type) : true
    }

    function filterByFramework(data) {
        return frameworkFilter.length > 0 ? (data.framework || []).some((item) => frameworkFilter.includes(item)) : true
    }

    function filterByUsecases(data) {
        if (activeTabValue === 0)
            return selectedUsecases.length > 0 ? (data.usecases || []).some((item) => selectedUsecases.includes(item)) : true
        else
            return selectedTemplateUsecases.length > 0
                ? (data.usecases || []).some((item) => selectedTemplateUsecases.includes(item))
                : true
    }

    const getEligibleUsecases = (data, filter) => {
        if (!data) return

        let filteredData = data
        if (filter.badgeFilter.length > 0) filteredData = filteredData.filter((data) => filter.badgeFilter.includes(data.badge))
        if (filter.typeFilter.length > 0) filteredData = filteredData.filter((data) => filter.typeFilter.includes(data.type))
        if (filter.frameworkFilter.length > 0)
            filteredData = filteredData.filter((data) => (data.framework || []).some((item) => filter.frameworkFilter.includes(item)))
        if (filter.search) {
            filteredData = filteredData.filter(
                (data) =>
                    (data.categories ? data.categories.join(',') : '').toLowerCase().indexOf(filter.search.toLowerCase()) > -1 ||
                    data.templateName.toLowerCase().indexOf(filter.search.toLowerCase()) > -1 ||
                    (data.description && data.description.toLowerCase().indexOf(filter.search.toLowerCase()) > -1)
            )
        }

        const usecases = []
        for (let i = 0; i < filteredData.length; i += 1) {
            if (filteredData[i].flowData) {
                usecases.push(...filteredData[i].usecases)
            }
        }
        if (activeTabValue === 0) setEligibleUsecases(Array.from(new Set(usecases)).sort())
        else setEligibleTemplateUsecases(Array.from(new Set(usecases)).sort())
    }

    const onUseTemplate = (selectedTool) => {
        const dialogProp = {
            title: 'Add New Tool',
            type: 'IMPORT',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Add',
            data: selectedTool
        }
        setToolDialogProps(dialogProp)
        setShowToolDialog(true)
    }

    const goToTool = (selectedTool) => {
        const dialogProp = {
            title: selectedTool.templateName,
            type: 'TEMPLATE',
            data: selectedTool
        }
        setToolDialogProps(dialogProp)
        setShowToolDialog(true)
    }

    const goToCanvas = (selectedChatflow) => {
        if (selectedChatflow.type === 'AgentflowV2') {
            navigate(`/v2/marketplace/${selectedChatflow.id}`, { state: selectedChatflow })
        } else {
            navigate(`/marketplace/${selectedChatflow.id}`, { state: selectedChatflow })
        }
    }

    useEffect(() => {
        getAllTemplatesMarketplacesApi.request()
    }, [])

    useEffect(() => {
        setLoading(getAllTemplatesMarketplacesApi.loading)
    }, [getAllTemplatesMarketplacesApi.loading])

    useEffect(() => {
        if (getAllTemplatesMarketplacesApi.data) {
            try {
                const flows = getAllTemplatesMarketplacesApi.data
                const usecases = []
                const images = {}
                const icons = {}
                for (let i = 0; i < flows.length; i += 1) {
                    if (flows[i].flowData) {
                        const flowDataStr = flows[i].flowData
                        const flowData = JSON.parse(flowDataStr)
                        usecases.push(...flows[i].usecases)
                        const nodes = flowData.nodes || []
                        images[flows[i].id] = []
                        icons[flows[i].id] = []
                        for (let j = 0; j < nodes.length; j += 1) {
                            const foundIcon = AGENTFLOW_ICONS.find((icon) => icon.name === nodes[j].data.name)
                            if (foundIcon) {
                                icons[flows[i].id].push(foundIcon)
                            } else {
                                const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                                if (!images[flows[i].id].includes(imageSrc)) {
                                    images[flows[i].id].push(imageSrc)
                                }
                            }
                        }
                    }
                }
                setImages(images)
                setIcons(icons)
                setUsecases(Array.from(new Set(usecases)).sort())
                setEligibleUsecases(Array.from(new Set(usecases)).sort())
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllTemplatesMarketplacesApi.data])

    useEffect(() => {
        if (getAllTemplatesMarketplacesApi.error) {
            setError(getAllTemplatesMarketplacesApi.error)
        }
    }, [getAllTemplatesMarketplacesApi.error])

    useEffect(() => {
        setLoading(getAllCustomTemplatesApi.loading)
    }, [getAllCustomTemplatesApi.loading])

    useEffect(() => {
        if (getAllCustomTemplatesApi.data) {
            try {
                const flows = getAllCustomTemplatesApi.data
                const usecases = []
                const tImages = {}
                const tIcons = {}
                for (let i = 0; i < flows.length; i += 1) {
                    if (flows[i].flowData) {
                        const flowDataStr = flows[i].flowData
                        const flowData = JSON.parse(flowDataStr)
                        usecases.push(...flows[i].usecases)
                        if (flows[i].framework) {
                            flows[i].framework = [flows[i].framework] || []
                        }
                        const nodes = flowData.nodes || []
                        tImages[flows[i].id] = []
                        tIcons[flows[i].id] = []
                        for (let j = 0; j < nodes.length; j += 1) {
                            const foundIcon = AGENTFLOW_ICONS.find((icon) => icon.name === nodes[j].data.name)
                            if (foundIcon) {
                                tIcons[flows[i].id].push(foundIcon)
                            } else {
                                const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                                if (!tImages[flows[i].id].includes(imageSrc)) {
                                    tImages[flows[i].id].push(imageSrc)
                                }
                            }
                        }
                    }
                }
                setTemplateImages(tImages)
                setTemplateIcons(tIcons)
                setTemplateUsecases(Array.from(new Set(usecases)).sort())
                setEligibleTemplateUsecases(Array.from(new Set(usecases)).sort())
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllCustomTemplatesApi.data])

    useEffect(() => {
        if (getAllCustomTemplatesApi.error) {
            setError(getAllCustomTemplatesApi.error)
        }
    }, [getAllCustomTemplatesApi.error])

    return (
        <FuturisticContainer>
            <GlassmorphismCard>
                {error ? (
                    <ErrorBoundary error={error} />
                ) : (
                    <Stack flexDirection='column' spacing={3}>
                        {/* Hero Section */}
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                                <PulsingIcon sx={{ mr: 2 }}>
                                    <IconRocket size={48} color='#ff8f00' />
                                </PulsingIcon>
                                <NeonHeader variant='h1'>AI Marketplace</NeonHeader>
                                <PulsingIcon sx={{ ml: 2 }}>
                                    <IconSparkles size={48} color='#ffd700' />
                                </PulsingIcon>
                            </Box>
                            <Typography
                                variant='h6'
                                sx={{
                                    color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#666',
                                    fontWeight: 500,
                                    mb: 3
                                }}
                            >
                                Discover cutting-edge AI workflows and unleash your creativity
                                <IconBolt size={20} style={{ marginLeft: 8, verticalAlign: 'middle', color: '#ffd700' }} />
                            </Typography>
                        </Box>

                        <ViewHeader
                            filters={
                                <Stack direction='row' spacing={2}>
                                    <FormControl sx={{ minWidth: 120 }}>
                                        <InputLabel size='small' id='filter-badge-label' sx={{ color: '#ff8f00' }}>
                                            Tag
                                        </InputLabel>
                                        <FuturisticSelect
                                            labelId='filter-badge-label'
                                            id='filter-badge-checkbox'
                                            size='small'
                                            multiple
                                            value={badgeFilter}
                                            onChange={handleBadgeFilterChange}
                                            input={<OutlinedInput label='Tag' />}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                        >
                                            {badges.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        p: 1,
                                                        color: 'white',
                                                        '&:hover': {
                                                            background: 'rgba(255, 143, 0, 0.2)'
                                                        }
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={badgeFilter.indexOf(name) > -1}
                                                        sx={{
                                                            p: 0,
                                                            color: '#ffd700',
                                                            '&.Mui-checked': {
                                                                color: '#ffd700'
                                                            }
                                                        }}
                                                    />
                                                    <ListItemText primary={name} />
                                                </MenuItem>
                                            ))}
                                        </FuturisticSelect>
                                    </FormControl>
                                    <FormControl sx={{ minWidth: 120 }}>
                                        <InputLabel size='small' id='type-badge-label' sx={{ color: '#ff8f00' }}>
                                            Type
                                        </InputLabel>
                                        <FuturisticSelect
                                            size='small'
                                            labelId='type-badge-label'
                                            id='type-badge-checkbox'
                                            multiple
                                            value={typeFilter}
                                            onChange={handleTypeFilterChange}
                                            input={<OutlinedInput label='Type' />}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                        >
                                            {types.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        p: 1,
                                                        color: 'white',
                                                        '&:hover': {
                                                            background: 'rgba(255, 143, 0, 0.2)'
                                                        }
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={typeFilter.indexOf(name) > -1}
                                                        sx={{
                                                            p: 0,
                                                            color: '#ffd700',
                                                            '&.Mui-checked': {
                                                                color: '#ffd700'
                                                            }
                                                        }}
                                                    />
                                                    <ListItemText primary={name} />
                                                </MenuItem>
                                            ))}
                                        </FuturisticSelect>
                                    </FormControl>
                                    <FormControl sx={{ minWidth: 120 }}>
                                        <InputLabel size='small' id='type-fw-label' sx={{ color: '#ff8f00' }}>
                                            Framework
                                        </InputLabel>
                                        <FuturisticSelect
                                            size='small'
                                            labelId='type-fw-label'
                                            id='type-fw-checkbox'
                                            multiple
                                            value={frameworkFilter}
                                            onChange={handleFrameworkFilterChange}
                                            input={<OutlinedInput label='Framework' />}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                        >
                                            {framework.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        p: 1,
                                                        color: 'white',
                                                        '&:hover': {
                                                            background: 'rgba(255, 143, 0, 0.2)'
                                                        }
                                                    }}
                                                >
                                                    <Checkbox
                                                        checked={frameworkFilter.indexOf(name) > -1}
                                                        sx={{
                                                            p: 0,
                                                            color: '#ffd700',
                                                            '&.Mui-checked': {
                                                                color: '#ffd700'
                                                            }
                                                        }}
                                                    />
                                                    <ListItemText primary={name} />
                                                </MenuItem>
                                            ))}
                                        </FuturisticSelect>
                                    </FormControl>
                                </Stack>
                            }
                            onSearchChange={onSearchChange}
                            search={true}
                            searchPlaceholder='Search Name/Description/Node'
                        >
                            <ToggleButtonGroup
                                sx={{ borderRadius: '15px', height: '100%' }}
                                value={view}
                                color='primary'
                                exclusive
                                onChange={handleViewChange}
                            >
                                <AnimatedToggleButton variant='contained' value='card' title='Card View'>
                                    <IconLayoutGrid />
                                </AnimatedToggleButton>
                                <AnimatedToggleButton variant='contained' value='list' title='List View'>
                                    <IconList />
                                </AnimatedToggleButton>
                            </ToggleButtonGroup>
                        </ViewHeader>

                        <GlowingTabs value={activeTabValue} onChange={handleTabChange} textColor='primary' aria-label='tabs' centered>
                            <Tab value={0} label='Community Templates'></Tab>
                            <Tab value={1} label='My Templates' />
                        </GlowingTabs>

                        <TabPanel value={activeTabValue} index={0}>
                            <Stack direction='row' sx={{ gap: 1, my: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                                {usecases.map((usecase, index) => (
                                    <FloatingUsecaseChip
                                        key={index}
                                        size='small'
                                        disabled={eligibleUsecases.length === 0 ? true : !eligibleUsecases.includes(usecase)}
                                        control={
                                            <Checkbox
                                                disabled={eligibleUsecases.length === 0 ? true : !eligibleUsecases.includes(usecase)}
                                                color='success'
                                                checked={selectedUsecases.includes(usecase)}
                                                onChange={(event) => {
                                                    setSelectedUsecases(
                                                        event.target.checked
                                                            ? [...selectedUsecases, usecase]
                                                            : selectedUsecases.filter((item) => item !== usecase)
                                                    )
                                                }}
                                            />
                                        }
                                        label={usecase}
                                    />
                                ))}
                            </Stack>
                            {selectedUsecases.length > 0 && (
                                <FuturisticButton
                                    sx={{ width: 'max-content', mb: 3 }}
                                    variant='outlined'
                                    onClick={() => clearAllUsecases()}
                                    startIcon={<IconX />}
                                >
                                    Clear All
                                </FuturisticButton>
                            )}

                            {!view || view === 'card' ? (
                                <>
                                    {isLoading ? (
                                        <Box display='grid' gridTemplateColumns='repeat(auto-fit, minmax(300px, 1fr))' gap={3}>
                                            {[...Array(6)].map((_, index) => (
                                                <Paper
                                                    key={index}
                                                    sx={{
                                                        background:
                                                            theme.palette.mode === 'dark'
                                                                ? 'rgba(138, 1, 161, 0.1)'
                                                                : 'rgba(255, 255, 255, 0.9)',
                                                        backdropFilter: 'blur(15px)',
                                                        borderRadius: '20px',
                                                        p: 2,
                                                        height: '200px'
                                                    }}
                                                >
                                                    <Skeleton
                                                        variant='rounded'
                                                        height='100%'
                                                        animation='wave'
                                                        sx={{
                                                            borderRadius: '15px',
                                                            background:
                                                                'linear-gradient(90deg, rgba(255, 143, 0, 0.1) 0%, rgba(171, 2, 201, 0.1) 50%, rgba(255, 215, 0, 0.1) 100%)'
                                                        }}
                                                    />
                                                </Paper>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Box display='grid' gridTemplateColumns='repeat(auto-fit, minmax(300px, 1fr))' gap={3}>
                                            {getAllTemplatesMarketplacesApi.data
                                                ?.filter(filterByBadge)
                                                .filter(filterByType)
                                                .filter(filterFlows)
                                                .filter(filterByFramework)
                                                .filter(filterByUsecases)
                                                .map((data, index) => (
                                                    <Box key={index} sx={{ transition: 'all 0.3s ease' }}>
                                                        {data.badge && (
                                                            <Badge
                                                                sx={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    '& .MuiBadge-badge': {
                                                                        right: 20,
                                                                        background:
                                                                            data.badge === 'POPULAR'
                                                                                ? 'linear-gradient(45deg, #ff8f00, #ffd700)'
                                                                                : 'linear-gradient(45deg, #ab02c9, #8a01a1)',
                                                                        color: 'white',
                                                                        fontWeight: 'bold',
                                                                        fontSize: '0.75rem',
                                                                        borderRadius: '15px',
                                                                        padding: '4px 8px',
                                                                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
                                                                    }
                                                                }}
                                                                badgeContent={data.badge}
                                                            >
                                                                {(data.type === 'Chatflow' ||
                                                                    data.type === 'Agentflow' ||
                                                                    data.type === 'AgentflowV2') && (
                                                                    <ItemCard
                                                                        onClick={() => goToCanvas(data)}
                                                                        data={data}
                                                                        images={images[data.id]}
                                                                        icons={icons[data.id]}
                                                                    />
                                                                )}
                                                                {data.type === 'Tool' && (
                                                                    <ItemCard data={data} onClick={() => goToTool(data)} />
                                                                )}
                                                            </Badge>
                                                        )}
                                                        {!data.badge &&
                                                            (data.type === 'Chatflow' ||
                                                                data.type === 'Agentflow' ||
                                                                data.type === 'AgentflowV2') && (
                                                                <ItemCard
                                                                    onClick={() => goToCanvas(data)}
                                                                    data={data}
                                                                    images={images[data.id]}
                                                                    icons={icons[data.id]}
                                                                />
                                                            )}
                                                        {!data.badge && data.type === 'Tool' && (
                                                            <ItemCard data={data} onClick={() => goToTool(data)} />
                                                        )}
                                                    </Box>
                                                ))}
                                        </Box>
                                    )}
                                </>
                            ) : (
                                <MarketplaceTable
                                    data={getAllTemplatesMarketplacesApi.data}
                                    filterFunction={filterFlows}
                                    filterByType={filterByType}
                                    filterByBadge={filterByBadge}
                                    filterByFramework={filterByFramework}
                                    filterByUsecases={filterByUsecases}
                                    goToTool={goToTool}
                                    goToCanvas={goToCanvas}
                                    isLoading={isLoading}
                                    setError={setError}
                                />
                            )}

                            {!isLoading && (!getAllTemplatesMarketplacesApi.data || getAllTemplatesMarketplacesApi.data.length === 0) && (
                                <Stack sx={{ alignItems: 'center', justifyContent: 'center', py: 8 }} flexDirection='column'>
                                    <Box sx={{ p: 2, height: 'auto', opacity: 0.7 }}>
                                        <img
                                            style={{ objectFit: 'cover', height: '25vh', width: 'auto', filter: 'hue-rotate(30deg)' }}
                                            src={WorkflowEmptySVG}
                                            alt='WorkflowEmptySVG'
                                        />
                                    </Box>
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#666',
                                            fontWeight: 500
                                        }}
                                    >
                                        No Marketplace Templates Yet
                                    </Typography>
                                </Stack>
                            )}
                        </TabPanel>

                        <TabPanel value={activeTabValue} index={1}>
                            <Stack direction='row' sx={{ gap: 1, my: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                                {templateUsecases.map((usecase, index) => (
                                    <FloatingUsecaseChip
                                        key={index}
                                        size='small'
                                        disabled={
                                            eligibleTemplateUsecases.length === 0 ? true : !eligibleTemplateUsecases.includes(usecase)
                                        }
                                        control={
                                            <Checkbox
                                                disabled={
                                                    eligibleTemplateUsecases.length === 0
                                                        ? true
                                                        : !eligibleTemplateUsecases.includes(usecase)
                                                }
                                                color='success'
                                                checked={selectedTemplateUsecases.includes(usecase)}
                                                onChange={(event) => {
                                                    setSelectedTemplateUsecases(
                                                        event.target.checked
                                                            ? [...selectedTemplateUsecases, usecase]
                                                            : selectedTemplateUsecases.filter((item) => item !== usecase)
                                                    )
                                                }}
                                            />
                                        }
                                        label={usecase}
                                    />
                                ))}
                            </Stack>
                            {selectedTemplateUsecases.length > 0 && (
                                <FuturisticButton
                                    sx={{ width: 'max-content', mb: 3 }}
                                    variant='outlined'
                                    onClick={() => clearAllUsecases()}
                                    startIcon={<IconX />}
                                >
                                    Clear All
                                </FuturisticButton>
                            )}

                            {!view || view === 'card' ? (
                                <>
                                    {isLoading ? (
                                        <Box display='grid' gridTemplateColumns='repeat(auto-fit, minmax(300px, 1fr))' gap={3}>
                                            {[...Array(6)].map((_, index) => (
                                                <Paper
                                                    key={index}
                                                    sx={{
                                                        background:
                                                            theme.palette.mode === 'dark'
                                                                ? 'rgba(138, 1, 161, 0.1)'
                                                                : 'rgba(255, 255, 255, 0.9)',
                                                        backdropFilter: 'blur(15px)',
                                                        borderRadius: '20px',
                                                        p: 2,
                                                        height: '200px'
                                                    }}
                                                >
                                                    <Skeleton
                                                        variant='rounded'
                                                        height='100%'
                                                        animation='wave'
                                                        sx={{
                                                            borderRadius: '15px',
                                                            background:
                                                                'linear-gradient(90deg, rgba(255, 143, 0, 0.1) 0%, rgba(171, 2, 201, 0.1) 50%, rgba(255, 215, 0, 0.1) 100%)'
                                                        }}
                                                    />
                                                </Paper>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Box display='grid' gridTemplateColumns='repeat(auto-fit, minmax(300px, 1fr))' gap={3}>
                                            {getAllCustomTemplatesApi.data
                                                ?.filter(filterByBadge)
                                                .filter(filterByType)
                                                .filter(filterFlows)
                                                .filter(filterByFramework)
                                                .filter(filterByUsecases)
                                                .map((data, index) => (
                                                    <Box key={index} sx={{ transition: 'all 0.3s ease' }}>
                                                        {data.badge && (
                                                            <Badge
                                                                sx={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    '& .MuiBadge-badge': {
                                                                        right: 20,
                                                                        background:
                                                                            data.badge === 'POPULAR'
                                                                                ? 'linear-gradient(45deg, #ff8f00, #ffd700)'
                                                                                : 'linear-gradient(45deg, #ab02c9, #8a01a1)',
                                                                        color: 'white',
                                                                        fontWeight: 'bold',
                                                                        fontSize: '0.75rem',
                                                                        borderRadius: '15px',
                                                                        padding: '4px 8px',
                                                                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
                                                                    }
                                                                }}
                                                                badgeContent={data.badge}
                                                            >
                                                                {(data.type === 'Chatflow' ||
                                                                    data.type === 'Agentflow' ||
                                                                    data.type === 'AgentflowV2') && (
                                                                    <ItemCard
                                                                        onClick={() => goToCanvas(data)}
                                                                        data={data}
                                                                        images={templateImages[data.id]}
                                                                        icons={templateIcons[data.id]}
                                                                    />
                                                                )}
                                                                {data.type === 'Tool' && (
                                                                    <ItemCard data={data} onClick={() => goToTool(data)} />
                                                                )}
                                                            </Badge>
                                                        )}
                                                        {!data.badge &&
                                                            (data.type === 'Chatflow' ||
                                                                data.type === 'Agentflow' ||
                                                                data.type === 'AgentflowV2') && (
                                                                <ItemCard
                                                                    onClick={() => goToCanvas(data)}
                                                                    data={data}
                                                                    images={templateImages[data.id]}
                                                                    icons={templateIcons[data.id]}
                                                                />
                                                            )}
                                                        {!data.badge && data.type === 'Tool' && (
                                                            <ItemCard data={data} onClick={() => goToTool(data)} />
                                                        )}
                                                    </Box>
                                                ))}
                                        </Box>
                                    )}
                                </>
                            ) : (
                                <MarketplaceTable
                                    data={getAllCustomTemplatesApi.data}
                                    filterFunction={filterFlows}
                                    filterByType={filterByType}
                                    filterByBadge={filterByBadge}
                                    filterByFramework={filterByFramework}
                                    filterByUsecases={filterByUsecases}
                                    goToTool={goToTool}
                                    goToCanvas={goToCanvas}
                                    isLoading={isLoading}
                                    setError={setError}
                                    onDelete={onDeleteCustomTemplate}
                                />
                            )}
                            {!isLoading && (!getAllCustomTemplatesApi.data || getAllCustomTemplatesApi.data.length === 0) && (
                                <Stack sx={{ alignItems: 'center', justifyContent: 'center', py: 8 }} flexDirection='column'>
                                    <Box sx={{ p: 2, height: 'auto', opacity: 0.7 }}>
                                        <img
                                            style={{ objectFit: 'cover', height: '25vh', width: 'auto', filter: 'hue-rotate(30deg)' }}
                                            src={WorkflowEmptySVG}
                                            alt='WorkflowEmptySVG'
                                        />
                                    </Box>
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#666',
                                            fontWeight: 500
                                        }}
                                    >
                                        No Saved Custom Templates
                                    </Typography>
                                </Stack>
                            )}
                        </TabPanel>
                    </Stack>
                )}
            </GlassmorphismCard>
            <ToolDialog
                show={showToolDialog}
                dialogProps={toolDialogProps}
                onCancel={() => setShowToolDialog(false)}
                onConfirm={() => setShowToolDialog(false)}
                onUseTemplate={(tool) => onUseTemplate(tool)}
            ></ToolDialog>
            <ConfirmDialog />
        </FuturisticContainer>
    )
}

export default Marketplace
