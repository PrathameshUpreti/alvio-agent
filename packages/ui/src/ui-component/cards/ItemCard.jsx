import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

// material-ui
import { styled } from '@mui/material/styles'
import { Box, Grid, Typography, useTheme } from '@mui/material'

// project imports
import MainCard from '@/ui-component/cards/MainCard'

const CardWrapper = styled(MainCard)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? 'linear-gradient(to bottom right, #232627, #1A1D1E) !important' : 'white',
    color: theme.darkTextPrimary,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: theme.palette.mode === 'dark' ? '0 10px 20px rgba(0, 0, 0, 0.4)' : '0 10px 20px rgba(0, 0, 0, 0.08)',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateY(-5px)',
        transition: 'all 0.2s ease',
        boxShadow: theme.palette.mode === 'dark' ? '0 10px 20px rgba(0, 0, 0, 0.5)' : '0 10px 20px rgba(0, 0, 0, 0.12)'
    },
    height: '100%',
    minHeight: '160px',
    maxHeight: '300px',
    width: '100%',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-line',
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' ? 'rgba(128, 128, 128, 0.2)' : 'rgb(229, 231, 235)'
}))

// Gradient overlay elements
const GradientOverlay = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    position: 'absolute',
    inset: 0,
    opacity: theme.palette.mode === 'dark' ? '0.9' : '0.5',
    pointerEvents: 'none',
    zIndex: 0
}))

const PurpleBall = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    right: 0,
    width: '180px',
    height: '180px',
    background: 'linear-gradient(to bottom left, #ff2daf, transparent)',
    borderRadius: '9999px',
    filter: theme.palette.mode === 'dark' ? 'blur(24px)' : 'blur(40px)',
    transform: 'translate(80px, -80px)'
}))

const PinkBall = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '180px',
    height: '180px',
    background: 'linear-gradient(to top right, #ff6a00, transparent)',
    borderRadius: '9999px',
    filter: theme.palette.mode === 'dark' ? 'blur(24px)' : 'blur(40px)',
    transform: 'translate(-80px, 80px)'
}))

// ===========================|| CONTRACT CARD ||=========================== //

const ItemCard = ({ data, images, icons, onClick }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    return (
        <CardWrapper content={false} onClick={onClick} sx={{ borderRadius: '6px' }}>
            {/* Gradient Background Effects */}
            <GradientOverlay>
                <PurpleBall />
                <PinkBall />
            </GradientOverlay>

            {/* Card Content */}
            <Box sx={{ height: '100%', p: 2.25, position: 'relative', zIndex: 10 }}>
                <Grid container justifyContent='space-between' direction='column' sx={{ height: '100%', gap: 3 }}>
                    <Box display='flex' flexDirection='column' sx={{ width: '100%' }}>
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                overflow: 'hidden'
                            }}
                        >
                            {data.iconSrc && (
                                <div
                                    style={{
                                        width: 35,
                                        height: 35,
                                        display: 'flex',
                                        flexShrink: 0,
                                        marginRight: 10,
                                        borderRadius: '50%',
                                        backgroundImage: `url(${data.iconSrc})`,
                                        backgroundSize: 'contain',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center center'
                                    }}
                                ></div>
                            )}
                            {!data.iconSrc && data.color && (
                                <div
                                    style={{
                                        width: 35,
                                        height: 35,
                                        display: 'flex',
                                        flexShrink: 0,
                                        marginRight: 10,
                                        borderRadius: '50%',
                                        background: data.color
                                    }}
                                ></div>
                            )}
                            <Typography
                                sx={{
                                    display: '-webkit-box',
                                    fontSize: '1.25rem',
                                    fontWeight: 500,
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#2d2d2d'
                                }}
                            >
                                {data.templateName || data.name}
                            </Typography>
                        </div>
                        {data.description && (
                            <span
                                style={{
                                    display: '-webkit-box',
                                    marginTop: 10,
                                    overflowWrap: 'break-word',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    color: theme.palette.mode === 'dark' ? '#9CA3AF' : '#6B7280'
                                }}
                            >
                                {data.description}
                            </span>
                        )}
                    </Box>
                    {(images?.length > 0 || icons?.length > 0) && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'start',
                                gap: 1,
                                position: 'relative',
                                zIndex: 1
                            }}
                        >
                            {[
                                ...(images || []).map((img) => ({ type: 'image', src: img })),
                                ...(icons || []).map((ic) => ({ type: 'icon', icon: ic.icon, color: ic.color }))
                            ]
                                .slice(0, 3)
                                .map((item, index) =>
                                    item.type === 'image' ? (
                                        <Box
                                            key={item.src}
                                            sx={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: '50%',
                                                background: 'linear-gradient(to right, #8D36F9, #C837AB)'
                                            }}
                                        >
                                            <img
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    padding: 5,
                                                    objectFit: 'contain',
                                                    filter: 'invert(1)'
                                                }}
                                                alt=''
                                                src={item.src}
                                            />
                                        </Box>
                                    ) : (
                                        <div
                                            key={index}
                                            style={{
                                                width: 30,
                                                height: 30,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <item.icon size={25} color={item.color} />
                                        </div>
                                    )
                                )}
                            {images?.length + (icons?.length || 0) > 3 && (
                                <Typography
                                    sx={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        fontSize: '.9rem',
                                        fontWeight: 200,
                                        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                                    }}
                                >
                                    + {images?.length + (icons?.length || 0) - 3} More
                                </Typography>
                            )}
                        </Box>
                    )}
                </Grid>
            </Box>
        </CardWrapper>
    )
}

ItemCard.propTypes = {
    data: PropTypes.object,
    images: PropTypes.array,
    icons: PropTypes.array,
    onClick: PropTypes.func
}

export default ItemCard
