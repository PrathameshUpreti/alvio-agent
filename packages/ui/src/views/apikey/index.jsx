import * as PropTypes from 'prop-types'
import moment from 'moment/moment'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from '@/store/actions'

// material-ui
import {
    Button,
    Box,
    Chip,
    Skeleton,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Popover,
    Collapse,
    Typography,
    OutlinedInput
} from '@mui/material'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { useTheme, styled } from '@mui/material/styles'

// project imports
import { StyledButton } from '@/ui-component/button/StyledButton'
import APIKeyDialog from './APIKeyDialog'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'
import ErrorBoundary from '@/ErrorBoundary'

// API
import apiKeyApi from '@/api/apikey'

// Hooks
import useApi from '@/hooks/useApi'
import useConfirm from '@/hooks/useConfirm'

// utils
import useNotifier from '@/utils/useNotifier'

// Icons
import {
    IconTrash,
    IconEdit,
    IconCopy,
    IconChevronsUp,
    IconChevronsDown,
    IconX,
    IconPlus,
    IconEye,
    IconEyeOff,
    IconFileUpload
} from '@tabler/icons-react'
import UploadJSONFileDialog from '@/views/apikey/UploadJSONFileDialog'

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

// ==============================|| APIKey ||============================== //

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderColor: theme.palette.grey[900] + 25,
    padding: '6px 16px',

    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.grey[900]
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        height: 64
    }
}))

const StyledTableRow = styled(TableRow)(() => ({
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}))

function APIKeyRow(props) {
    const [open, setOpen] = useState(false)
    const theme = useTheme()

    return (
        <>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <StyledTableCell scope='row' style={{ width: '15%' }}>
                    {props.apiKey.keyName}
                </StyledTableCell>
                <StyledTableCell style={{ width: '40%' }}>
                    {props.showApiKeys.includes(props.apiKey.apiKey)
                        ? props.apiKey.apiKey
                        : `${props.apiKey.apiKey.substring(0, 2)}${'•'.repeat(18)}${props.apiKey.apiKey.substring(
                              props.apiKey.apiKey.length - 5
                          )}`}
                    <IconButton title='Copy' color='success' onClick={props.onCopyClick}>
                        <IconCopy />
                    </IconButton>
                    <IconButton title='Show' color='inherit' onClick={props.onShowAPIClick}>
                        {props.showApiKeys.includes(props.apiKey.apiKey) ? <IconEyeOff /> : <IconEye />}
                    </IconButton>
                    <Popover
                        open={props.open}
                        anchorEl={props.anchorEl}
                        onClose={props.onClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left'
                        }}
                    >
                        <Typography variant='h6' sx={{ pl: 1, pr: 1, color: 'white', background: props.theme.palette.success.dark }}>
                            Copied!
                        </Typography>
                    </Popover>
                </StyledTableCell>
                <StyledTableCell>
                    {props.apiKey.chatFlows.length}{' '}
                    {props.apiKey.chatFlows.length > 0 && (
                        <IconButton aria-label='expand row' size='small' color='inherit' onClick={() => setOpen(!open)}>
                            {props.apiKey.chatFlows.length > 0 && open ? <IconChevronsUp /> : <IconChevronsDown />}
                        </IconButton>
                    )}
                </StyledTableCell>
                <StyledTableCell>{moment(props.apiKey.createdAt).format('MMMM Do, YYYY')}</StyledTableCell>
                <StyledTableCell>
                    <IconButton title='Edit' color='primary' onClick={props.onEditClick}>
                        <IconEdit />
                    </IconButton>
                </StyledTableCell>
                <StyledTableCell>
                    <IconButton title='Delete' color='error' onClick={props.onDeleteClick}>
                        <IconTrash />
                    </IconButton>
                </StyledTableCell>
            </TableRow>
            {open && (
                <TableRow sx={{ '& td': { border: 0 } }}>
                    <StyledTableCell sx={{ p: 2 }} colSpan={6}>
                        <Collapse in={open} timeout='auto' unmountOnExit>
                            <Box sx={{ borderRadius: 2, border: 1, borderColor: theme.palette.grey[900] + 25, overflow: 'hidden' }}>
                                <Table aria-label='chatflow table'>
                                    <TableHead sx={{ height: 48 }}>
                                        <TableRow>
                                            <StyledTableCell sx={{ width: '30%' }}>Chatflow Name</StyledTableCell>
                                            <StyledTableCell sx={{ width: '20%' }}>Modified On</StyledTableCell>
                                            <StyledTableCell sx={{ width: '50%' }}>Category</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {props.apiKey.chatFlows.map((flow, index) => (
                                            <TableRow key={index}>
                                                <StyledTableCell>{flow.flowName}</StyledTableCell>
                                                <StyledTableCell>{moment(flow.updatedDate).format('MMMM Do, YYYY')}</StyledTableCell>
                                                <StyledTableCell>
                                                    &nbsp;
                                                    {flow.category &&
                                                        flow.category
                                                            .split(';')
                                                            .map((tag, index) => (
                                                                <Chip key={index} label={tag} style={{ marginRight: 5, marginBottom: 5 }} />
                                                            ))}
                                                </StyledTableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </StyledTableCell>
                </TableRow>
            )}
        </>
    )
}

APIKeyRow.propTypes = {
    apiKey: PropTypes.any,
    showApiKeys: PropTypes.arrayOf(PropTypes.any),
    onCopyClick: PropTypes.func,
    onShowAPIClick: PropTypes.func,
    open: PropTypes.bool,
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    theme: PropTypes.any,
    onEditClick: PropTypes.func,
    onDeleteClick: PropTypes.func
}
const APIKey = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const dispatch = useDispatch()
    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [apiKeys, setAPIKeys] = useState([])
    const [anchorEl, setAnchorEl] = useState(null)
    const [showApiKeys, setShowApiKeys] = useState([])
    const openPopOver = Boolean(anchorEl)

    const [showUploadDialog, setShowUploadDialog] = useState(false)
    const [uploadDialogProps, setUploadDialogProps] = useState({})

    const [search, setSearch] = useState('')
    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }
    function filterKeys(data) {
        return data.keyName.toLowerCase().indexOf(search.toLowerCase()) > -1
    }

    const { confirm } = useConfirm()

    const getAllAPIKeysApi = useApi(apiKeyApi.getAllAPIKeys)

    const onShowApiKeyClick = (apikey) => {
        const index = showApiKeys.indexOf(apikey)
        if (index > -1) {
            //showApiKeys.splice(index, 1)
            const newShowApiKeys = showApiKeys.filter(function (item) {
                return item !== apikey
            })
            setShowApiKeys(newShowApiKeys)
        } else {
            setShowApiKeys((prevkeys) => [...prevkeys, apikey])
        }
    }

    const handleClosePopOver = () => {
        setAnchorEl(null)
    }

    const addNew = () => {
        const dialogProp = {
            title: 'Add New API Key',
            type: 'ADD',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Add',
            customBtnId: 'btn_confirmAddingApiKey'
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const edit = (key) => {
        const dialogProp = {
            title: 'Edit API Key',
            type: 'EDIT',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Save',
            customBtnId: 'btn_confirmEditingApiKey',
            key
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const uploadDialog = () => {
        const dialogProp = {
            type: 'ADD',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Upload',
            data: {}
        }
        setUploadDialogProps(dialogProp)
        setShowUploadDialog(true)
    }

    const deleteKey = async (key) => {
        const confirmPayload = {
            title: `Delete`,
            description:
                key.chatFlows.length === 0
                    ? `Delete key [${key.keyName}] ? `
                    : `Delete key [${key.keyName}] ?\n There are ${key.chatFlows.length} chatflows using this key.`,
            confirmButtonName: 'Delete',
            cancelButtonName: 'Cancel',
            customBtnId: 'btn_initiateDeleteApiKey'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            try {
                const deleteResp = await apiKeyApi.deleteAPI(key.id)
                if (deleteResp.data) {
                    enqueueSnackbar({
                        message: 'API key deleted',
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
                    message: `Failed to delete API key: ${
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

    const onConfirm = () => {
        setShowDialog(false)
        setShowUploadDialog(false)
        getAllAPIKeysApi.request()
    }

    useEffect(() => {
        getAllAPIKeysApi.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllAPIKeysApi.loading)
    }, [getAllAPIKeysApi.loading])

    useEffect(() => {
        if (getAllAPIKeysApi.data) {
            setAPIKeys(getAllAPIKeysApi.data)
        }
    }, [getAllAPIKeysApi.data])

    useEffect(() => {
        if (getAllAPIKeysApi.error) {
            setError(getAllAPIKeysApi.error)
        }
    }, [getAllAPIKeysApi.error])

    return (
        <SplitLayout>
            {/* Left Panel: Header + Actions */}
            <LeftPanel>
                <Box>
                    <Box>
                        <Box sx={{ fontWeight: 900, fontSize: '2rem', color: 'primary.main', mb: 0.5 }}>API Keys</Box>
                        <Box sx={{ color: 'text.secondary', fontWeight: 500, mb: 2 }}>Flowise API & SDK authentication keys</Box>
                    </Box>
                    <Box sx={{ mt: 2, mb: 2, width: '100%' }}>
                        <Button
                            variant='outlined'
                            sx={{ borderRadius: 2, height: 40, mr: 1 }}
                            onClick={uploadDialog}
                            startIcon={<IconFileUpload />}
                            id='btn_importApiKeys'
                        >
                            Import
                        </Button>
                        <StyledButton
                            variant='contained'
                            sx={{ borderRadius: 2, height: 40 }}
                            onClick={addNew}
                            startIcon={<IconPlus />}
                            id='btn_createApiKey'
                        >
                            Create Key
                        </StyledButton>
                    </Box>
                </Box>
                <Box sx={{ mt: 2, width: '100%' }}>
                    <OutlinedInput
                        fullWidth
                        size='small'
                        placeholder='Search API Keys'
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
                ) : !isLoading && apiKeys.length <= 0 ? (
                    <EngagingEmptyState>
                        <PulseEmoji>🔑</PulseEmoji>
                        <Typography variant='h5' sx={{ fontWeight: 700, mb: 1, mt: 2 }}>
                            You are just one click away from creating your first API key!
                        </Typography>
                        <Typography variant='body2' sx={{ color: 'text.secondary', mb: 3 }}>
                            API Keys let you authenticate and secure your Flowise API & SDK usage. Add one now!
                        </Typography>
                        <StyledButton
                            variant='contained'
                            sx={{ borderRadius: 2, height: 44, fontWeight: 700 }}
                            onClick={addNew}
                            startIcon={<IconPlus />}
                            id='btn_createApiKey'
                        >
                            Create API Key
                        </StyledButton>
                    </EngagingEmptyState>
                ) : (
                    <TableContainer sx={{ border: 1, borderColor: theme.palette.grey[900] + 25, borderRadius: 2 }} component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                            <TableHead
                                sx={{
                                    backgroundColor: customization.isDarkMode ? theme.palette.common.black : theme.palette.grey[100],
                                    height: 56
                                }}
                            >
                                <TableRow>
                                    <StyledTableCell>Key Name</StyledTableCell>
                                    <StyledTableCell>API Key</StyledTableCell>
                                    <StyledTableCell>Usage</StyledTableCell>
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
                                            <StyledTableCell>
                                                <Skeleton variant='text' />
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </>
                                ) : (
                                    <>
                                        {apiKeys.filter(filterKeys).map((key, index) => (
                                            <APIKeyRow
                                                key={index}
                                                apiKey={key}
                                                showApiKeys={showApiKeys}
                                                onCopyClick={(event) => {
                                                    navigator.clipboard.writeText(key.apiKey)
                                                    setAnchorEl(event.currentTarget)
                                                    setTimeout(() => {
                                                        handleClosePopOver()
                                                    }, 1500)
                                                }}
                                                onShowAPIClick={() => onShowApiKeyClick(key.apiKey)}
                                                open={openPopOver}
                                                anchorEl={anchorEl}
                                                onClose={handleClosePopOver}
                                                theme={theme}
                                                onEditClick={() => edit(key)}
                                                onDeleteClick={() => deleteKey(key)}
                                            />
                                        ))}
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </RightPanel>
            <APIKeyDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={() => setShowDialog(false)}
                onConfirm={onConfirm}
                setError={setError}
            />
            {showUploadDialog && (
                <UploadJSONFileDialog
                    show={showUploadDialog}
                    dialogProps={uploadDialogProps}
                    onCancel={() => setShowUploadDialog(false)}
                    onConfirm={onConfirm}
                />
            )}
            <ConfirmDialog />
        </SplitLayout>
    )
}

export default APIKey
