import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from '@/store/actions'

// Material
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, OutlinedInput } from '@mui/material'

// Project imports
import { StyledButton } from '@/ui-component/button/StyledButton'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'

// Icons
import { IconX, IconVariable } from '@tabler/icons-react'

// API
import variablesApi from '@/api/variables'

// Hooks

// utils
import useNotifier from '@/utils/useNotifier'

// const
import { HIDE_CANVAS_DIALOG, SHOW_CANVAS_DIALOG } from '@/store/actions'
import { Dropdown } from '@/ui-component/dropdown/Dropdown'

const variableTypes = [
    {
        label: 'Static',
        name: 'static',
        description: 'Variable value will be read from the value entered below'
    },
    {
        label: 'Runtime',
        name: 'runtime',
        description: 'Variable value will be read from .env file'
    }
]

const AddEditVariableDialog = ({ show, dialogProps, onCancel, onConfirm, setError }) => {
    const portalElement = document.getElementById('portal')

    const dispatch = useDispatch()

    // ==============================|| Snackbar ||============================== //

    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [variableName, setVariableName] = useState('')
    const [variableValue, setVariableValue] = useState('')
    const [variableType, setVariableType] = useState('static')
    const [dialogType, setDialogType] = useState('ADD')
    const [variable, setVariable] = useState({})

    useEffect(() => {
        if (dialogProps.type === 'EDIT' && dialogProps.data) {
            setVariableName(dialogProps.data.name)
            setVariableValue(dialogProps.data.value)
            setVariableType(dialogProps.data.type)
            setDialogType('EDIT')
            setVariable(dialogProps.data)
        } else if (dialogProps.type === 'ADD') {
            setVariableName('')
            setVariableValue('')
            setVariableType('static')
            setDialogType('ADD')
            setVariable({})
        }

        return () => {
            setVariableName('')
            setVariableValue('')
            setVariableType('static')
            setDialogType('ADD')
            setVariable({})
        }
    }, [dialogProps])

    useEffect(() => {
        if (show) dispatch({ type: SHOW_CANVAS_DIALOG })
        else dispatch({ type: HIDE_CANVAS_DIALOG })
        return () => dispatch({ type: HIDE_CANVAS_DIALOG })
    }, [show, dispatch])

    const addNewVariable = async () => {
        try {
            const obj = {
                name: variableName,
                value: variableValue,
                type: variableType
            }
            const createResp = await variablesApi.createVariable(obj)
            if (createResp.data) {
                enqueueSnackbar({
                    message: 'New Variable added',
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
            if (setError) setError(err)
            enqueueSnackbar({
                message: `Failed to add new Variable: ${
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

    const saveVariable = async () => {
        try {
            const saveObj = {
                name: variableName,
                value: variableValue,
                type: variableType
            }

            const saveResp = await variablesApi.updateVariable(variable.id, saveObj)
            if (saveResp.data) {
                enqueueSnackbar({
                    message: 'Variable saved',
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
                onConfirm(saveResp.data.id)
            }
        } catch (error) {
            if (setError) setError(err)
            enqueueSnackbar({
                message: `Failed to save Variable: ${
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

    const component = show ? (
        <Dialog
            fullWidth
            maxWidth='sm'
            open={show}
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    boxShadow: 24,
                    background: (theme) => theme.palette.background.paper,
                    p: 0
                }
            }}
        >
            <DialogTitle sx={{ fontSize: '1.15rem', fontWeight: 700, pb: 0, pt: 3, px: 4 }} id='alert-dialog-title'>
                <Box display='flex' alignItems='center'>
                    <IconVariable style={{ marginRight: '10px', fontSize: 28 }} />
                    {dialogProps.type === 'ADD' ? 'Add Variable' : 'Edit Variable'}
                </Box>
            </DialogTitle>
            <DialogContent
                sx={{
                    px: 4,
                    pt: 2,
                    pb: 1,
                    minHeight: 220,
                    maxHeight: 400,
                    overflowY: 'auto',
                    // Custom scrollbar
                    '&::-webkit-scrollbar': {
                        width: 8
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: (theme) => (theme.palette.mode === 'dark' ? '#444' : '#ccc'),
                        borderRadius: 4
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent'
                    }
                }}
            >
                <Box sx={{ mb: 2 }}>
                    <Typography fontWeight={600} fontSize={15} mb={0.5}>
                        Variable Name<span style={{ color: 'red' }}>&nbsp;*</span>
                    </Typography>
                    <OutlinedInput
                        size='medium'
                        sx={{
                            mt: 0.5,
                            fontSize: 15,
                            borderRadius: 2,
                            background: (theme) => (theme.palette.mode === 'dark' ? '#232323' : '#fafbfc')
                        }}
                        type='string'
                        fullWidth
                        key='variableName'
                        onChange={(e) => setVariableName(e.target.value)}
                        value={variableName ?? ''}
                        id='txtInput_variableName'
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography fontWeight={600} fontSize={15} mb={0.5}>
                        Type<span style={{ color: 'red' }}>&nbsp;*</span>
                    </Typography>
                    <Dropdown
                        key={variableType}
                        name='variableType'
                        options={variableTypes}
                        onSelect={(newValue) => setVariableType(newValue)}
                        value={variableType ?? 'choose an option'}
                        id='dropdown_variableType'
                    />
                </Box>
                {variableType === 'static' && (
                    <Box sx={{ mb: 2 }}>
                        <Typography fontWeight={600} fontSize={15} mb={0.5}>
                            Value<span style={{ color: 'red' }}>&nbsp;*</span>
                        </Typography>
                        <OutlinedInput
                            size='medium'
                            sx={{
                                mt: 0.5,
                                fontSize: 15,
                                borderRadius: 2,
                                background: (theme) => (theme.palette.mode === 'dark' ? '#232323' : '#fafbfc')
                            }}
                            type='string'
                            fullWidth
                            key='variableValue'
                            onChange={(e) => setVariableValue(e.target.value)}
                            value={variableValue ?? ''}
                            id='txtInput_variableValue'
                        />
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 4, pb: 3, pt: 1 }}>
                <StyledButton
                    disabled={!variableName || !variableType || (variableType === 'static' && !variableValue)}
                    variant='contained'
                    sx={{
                        fontWeight: 700,
                        fontSize: 15,
                        borderRadius: 2,
                        px: 4,
                        py: 1.2,
                        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)'
                    }}
                    onClick={() => (dialogType === 'ADD' ? addNewVariable() : saveVariable())}
                    id='btn_confirmAddingNewVariable'
                >
                    {dialogProps.confirmButtonName}
                </StyledButton>
            </DialogActions>
            <ConfirmDialog />
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

AddEditVariableDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    setError: PropTypes.func
}

export default AddEditVariableDialog
