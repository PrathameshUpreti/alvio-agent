import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// material-ui
import { Box, Stack, Button, Skeleton } from '@mui/material'
import { useTheme, styled } from '@mui/material/styles'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import ItemCard from '@/ui-component/cards/ItemCard'
import { StyledButton } from '@/ui-component/button/StyledButton'
import AssistantDialog from './AssistantDialog'
import LoadAssistantDialog from './LoadAssistantDialog'
import ErrorBoundary from '@/ErrorBoundary'

// API
import assistantsApi from '@/api/assistants'

// Hooks
import useApi from '@/hooks/useApi'

// icons
import { IconPlus, IconFileUpload } from '@tabler/icons-react'
import AgentsEmptySVG from '@/assets/images/agents_empty.svg'
import { gridSpacing } from '@/store/constant'

// Styled components for new UI (copied from AgentFlow)
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

const VerticalToolbar = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    width: '100%',
    marginTop: theme.spacing(4),
    alignItems: 'stretch'
}))

const PillInput = styled('input')(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? '#232627' : '#f5f5f7',
    borderRadius: 20,
    padding: '8px 18px',
    fontSize: 16,
    minWidth: 180,
    boxShadow: 'none',
    border: `1.5px solid ${theme.palette.divider}`,
    outline: 'none',
    marginBottom: theme.spacing(1)
}))

// ==============================|| OpenAIAssistantLayout ||============================== //

const OpenAIAssistantLayout = () => {
    const navigate = useNavigate()
    const theme = useTheme()

    const getAllAssistantsApi = useApi(assistantsApi.getAllAssistants)

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [showLoadDialog, setShowLoadDialog] = useState(false)
    const [loadDialogProps, setLoadDialogProps] = useState({})

    const loadExisting = () => {
        const dialogProp = {
            title: 'Load Existing Assistant'
        }
        setLoadDialogProps(dialogProp)
        setShowLoadDialog(true)
    }

    const [search, setSearch] = useState('')
    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }

    const onAssistantSelected = (selectedOpenAIAssistantId, credential) => {
        setShowLoadDialog(false)
        addNew(selectedOpenAIAssistantId, credential)
    }

    const addNew = (selectedOpenAIAssistantId, credential) => {
        const dialogProp = {
            title: 'Add New Assistant',
            type: 'ADD',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Add',
            selectedOpenAIAssistantId,
            credential
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const edit = (selectedAssistant) => {
        const dialogProp = {
            title: 'Edit Assistant',
            type: 'EDIT',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Save',
            data: selectedAssistant
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const onConfirm = () => {
        setShowDialog(false)
        getAllAssistantsApi.request('OPENAI')
    }

    function filterAssistants(data) {
        const parsedData = JSON.parse(data.details)
        return parsedData && parsedData.name && parsedData.name.toLowerCase().indexOf(search.toLowerCase()) > -1
    }

    useEffect(() => {
        getAllAssistantsApi.request('OPENAI')

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllAssistantsApi.loading)
    }, [getAllAssistantsApi.loading])

    useEffect(() => {
        if (getAllAssistantsApi.error) {
            setError(getAllAssistantsApi.error)
        }
    }, [getAllAssistantsApi.error])

    return (
        <SplitLayout>
            {/* Left Panel: Search + Actions */}
            <LeftPanel>
                <Stack direction='column' sx={{ width: '100%' }}>
                    <Button variant='text' onClick={() => navigate(-1)} sx={{ mb: 2, alignSelf: 'flex-start', minWidth: 0, p: 0 }}>
                        <span style={{ fontSize: 24, marginRight: 8 }}>&larr;</span>
                    </Button>
                    <Box sx={{ mb: 2 }}>
                        <div style={{ fontWeight: 900, fontSize: 28, letterSpacing: '-2px', color: theme.palette.primary.main }}>
                            OpenAI Assistant
                        </div>
                        <div style={{ color: theme.palette.text.secondary, fontWeight: 500, fontSize: 16 }}>
                            Create assistants using OpenAI Assistant API
                        </div>
                    </Box>
                    <VerticalToolbar>
                        <PillInput placeholder='Search Assistants' value={search} onChange={onSearchChange} />
                        <Button
                            variant='outlined'
                            onClick={loadExisting}
                            startIcon={<IconFileUpload />}
                            sx={{ borderRadius: 2, height: 40 }}
                        >
                            Load
                        </Button>
                        <StyledButton variant='contained' sx={{ borderRadius: 2, height: 40 }} onClick={addNew} startIcon={<IconPlus />}>
                            Add
                        </StyledButton>
                    </VerticalToolbar>
                </Stack>
            </LeftPanel>
            {/* Right Panel: Assistants Grid or Empty State */}
            <RightPanel>
                <MainCard sx={{ boxShadow: 'none', background: 'none', p: 0 }}>
                    {error ? (
                        <ErrorBoundary error={error} />
                    ) : isLoading ? (
                        <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                            <Skeleton variant='rounded' height={160} />
                            <Skeleton variant='rounded' height={160} />
                            <Skeleton variant='rounded' height={160} />
                        </Box>
                    ) : (
                        <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                            {getAllAssistantsApi.data &&
                                getAllAssistantsApi.data?.filter(filterAssistants).map((data, index) => (
                                    <ItemCard
                                        data={{
                                            name: JSON.parse(data.details)?.name,
                                            description: JSON.parse(data.details)?.instructions,
                                            iconSrc: data.iconSrc
                                        }}
                                        key={index}
                                        onClick={() => edit(data)}
                                    />
                                ))}
                        </Box>
                    )}
                    {!isLoading && (!getAllAssistantsApi.data || getAllAssistantsApi.data.length === 0) && (
                        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                            <Box sx={{ p: 2, height: 'auto' }}>
                                <img
                                    style={{ objectFit: 'cover', height: '22vh', width: 'auto', marginBottom: 16 }}
                                    src={AgentsEmptySVG}
                                    alt='No Assistants'
                                />
                            </Box>
                            <div style={{ color: '#888', fontSize: 20, fontWeight: 500, textAlign: 'center' }}>
                                No OpenAI Assistants Yet
                                <br />
                                <span style={{ fontSize: 16, color: '#aaa', fontWeight: 400 }}>
                                    Click <b>Add</b> to create your first assistant!
                                </span>
                            </div>
                        </Stack>
                    )}
                </MainCard>
            </RightPanel>
            <LoadAssistantDialog
                show={showLoadDialog}
                dialogProps={loadDialogProps}
                onCancel={() => setShowLoadDialog(false)}
                onAssistantSelected={onAssistantSelected}
                setError={setError}
            ></LoadAssistantDialog>
            <AssistantDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={() => setShowDialog(false)}
                onConfirm={onConfirm}
                setError={setError}
            ></AssistantDialog>
        </SplitLayout>
    )
}

export default OpenAIAssistantLayout
