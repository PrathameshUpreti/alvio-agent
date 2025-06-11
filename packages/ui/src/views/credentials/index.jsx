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
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    useTheme,
    Typography
} from '@mui/material'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
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
import CredentialEmptySVG from '@/assets/images/credential_empty.svg'
import keySVG from '@/assets/images/key.svg'

// const
import { baseURL } from '@/store/constant'
import { SET_COMPONENT_CREDENTIALS } from '@/store/actions'
import ViewHeader from '@/layout/MainLayout/ViewHeader'
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
        <>
            <MainCard
                sx={{
                    height: '100%',
                    borderRadius: '16px',
                    boxShadow: theme.palette.mode === 'dark' ? '0 8px 40px rgba(0, 0, 0, 0.4)' : '0 8px 40px rgba(0, 0, 0, 0.1)'
                }}
            >
                {error ? (
                    <ErrorBoundary error={error} />
                ) : (
                    <Stack flexDirection='column' sx={{ gap: 3 }}>
                        <ViewHeader
                            onSearchChange={onSearchChange}
                            search={true}
                            searchPlaceholder='Search Credentials'
                            title='Credentials'
                            description='API keys, tokens, and secrets for 3rd party integrations'
                        >
                            <StyledButton
                                variant='contained'
                                sx={{
                                    borderRadius: '30px',
                                    px: 3,
                                    py: 1,
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #FF7400, #FF5A00)',
                                    boxShadow: '0 4px 10px rgba(255, 116, 0, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #FF5A00, #FF4500)',
                                        boxShadow: '0 6px 15px rgba(255, 116, 0, 0.4)'
                                    }
                                }}
                                onClick={listCredential}
                                startIcon={<IconPlus />}
                            >
                                Add Credential
                            </StyledButton>
                        </ViewHeader>
                        {!isLoading && credentials.length <= 0 ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    py: 8,
                                    position: 'relative',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(26, 29, 30, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                                    boxShadow:
                                        theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.08)'
                                }}
                            >
                                <GradientBackground>
                                    <div className='top-right-gradient' />
                                    <div className='bottom-left-gradient' />
                                </GradientBackground>
                                <Box sx={{ p: 2, height: 'auto', position: 'relative', zIndex: 1 }}>
                                    <img
                                        style={{ objectFit: 'cover', height: '16vh', width: 'auto' }}
                                        src={CredentialEmptySVG}
                                        alt='CredentialEmptySVG'
                                    />
                                </Box>
                                <Typography
                                    variant='h5'
                                    sx={{
                                        fontWeight: 600,
                                        position: 'relative',
                                        zIndex: 1,
                                        color: theme.palette.mode === 'dark' ? '#fff' : '#4A0072'
                                    }}
                                >
                                    No Credentials Yet
                                </Typography>
                                <Typography
                                    variant='body2'
                                    sx={{
                                        mt: 1,
                                        position: 'relative',
                                        zIndex: 1,
                                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                                    }}
                                >
                                    Add credentials to connect to external services
                                </Typography>
                            </Box>
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
                                            <StyledTableCell>Name</StyledTableCell>
                                            <StyledTableCell>Last Updated</StyledTableCell>
                                            <StyledTableCell>Created</StyledTableCell>
                                            <StyledTableCell> </StyledTableCell>
                                            <StyledTableCell> </StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading ? (
                                            <>
                                                <StyledTableRow>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                                <StyledTableRow>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                    <StyledTableCell>
                                                        <Skeleton variant='text' />
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            </>
                                        ) : (
                                            <>
                                                {credentials.filter(filterCredentials).map((credential, index) => (
                                                    <StyledTableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <StyledTableCell scope='row'>
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'row',
                                                                    alignItems: 'center',
                                                                    gap: 1.5
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        width: 40,
                                                                        height: 40,
                                                                        borderRadius: '12px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        backgroundColor: customization.isDarkMode
                                                                            ? 'rgba(255, 255, 255, 0.1)'
                                                                            : 'rgba(0, 0, 0, 0.05)',
                                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                                    }}
                                                                >
                                                                    <img
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            padding: 8,
                                                                            objectFit: 'contain'
                                                                        }}
                                                                        alt={credential.credentialName}
                                                                        src={`${baseURL}/api/v1/components-credentials-icon/${credential.credentialName}`}
                                                                        onError={(e) => {
                                                                            e.target.onerror = null
                                                                            e.target.style.padding = '8px'
                                                                            e.target.src = keySVG
                                                                        }}
                                                                    />
                                                                </Box>
                                                                <Typography
                                                                    sx={{
                                                                        fontWeight: 500,
                                                                        color: theme.palette.mode === 'dark' ? '#fff' : '#333'
                                                                    }}
                                                                >
                                                                    {credential.name}
                                                                </Typography>
                                                            </Box>
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <Typography
                                                                sx={{
                                                                    color:
                                                                        theme.palette.mode === 'dark'
                                                                            ? 'rgba(255, 255, 255, 0.7)'
                                                                            : 'rgba(0, 0, 0, 0.6)',
                                                                    fontSize: '0.85rem'
                                                                }}
                                                            >
                                                                {moment(credential.updatedDate).format('MMM D, YYYY • HH:mm')}
                                                            </Typography>
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <Typography
                                                                sx={{
                                                                    color:
                                                                        theme.palette.mode === 'dark'
                                                                            ? 'rgba(255, 255, 255, 0.7)'
                                                                            : 'rgba(0, 0, 0, 0.6)',
                                                                    fontSize: '0.85rem'
                                                                }}
                                                            >
                                                                {moment(credential.createdDate).format('MMM D, YYYY • HH:mm')}
                                                            </Typography>
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <IconButton
                                                                title='Edit'
                                                                sx={{
                                                                    backgroundColor:
                                                                        theme.palette.mode === 'dark'
                                                                            ? 'rgba(141, 54, 249, 0.15)'
                                                                            : 'rgba(141, 54, 249, 0.08)',
                                                                    color: theme.palette.mode === 'dark' ? '#9B5DE5' : '#8D36F9',
                                                                    '&:hover': {
                                                                        backgroundColor:
                                                                            theme.palette.mode === 'dark'
                                                                                ? 'rgba(141, 54, 249, 0.25)'
                                                                                : 'rgba(141, 54, 249, 0.15)'
                                                                    }
                                                                }}
                                                                onClick={() => edit(credential)}
                                                            >
                                                                <IconEdit size={20} />
                                                            </IconButton>
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <IconButton
                                                                title='Delete'
                                                                sx={{
                                                                    backgroundColor:
                                                                        theme.palette.mode === 'dark'
                                                                            ? 'rgba(255, 76, 76, 0.15)'
                                                                            : 'rgba(255, 76, 76, 0.08)',
                                                                    color: theme.palette.mode === 'dark' ? '#ff7c7c' : '#FF4C4C',
                                                                    '&:hover': {
                                                                        backgroundColor:
                                                                            theme.palette.mode === 'dark'
                                                                                ? 'rgba(255, 76, 76, 0.25)'
                                                                                : 'rgba(255, 76, 76, 0.15)'
                                                                    }
                                                                }}
                                                                onClick={() => deleteCredential(credential)}
                                                            >
                                                                <IconTrash size={20} />
                                                            </IconButton>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </>
                                        )}
                                    </TableBody>
                                </Table>
                            </StyledTableContainer>
                        )}
                    </Stack>
                )}
            </MainCard>
            <CredentialListDialog
                show={showCredentialListDialog}
                dialogProps={credentialListDialogProps}
                onCancel={() => setShowCredentialListDialog(false)}
                onCredentialSelected={onCredentialSelected}
            ></CredentialListDialog>
            <AddEditCredentialDialog
                show={showSpecificCredentialDialog}
                dialogProps={specificCredentialDialogProps}
                onCancel={() => setShowSpecificCredentialDialog(false)}
                onConfirm={onConfirm}
                setError={setError}
            ></AddEditCredentialDialog>
            <ConfirmDialog />
        </>
    )
}

export default Credentials
