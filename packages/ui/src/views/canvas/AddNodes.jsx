import { useState, useRef, useEffect, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

// material-ui
import { useTheme } from '@mui/material/styles'
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    ClickAwayListener,
    Divider,
    InputAdornment,
    OutlinedInput,
    Popper,
    Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { styled } from '@mui/material/styles'
import Fade from '@mui/material/Fade'

// third-party

// project imports
import { StyledFab } from '@/ui-component/button/StyledFab'
import AgentflowGeneratorDialog from '@/ui-component/dialog/AgentflowGeneratorDialog'

// icons
import { IconPlus, IconSearch, IconMinus, IconX, IconSparkles } from '@tabler/icons-react'
import LlamaindexPNG from '@/assets/images/llamaindex.png'
import LangChainPNG from '@/assets/images/langchain.png'
import utilNodesPNG from '@/assets/images/utilNodes.png'

// const
import { AGENTFLOW_ICONS } from '@/store/constant'
import { SET_COMPONENT_NODES } from '@/store/actions'

// Remove GlassPanel, GlassAccordion, GlassAccordionSummary, GlassListItemButton, GlassAvatar, GlassSearch, GlassTabs styles and replace with new styles for a clean dark mode look

const PanelBox = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: 16,
    padding: '24px 20px',
    color: theme.palette.mode === 'dark' ? '#fff' : '#23272f',
    width: 350,
    boxShadow: theme.palette.mode === 'dark' ? '0 4px 32px rgba(0,0,0,0.25)' : '0 4px 32px rgba(141,54,249,0.10)'
}))

const SearchBar = styled(OutlinedInput)(({ theme }) => ({
    borderRadius: 10,
    background: theme.palette.mode === 'dark' ? '#181b20' : '#fff',
    color: theme.palette.mode === 'dark' ? '#fff' : '#23272f',
    border: `1.5px solid ${theme.palette.primary.main}`,
    fontWeight: 500,
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom: 18,
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '& input': {
        color: theme.palette.mode === 'dark' ? '#fff' : '#23272f',
        '::placeholder': { color: theme.palette.mode === 'dark' ? '#b0b3b8' : '#888' }
    }
}))

const SectionHeader = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '1.1rem',
    color: theme.palette.mode === 'dark' ? '#f3f4f6' : '#23272f',
    marginBottom: 8,
    marginTop: 18
}))

const DividerLine = styled(Divider)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#35373b' : '#e0e0e0'}`,
    margin: '16px 0'
}))

const NodeListItem = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    padding: '14px 0',
    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#35373b' : '#e0e0e0'}`,
    cursor: 'pointer',
    transition: 'background 0.15s',
    '&:last-child': { borderBottom: 'none' },
    '&:hover': {
        background: theme.palette.mode === 'dark' ? '#262a31' : '#f0f0f0'
    }
}))

const NodeIcon = styled('span')(({ theme }) => ({
    fontSize: '1.7rem',
    marginTop: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}))

const NodeTitle = styled('div')(({ theme }) => ({
    fontWeight: 600,
    color: theme.palette.mode === 'dark' ? '#fff' : '#23272f',
    fontSize: '1rem'
}))

const NodeDesc = styled('div')(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#b0b3b8' : '#555',
    fontSize: '0.95rem',
    marginTop: 2
}))

// ==============================|| ADD NODES||============================== //
function a11yProps(index) {
    return {
        id: `attachment-tab-${index}`,
        'aria-controls': `attachment-tabpanel-${index}`
    }
}

const blacklistCategoriesForAgentCanvas = ['Agents', 'Memory', 'Record Manager', 'Utilities']

const agentMemoryNodes = ['agentMemory', 'sqliteAgentMemory', 'postgresAgentMemory', 'mySQLAgentMemory']

// Show blacklisted nodes (exceptions) for agent canvas
const exceptionsForAgentCanvas = {
    Memory: agentMemoryNodes,
    Utilities: ['getVariable', 'setVariable', 'stickyNote']
}

// Hide some nodes from the chatflow canvas
const blacklistForChatflowCanvas = {
    Memory: agentMemoryNodes
}

const AddNodes = ({ nodesData, node, isAgentCanvas, isAgentflowv2, onFlowGenerated }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const dispatch = useDispatch()

    const [searchValue, setSearchValue] = useState('')
    const [nodes, setNodes] = useState({})
    const [open, setOpen] = useState(false)
    const [categoryExpanded, setCategoryExpanded] = useState({})
    const [tabValue, setTabValue] = useState(0)

    const [openDialog, setOpenDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})

    const isAgentCanvasV2 = window.location.pathname.includes('/v2/agentcanvas')

    const anchorRef = useRef(null)
    const prevOpen = useRef(open)
    const ps = useRef()

    const scrollTop = () => {
        const curr = ps.current
        if (curr) {
            curr.scrollTop = 0
        }
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
        filterSearch(searchValue, newValue)
    }

    const addException = (category) => {
        let nodes = []
        if (category) {
            const nodeNames = exceptionsForAgentCanvas[category] || []
            nodes = nodesData.filter((nd) => nd.category === category && nodeNames.includes(nd.name))
        } else {
            for (const category in exceptionsForAgentCanvas) {
                const nodeNames = exceptionsForAgentCanvas[category]
                nodes.push(...nodesData.filter((nd) => nd.category === category && nodeNames.includes(nd.name)))
            }
        }
        return nodes
    }

    const getSearchedNodes = (value) => {
        if (isAgentCanvas) {
            const nodes = nodesData.filter((nd) => !blacklistCategoriesForAgentCanvas.includes(nd.category))
            nodes.push(...addException())
            const passed = nodes.filter((nd) => {
                const passesName = nd.name.toLowerCase().includes(value.toLowerCase())
                const passesLabel = nd.label.toLowerCase().includes(value.toLowerCase())
                const passesCategory = nd.category.toLowerCase().includes(value.toLowerCase())
                return passesName || passesCategory || passesLabel
            })
            return passed
        }
        let nodes = nodesData.filter((nd) => nd.category !== 'Multi Agents' && nd.category !== 'Sequential Agents')

        for (const category in blacklistForChatflowCanvas) {
            const nodeNames = blacklistForChatflowCanvas[category]
            nodes = nodes.filter((nd) => !nodeNames.includes(nd.name))
        }

        const passed = nodes.filter((nd) => {
            const passesName = nd.name.toLowerCase().includes(value.toLowerCase())
            const passesLabel = nd.label.toLowerCase().includes(value.toLowerCase())
            const passesCategory = nd.category.toLowerCase().includes(value.toLowerCase())
            return passesName || passesCategory || passesLabel
        })
        return passed
    }

    const filterSearch = (value, newTabValue) => {
        setSearchValue(value)
        setTimeout(() => {
            if (value) {
                const returnData = getSearchedNodes(value)
                groupByCategory(returnData, newTabValue ?? tabValue, true)
                scrollTop()
            } else if (value === '') {
                groupByCategory(nodesData, newTabValue ?? tabValue)
                scrollTop()
            }
        }, 500)
    }

    const groupByTags = (nodes, newTabValue = 0) => {
        const langchainNodes = nodes.filter((nd) => !nd.tags)
        const llmaindexNodes = nodes.filter((nd) => nd.tags && nd.tags.includes('LlamaIndex'))
        const utilitiesNodes = nodes.filter((nd) => nd.tags && nd.tags.includes('Utilities'))
        if (newTabValue === 0) {
            return langchainNodes
        } else if (newTabValue === 1) {
            return llmaindexNodes
        } else {
            return utilitiesNodes
        }
    }

    const groupByCategory = (nodes, newTabValue, isFilter) => {
        if (isAgentCanvas) {
            const accordianCategories = {}
            const result = nodes.reduce(function (r, a) {
                r[a.category] = r[a.category] || []
                r[a.category].push(a)
                accordianCategories[a.category] = isFilter ? true : false
                return r
            }, Object.create(null))

            const filteredResult = {}
            for (const category in result) {
                if (isAgentCanvasV2) {
                    if (category !== 'Agent Flows') {
                        continue
                    }
                } else {
                    if (category === 'Agent Flows') {
                        continue
                    }
                }
                // Filter out blacklisted categories
                if (!blacklistCategoriesForAgentCanvas.includes(category)) {
                    // Filter out LlamaIndex nodes
                    const nodes = result[category].filter((nd) => !nd.tags || !nd.tags.includes('LlamaIndex'))
                    if (!nodes.length) continue

                    filteredResult[category] = nodes
                }

                // Allow exceptionsForAgentCanvas
                if (Object.keys(exceptionsForAgentCanvas).includes(category)) {
                    filteredResult[category] = addException(category)
                }
            }
            setNodes(filteredResult)
            accordianCategories['Multi Agents'] = true
            accordianCategories['Sequential Agents'] = true
            accordianCategories['Memory'] = true
            accordianCategories['Agent Flows'] = true
            setCategoryExpanded(accordianCategories)
        } else {
            const taggedNodes = groupByTags(nodes, newTabValue)
            const accordianCategories = {}
            const result = taggedNodes.reduce(function (r, a) {
                r[a.category] = r[a.category] || []
                r[a.category].push(a)
                accordianCategories[a.category] = isFilter ? true : false
                return r
            }, Object.create(null))

            const filteredResult = {}
            for (const category in result) {
                if (category === 'Agent Flows' || category === 'Multi Agents' || category === 'Sequential Agents') {
                    continue
                }
                if (Object.keys(blacklistForChatflowCanvas).includes(category)) {
                    const nodes = blacklistForChatflowCanvas[category]
                    result[category] = result[category].filter((nd) => !nodes.includes(nd.name))
                }
                filteredResult[category] = result[category]
            }

            setNodes(filteredResult)
            setCategoryExpanded(accordianCategories)
        }
    }

    const handleAccordionChange = (category) => (event, isExpanded) => {
        const accordianCategories = { ...categoryExpanded }
        accordianCategories[category] = isExpanded
        setCategoryExpanded(accordianCategories)
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }
        setOpen(false)
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }

    const onDragStart = (event, node) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(node))
        event.dataTransfer.effectAllowed = 'move'
    }

    const getImage = (tabValue) => {
        if (tabValue === 0) {
            return LangChainPNG
        } else if (tabValue === 1) {
            return LlamaindexPNG
        } else {
            return utilNodesPNG
        }
    }

    const renderIcon = (node) => {
        const foundIcon = AGENTFLOW_ICONS.find((icon) => icon.name === node.name)

        if (!foundIcon) return null
        return <foundIcon.icon size={30} color={node.color} />
    }

    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus()
        }

        prevOpen.current = open
    }, [open])

    useEffect(() => {
        if (node) setOpen(false)
    }, [node])

    useEffect(() => {
        if (nodesData) {
            groupByCategory(nodesData)
            dispatch({ type: SET_COMPONENT_NODES, componentNodes: nodesData })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodesData, dispatch])

    // Handle dialog open/close
    const handleOpenDialog = () => {
        setOpenDialog(true)
        setDialogProps({
            title: 'What would you like to build?',
            description:
                'Enter your prompt to generate an agentflow. Performance may vary with different models. Only nodes and edges are generated, you will need to fill in the input fields for each node.'
        })
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    const handleConfirmDialog = () => {
        setOpenDialog(false)
        onFlowGenerated()
    }

    return (
        <>
            <StyledFab
                sx={{ left: 20, top: 20 }}
                ref={anchorRef}
                size='small'
                color='primary'
                aria-label='add'
                title='Add Node'
                onClick={handleToggle}
            >
                {open ? <IconMinus /> : <IconPlus />}
            </StyledFab>
            {isAgentflowv2 && (
                <StyledFab
                    sx={{
                        left: 40,
                        top: 20,
                        background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)'
                        }
                    }}
                    onClick={handleOpenDialog}
                    size='small'
                    color='primary'
                    aria-label='generate'
                    title='Generate Agentflow'
                >
                    <IconSparkles />
                </StyledFab>
            )}

            <AgentflowGeneratorDialog
                show={openDialog}
                dialogProps={dialogProps}
                onCancel={handleCloseDialog}
                onConfirm={handleConfirmDialog}
            />

            <Popper
                placement='bottom-end'
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [-40, 14]
                            }
                        }
                    ]
                }}
                sx={{ zIndex: 1000 }}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={220}>
                        <PanelBox>
                            <ClickAwayListener onClickAway={handleClose}>
                                <Box>
                                    <Typography variant='h5' sx={{ fontWeight: 800, mb: 2 }}>
                                        Add Nodes
                                    </Typography>
                                    <SearchBar
                                        fullWidth
                                        id='input-search-node'
                                        value={searchValue}
                                        onChange={(e) => filterSearch(e.target.value)}
                                        placeholder='Search nodes'
                                        startAdornment={
                                            <InputAdornment position='start'>
                                                <IconSearch stroke={1.5} size='1rem' color={theme.palette.grey[500]} />
                                            </InputAdornment>
                                        }
                                        endAdornment={
                                            <InputAdornment
                                                position='end'
                                                sx={{
                                                    cursor: 'pointer',
                                                    color: theme.palette.grey[500],
                                                    '&:hover': { color: theme.palette.grey[900] }
                                                }}
                                                title='Clear Search'
                                            >
                                                <IconX
                                                    stroke={1.5}
                                                    size='1rem'
                                                    onClick={() => filterSearch('')}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </InputAdornment>
                                        }
                                        aria-describedby='search-helper-text'
                                        inputProps={{ 'aria-label': 'search nodes' }}
                                    />
                                    <DividerLine />
                                    <Box sx={{ maxHeight: '55vh', overflowY: 'auto', pr: 1 }}>
                                        {Object.keys(nodes)
                                            .sort()
                                            .map((category) => (
                                                <Accordion
                                                    key={category}
                                                    expanded={!!categoryExpanded[category]}
                                                    onChange={handleAccordionChange(category)}
                                                    sx={{
                                                        background: (theme) => theme.palette.background.paper,
                                                        borderRadius: 2,
                                                        boxShadow: 'none',
                                                        mb: 1,
                                                        '&:before': { display: 'none' },
                                                        border: `1px solid ${(theme) => theme.palette.divider}`
                                                    }}
                                                >
                                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                        <SectionHeader>{category}</SectionHeader>
                                                    </AccordionSummary>
                                                    <AccordionDetails sx={{ p: 0 }}>
                                                        {nodes[category].map((node) => (
                                                            <NodeListItem
                                                                key={node.name}
                                                                onDragStart={(event) => onDragStart(event, node)}
                                                                draggable
                                                            >
                                                                <NodeIcon style={{ color: node.color }}>{renderIcon(node)}</NodeIcon>
                                                                <div>
                                                                    <NodeTitle>{node.label}</NodeTitle>
                                                                    <NodeDesc>{node.description}</NodeDesc>
                                                                </div>
                                                            </NodeListItem>
                                                        ))}
                                                    </AccordionDetails>
                                                </Accordion>
                                            ))}
                                    </Box>
                                </Box>
                            </ClickAwayListener>
                        </PanelBox>
                    </Fade>
                )}
            </Popper>
        </>
    )
}

AddNodes.propTypes = {
    nodesData: PropTypes.array,
    node: PropTypes.object,
    onFlowGenerated: PropTypes.func,
    isAgentCanvas: PropTypes.bool,
    isAgentflowv2: PropTypes.bool
}

export default memo(AddNodes)
