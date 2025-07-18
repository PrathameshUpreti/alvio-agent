import PropTypes from 'prop-types'
import { useState } from 'react'

// material-ui
import { styled, useTheme } from '@mui/material/styles'
import { Box, Typography, Divider, Button } from '@mui/material'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import NodeInputHandler from '@/views/canvas/NodeInputHandler'
import NodeOutputHandler from '@/views/canvas/NodeOutputHandler'
import AdditionalParamsDialog from '@/ui-component/dialog/AdditionalParamsDialog'

// const
import { baseURL } from '@/store/constant'
import LlamaindexPNG from '@/assets/images/llamaindex.png'

const CardWrapper = styled(MainCard)(({ theme }) => ({
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    border: '1.5px solid',
    borderColor: theme.palette.divider,
    width: '300px',
    height: 'auto',
    padding: '10px',
    boxShadow: theme.shadows[2],
    '&:hover': {
        borderColor: theme.palette.primary.main
    }
}))

// ===========================|| CANVAS NODE ||=========================== //

const MarketplaceCanvasNode = ({ data }) => {
    const theme = useTheme()

    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})

    const onDialogClicked = () => {
        const dialogProps = {
            data,
            inputParams: data.inputParams.filter((param) => param.additionalParams),
            disabled: true,
            confirmButtonName: 'Save',
            cancelButtonName: 'Cancel'
        }
        setDialogProps(dialogProps)
        setShowDialog(true)
    }

    return (
        <div style={{ width: 300, margin: 0, padding: 0, position: 'relative' }}>
            <Box sx={{ p: 2 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Box style={{ width: 50, marginRight: 10, padding: 5 }}>
                        <div
                            style={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.largeAvatar,
                                borderRadius: '50%',
                                backgroundColor: theme.palette.background.default,
                                cursor: 'grab',
                                border: `2px solid ${theme.palette.primary.main}`
                            }}
                        >
                            <img
                                style={{ width: '100%', height: '100%', padding: 5, objectFit: 'contain' }}
                                src={`${baseURL}/api/v1/node-icon/${data.name}`}
                                alt='Notification'
                            />
                        </div>
                    </Box>
                    <Box>
                        <Typography
                            sx={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: theme.palette.primary.main
                            }}
                        >
                            {data.label}
                        </Typography>
                    </Box>
                    <div style={{ flexGrow: 1 }}></div>
                    {data.tags && data.tags.includes('LlamaIndex') && (
                        <div style={{ borderRadius: '50%', padding: 15 }}>
                            <img
                                style={{ width: '25px', height: '25px', borderRadius: '50%', objectFit: 'contain' }}
                                src={LlamaindexPNG}
                                alt='LlamaIndex'
                            />
                        </div>
                    )}
                </div>
                {(data.inputAnchors.length > 0 || data.inputParams.length > 0) && (
                    <>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ background: '#f5f5fa', p: 1, borderRadius: 1 }}>
                            <Typography sx={{ fontWeight: 700, textAlign: 'center', color: theme.palette.primary.main }}>Inputs</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                    </>
                )}
                {data.inputAnchors.map((inputAnchor, index) => (
                    <NodeInputHandler disabled={true} key={index} inputAnchor={inputAnchor} data={data} />
                ))}
                {data.inputParams
                    .filter((inputParam) => inputParam.display !== false)
                    .map((inputParam, index) => (
                        <NodeInputHandler disabled={true} key={index} inputParam={inputParam} data={data} />
                    ))}
                {data.inputParams.find((param) => param.additionalParams) && (
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <Button
                            sx={{
                                borderRadius: 25,
                                width: '90%',
                                mb: 2,
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.primary.main,
                                fontWeight: 700,
                                background: 'transparent',
                                '&:hover': {
                                    background: theme.palette.primary.main,
                                    color: theme.palette.getContrastText(theme.palette.primary.main),
                                    borderColor: theme.palette.primary.dark
                                }
                            }}
                            variant='outlined'
                            onClick={onDialogClicked}
                        >
                            Additional Parameters
                        </Button>
                    </div>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ background: '#f5f5fa', p: 1, borderRadius: 1 }}>
                    <Typography sx={{ fontWeight: 700, textAlign: 'center', color: theme.palette.primary.main }}>Output</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                {data.outputAnchors.map((outputAnchor, index) => (
                    <NodeOutputHandler disabled={true} key={index} outputAnchor={outputAnchor} data={data} />
                ))}
            </Box>
            <AdditionalParamsDialog show={showDialog} dialogProps={dialogProps} onCancel={() => setShowDialog(false)} />
        </div>
    )
}

MarketplaceCanvasNode.propTypes = {
    data: PropTypes.object
}

export default MarketplaceCanvasNode
