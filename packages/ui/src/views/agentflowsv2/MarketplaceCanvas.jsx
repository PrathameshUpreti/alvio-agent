import { useEffect, useState, useCallback, useRef, useContext } from 'react'
import ReactFlow, { Controls, Background, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/style.css'
import '@/views/canvas/index.css'

import { useLocation, useNavigate } from 'react-router-dom'

// material-ui
import { Toolbar, Box, AppBar } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'

// project imports
import AgentFlowNode from './AgentFlowNode'
import AgentFlowEdge from './AgentFlowEdge'
import IterationNode from './IterationNode'
import MarketplaceCanvasHeader from '@/views/marketplaces/MarketplaceCanvasHeader'
import StickyNote from './StickyNote'
import EditNodeDialog from '@/views/agentflowsv2/EditNodeDialog'
import { flowContext } from '@/store/context/ReactFlowContext'

const nodeTypes = { agentFlow: AgentFlowNode, stickyNote: StickyNote, iteration: IterationNode }
const edgeTypes = { agentFlow: AgentFlowEdge }

// Custom canvas background
const CanvasBackground = styled('div')(({ theme }) => ({
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    width: '100%',
    height: '100%',
    background:
        theme.palette.mode === 'dark'
            ? 'linear-gradient(120deg, #232526 0%, #414345 100%)'
            : 'linear-gradient(120deg, #f7f7fa 0%, #e3e3f3 100%)',
    animation: 'gradientMove 12s ease-in-out infinite',
    backgroundSize: '200% 200%',
    borderRadius: 0,
    pointerEvents: 'none'
}))

// ==============================|| CANVAS ||============================== //

const MarketplaceCanvasV2 = () => {
    const theme = useTheme()
    const navigate = useNavigate()

    const { state } = useLocation()
    const { flowData, name } = state

    // ==============================|| ReactFlow ||============================== //

    const [nodes, setNodes, onNodesChange] = useNodesState()
    const [edges, setEdges, onEdgesChange] = useEdgesState()
    const [editNodeDialogOpen, setEditNodeDialogOpen] = useState(false)
    const [editNodeDialogProps, setEditNodeDialogProps] = useState({})

    const reactFlowWrapper = useRef(null)
    const { setReactFlowInstance } = useContext(flowContext)

    // ==============================|| useEffect ||============================== //

    useEffect(() => {
        if (flowData) {
            const initialFlow = JSON.parse(flowData)
            setNodes(initialFlow.nodes || [])
            setEdges(initialFlow.edges || [])
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flowData])

    const onChatflowCopy = (flowData) => {
        const templateFlowData = JSON.stringify(flowData)
        navigate('/v2/agentcanvas', { state: { templateFlowData } })
    }

    // eslint-disable-next-line
    const onNodeDoubleClick = useCallback((event, node) => {
        if (!node || !node.data) return
        if (node.data.name === 'stickyNoteAgentflow') {
            // dont show dialog
        } else {
            const dialogProps = {
                data: node.data,
                inputParams: node.data.inputParams.filter((inputParam) => !inputParam.hidden),
                disabled: true
            }

            setEditNodeDialogProps(dialogProps)
            setEditNodeDialogOpen(true)
        }
    })

    return (
        <>
            <Box sx={{ position: 'relative' }}>
                <CanvasBackground />
                <AppBar
                    enableColorOnDark
                    position='fixed'
                    color='inherit'
                    elevation={1}
                    sx={{
                        bgcolor: theme.palette.background.default
                    }}
                >
                    <Toolbar>
                        <MarketplaceCanvasHeader
                            flowName={name}
                            flowData={JSON.parse(flowData)}
                            onChatflowCopy={(flowData) => onChatflowCopy(flowData)}
                        />
                    </Toolbar>
                </AppBar>
                <Box sx={{ pt: '70px', height: '100vh', width: '100%' }}>
                    <div className='reactflow-parent-wrapper'>
                        <div className='reactflow-wrapper' ref={reactFlowWrapper} style={{ position: 'relative' }}>
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onNodeDoubleClick={onNodeDoubleClick}
                                onInit={setReactFlowInstance}
                                nodeTypes={nodeTypes}
                                edgeTypes={edgeTypes}
                                fitView
                                minZoom={0.1}
                            >
                                <Controls
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        background: theme.palette.background.paper,
                                        borderRadius: 16,
                                        boxShadow: '0 2px 12px rgba(141,54,249,0.10)',
                                        padding: 4
                                    }}
                                />
                                <Background color={theme.palette.mode === 'dark' ? '#393a4a' : '#e3e3f3'} gap={20} />
                                <EditNodeDialog
                                    show={editNodeDialogOpen}
                                    dialogProps={editNodeDialogProps}
                                    onCancel={() => setEditNodeDialogOpen(false)}
                                />
                            </ReactFlow>
                        </div>
                    </div>
                </Box>
            </Box>
        </>
    )
}

export default MarketplaceCanvasV2
