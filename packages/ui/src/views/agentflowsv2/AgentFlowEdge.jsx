import { EdgeLabelRenderer, getBezierPath } from 'reactflow'
import { memo } from 'react'
import PropTypes from 'prop-types'

function EdgeLabel({ transform, isHumanInput, label, color }) {
    return (
        <div
            style={{
                position: 'absolute',
                background: 'transparent',
                left: isHumanInput ? 10 : 0,
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

const AgentFlowEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, markerEnd, selected }) => {
    const xEqual = sourceX === targetX
    const yEqual = sourceY === targetY

    const [edgePath] = getBezierPath({
        // we need this little hack in order to display the gradient for a straight line
        sourceX: xEqual ? sourceX + 0.0001 : sourceX,
        sourceY: yEqual ? sourceY + 0.0001 : sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition
    })

    const gradientId = `edge-gradient-${id}`
    return (
        <>
            <defs>
                <linearGradient id={gradientId} x1='0' y1='0' x2='1' y2='1'>
                    <stop offset='0%' stopColor={data?.sourceColor || '#8D36F9'} />
                    <stop offset='100%' stopColor={data?.targetColor || '#C837AB'} />
                </linearGradient>
            </defs>
            <path
                id={`${id}-selector`}
                className='agent-flow-edge-selector'
                style={{
                    stroke: 'transparent',
                    strokeWidth: 18,
                    fill: 'none',
                    cursor: 'pointer'
                }}
                d={edgePath}
            />
            <path
                id={id}
                className='agent-flow-edge'
                style={{
                    strokeWidth: selected ? 4 : 2.5,
                    stroke: `url(#${gradientId})`,
                    filter: selected ? 'drop-shadow(0 0 8px #C837AB)' : 'drop-shadow(0 2px 8px rgba(141,54,249,0.10))',
                    cursor: 'pointer',
                    opacity: selected ? 1 : 0.85,
                    fill: 'none',
                    transition: 'stroke-width 0.2s, filter 0.2s'
                }}
                d={edgePath}
                markerEnd={markerEnd}
            />
            {data?.edgeLabel && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: 'absolute',
                            left: sourceX + 20,
                            top: sourceY - 10,
                            background: 'rgba(255,255,255,0.75)',
                            color: '#8D36F9',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            borderRadius: 16,
                            boxShadow: '0 2px 8px rgba(141,54,249,0.10)',
                            padding: '4px 14px',
                            border: '1.5px solid #C837AB',
                            zIndex: 1000,
                            pointerEvents: 'none',
                            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))'
                        }}
                        className='nodrag nopan'
                    >
                        {data.edgeLabel}
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    )
}

AgentFlowEdge.propTypes = {
    id: PropTypes.string,
    sourceX: PropTypes.number,
    sourceY: PropTypes.number,
    targetX: PropTypes.number,
    targetY: PropTypes.number,
    sourcePosition: PropTypes.any,
    targetPosition: PropTypes.any,
    style: PropTypes.object,
    data: PropTypes.object,
    markerEnd: PropTypes.any,
    selected: PropTypes.bool
}

export default memo(AgentFlowEdge)
