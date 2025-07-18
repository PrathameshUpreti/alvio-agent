import { useEffect, useState, useRef } from 'react'

// material-ui
import { Box, Button, Skeleton, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

// project imports
import ItemCard from '@/ui-component/cards/ItemCard'
import { StyledButton } from '@/ui-component/button/StyledButton'
import ToolDialog from './ToolDialog'
import { ToolsTable } from '@/ui-component/table/ToolsListTable'
import { OutlinedInput } from '@mui/material'

// API
import toolsApi from '@/api/tools'

// Hooks
import useApi from '@/hooks/useApi'

// icons
import { IconPlus, IconFileUpload, IconLayoutGrid, IconList } from '@tabler/icons-react'
import ErrorBoundary from '@/ErrorBoundary'
import { useTheme } from '@mui/material/styles'

// ==============================|| CHATFLOWS ||============================== //

// Add split layout styled components
const SplitLayout = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    minHeight: 'calc(100vh - 56px)',
    marginTop: 0,
    background: theme.palette.background.default,
    borderRadius: '8px',
    boxShadow: 'none',
    overflow: 'visible'
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

const Tools = () => {
    const theme = useTheme()
    const getAllToolsApi = useApi(toolsApi.getAllTools)

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [view, setView] = useState(localStorage.getItem('toolsDisplayStyle') || 'card')

    const inputRef = useRef(null)

    const handleChange = (event, nextView) => {
        if (nextView === null) return
        localStorage.setItem('toolsDisplayStyle', nextView)
        setView(nextView)
    }

    const onUploadFile = (file) => {
        try {
            const dialogProp = {
                title: 'Add New Tool',
                type: 'IMPORT',
                cancelButtonName: 'Cancel',
                confirmButtonName: 'Save',
                data: JSON.parse(file)
            }
            setDialogProps(dialogProp)
            setShowDialog(true)
        } catch (e) {
            console.error(e)
        }
    }

    const handleFileUpload = (e) => {
        if (!e.target.files) return

        const file = e.target.files[0]

        const reader = new FileReader()
        reader.onload = (evt) => {
            if (!evt?.target?.result) {
                return
            }
            const { result } = evt.target
            onUploadFile(result)
        }
        reader.readAsText(file)
    }

    const addNew = () => {
        const dialogProp = {
            title: 'Add New Tool',
            type: 'ADD',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Add'
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const edit = (selectedTool) => {
        const dialogProp = {
            title: 'Edit Tool',
            type: 'EDIT',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Save',
            data: selectedTool
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const onConfirm = () => {
        setShowDialog(false)
        getAllToolsApi.request()
    }

    const [search, setSearch] = useState('')
    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }

    function filterTools(data) {
        return (
            data.name.toLowerCase().indexOf(search.toLowerCase()) > -1 || data.description.toLowerCase().indexOf(search.toLowerCase()) > -1
        )
    }

    useEffect(() => {
        getAllToolsApi.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllToolsApi.loading)
    }, [getAllToolsApi.loading])

    useEffect(() => {
        if (getAllToolsApi.error) {
            setError(getAllToolsApi.error)
        }
    }, [getAllToolsApi.error])

    return (
        <SplitLayout>
            {/* Left Panel: Header + Actions */}
            <LeftPanel>
                <Box>
                    <Box>
                        <Box sx={{ fontWeight: 900, fontSize: '2rem', color: 'primary.main', mb: 0.5 }}>Tools</Box>
                        <Box sx={{ color: 'text.secondary', fontWeight: 500, mb: 2 }}>
                            External functions or APIs the agent can use to take action
                        </Box>
                    </Box>
                    <Box sx={{ mt: 2, mb: 2, width: '100%' }}>
                        <StyledButton
                            variant='contained'
                            onClick={addNew}
                            startIcon={<IconPlus />}
                            sx={{ borderRadius: 2, height: 40, mr: 1 }}
                        >
                            Add New
                        </StyledButton>
                        <Button
                            variant='outlined'
                            onClick={() => inputRef.current.click()}
                            startIcon={<IconFileUpload />}
                            sx={{ borderRadius: 2, height: 40 }}
                        >
                            Load
                        </Button>
                        <input
                            style={{ display: 'none' }}
                            ref={inputRef}
                            type='file'
                            hidden
                            accept='.json'
                            onChange={(e) => handleFileUpload(e)}
                        />
                    </Box>
                </Box>
                <Box sx={{ mt: 2, width: '100%' }}>
                    <OutlinedInput
                        fullWidth
                        size='small'
                        placeholder='Search Tools'
                        value={search}
                        onChange={onSearchChange}
                        sx={{ borderRadius: 8, background: theme.palette.background.default, fontSize: 16 }}
                    />
                </Box>
                <ToggleButtonGroup
                    orientation='vertical'
                    sx={{ borderRadius: '20px', width: '100%', mt: 2 }}
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
            </LeftPanel>
            {/* Right Panel: Content */}
            <RightPanel>
                {error ? (
                    <ErrorBoundary error={error} />
                ) : !view || view === 'card' ? (
                    <>
                        {isLoading ? (
                            <Box display='grid' gridTemplateColumns='repeat(auto-fit, minmax(320px, 1fr))' gap={4}>
                                <Skeleton variant='rounded' height={180} />
                                <Skeleton variant='rounded' height={180} />
                                <Skeleton variant='rounded' height={180} />
                            </Box>
                        ) : getAllToolsApi.data?.filter(filterTools).length === 0 ? (
                            <EngagingEmptyState>
                                <PulseEmoji>🛠️</PulseEmoji>
                                <Typography variant='h5' sx={{ fontWeight: 700, mb: 1, mt: 2 }}>
                                    You are just one click away from adding your first tool!
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'text.secondary', mb: 3 }}>
                                    Tools let your agents interact with external APIs and services. Add one now!
                                </Typography>
                                <StyledButton
                                    variant='contained'
                                    onClick={addNew}
                                    startIcon={<IconPlus />}
                                    sx={{ borderRadius: 2, height: 44, fontWeight: 700 }}
                                >
                                    Add Tool
                                </StyledButton>
                            </EngagingEmptyState>
                        ) : (
                            <Box display='grid' gridTemplateColumns='repeat(auto-fit, minmax(320px, 1fr))' gap={4}>
                                {getAllToolsApi.data?.filter(filterTools).map((data, index) => (
                                    <ItemCard key={index} onClick={() => edit(data)} data={data} />
                                ))}
                            </Box>
                        )}
                    </>
                ) : (
                    <ToolsTable data={getAllToolsApi.data} isLoading={isLoading} filterFunction={filterTools} edit={edit} />
                )}
            </RightPanel>
            <ToolDialog show={showDialog} dialogProps={dialogProps} onConfirm={onConfirm} onCancel={() => setShowDialog(false)} />
        </SplitLayout>
    )
}

export default Tools
