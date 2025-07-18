import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Material
import { Typography, Box, Dialog, DialogContent, DialogTitle, Button, Tooltip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { IconCopy, IconX, IconLink } from '@tabler/icons-react'
import { styled } from '@mui/material/styles'

// Constants
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from '@/store/actions'

// API
import executionsApi from '@/api/executions'
import useApi from '@/hooks/useApi'

const GlassyDialogContent = styled(DialogContent)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: 18,
    boxShadow: theme.shadows[24],
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(3)
}))
const LinkPill = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.main),
    borderRadius: 999,
    padding: '10px 24px',
    fontWeight: 600,
    fontSize: 16,
    boxShadow: theme.shadows[2],
    marginRight: theme.spacing(2),
    transition: 'background 0.2s',
    overflow: 'hidden'
}))

const ShareExecutionDialog = ({ show, executionId, onClose, onUnshare }) => {
    const portalElement = document.getElementById('portal')
    const theme = useTheme()
    const dispatch = useDispatch()
    const customization = useSelector((state) => state.customization)
    const [copied, setCopied] = useState(false)

    const updateExecutionApi = useApi(executionsApi.updateExecution)

    // Create shareable link
    const origin = window.location.origin
    const shareableLink = `${origin}/execution/${executionId}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareableLink)
        setCopied(true)

        // Show success message
        dispatch(
            enqueueSnackbarAction({
                message: 'Link copied to clipboard',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'success',
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => dispatch(closeSnackbarAction(key))}>
                            <IconX />
                        </Button>
                    )
                }
            })
        )

        // Reset copied state after 2 seconds
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    const handleUnshare = () => {
        updateExecutionApi.request(executionId, { isPublic: false })
        if (onUnshare) onUnshare()
        onClose()
    }

    const component = show ? (
        <Dialog open={show} onClose={onClose} maxWidth='sm' fullWidth aria-labelledby='share-dialog-title'>
            <DialogTitle id='share-dialog-title' sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                Public Trace Link
            </DialogTitle>
            <GlassyDialogContent>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    Anyone with the link below can view this execution trace.
                </Typography>
                <LinkPill>
                    <IconLink size={20} style={{ marginRight: '8px', color: theme.palette.text.secondary }} />
                    <Typography
                        variant='body2'
                        sx={{
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: theme.palette.primary.main,
                            mr: 1
                        }}
                    >
                        {shareableLink}
                    </Typography>
                    <Tooltip title={copied ? 'Copied!' : 'Copy link'}>
                        <Button
                            variant='text'
                            color='primary'
                            onClick={copyToClipboard}
                            startIcon={<IconCopy size={18} />}
                            sx={{ borderRadius: 999, fontWeight: 600 }}
                        >
                            Copy
                        </Button>
                    </Tooltip>
                </LinkPill>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button color='error' onClick={handleUnshare} sx={{ mr: 1, borderRadius: 999, fontWeight: 600 }}>
                        Unshare
                    </Button>
                    <Button onClick={onClose} sx={{ borderRadius: 999, fontWeight: 600 }}>
                        Close
                    </Button>
                </Box>
            </GlassyDialogContent>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

ShareExecutionDialog.propTypes = {
    show: PropTypes.bool,
    executionId: PropTypes.string,
    onClose: PropTypes.func,
    onUnshare: PropTypes.func
}

export default ShareExecutionDialog
