import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from '@/store/actions'
import moment from 'moment'

// material-ui
import { styled } from '@mui/material/styles'
import { tableCellClasses } from '@mui/material/TableCell'
import {
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    useTheme,
    Typography,
    OutlinedInput
} from '@mui/material'

// project imports
import { StyledButton } from '@/ui-component/button/StyledButton'
import CredentialListDialog from './CredentialListDialog'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'
import AddEditCredentialDialog from './AddEditCredentialDialog'

// API
import credentialsApi from '@/api/credentials'

// Hooks
import useApi from '@/hooks/useApi'
import useConfirm from '@/hooks/useConfirm'

// utils
import useNotifier from '@/utils/useNotifier'

// Icons
import { IconTrash, IconEdit, IconX, IconPlus } from '@tabler/icons-react'
import keySVG from '@/assets/images/key.svg'

// const
import { SET_COMPONENT_CREDENTIALS } from '@/store/actions'
import ErrorBoundary from '@/ErrorBoundary'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
    padding: '6px 16px',

    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.grey[900],
        fontWeight: 600
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        height: 64
    }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    },
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
    }
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    position: 'relative',
    borderRadius: '16px !important',
    overflow: 'hidden',
    border: 'none !important',
    boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.08)',
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        opacity: theme.palette.mode === 'dark' ? 0.7 : 0.3,
        zIndex: 0,
        pointerEvents: 'none'
    },
    '& .MuiTable-root': {
        position: 'relative',
        zIndex: 1,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(26, 29, 30, 0.8)' : 'rgba(255, 255, 255, 0.9)'
    },
    '& .MuiTableHead-root': {
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background:
                theme.palette.mode === 'dark'
                    ? 'linear-gradient(90deg, transparent, rgba(141, 54, 249, 0.1))'
                    : 'linear-gradient(90deg, transparent, rgba(141, 54, 249, 0.05))',
            pointerEvents: 'none'
        }
    }
}))

const GradientBackground = styled(Box)(({ theme }) => ({
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    opacity: theme.palette.mode === 'dark' ? 0.9 : 0.7,
    '& .top-right-gradient': {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '450px',
        height: '400px',
        background: 'linear-gradient(to bottom left, #ff2daf, transparent)',
        borderRadius: '9999px',
        filter: theme.palette.mode === 'dark' ? 'blur(24px)' : 'blur(40px)',
        transform: 'translate(80px, -80px)'
    },
    '& .bottom-left-gradient': {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '450px',
        height: '400px',
        background: 'linear-gradient(to top right, #ff6a00, transparent)',
        borderRadius: '9999px',
        filter: theme.palette.mode === 'dark' ? 'blur(24px)' : 'blur(40px)',
        transform: 'translate(-80px, 80px)'
    }
}))

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

// ==============================|| Credentials ||============================== //

const Credentials = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const dispatch = useDispatch()
    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showCredentialListDialog, setShowCredentialListDialog] = useState(false)
    const [credentialListDialogProps, setCredentialListDialogProps] = useState({})
    const [showSpecificCredentialDialog, setShowSpecificCredentialDialog] = useState(false)
    const [specificCredentialDialogProps, setSpecificCredentialDialogProps] = useState({})
    const [credentials, setCredentials] = useState([])
    const [componentsCredentials, setComponentsCredentials] = useState([])

    const { confirm } = useConfirm()

    const getAllCredentialsApi = useApi(credentialsApi.getAllCredentials)
    const getAllComponentsCredentialsApi = useApi(credentialsApi.getAllComponentsCredentials)

    const [search, setSearch] = useState('')
    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }
    function filterCredentials(data) {
        return data.credentialName.toLowerCase().indexOf(search.toLowerCase()) > -1
    }

    const listCredential = () => {
        const dialogProp = {
            title: 'Add New Credential',
            componentsCredentials
        }
        setCredentialListDialogProps(dialogProp)
        setShowCredentialListDialog(true)
    }

    const addNew = (credentialComponent) => {
        const dialogProp = {
            type: 'ADD',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Add',
            credentialComponent
        }
        setSpecificCredentialDialogProps(dialogProp)
        setShowSpecificCredentialDialog(true)
    }

    const edit = (credential) => {
        const dialogProp = {
            type: 'EDIT',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Save',
            data: credential
        }
        setSpecificCredentialDialogProps(dialogProp)
        setShowSpecificCredentialDialog(true)
    }

    const deleteCredential = async (credential) => {
        const confirmPayload = {
            title: `Delete`,
            description: `Delete credential ${credential.name}?`,
            confirmButtonName: 'Delete',
            cancelButtonName: 'Cancel'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            try {
                const deleteResp = await credentialsApi.deleteCredential(credential.id)
                if (deleteResp.data) {
                    enqueueSnackbar({
                        message: 'Credential deleted',
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
                    onConfirm()
                }
            } catch (error) {
                enqueueSnackbar({
                    message: `Failed to delete Credential: ${
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
                onCancel()
            }
        }
    }

    const onCredentialSelected = (credentialComponent) => {
        setShowCredentialListDialog(false)
        addNew(credentialComponent)
    }

    const onConfirm = () => {
        setShowCredentialListDialog(false)
        setShowSpecificCredentialDialog(false)
        getAllCredentialsApi.request()
    }

    useEffect(() => {
        getAllCredentialsApi.request()
        getAllComponentsCredentialsApi.request()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllCredentialsApi.loading)
    }, [getAllCredentialsApi.loading])

    useEffect(() => {
        if (getAllCredentialsApi.data) {
            setCredentials(getAllCredentialsApi.data)
        }
    }, [getAllCredentialsApi.data])

    useEffect(() => {
        if (getAllCredentialsApi.error) {
            setError(getAllCredentialsApi.error)
        }
    }, [getAllCredentialsApi.error])

    useEffect(() => {
        if (getAllComponentsCredentialsApi.data) {
            setComponentsCredentials(getAllComponentsCredentialsApi.data)
            dispatch({ type: SET_COMPONENT_CREDENTIALS, componentsCredentials: getAllComponentsCredentialsApi.data })
        }
    }, [getAllComponentsCredentialsApi.data, dispatch])

    return (
        <SplitLayout>
            {/* Left Panel: Header + Actions */}
            <LeftPanel>
                <Box>
                    <Box>
                        <Box sx={{ fontWeight: 900, fontSize: '2rem', color: 'primary.main', mb: 0.5 }}>Credentials</Box>
                        <Box sx={{ color: 'text.secondary', fontWeight: 500, mb: 2 }}>
                            API keys, tokens, and secrets for 3rd party integrations
                        </Box>
                    </Box>
                    <Box sx={{ mt: 2, mb: 2, width: '100%' }}>
                        <StyledButton
                            variant='contained'
                            sx={{ borderRadius: 2, height: 40 }}
                            onClick={listCredential}
                            startIcon={<IconPlus />}
                        >
                            Add Credential
                        </StyledButton>
                    </Box>
                </Box>
                <Box sx={{ mt: 2, width: '100%' }}>
                    <OutlinedInput
                        fullWidth
                        size='small'
                        placeholder='Search Credentials'
                        value={search}
                        onChange={onSearchChange}
                        sx={{ borderRadius: 8, background: theme.palette.background.default, fontSize: 16 }}
                    />
                </Box>
            </LeftPanel>
            {/* Right Panel: Content */}
            <RightPanel>
                {error ? (
                    <ErrorBoundary error={error} />
                ) : !isLoading && credentials.length <= 0 ? (
                    <EngagingEmptyState>
                        <PulseEmoji>🔐</PulseEmoji>
                        <Typography variant='h5' sx={{ fontWeight: 700, mb: 1, mt: 2 }}>
                            You are just one click away from adding your first credential!
                        </Typography>
                        <Typography variant='body2' sx={{ color: 'text.secondary', mb: 3 }}>
                            Credentials let you securely connect to external services. Add one now!
                        </Typography>
                        <StyledButton
                            variant='contained'
                            sx={{ borderRadius: 2, height: 44, fontWeight: 700 }}
                            onClick={listCredential}
                            startIcon={<IconPlus />}
                        >
                            Add Credential
                        </StyledButton>
                    </EngagingEmptyState>
                ) : (
                    <StyledTableContainer sx={{ borderRadius: 2 }} component={Paper}>
                        <GradientBackground>
                            <div className='top-right-gradient' />
                            <div className='bottom-left-gradient' />
                        </GradientBackground>
                        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                            <TableHead
                                sx={{
                                    backgroundColor: customization.isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.02)',
                                    height: 56,
                                    position: 'relative',
                                    zIndex: 2
                                }}
                            >
                                <TableRow>
                                    <StyledTableCell>Credential Name</StyledTableCell>
                                    <StyledTableCell>Type</StyledTableCell>
                                    <StyledTableCell>Created</StyledTableCell>
                                    <StyledTableCell>Last Updated</StyledTableCell>
                                    <StyledTableCell align='right'>Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {credentials.filter(filterCredentials).map((row, idx) => (
                                    <StyledTableRow key={row.id}>
                                        <StyledTableCell component='th' scope='row'>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <img src={keySVG} alt='' style={{ width: 24, height: 24, marginRight: 8 }} />
                                                <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>
                                                    {row.credentialName}
                                                </Typography>
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell>{row.type}</StyledTableCell>
                                        <StyledTableCell>{moment(row.createdAt).format('YYYY-MM-DD HH:mm')}</StyledTableCell>
                                        <StyledTableCell>{moment(row.updatedAt).format('YYYY-MM-DD HH:mm')}</StyledTableCell>
                                        <StyledTableCell align='right'>
                                            <IconButton color='primary' onClick={() => edit(row)}>
                                                <IconEdit />
                                            </IconButton>
                                            <IconButton color='error' onClick={() => deleteCredential(row)}>
                                                <IconTrash />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>
                )}
                <CredentialListDialog
                    show={showCredentialListDialog}
                    dialogProps={credentialListDialogProps}
                    onCancel={() => setShowCredentialListDialog(false)}
                    onConfirm={onCredentialSelected}
                />
                <AddEditCredentialDialog
                    show={showSpecificCredentialDialog}
                    dialogProps={specificCredentialDialogProps}
                    onCancel={() => setShowSpecificCredentialDialog(false)}
                    onConfirm={onConfirm}
                />
                <ConfirmDialog />
            </RightPanel>
        </SplitLayout>
    )
}

export default Credentials
