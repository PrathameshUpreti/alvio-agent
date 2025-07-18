import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Box, IconButton, Typography } from '@mui/material'
import { StyledButton } from '@/ui-component/button/StyledButton'

// icons
import { IconCopy, IconChevronLeft } from '@tabler/icons-react'

// ==============================|| CANVAS HEADER ||============================== //

const MarketplaceCanvasHeader = ({ flowName, flowData, onChatflowCopy }) => {
    const theme = useTheme()
    const navigate = useNavigate()

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                px: { xs: 1, sm: 3 },
                py: { xs: 1, sm: 1.5 },
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#f9f9fb',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)',
                mb: 2,
                minHeight: 56
            }}
        >
            <IconButton
                title='Back'
                onClick={() => navigate(-1)}
                sx={{
                    color: theme.palette.text.secondary,
                    borderRadius: 1,
                    p: 1.2,
                    transition: 'background 0.2s',
                    '&:hover': {
                        background: theme.palette.action.hover
                    }
                }}
            >
                <IconChevronLeft stroke={2} size='1.5rem' />
            </IconButton>
            <Typography
                sx={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: { xs: '1.1rem', sm: '1.35rem' },
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    letterSpacing: 1.2,
                    mx: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
                noWrap
            >
                {flowName}
            </Typography>
            <StyledButton
                color='primary'
                variant='text'
                title='Use Chatflow'
                onClick={() => onChatflowCopy(flowData)}
                startIcon={<IconCopy />}
                sx={{
                    borderRadius: 2,
                    fontWeight: 500,
                    minWidth: 0,
                    px: 2,
                    color: theme.palette.primary.main,
                    background: 'transparent',
                    boxShadow: 'none',
                    '&:hover': {
                        background: theme.palette.action.hover,
                        color: theme.palette.primary.dark
                    }
                }}
            >
                Use Template
            </StyledButton>
        </Box>
    )
}

MarketplaceCanvasHeader.propTypes = {
    flowName: PropTypes.string,
    flowData: PropTypes.object,
    onChatflowCopy: PropTypes.func
}

export default MarketplaceCanvasHeader
