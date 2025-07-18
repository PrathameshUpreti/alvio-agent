import { memo, useState, useRef, useEffect, useContext } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { ClickAwayListener, Paper, Popper, Button, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { IconMessage, IconX, IconEraser, IconArrowsMaximize } from '@tabler/icons-react'

// project import
import { StyledFab } from '@/ui-component/button/StyledFab'
import MainCard from '@/ui-component/cards/MainCard'
import Transitions from '@/ui-component/extended/Transitions'
import ChatMessage from './ChatMessage'
import ChatExpandDialog from './ChatExpandDialog'
import { styled } from '@mui/material/styles'

// api
import chatmessageApi from '@/api/chatmessage'

// Hooks
import useConfirm from '@/hooks/useConfirm'
import useNotifier from '@/utils/useNotifier'
import { flowContext } from '@/store/context/ReactFlowContext'

// Const
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from '@/store/actions'

// Utils
import { getLocalStorageChatflow, removeLocalStorageChatHistory } from '@/utils/genericHelper'

// Gradient header for popup
const GradientHeader = styled('div')(({ theme }) => ({
    width: '100%',
    padding: '18px 28px 10px 28px',
    background: 'linear-gradient(135deg, #4f8cff 0%, #7b2ff2 50%, #f357a8 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: 14,
    background: theme.palette.background.paper,
    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
    minWidth: 400,
    maxWidth: 520
}))

const ScrollableMainCard = styled(MainCard)(({ theme }) => ({
    borderRadius: 0,
    background: 'transparent',
    maxHeight: '60vh',
    overflowY: 'auto',
    // Custom scrollbar
    '&::-webkit-scrollbar': {
        width: 8
    },
    '&::-webkit-scrollbar-thumb': {
        background: theme.palette.mode === 'dark' ? '#444' : '#ccc',
        borderRadius: 4
    },
    '&::-webkit-scrollbar-track': {
        background: 'transparent'
    }
}))

const ChatPopUp = ({ chatflowid, isAgentCanvas, onOpenChange }) => {
    const theme = useTheme()
    const { confirm } = useConfirm()
    const dispatch = useDispatch()
    const { clearAgentflowNodeStatus } = useContext(flowContext)

    useNotifier()
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [open, setOpen] = useState(false)
    const [showExpandDialog, setShowExpandDialog] = useState(false)
    const [expandDialogProps, setExpandDialogProps] = useState({})
    const [previews, setPreviews] = useState([])

    const anchorRef = useRef(null)
    const prevOpen = useRef(open)

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }
        setOpen(false)
        if (onOpenChange) onOpenChange(false)
    }

    const handleToggle = () => {
        const newOpenState = !open
        setOpen(newOpenState)
        if (onOpenChange) onOpenChange(newOpenState)
    }

    const expandChat = () => {
        const props = {
            open: true,
            chatflowid: chatflowid
        }
        setExpandDialogProps(props)
        setShowExpandDialog(true)
    }

    const resetChatDialog = () => {
        const props = {
            ...expandDialogProps,
            open: false
        }
        setExpandDialogProps(props)
        clearAgentflowNodeStatus()
        setTimeout(() => {
            const resetProps = {
                ...expandDialogProps,
                open: true
            }
            setExpandDialogProps(resetProps)
        }, 500)
    }

    const clearChat = async () => {
        const confirmPayload = {
            title: `Clear Chat History`,
            description: `Are you sure you want to clear all chat history?`,
            confirmButtonName: 'Clear',
            cancelButtonName: 'Cancel'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            try {
                const objChatDetails = getLocalStorageChatflow(chatflowid)
                if (!objChatDetails.chatId) return
                await chatmessageApi.deleteChatmessage(chatflowid, { chatId: objChatDetails.chatId, chatType: 'INTERNAL' })
                removeLocalStorageChatHistory(chatflowid)
                resetChatDialog()
                enqueueSnackbar({
                    message: 'Succesfully cleared all chat history',
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
            } catch (error) {
                enqueueSnackbar({
                    message: typeof error.response.data === 'object' ? error.response.data.message : error.response.data,
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
            }
        }
    }

    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus()
            if (onOpenChange) onOpenChange(false)
        }
        prevOpen.current = open

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, chatflowid])

    return (
        <>
            <StyledFab
                sx={{ position: 'absolute', right: 20, top: 20 }}
                ref={anchorRef}
                size='small'
                color='secondary'
                aria-label='chat'
                title='Chat'
                onClick={handleToggle}
            >
                {open ? <IconX /> : <IconMessage />}
            </StyledFab>

            {open && (
                <StyledFab
                    sx={{ position: 'absolute', right: 80, top: 20 }}
                    onClick={clearChat}
                    size='small'
                    color='error'
                    aria-label='clear'
                    title='Clear Chat History'
                >
                    <IconEraser />
                </StyledFab>
            )}
            {open && (
                <StyledFab
                    sx={{ position: 'absolute', right: 140, top: 20 }}
                    onClick={expandChat}
                    size='small'
                    color='primary'
                    aria-label='expand'
                    title='Expand Chat'
                >
                    <IconArrowsMaximize />
                </StyledFab>
            )}
            <Popper
                placement='bottom-end'
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [40, 14]
                            }
                        }
                    ]
                }}
                sx={{ zIndex: 1000 }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <StyledPaper>
                            <GradientHeader>
                                <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: 0.5 }}>Chat</span>
                                <IconButton onClick={handleToggle} size='small' sx={{ color: '#fff' }}>
                                    <IconX size={22} />
                                </IconButton>
                            </GradientHeader>
                            <ClickAwayListener onClickAway={handleClose}>
                                <ScrollableMainCard
                                    border={false}
                                    className='cloud-wrapper'
                                    elevation={0}
                                    content={false}
                                    boxShadow={false}
                                >
                                    <ChatMessage
                                        isAgentCanvas={isAgentCanvas}
                                        chatflowid={chatflowid}
                                        open={open}
                                        previews={previews}
                                        setPreviews={setPreviews}
                                    />
                                </ScrollableMainCard>
                            </ClickAwayListener>
                        </StyledPaper>
                    </Transitions>
                )}
            </Popper>
            <ChatExpandDialog
                show={showExpandDialog}
                dialogProps={expandDialogProps}
                isAgentCanvas={isAgentCanvas}
                onClear={clearChat}
                onCancel={() => setShowExpandDialog(false)}
                previews={previews}
                setPreviews={setPreviews}
            ></ChatExpandDialog>
        </>
    )
}

ChatPopUp.propTypes = {
    chatflowid: PropTypes.string,
    isAgentCanvas: PropTypes.bool,
    onOpenChange: PropTypes.func
}

export default memo(ChatPopUp)
