import { memo } from 'react'
import { EdgeLabelRenderer, useStore, getBezierPath } from 'reactflow'
import PropTypes from 'prop-types'
import { AGENTFLOW_ICONS } from '@/store/constant'
import { useTheme } from '@mui/material/styles'

function EdgeLabel({ transform, isHumanInput, label, color }) {
    return (
        <div
            style={{
                position: 'absolute',
                background: 'transparent',
                left: isHumanInput ? 20 : 10,
                paddingTop: 1,
                color: color,
                fontSize: '0.5rem',
                fontWeight: 700,
                transform,
                zIndex: 1000
            }}
            className='nodrag nopan'
        >
            {label}
        </div>
    )
}

EdgeLabel.propTypes = {
    transform: PropTypes.string,
    isHumanInput: PropTypes.bool,
    label: PropTypes.string,
    color: PropTypes.string
}

const ConnectionLine = ({ fromX, fromY, toX, toY, fromPosition, toPosition }) => {
    const [edgePath] = getBezierPath({
        // we need this little hack in order to display the gradient for a straight line
        sourceX: fromX,
        sourceY: fromY,
        sourcePosition: fromPosition,
        targetX: toX,
        targetY: toY,
        targetPosition: toPosition
    })

    const { connectionHandleId } = useStore()
    const theme = useTheme()
    const nodeName = (connectionHandleId || '').split('_')[0] || ''

    const isLabelVisible = nodeName === 'humanInputAgentflow' || nodeName === 'conditionAgentflow' || nodeName === 'conditionAgentAgentflow'

    const getEdgeLabel = () => {
        let edgeLabel = undefined
        if (nodeName === 'conditionAgentflow' || nodeName === 'conditionAgentAgentflow') {
            const _edgeLabel = connectionHandleId.split('-').pop()
            edgeLabel = (isNaN(_edgeLabel) ? 0 : _edgeLabel).toString()
        }
        if (nodeName === 'humanInputAgentflow') {
            const _edgeLabel = connectionHandleId.split('-').pop()
            edgeLabel = (isNaN(_edgeLabel) ? 0 : _edgeLabel).toString()
            edgeLabel = edgeLabel === '0' ? 'proceed' : 'reject'
        }
        return edgeLabel
    }

    const color =
        AGENTFLOW_ICONS.find((icon) => icon.name === (connectionHandleId || '').split('_')[0] || '')?.color ?? theme.palette.primary.main

    const gradientId = `connection-gradient`
    return (
        <g>
            <defs>
                <linearGradient id={gradientId} x1='0' y1='0' x2='1' y2='1'>
                    <stop offset='0%' stopColor={theme.palette.primary.main} />
                    <stop offset='100%' stopColor={theme.palette.secondary.main} />
                </linearGradient>
            </defs>
            <path
                fill='none'
                stroke={`url(#${gradientId})`}
                strokeWidth={3}
                className='animated'
                d={edgePath}
                style={{ filter: 'drop-shadow(0 0 8px #C837AB)' }}
            />
            <g transform={`translate(${toX - 10}, ${toY - 10}) scale(0.8)`}>
                <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                <path
                    d='M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -20 0c0 -5.523 4.477 -10 10 -10m-.293 6.293a1 1 0 0 0 -1.414 0l-.083 .094a1 1 0 0 0 .083 1.32l2.292 2.293l-2.292 2.293a1 1 0 0 0 1.414 1.414l3 -3a1 1 0 0 0 0 -1.414z'
                    fill={theme.palette.primary.main}
                />
            </g>
            {isLabelVisible && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: 'absolute',
                            left: fromX + 20,
                            top: fromY - 10,
                            background: 'rgba(255,255,255,0.85)',
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            borderRadius: 16,
                            boxShadow: '0 2px 8px rgba(141,54,249,0.10)',
                            padding: '4px 14px',
                            border: `1.5px solid ${theme.palette.secondary.main}`,
                            zIndex: 1000,
                            pointerEvents: 'none',
                            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))'
                        }}
                        className='nodrag nopan'
                    >
                        {getEdgeLabel()}
                    </div>
                </EdgeLabelRenderer>
            )}
        </g>
    )
}

ConnectionLine.propTypes = {
    fromX: PropTypes.number,
    fromY: PropTypes.number,
    toX: PropTypes.number,
    toY: PropTypes.number,
    fromPosition: PropTypes.any,
    toPosition: PropTypes.any
}

export default memo(ConnectionLine)
