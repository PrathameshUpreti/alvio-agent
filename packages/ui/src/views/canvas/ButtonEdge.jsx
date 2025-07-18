import { getBezierPath, EdgeText } from 'reactflow'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useContext, memo } from 'react'
import { SET_DIRTY } from '@/store/actions'
import { flowContext } from '@/store/context/ReactFlowContext'
import { IconX } from '@tabler/icons-react'

import './index.css'

const foreignObjectSize = 40

const ButtonEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data, markerEnd }) => {
    const [edgePath, edgeCenterX, edgeCenterY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition
    })

    const { deleteEdge } = useContext(flowContext)

    const dispatch = useDispatch()

    const onEdgeClick = (evt, id) => {
        evt.stopPropagation()
        deleteEdge(id)
        dispatch({ type: SET_DIRTY })
    }

    // Add more vibrant styling for edges
    const isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const themeStroke = isDark ? '#8D36F9' : '#5e35b1'
    const enhancedStyle = {
        ...style,
        strokeWidth: 2.5,
        stroke: themeStroke,
        strokeDasharray: '0', // set to '6 4' for dashed
        filter: 'none',
        transition: 'stroke 0.2s'
    }

    const handleMouseOver = () => {
        // This function is not defined in the original code,
        // but it's implied by the new_code.
        // Assuming it's meant to set a background color.
        // For now, we'll just return a function that does nothing.
        // If the intent was to change the background, it would need to be defined.
        // Since the new_code only provided the structure, we'll keep it simple.
    }

    const handleMouseOut = () => {
        // This function is not defined in the original code,
        // but it's implied by the new_code.
        // Assuming it's meant to set a background color.
        // For now, we'll just return a function that does nothing.
        // If the intent was to change the background, it would need to be defined.
        // Since the new_code only provided the structure, we'll keep it simple.
    }

    return (
        <>
            <defs>
                <linearGradient id='edge-gradient-light' x1='0' y1='0' x2='1' y2='1'>
                    <stop offset='0%' stopColor='#8D36F9' />
                    <stop offset='100%' stopColor='#5e35b1' />
                </linearGradient>
                <linearGradient id='edge-gradient-dark' x1='0' y1='0' x2='1' y2='1'>
                    <stop offset='0%' stopColor='#C837AB' />
                    <stop offset='100%' stopColor='#8D36F9' />
                </linearGradient>
            </defs>
            <path id={id} style={enhancedStyle} className='react-flow__edge-path' d={edgePath} markerEnd={markerEnd} />
            {data && data.label && (
                <EdgeText
                    x={sourceX + 10}
                    y={sourceY + 10}
                    label={data.label}
                    labelStyle={{ fill: '#fff', fontWeight: 600, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))' }}
                    labelBgStyle={{ fill: 'rgba(30,30,40,0.7)', fillOpacity: 0.9 }}
                    labelBgPadding={[6, 10]}
                    labelBgBorderRadius={8}
                />
            )}
            <foreignObject
                width={foreignObjectSize}
                height={foreignObjectSize}
                x={edgeCenterX - foreignObjectSize / 2}
                y={edgeCenterY - foreignObjectSize / 2}
                className='edgebutton-foreignobject'
                requiredExtensions='http://www.w3.org/1999/xhtml'
                style={{ pointerEvents: 'all' }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        background: isDark ? '#23272f' : '#f5f6fa',
                        borderRadius: '50%',
                        boxShadow: '0 1px 4px rgba(31,38,135,0.08)',
                        border: `1.5px solid ${themeStroke}`,
                        transition: 'box-shadow 0.15s'
                    }}
                    onMouseOver={handleMouseOver}
                    onFocus={handleMouseOver}
                    onMouseOut={handleMouseOut}
                    onBlur={handleMouseOut}
                >
                    <button
                        className='edgebutton'
                        onClick={(event) => onEdgeClick(event, id)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            padding: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.15s',
                            color: themeStroke
                        }}
                        aria-label='Delete edge'
                        title='Delete edge'
                    >
                        <IconX stroke={2.2} size='16' color={themeStroke} />
                    </button>
                </div>
            </foreignObject>
        </>
    )
}

ButtonEdge.propTypes = {
    id: PropTypes.string,
    sourceX: PropTypes.number,
    sourceY: PropTypes.number,
    targetX: PropTypes.number,
    targetY: PropTypes.number,
    sourcePosition: PropTypes.any,
    targetPosition: PropTypes.any,
    style: PropTypes.object,
    data: PropTypes.object,
    markerEnd: PropTypes.any
}

export default memo(ButtonEdge)
