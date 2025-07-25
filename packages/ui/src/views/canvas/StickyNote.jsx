import PropTypes from 'prop-types'
import { useContext, useState, memo } from 'react'
import { useSelector } from 'react-redux'

// material-ui
import { useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'

// project imports
import NodeCardWrapper from '@/ui-component/cards/NodeCardWrapper'
import NodeTooltip from '@/ui-component/tooltip/NodeTooltip'
import { IconButton, Box } from '@mui/material'
import { IconCopy, IconTrash } from '@tabler/icons-react'
import { Input } from '@/ui-component/input/Input'

// const
import { flowContext } from '@/store/context/ReactFlowContext'

const StickyNoteBox = styled(NodeCardWrapper)(({ theme, selected }) => ({
    borderRadius: 18,
    boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
    backgroundColor: selected
        ? theme.palette.mode === 'dark'
            ? '#FFD600'
            : '#FFEB3B'
        : theme.palette.mode === 'dark'
        ? '#FFE066'
        : '#FFF9C4',
    border: 'none',
    padding: 0
}))

const StickyNote = ({ data }) => {
    const theme = useTheme()
    const canvas = useSelector((state) => state.canvas)
    const { deleteNode, duplicateNode } = useContext(flowContext)
    const [inputParam] = data.inputParams

    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const getBorderColor = () => {
        if (data.selected) return theme.palette.primary.main
        else if (theme?.customization?.isDarkMode) return theme.palette.grey[900] + 25
        else return theme.palette.grey[900] + 50
    }

    return (
        <>
            <StickyNoteBox
                content={false}
                sx={{
                    padding: 0,
                    borderColor: getBorderColor(),
                    backgroundColor: data.selected ? '#FFDC00' : '#FFE770'
                }}
                border={false}
            >
                <NodeTooltip
                    open={!canvas.canvasDialogShow && open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    disableFocusListener={true}
                    title={
                        <div
                            style={{
                                background: 'transparent',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <IconButton
                                title='Duplicate'
                                onClick={() => {
                                    duplicateNode(data.id)
                                }}
                                sx={{ height: '35px', width: '35px', '&:hover': { color: theme?.palette.primary.main } }}
                                color={theme?.customization?.isDarkMode ? theme.colors?.paper : 'inherit'}
                            >
                                <IconCopy />
                            </IconButton>
                            <IconButton
                                title='Delete'
                                onClick={() => {
                                    deleteNode(data.id)
                                }}
                                sx={{ height: '35px', width: '35px', '&:hover': { color: 'red' } }}
                                color={theme?.customization?.isDarkMode ? theme.colors?.paper : 'inherit'}
                            >
                                <IconTrash />
                            </IconButton>
                        </div>
                    }
                    placement='right-start'
                >
                    <Box>
                        <Input
                            key={data.id}
                            inputParam={inputParam}
                            onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
                            value={data.inputs[inputParam.name] ?? inputParam.default ?? ''}
                            nodes={inputParam?.acceptVariable && reactFlowInstance ? reactFlowInstance.getNodes() : []}
                            edges={inputParam?.acceptVariable && reactFlowInstance ? reactFlowInstance.getEdges() : []}
                            nodeId={data.id}
                        />
                    </Box>
                </NodeTooltip>
            </StickyNoteBox>
        </>
    )
}

StickyNote.propTypes = {
    data: PropTypes.object
}

export default memo(StickyNote)
