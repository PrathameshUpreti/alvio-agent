import { useEffect, useRef } from 'react'
import ReactFlow, { Controls, Background, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/style.css'
import '@/views/canvas/index.css'

import { useLocation, useNavigate } from 'react-router-dom'

// material-ui
import { Toolbar, Box, AppBar } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import MarketplaceCanvasNode from './MarketplaceCanvasNode'
import MarketplaceCanvasHeader from './MarketplaceCanvasHeader'
import StickyNote from '../canvas/StickyNote'

const nodeTypes = { customNode: MarketplaceCanvasNode, stickyNote: StickyNote }
const edgeTypes = { buttonedge: '' }

// ==============================|| CANVAS ||============================== //

const MarketplaceCanvas = () => {
    const theme = useTheme()
    const navigate = useNavigate()

    const { state } = useLocation()
    const { flowData, name } = state

    // ==============================|| ReactFlow ||============================== //

    const [nodes, setNodes, onNodesChange] = useNodesState()
    const [edges, setEdges, onEdgesChange] = useEdgesState()

    const reactFlowWrapper = useRef(null)

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
        const isAgentCanvas = (flowData?.nodes || []).some(
            (node) => node.data.category === 'Multi Agents' || node.data.category === 'Sequential Agents'
        )
        const templateFlowData = JSON.stringify(flowData)
        navigate(`/${isAgentCanvas ? 'agentcanvas' : 'canvas'}`, { state: { templateFlowData } })
    }

    return (
        <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', width: '100%' }}>
            <AppBar position='fixed' color='inherit' elevation={1} sx={{ bgcolor: theme.palette.background.paper }}>
                <Toolbar>
                    <MarketplaceCanvasHeader flowName={name} flowData={JSON.parse(flowData)} onChatflowCopy={onChatflowCopy} />
                </Toolbar>
            </AppBar>
            <Box sx={{ pt: '70px', height: '100vh', width: '100%' }}>
                <Box ref={reactFlowWrapper} sx={{ height: '100%', width: '100%' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodesDraggable={false}
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
                                transform: 'translate(-50%, -50%)'
                            }}
                        />
                        <Background color={theme.palette.mode === 'dark' ? '#232627' : '#e0e0e0'} gap={16} />
                    </ReactFlow>
                </Box>
            </Box>
        </Box>
    )
}

export default MarketplaceCanvas
