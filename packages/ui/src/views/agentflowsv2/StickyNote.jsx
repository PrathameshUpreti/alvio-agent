import PropTypes from 'prop-types'
import { useRef, useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import { NodeToolbar } from 'reactflow'

// material-ui
import { styled, useTheme, alpha, darken, lighten } from '@mui/material/styles'

// project imports
import { ButtonGroup, IconButton, Box } from '@mui/material'
import { IconCopy, IconTrash } from '@tabler/icons-react'
import { Input } from '@/ui-component/input/Input'
import MainCard from '@/ui-component/cards/MainCard'

// const
import { flowContext } from '@/store/context/ReactFlowContext'

const CardWrapper = styled(MainCard)(({ theme }) => ({
    background: theme.palette.card.main,
    color: theme.darkTextPrimary,
    border: 'solid 1px',
    width: 'max-content',
    height: 'auto',
    padding: '10px',
    boxShadow: 'none'
}))

const StyledNodeToolbar = styled(NodeToolbar)(({ theme }) => ({
    backgroundColor: theme.palette.card.main,
    color: theme.darkTextPrimary,
    padding: '5px',
    borderRadius: '10px',
    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
}))

const GlassNoteCard = styled('div')(({ theme, selected }) => ({
    background: theme.palette.mode === 'dark' ? 'rgba(30, 30, 40, 0.85)' : 'rgba(255,255,200,0.65)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: 18,
    border: selected ? `2.5px solid ${theme.palette.primary.main}` : '2px solid rgba(141,54,249,0.10)',
    boxShadow: selected
        ? '0 0 0 4px ' + theme.palette.primary.main + ', 0 8px 32px 0 rgba(141,54,249,0.18)'
        : '0 4px 24px 0 rgba(141,54,249,0.10)',
    minWidth: 180,
    minHeight: 60,
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    transition: 'box-shadow 0.3s, border-color 0.3s, transform 0.18s'
}))

const StickyNote = ({ data }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const ref = useRef(null)

    const { reactFlowInstance, deleteNode, duplicateNode } = useContext(flowContext)
    const [inputParam] = data.inputParams
    const [isHovered, setIsHovered] = useState(false)

    const defaultColor = '#666666' // fallback color if data.color is not present
    const nodeColor = data.color || defaultColor

    // Get different shades of the color based on state
    const getStateColor = () => {
        if (data.selected) return nodeColor
        if (isHovered) return alpha(nodeColor, 0.8)
        return alpha(nodeColor, 0.5)
    }

    const getBackgroundColor = () => {
        if (customization.isDarkMode) {
            return isHovered ? darken(nodeColor, 0.7) : darken(nodeColor, 0.8)
        }
        return isHovered ? lighten(nodeColor, 0.8) : lighten(nodeColor, 0.9)
    }

    return (
        <div ref={ref} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <StyledNodeToolbar>
                <ButtonGroup sx={{ gap: 1 }} variant='outlined' aria-label='Basic button group'>
                    <IconButton
                        size={'small'}
                        title='Duplicate'
                        onClick={() => {
                            duplicateNode(data.id)
                        }}
                        sx={{
                            color: customization.isDarkMode ? 'white' : 'inherit',
                            '&:hover': {
                                color: theme.palette.primary.main
                            }
                        }}
                    >
                        <IconCopy size={20} />
                    </IconButton>
                    <IconButton
                        size={'small'}
                        title='Delete'
                        onClick={() => {
                            deleteNode(data.id)
                        }}
                        sx={{
                            color: customization.isDarkMode ? 'white' : 'inherit',
                            '&:hover': {
                                color: theme.palette.error.main
                            }
                        }}
                    >
                        <IconTrash size={20} />
                    </IconButton>
                </ButtonGroup>
            </StyledNodeToolbar>
            <GlassNoteCard selected={data.selected}>
                <Box sx={{ width: '100%' }}>
                    <Input
                        key={data.id}
                        placeholder={inputParam.placeholder}
                        inputParam={inputParam}
                        onChange={(newValue) => (data.inputs[inputParam.name] = newValue)}
                        value={data.inputs[inputParam.name] ?? inputParam.default ?? ''}
                        nodes={reactFlowInstance ? reactFlowInstance.getNodes() : []}
                        edges={reactFlowInstance ? reactFlowInstance.getEdges() : []}
                        nodeId={data.id}
                    />
                </Box>
            </GlassNoteCard>
        </div>
    )
}

StickyNote.propTypes = {
    data: PropTypes.object
}

export default StickyNote
