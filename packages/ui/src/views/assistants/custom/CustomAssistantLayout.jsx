import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// material-ui
import { Box, Stack, Skeleton } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'

// project imports
import ViewHeader from '@/layout/MainLayout/ViewHeader'
import MainCard from '@/ui-component/cards/MainCard'
import ItemCard from '@/ui-component/cards/ItemCard'
import { baseURL, gridSpacing } from '@/store/constant'
import AssistantEmptySVG from '@/assets/images/assistant_empty.svg'
import { StyledButton } from '@/ui-component/button/StyledButton'
import AddCustomAssistantDialog from './AddCustomAssistantDialog'
import ErrorBoundary from '@/ErrorBoundary'

// API
import assistantsApi from '@/api/assistants'

// Hooks
import useApi from '@/hooks/useApi'

// icons
import { IconPlus } from '@tabler/icons-react'

// Glassy MainCard and ItemCard wrappers
const GlassMainCard = styled(MainCard)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? 'rgba(30,32,36,0.92)' : 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(16px)',
    borderRadius: 18,
    boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.45)' : '0 8px 32px rgba(141,54,249,0.10)',
    border: `1.5px solid ${theme.palette.mode === 'dark' ? '#35373b' : '#e0e0e0'}`
}))
const GlassEmptyBox = styled(Box)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? '#23272f' : '#f8fafc',
    borderRadius: 16,
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.mode === 'dark' ? '#fff' : '#23272f',
    marginTop: theme.spacing(2)
}))

// ==============================|| CustomAssistantLayout ||============================== //

const CustomAssistantLayout = () => {
    const navigate = useNavigate()

    const getAllAssistantsApi = useApi(assistantsApi.getAllAssistants)

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})

    const [search, setSearch] = useState('')
    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }

    const addNew = () => {
        const dialogProp = {
            title: 'Add New Custom Assistant',
            type: 'ADD',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Add'
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const onConfirm = (assistantId) => {
        setShowDialog(false)
        navigate(`/assistants/custom/${assistantId}`)
    }

    function filterAssistants(data) {
        const parsedData = JSON.parse(data.details)
        return parsedData && parsedData.name && parsedData.name.toLowerCase().indexOf(search.toLowerCase()) > -1
    }

    const getImages = (details) => {
        const images = []
        if (details && details.chatModel && details.chatModel.name) {
            images.push(`${baseURL}/api/v1/node-icon/${details.chatModel.name}`)
        }
        return images
    }

    useEffect(() => {
        getAllAssistantsApi.request('CUSTOM')

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

    const theme = useTheme()

    return (
        <>
            <GlassMainCard>
                {error ? (
                    <ErrorBoundary error={error} />
                ) : (
                    <Stack flexDirection='column' sx={{ gap: 3 }}>
                        <ViewHeader
                            isBackButton={true}
                            onSearchChange={onSearchChange}
                            search={true}
                            searchPlaceholder='Search Assistants'
                            title='Custom Assistant'
                            description='Create custom assistants with your choice of LLMs'
                            onBack={() => navigate(-1)}
                        >
                            <StyledButton
                                variant='contained'
                                sx={{ borderRadius: 2, height: 40, fontWeight: 700, fontSize: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
                                onClick={addNew}
                                startIcon={<IconPlus />}
                            >
                                Add
                            </StyledButton>
                        </ViewHeader>
                        {isLoading ? (
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
                                                description: JSON.parse(data.details)?.instruction
                                            }}
                                            images={getImages(JSON.parse(data.details))}
                                            key={index}
                                            onClick={() => navigate('/assistants/custom/' + data.id)}
                                            sx={{
                                                background: theme.palette.mode === 'dark' ? 'rgba(40,42,50,0.95)' : '#fff',
                                                borderRadius: 14,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                                                color: theme.palette.mode === 'dark' ? '#fff' : '#23272f',
                                                '&:hover': {
                                                    boxShadow: '0 4px 16px rgba(141,54,249,0.18)',
                                                    transform: 'scale(1.025)'
                                                }
                                            }}
                                        />
                                    ))}
                            </Box>
                        )}
                        {!isLoading && (!getAllAssistantsApi.data || getAllAssistantsApi.data.length === 0) && (
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                                <GlassEmptyBox>
                                    <Box sx={{ p: 2, height: 'auto' }}>
                                        <img
                                            style={{ objectFit: 'cover', height: '20vh', width: 'auto' }}
                                            src={AssistantEmptySVG}
                                            alt='AssistantEmptySVG'
                                        />
                                    </Box>
                                    <div>No Custom Assistants Added Yet</div>
                                </GlassEmptyBox>
                            </Stack>
                        )}
                    </Stack>
                )}
            </GlassMainCard>
            <AddCustomAssistantDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={() => setShowDialog(false)}
                onConfirm={onConfirm}
                setError={setError}
            ></AddCustomAssistantDialog>
        </>
    )
}

export default CustomAssistantLayout
