import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
    HIDE_CANVAS_DIALOG,
    SHOW_CANVAS_DIALOG,
    enqueueSnackbar as enqueueSnackbarAction,
    closeSnackbar as closeSnackbarAction
} from '@/store/actions'
import { v4 as uuidv4 } from 'uuid'

// Material
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, OutlinedInput } from '@mui/material'
import { styled } from '@mui/material/styles'

// Project imports
import { StyledButton } from '@/ui-component/button/StyledButton'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'

// Icons
import { IconX, IconFiles } from '@tabler/icons-react'

// API
import assistantsApi from '@/api/assistants'

// utils
import useNotifier from '@/utils/useNotifier'

// Glassmorphism dialog and input styles
const GlassDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        background: theme.palette.background.paper,
        borderRadius: 18,
        boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.45)' : '0 8px 32px rgba(141,54,249,0.10)',
        border: `1.5px solid ${theme.palette.mode === 'dark' ? '#35373b' : '#e0e0e0'}`,
        padding: 0
    }
}))
const GlassInput = styled(OutlinedInput)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? '#23272f' : '#f8fafc',
    color: theme.palette.mode === 'dark' ? '#fff' : '#23272f',
    border: `1.5px solid ${theme.palette.mode === 'dark' ? '#35373b' : '#e0e0e0'}`,
    borderRadius: 12,
    padding: 18,
    fontSize: 18,
    marginBottom: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    '::placeholder': {
        color: theme.palette.mode === 'dark' ? '#b0b3b8' : '#888'
    }
}))

const AddCustomAssistantDialog = ({ show, dialogProps, onCancel, onConfirm }) => {
    const portalElement = document.getElementById('portal')

    const dispatch = useDispatch()

    // ==============================|| Snackbar ||============================== //

    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [customAssistantName, setCustomAssistantName] = useState('')

    useEffect(() => {
        if (show) dispatch({ type: SHOW_CANVAS_DIALOG })
        else dispatch({ type: HIDE_CANVAS_DIALOG })
        return () => dispatch({ type: HIDE_CANVAS_DIALOG })
    }, [show, dispatch])

    const createCustomAssistant = async () => {
        try {
            const obj = {
                details: JSON.stringify({
                    name: customAssistantName
                }),
                credential: uuidv4(),
                type: 'CUSTOM'
            }
            const createResp = await assistantsApi.createNewAssistant(obj)
            if (createResp.data) {
                enqueueSnackbar({
                    message: 'New Custom Assistant created.',
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
                onConfirm(createResp.data.id)
            }
        } catch (err) {
            enqueueSnackbar({
                message: `Failed to add new Custom Assistant: ${
                    typeof err.response.data === 'object' ? err.response.data.message : err.response.data
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

    const component = show ? (
        <GlassDialog
            fullWidth
            maxWidth='sm'
            open={show}
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle style={{ fontSize: '1rem' }} id='alert-dialog-title'>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <IconFiles style={{ marginRight: '10px' }} />
                    {dialogProps.title}
                </div>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Typography>
                            Name<span style={{ color: 'red' }}>&nbsp;*</span>
                        </Typography>
                        <div style={{ flexGrow: 1 }}></div>
                    </div>
                    <GlassInput
                        size='small'
                        sx={{ mt: 1 }}
                        type='string'
                        fullWidth
                        key='customAssistantName'
                        onChange={(e) => setCustomAssistantName(e.target.value)}
                        value={customAssistantName ?? ''}
                        placeholder='Enter assistant name'
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onCancel()}>Cancel</Button>
                <StyledButton disabled={!customAssistantName} variant='contained' onClick={() => createCustomAssistant()}>
                    {dialogProps.confirmButtonName}
                </StyledButton>
            </DialogActions>
            <ConfirmDialog />
        </GlassDialog>
    ) : null

    return createPortal(component, portalElement)
}

AddCustomAssistantDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func
}

export default AddCustomAssistantDialog
