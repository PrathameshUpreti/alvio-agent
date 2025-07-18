import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { styled } from '@mui/system'

// material-ui
import {
    Pagination,
    Box,
    Stack,
    TextField,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    Select,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material'

// project imports
import ErrorBoundary from '@/ErrorBoundary'

// API
import useApi from '@/hooks/useApi'
import executionsApi from '@/api/executions'

// icons
import { IconTrash } from '@tabler/icons-react'

// const
import { ExecutionsListTable } from '@/ui-component/table/ExecutionsListTable'
import { ExecutionDetails } from './ExecutionDetails'
import { omit } from 'lodash'

// Styled components for new UI
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

const OutlinedPanel = styled(Box)(({ theme }) => ({
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 24,
    background: theme.palette.mode === 'dark' ? '#232627' : '#fff',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    width: '100%',
    boxShadow: 'none'
}))

const VerticalToolbar = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    width: '100%',
    marginTop: theme.spacing(2),
    alignItems: 'stretch'
}))

const EmptyState = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '40vh',
    width: '100%',
    padding: theme.spacing(6, 2),
    background: 'none'
}))

// Add a styled empty state for a soft animation
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

// ==============================|| AGENT EXECUTIONS ||============================== //

const AgentExecutions = () => {
    const theme = useTheme()
    const borderColor = theme.palette.grey[900] + 25

    const getAllExecutions = useApi(executionsApi.getAllExecutions)
    const deleteExecutionsApi = useApi(executionsApi.deleteExecutions)
    const getExecutionByIdApi = useApi(executionsApi.getExecutionById)

    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [executions, setExecutions] = useState([])
    const [openDrawer, setOpenDrawer] = useState(false)
    const [selectedExecutionData, setSelectedExecutionData] = useState([])
    const [selectedMetadata, setSelectedMetadata] = useState({})
    const [selectedExecutionIds, setSelectedExecutionIds] = useState([])
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [filters, setFilters] = useState({
        state: '',
        startDate: null,
        endDate: null,
        agentflowId: '',
        sessionId: ''
    })
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0
    })

    const handleFilterChange = (field, value) => {
        setFilters({
            ...filters,
            [field]: value
        })
    }

    const onDateChange = (field, date) => {
        const updatedDate = new Date(date)
        updatedDate.setHours(0, 0, 0, 0)

        setFilters({
            ...filters,
            [field]: updatedDate
        })
    }

    const handlePageChange = (event, newPage) => {
        setPagination({
            ...pagination,
            page: newPage
        })
    }

    const handleLimitChange = (event) => {
        setPagination({
            ...pagination,
            page: 1, // Reset to first page when changing items per page
            limit: parseInt(event.target.value, 10)
        })
    }

    const applyFilters = () => {
        setLoading(true)
        const params = {
            page: pagination.page,
            limit: pagination.limit
        }

        if (filters.state) params.state = filters.state

        // Create date strings that preserve the exact date values
        if (filters.startDate) {
            const date = new Date(filters.startDate)
            // Format date as YYYY-MM-DD and set to start of day in UTC
            // This ensures the server sees the same date we've selected regardless of timezone
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            params.startDate = `${year}-${month}-${day}T00:00:00.000Z`
        }

        if (filters.endDate) {
            const date = new Date(filters.endDate)
            // Format date as YYYY-MM-DD and set to end of day in UTC
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            params.endDate = `${year}-${month}-${day}T23:59:59.999Z`
        }

        if (filters.agentflowId) params.agentflowId = filters.agentflowId
        if (filters.sessionId) params.sessionId = filters.sessionId

        getAllExecutions.request(params)
    }

    const resetFilters = () => {
        setFilters({
            state: '',
            startDate: null,
            endDate: null,
            agentflowId: '',
            sessionId: ''
        })
        getAllExecutions.request()
    }

    const handleExecutionSelectionChange = (selectedIds) => {
        setSelectedExecutionIds(selectedIds)
    }

    const handleDeleteDialogOpen = () => {
        if (selectedExecutionIds.length > 0) {
            setOpenDeleteDialog(true)
        }
    }

    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false)
    }

    const handleDeleteExecutions = () => {
        deleteExecutionsApi.request(selectedExecutionIds)
        setOpenDeleteDialog(false)
    }

    useEffect(() => {
        getAllExecutions.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (getAllExecutions.data) {
            try {
                const { data, total } = getAllExecutions.data
                if (!Array.isArray(data)) return
                setExecutions(data)
                setPagination((prev) => ({ ...prev, total }))
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllExecutions.data])

    useEffect(() => {
        setLoading(getAllExecutions.loading)
    }, [getAllExecutions.loading])

    useEffect(() => {
        setError(getAllExecutions.error)
    }, [getAllExecutions.error])

    useEffect(() => {
        applyFilters()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page, pagination.limit])

    useEffect(() => {
        if (deleteExecutionsApi.data) {
            // Refresh the executions list
            getAllExecutions.request({
                page: pagination.page,
                limit: pagination.limit
            })
            setSelectedExecutionIds([])
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteExecutionsApi.data])

    useEffect(() => {
        if (getExecutionByIdApi.data) {
            const execution = getExecutionByIdApi.data
            const executionDetails =
                typeof execution.executionData === 'string' ? JSON.parse(execution.executionData) : execution.executionData
            setSelectedExecutionData(executionDetails)
            setSelectedMetadata(omit(execution, ['executionData']))
        }
    }, [getExecutionByIdApi.data])

    return (
        <SplitLayout>
            {/* Left Panel: Header + Filters */}
            <LeftPanel>
                <Typography variant='h2' sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-2px', color: 'primary.main' }}>
                    Agent Executions
                </Typography>
                <Typography variant='h6' sx={{ color: 'text.secondary', fontWeight: 500, mb: 2 }}>
                    Monitor and manage agentflows executions
                </Typography>
                <OutlinedPanel>
                    <VerticalToolbar>
                        <FormControl
                            fullWidth
                            size='small'
                            sx={{
                                mb: 2,
                                background: theme.palette.mode === 'dark' ? 'rgba(30,30,40,0.7)' : 'rgba(255,255,255,0.7)',
                                borderRadius: 2,
                                boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                                border: '1.5px solid #f357a8'
                            }}
                        >
                            <InputLabel id='state-select-label' sx={{ color: '#f357a8' }} shrink>
                                State
                            </InputLabel>
                            <Select
                                labelId='state-select-label'
                                value={filters.state}
                                label='State'
                                onChange={(e) => handleFilterChange('state', e.target.value)}
                                size='small'
                                sx={{ color: 'white', '& .MuiSelect-icon': { color: '#f357a8' } }}
                            >
                                <MenuItem value=''>All</MenuItem>
                                <MenuItem value='INPROGRESS'>In Progress</MenuItem>
                                <MenuItem value='FINISHED'>Finished</MenuItem>
                                <MenuItem value='ERROR'>Error</MenuItem>
                                <MenuItem value='TERMINATED'>Terminated</MenuItem>
                                <MenuItem value='TIMEOUT'>Timeout</MenuItem>
                                <MenuItem value='STOPPED'>Stopped</MenuItem>
                            </Select>
                        </FormControl>
                        <DatePicker
                            selected={filters.startDate}
                            onChange={(date) => onDateChange('startDate', date)}
                            selectsStart
                            startDate={filters.startDate}
                            className='form-control'
                            wrapperClassName='datePicker'
                            maxDate={new Date()}
                            customInput={<TextField size='small' label='Start date' fullWidth />}
                        />
                        <DatePicker
                            selected={filters.endDate}
                            onChange={(date) => onDateChange('endDate', date)}
                            selectsEnd
                            endDate={filters.endDate}
                            className='form-control'
                            wrapperClassName='datePicker'
                            minDate={filters.startDate}
                            maxDate={new Date()}
                            customInput={<TextField size='small' label='End date' fullWidth />}
                        />
                        <TextField
                            fullWidth
                            label='Session ID'
                            value={filters.sessionId}
                            onChange={(e) => handleFilterChange('sessionId', e.target.value)}
                            size='small'
                        />
                        <Stack direction='row' spacing={1} sx={{ mt: 1 }}>
                            <Button variant='contained' color='primary' onClick={applyFilters} size='small'>
                                Apply
                            </Button>
                            <Button variant='outlined' onClick={resetFilters} size='small'>
                                Reset
                            </Button>
                            <Tooltip title='Delete selected executions'>
                                <span>
                                    <IconButton
                                        sx={{ height: 30, width: 30 }}
                                        size='small'
                                        color='error'
                                        onClick={handleDeleteDialogOpen}
                                        edge='end'
                                        disabled={selectedExecutionIds.length === 0}
                                    >
                                        <IconTrash />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Stack>
                    </VerticalToolbar>
                </OutlinedPanel>
            </LeftPanel>
            {/* Right Panel: Table/Content */}
            <RightPanel>
                {error ? (
                    <ErrorBoundary error={error} />
                ) : (
                    <>
                        <ExecutionsListTable
                            data={executions}
                            isLoading={isLoading}
                            onSelectionChange={handleExecutionSelectionChange}
                            onExecutionRowClick={(execution) => {
                                setOpenDrawer(true)
                                const executionDetails =
                                    typeof execution.executionData === 'string'
                                        ? JSON.parse(execution.executionData)
                                        : execution.executionData
                                setSelectedExecutionData(executionDetails)
                                setSelectedMetadata(omit(execution, ['executionData']))
                            }}
                        />
                        {/* Pagination and Page Size Controls */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant='body2'>Items per page:</Typography>
                                <FormControl variant='outlined' size='small' sx={{ minWidth: 80 }}>
                                    <Select value={pagination.limit} onChange={handleLimitChange} displayEmpty>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={1000}>1000</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Pagination
                                count={Math.ceil(pagination.total / pagination.limit)}
                                page={pagination.page}
                                onChange={handlePageChange}
                                color='primary'
                            />
                        </Box>
                        <ExecutionDetails
                            open={openDrawer}
                            execution={selectedExecutionData}
                            metadata={selectedMetadata}
                            onClose={() => setOpenDrawer(false)}
                            onProceedSuccess={() => {
                                setOpenDrawer(false)
                                getAllExecutions.request()
                            }}
                            onUpdateSharing={() => {
                                getAllExecutions.request()
                            }}
                            onRefresh={(executionId) => {
                                getAllExecutions.request()
                                getExecutionByIdApi.request(executionId)
                            }}
                        />
                        {/* Delete Confirmation Dialog */}
                        <Dialog
                            open={openDeleteDialog}
                            onClose={handleDeleteDialogClose}
                            aria-labelledby='alert-dialog-title'
                            aria-describedby='alert-dialog-description'
                        >
                            <DialogTitle id='alert-dialog-title'>Confirm Deletion</DialogTitle>
                            <DialogContent>
                                <DialogContentText id='alert-dialog-description'>
                                    Are you sure you want to delete {selectedExecutionIds.length} execution
                                    {selectedExecutionIds.length !== 1 ? 's' : ''}? This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleDeleteDialogClose} color='primary'>
                                    Cancel
                                </Button>
                                <Button onClick={handleDeleteExecutions} color='error'>
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                        {!isLoading && (!executions || executions.length === 0) && (
                            <EngagingEmptyState>
                                <PulseEmoji>📄</PulseEmoji>
                                <Typography variant='h5' sx={{ fontWeight: 700, mb: 1, mt: 2 }}>
                                    You&apos;re just one click away from running your first execution!
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'text.secondary', mb: 3 }}>
                                    Agent Executions let you monitor and manage your agentflows in real time.
                                </Typography>
                            </EngagingEmptyState>
                        )}
                    </>
                )}
            </RightPanel>
        </SplitLayout>
    )
}

export default AgentExecutions
