import PropTypes from 'prop-types'
import { useContext, useState, useEffect, memo } from 'react'
import { useSelector } from 'react-redux'

// material-ui
import { useTheme } from '@mui/material/styles'
import { IconButton, Box, Typography, Divider, Button, Paper, Chip } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'

// project imports
import NodeInputHandler from './NodeInputHandler'
import NodeOutputHandler from './NodeOutputHandler'
import AdditionalParamsDialog from '@/ui-component/dialog/AdditionalParamsDialog'
import NodeInfoDialog from '@/ui-component/dialog/NodeInfoDialog'

// const
import { baseURL } from '@/store/constant'
import { IconTrash, IconCopy, IconInfoCircle, IconAlertTriangle } from '@tabler/icons-react'
import { flowContext } from '@/store/context/ReactFlowContext'

// styles
import './index.css'

// Replace GlassNodeCard with a new Card style
const ModernNodeCard = styled(Paper)(({ theme, selected }) => ({
    borderRadius: 10,
    background: theme.palette.background.paper,
    boxShadow: selected
        ? `0 0 0 3px ${theme.palette.primary.main}, 0 2px 12px 0 rgba(31, 38, 135, 0.10)`
        : '0 2px 12px 0 rgba(31, 38, 135, 0.08)',
    border: selected ? `2px solid ${theme.palette.primary.main}` : `1.5px solid ${theme.palette.divider}`,
    transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.12s',
    padding: theme.spacing(2, 2),
    minWidth: 220,
    minHeight: 90,
    position: 'relative',
    '&:hover': {
        boxShadow: `0 0 0 2px ${theme.palette.primary.light}, 0 4px 16px 0 rgba(31, 38, 135, 0.12)`,
        transform: 'scale(1.018)'
    },
    '&:active': {
        boxShadow: `0 0 0 4px ${theme.palette.primary.light}`,
        transform: 'scale(0.98)'
    }
}))

const ModernNodeIcon = styled('div')(({ theme }) => ({
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
    border: `2px solid ${theme.palette.primary.main}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(2),
    boxShadow: '0 1px 6px rgba(31,38,135,0.08)'
}))

const GlassNodeActions = styled('div')(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    position: 'absolute',
    top: 10,
    right: 10,
    opacity: 1,
    zIndex: 2
}))

// ===========================|| CANVAS NODE ||=========================== //

const CanvasNode = ({ data }) => {
    const theme = useTheme()
    const canvas = useSelector((state) => state.canvas)
    const { deleteNode, duplicateNode } = useContext(flowContext)

    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [showInfoDialog, setShowInfoDialog] = useState(false)
    const [infoDialogProps, setInfoDialogProps] = useState({})
    const [warningMessage, setWarningMessage] = useState('')
    const [open, setOpen] = useState(false)
    const [isForceCloseNodeInfo, setIsForceCloseNodeInfo] = useState(null)

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const getNodeInfoOpenStatus = () => {
        if (isForceCloseNodeInfo) return false
        else return !canvas.canvasDialogShow && open
    }

    const nodeOutdatedMessage = (oldVersion, newVersion) => `Node version ${oldVersion} outdated\nUpdate to latest version ${newVersion}`

    const nodeVersionEmptyMessage = (newVersion) => `Node outdated\nUpdate to latest version ${newVersion}`

    const onDialogClicked = () => {
        const dialogProps = {
            data,
            inputParams: data.inputParams.filter((inputParam) => !inputParam.hidden).filter((param) => param.additionalParams),
            confirmButtonName: 'Save',
            cancelButtonName: 'Cancel'
        }
        setDialogProps(dialogProps)
        setShowDialog(true)
    }

    const getBorderColor = () => {
        if (data.selected) return theme.palette.primary.main
        else if (theme?.customization?.isDarkMode) return theme.palette.grey[900] + 25
        else return theme.palette.grey[900] + 50
    }

    useEffect(() => {
        const componentNode = canvas.componentNodes.find((nd) => nd.name === data.name)
        if (componentNode) {
            if (!data.version) {
                setWarningMessage(nodeVersionEmptyMessage(componentNode.version))
            } else if (data.version && componentNode.version > data.version) {
                setWarningMessage(nodeOutdatedMessage(data.version, componentNode.version))
            } else if (componentNode.badge === 'DEPRECATING') {
                setWarningMessage(
                    componentNode?.deprecateMessage ??
                        'This node will be deprecated in the next release. Change to a new node tagged with NEW'
                )
            } else {
                setWarningMessage('')
            }
        }
    }, [canvas.componentNodes, data.name, data.version])

    return (
        <>
            <ModernNodeCard elevation={0} selected={data.selected}>
                <Box display='flex' alignItems='center'>
                    <ModernNodeIcon>
                        <img
                            style={{ width: 32, height: 32, objectFit: 'contain' }}
                            src={`${baseURL}/api/v1/node-icon/${data.name}`}
                            alt={data.label}
                        />
                    </ModernNodeIcon>
                    <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.08rem', color: theme.palette.text.primary }}>
                            {data.label}
                        </Typography>
                        {data.tags && data.tags.length > 0 && (
                            <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5 }}>
                                {data.tags.map((tag, idx) => (
                                    <Chip
                                        key={idx}
                                        label={tag}
                                        size='small'
                                        color='primary'
                                        variant='filled'
                                        sx={{ fontWeight: 600, opacity: 0.85 }}
                                    />
                                ))}
                            </Box>
                        )}
                    </Box>
                    <Box flexGrow={1} />
                    <GlassNodeActions>
                        <Tooltip title='Duplicate' arrow>
                            <IconButton aria-label='Duplicate node' onClick={() => duplicateNode(data.id)} size='small'>
                                <IconCopy />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete' arrow>
                            <IconButton aria-label='Delete node' onClick={() => deleteNode(data.id)} size='small'>
                                <IconTrash />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Info' arrow>
                            <IconButton
                                aria-label='Node info'
                                onClick={() => {
                                    setInfoDialogProps({ data })
                                    setShowInfoDialog(true)
                                }}
                                size='small'
                            >
                                <IconInfoCircle />
                            </IconButton>
                        </Tooltip>
                    </GlassNodeActions>
                </Box>
                {warningMessage && (
                    <Box sx={{ mt: 1, mb: 1 }}>
                        <Chip
                            icon={<IconAlertTriangle />}
                            label={warningMessage}
                            color='warning'
                            variant='filled'
                            sx={{ fontWeight: 700, fontSize: '0.95em' }}
                        />
                    </Box>
                )}
                {/* Inputs */}
                {(data.inputAnchors.length > 0 || data.inputParams.length > 0) && (
                    <>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ background: 'rgba(255,255,255,0.18)', p: 1, borderRadius: 2 }}>
                            <Typography sx={{ fontWeight: 600, textAlign: 'center', color: theme.palette.text.secondary }}>
                                Inputs
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                    </>
                )}
                {data.inputAnchors.map((inputAnchor, index) => (
                    <NodeInputHandler key={index} inputAnchor={inputAnchor} data={data} />
                ))}
                {data.inputParams
                    .filter((inputParam) => !inputParam.hidden)
                    .filter((inputParam) => inputParam.display !== false)
                    .map((inputParam, index) => (
                        <NodeInputHandler
                            key={index}
                            inputParam={inputParam}
                            data={data}
                            onHideNodeInfoDialog={(status) => {
                                if (status) {
                                    setIsForceCloseNodeInfo(true)
                                } else {
                                    setIsForceCloseNodeInfo(null)
                                }
                            }}
                        />
                    ))}
                {data.inputParams.find((param) => param.additionalParams) && (
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <Button sx={{ borderRadius: 25, width: '90%', mb: 2 }} variant='outlined' onClick={onDialogClicked}>
                            Additional Parameters
                        </Button>
                    </div>
                )}
                {/* Outputs */}
                {data.outputAnchors.length > 0 && <Divider sx={{ my: 1 }} />}
                {data.outputAnchors.length > 0 && (
                    <Box sx={{ background: 'rgba(255,255,255,0.18)', p: 1, borderRadius: 2 }}>
                        <Typography sx={{ fontWeight: 600, textAlign: 'center', color: theme.palette.text.secondary }}>Output</Typography>
                    </Box>
                )}
                {data.outputAnchors.length > 0 && <Divider sx={{ my: 1 }} />}
                {data.outputAnchors.length > 0 &&
                    data.outputAnchors.map((outputAnchor) => (
                        <NodeOutputHandler key={JSON.stringify(data)} outputAnchor={outputAnchor} data={data} />
                    ))}
            </ModernNodeCard>
            <AdditionalParamsDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={() => setShowDialog(false)}
            ></AdditionalParamsDialog>
            <NodeInfoDialog show={showInfoDialog} dialogProps={infoDialogProps} onCancel={() => setShowInfoDialog(false)}></NodeInfoDialog>
        </>
    )
}

CanvasNode.propTypes = {
    data: PropTypes.object
}

export default memo(CanvasNode)
