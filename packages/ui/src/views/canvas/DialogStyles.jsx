import { styled } from '@mui/material/styles'
import { Dialog, DialogContent, DialogTitle, Box, Paper } from '@mui/material'

// Styled components for dialog styling
export const ModernDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '10px',
        overflow: 'hidden',
        paddingBottom: '20px',
        background: theme.palette.background.paper,
        border: `1.5px solid ${theme.palette.divider}`,
        boxShadow: theme.palette.mode === 'dark' ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(141,54,249,0.10)'
    }
}))

export const ModernDialogTitle = styled(DialogTitle)(({ theme }) => ({
    position: 'relative',
    zIndex: 10,
    fontWeight: 700,
    padding: theme.spacing(2, 2, 1.5, 2),
    color: theme.palette.text.primary
}))

export const ModernDialogContent = styled(DialogContent)(({ theme }) => ({
    position: 'relative',
    zIndex: 10,
    padding: theme.spacing(1, 2, 0, 2),
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
        display: 'none'
    },
    msOverflowStyle: 'none',
    scrollbarWidth: 'none'
}))

export const ModernOverlay = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 1,
    opacity: theme.palette.mode === 'dark' ? 0.8 : 0.5
}))

export const ModernPinkBall = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '60%',
    height: '90%',
    background: 'linear-gradient(to top left, #8D36F9, transparent)',
    borderRadius: '9999px',
    filter: 'blur(80px)',
    transform: 'translate(-20%, 25%)'
}))

export const ModernOrangeBall = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '60%',
    height: '90%',
    background: 'linear-gradient(to top right, #C837AB, transparent)',
    borderRadius: '9999px',
    filter: 'blur(80px)',
    transform: 'translate(20%, 25%)'
}))

export const ModernStyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: '8px',
    background: theme.palette.background.paper,
    border: `1.5px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.mode === 'dark' ? '0 2px 12px rgba(0,0,0,0.18)' : '0 2px 12px rgba(141,54,249,0.08)'
}))

export default {
    ModernDialog,
    ModernDialogTitle,
    ModernDialogContent,
    ModernOverlay,
    ModernPinkBall,
    ModernOrangeBall,
    ModernStyledPaper
}
