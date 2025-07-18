import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ExecutionDetails } from './ExecutionDetails'
import { omit } from 'lodash'

// API
import executionsApi from '@/api/executions'

// Hooks
import useApi from '@/hooks/useApi'

// MUI
import { Box, Card, Stack, Typography, useTheme } from '@mui/material'
import { IconCircleXFilled } from '@tabler/icons-react'
import { alpha } from '@mui/material/styles'
import { styled } from '@mui/material/styles'

// ==============================|| PublicExecutionDetails ||============================== //

const PublicExecutionDetails = () => {
    const { id: executionId } = useParams()
    const theme = useTheme()

    const [execution, setExecution] = useState(null)
    const [selectedMetadata, setSelectedMetadata] = useState({})
    const [isLoading, setLoading] = useState(true)

    const getExecutionByIdPublicApi = useApi(executionsApi.getExecutionByIdPublic)

    useEffect(() => {
        getExecutionByIdPublicApi.request(executionId)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (getExecutionByIdPublicApi.data) {
            const execution = getExecutionByIdPublicApi.data
            const executionDetails =
                typeof execution.executionData === 'string' ? JSON.parse(execution.executionData) : execution.executionData
            setExecution(executionDetails)
            setSelectedMetadata(omit(execution, ['executionData']))
        }
    }, [getExecutionByIdPublicApi.data])

    useEffect(() => {
        setLoading(getExecutionByIdPublicApi.loading)
    }, [getExecutionByIdPublicApi.loading])

    const GlassyErrorCard = styled(Card)(({ theme }) => ({
        background: theme.palette.mode === 'dark' ? 'rgba(44,0,0,0.92)' : 'rgba(255,230,230,0.92)',
        backdropFilter: 'blur(10px)',
        borderRadius: 18,
        boxShadow: theme.shadows[24],
        border: `1px solid ${theme.palette.error.main}`,
        padding: '20px',
        transition: 'background 0.3s'
    }))

    return (
        <>
            {!isLoading ? (
                <>
                    {!execution || getExecutionByIdPublicApi.error ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                            <Box sx={{ maxWidth: '500px', width: '100%' }}>
                                <GlassyErrorCard
                                    variant='outlined'
                                    sx={{
                                        border: `1px solid ${theme.palette.error.main}`,
                                        borderRadius: 2,
                                        padding: '20px',
                                        boxShadow: `0 4px 8px ${alpha(theme.palette.error.main, 0.15)}`
                                    }}
                                >
                                    <Stack spacing={2} alignItems='center'>
                                        <IconCircleXFilled size={50} color={theme.palette.error.main} />
                                        <Typography variant='h3' color='error.main' align='center'>
                                            Invalid Execution
                                        </Typography>
                                        <Typography variant='body1' color='text.secondary' align='center'>
                                            {`The execution you're looking for doesn't exist or you don't have permission to view it.`}
                                        </Typography>
                                    </Stack>
                                </GlassyErrorCard>
                            </Box>
                        </Box>
                    ) : (
                        <ExecutionDetails
                            isPublic={true}
                            execution={execution}
                            metadata={selectedMetadata}
                            onProceedSuccess={() => {
                                getExecutionByIdPublicApi.request(executionId)
                            }}
                            onRefresh={(executionId) => {
                                getExecutionByIdPublicApi.request(executionId)
                            }}
                        />
                    )}
                </>
            ) : null}
        </>
    )
}

export default PublicExecutionDetails
