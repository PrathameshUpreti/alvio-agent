import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// material-ui
import {
    Box,
    Paper,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { keyframes, styled } from '@mui/material/styles'

// project imports
import DocumentStoreCard from '@/ui-component/cards/DocumentStoreCard'
import { StyledButton } from '@/ui-component/button/StyledButton'
import AddDocStoreDialog from '@/views/docstore/AddDocStoreDialog'
import ErrorBoundary from '@/ErrorBoundary'
import DocumentStoreStatus from '@/views/docstore/DocumentStoreStatus'

// API
import useApi from '@/hooks/useApi'
import documentsApi from '@/api/documentstore'

// icons
import { IconPlus, IconLayoutGrid, IconList } from '@tabler/icons-react'

// const
import { baseURL, gridSpacing } from '@/store/constant'

// Pulsing animation for emoji
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.12); }
  100% { transform: scale(1); }
`

const EmptyStateEmoji = styled('div')(({ theme }) => ({
    fontSize: '4rem',
    animation: `${pulse} 1.2s infinite`,
    marginBottom: theme.spacing(1)
}))

const ControlsPaper = styled(Paper)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(2),
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
    flexWrap: 'wrap'
}))

// Add styled components from Agentflows
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

const AnimatedFab = styled('button')(({ theme }) => ({
    position: 'fixed',
    bottom: 40,
    right: 40,
    zIndex: 1200,
    background: theme.palette.primary.main,
    color: '#fff',
    fontWeight: 700,
    border: 'none',
    borderRadius: '50%',
    width: 56,
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    boxShadow: theme.shadows[6],
    cursor: 'pointer',
    animation: `${pulse} 1.8s infinite`,
    '&:hover': {
        background: theme.palette.secondary.main
    }
}))

// ==============================|| DOCUMENTS ||============================== //

const Documents = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const navigate = useNavigate()
    const getAllDocumentStores = useApi(documentsApi.getAllDocumentStores)

    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [images, setImages] = useState({})
    const [search, setSearch] = useState('')
    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [docStores, setDocStores] = useState([])
    const [view, setView] = useState(localStorage.getItem('docStoreDisplayStyle') || 'card')

    const handleChange = (event, nextView) => {
        if (nextView === null) return
        localStorage.setItem('docStoreDisplayStyle', nextView)
        setView(nextView)
    }

    function filterDocStores(data) {
        return data.name.toLowerCase().indexOf(search.toLowerCase()) > -1
    }

    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }

    const goToDocumentStore = (id) => {
        navigate('/document-stores/' + id)
    }

    const addNew = () => {
        const dialogProp = {
            title: 'Add New Document Store',
            type: 'ADD',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Add'
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const onConfirm = () => {
        setShowDialog(false)
        getAllDocumentStores.request()
    }

    useEffect(() => {
        getAllDocumentStores.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (getAllDocumentStores.data) {
            try {
                const docStores = getAllDocumentStores.data
                if (!Array.isArray(docStores)) return
                const loaderImages = {}

                for (let i = 0; i < docStores.length; i += 1) {
                    const loaders = docStores[i].loaders ?? []

                    let totalChunks = 0
                    let totalChars = 0
                    loaderImages[docStores[i].id] = []
                    for (let j = 0; j < loaders.length; j += 1) {
                        const imageSrc = `${baseURL}/api/v1/node-icon/${loaders[j].loaderId}`
                        if (!loaderImages[docStores[i].id].includes(imageSrc)) {
                            loaderImages[docStores[i].id].push(imageSrc)
                        }
                        totalChunks += loaders[j]?.totalChunks ?? 0
                        totalChars += loaders[j]?.totalChars ?? 0
                    }
                    docStores[i].totalDocs = loaders?.length ?? 0
                    docStores[i].totalChunks = totalChunks
                    docStores[i].totalChars = totalChars
                }
                setDocStores(docStores)
                setImages(loaderImages)
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllDocumentStores.data])

    useEffect(() => {
        setLoading(getAllDocumentStores.loading)
    }, [getAllDocumentStores.loading])

    useEffect(() => {
        setError(getAllDocumentStores.error)
    }, [getAllDocumentStores.error])

    return (
        <SplitLayout>
            {/* Left Panel: Title, description, controls */}
            <LeftPanel>
                <Typography variant='h2' sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-2px', color: 'primary.main' }}>
                    Document Store
                </Typography>
                <Typography variant='h6' sx={{ color: 'text.secondary', fontWeight: 500, mb: 2 }}>
                    Store and upsert documents for LLM retrieval (RAG)
                </Typography>
                <VerticalToolbar>
                    <PillInput placeholder='Search Name' value={search} onChange={onSearchChange} />
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
                    <StyledButton
                        variant='contained'
                        sx={{ borderRadius: 2, height: 44, fontWeight: 700 }}
                        onClick={addNew}
                        startIcon={<IconPlus />}
                        id='btn_createDocStore'
                    >
                        Add New
                    </StyledButton>
                </VerticalToolbar>
            </LeftPanel>
            {/* Right Panel: Content */}
            <RightPanel>
                {error ? (
                    <ErrorBoundary error={error} />
                ) : !view || view === 'card' ? (
                    <>
                        {isLoading && !docStores ? (
                            <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                <Skeleton variant='rounded' height={160} />
                                <Skeleton variant='rounded' height={160} />
                                <Skeleton variant='rounded' height={160} />
                            </Box>
                        ) : (
                            <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                {docStores?.filter(filterDocStores).map((data, index) => (
                                    <DocumentStoreCard
                                        key={index}
                                        images={images[data.id]}
                                        data={data}
                                        onClick={() => goToDocumentStore(data.id)}
                                    />
                                ))}
                            </Box>
                        )}
                    </>
                ) : (
                    <TableContainer sx={{ border: 1, borderColor: theme.palette.grey[900] + 25, borderRadius: 2 }} component={Paper}>
                        <Table aria-label='documents table'>
                            <TableHead
                                sx={{
                                    backgroundColor: customization.isDarkMode ? theme.palette.common.black : theme.palette.grey[100],
                                    height: 56
                                }}
                            >
                                <TableRow>
                                    <TableCell>&nbsp;</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Connected flows</TableCell>
                                    <TableCell>Total characters</TableCell>
                                    <TableCell>Total chunks</TableCell>
                                    <TableCell>Loader types</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {docStores?.filter(filterDocStores).map((data, index) => (
                                    <TableRow
                                        onClick={() => goToDocumentStore(data.id)}
                                        hover
                                        key={index}
                                        sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align='center'>
                                            <DocumentStoreStatus isTableView={true} status={data.status} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 5,
                                                    WebkitBoxOrient: 'vertical',
                                                    textOverflow: 'ellipsis',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {data.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 5,
                                                    WebkitBoxOrient: 'vertical',
                                                    textOverflow: 'ellipsis',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {data?.description}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{data.whereUsed?.length ?? 0}</TableCell>
                                        <TableCell>{data.totalChars}</TableCell>
                                        <TableCell>{data.totalChunks}</TableCell>
                                        <TableCell>
                                            {images[data.id] && (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'start',
                                                        gap: 1
                                                    }}
                                                >
                                                    {images[data.id].slice(0, images.length > 3 ? 3 : images.length).map((img) => (
                                                        <Box
                                                            key={img}
                                                            sx={{
                                                                width: 30,
                                                                height: 30,
                                                                borderRadius: '50%',
                                                                backgroundColor: customization.isDarkMode
                                                                    ? theme.palette.common.white
                                                                    : theme.palette.grey[300] + 75
                                                            }}
                                                        >
                                                            <img
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    padding: 5,
                                                                    objectFit: 'contain'
                                                                }}
                                                                alt=''
                                                                src={img}
                                                            />
                                                        </Box>
                                                    ))}
                                                    {images.length > 3 && (
                                                        <Typography
                                                            sx={{
                                                                alignItems: 'center',
                                                                display: 'flex',
                                                                fontSize: '.9rem',
                                                                fontWeight: 200
                                                            }}
                                                        >
                                                            + {images.length - 3} More
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                {!isLoading && (!docStores || docStores.length === 0) && (
                    <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: '40vh', p: 3 }} flexDirection='column'>
                        <EmptyStateEmoji>📄</EmptyStateEmoji>
                        <Typography variant='h6' sx={{ fontWeight: 700, mb: 0.5 }}>
                            No Document Stores Yet
                        </Typography>
                        <Typography variant='body2' sx={{ color: 'text.secondary', mb: 2 }}>
                            You are just one click away from creating your first document store for RAG!
                        </Typography>
                        <StyledButton
                            variant='contained'
                            color='primary'
                            sx={{ borderRadius: 2, fontWeight: 600, boxShadow: 'none', textTransform: 'none' }}
                            onClick={addNew}
                            startIcon={<IconPlus />}
                        >
                            Add New Document Store
                        </StyledButton>
                    </Stack>
                )}
            </RightPanel>
            {/* Floating Add New Button */}
            <AnimatedFab aria-label='add' onClick={addNew} title='Add New Document Store'>
                <IconPlus size={28} />
            </AnimatedFab>
            {showDialog && (
                <AddDocStoreDialog
                    dialogProps={dialogProps}
                    show={showDialog}
                    onCancel={() => setShowDialog(false)}
                    onConfirm={onConfirm}
                />
            )}
        </SplitLayout>
    )
}

export default Documents
