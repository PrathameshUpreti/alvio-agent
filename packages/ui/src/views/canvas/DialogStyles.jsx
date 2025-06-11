import { styled } from '@mui/material/styles'
import { Dialog, DialogContent, DialogTitle, Box, Paper } from '@mui/material'

// Styled components for dialog styling
export const GradientDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '16px',
        overflow: 'hidden',
        paddingBottom: '24px',
        background:
            theme.palette.mode === 'dark'
                ? 'linear-gradient(to bottom right, rgb(40, 45, 50), rgb(30, 35, 40))'
                : 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(128, 128, 128, 0.2)' : 'rgba(14, 165, 233, 0.15)',
        boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)'
    }
}))

export const GradientDialogTitle = styled(DialogTitle)(({ theme }) => ({
    position: 'relative',
    zIndex: 10,
    fontWeight: 600,
    padding: theme.spacing(3, 3, 2, 3),
    color: theme.palette.mode === 'dark' ? '#f0f4f8' : '#0f172a'
}))

export const GradientDialogContent = styled(DialogContent)(({ theme }) => ({
    position: 'relative',
    zIndex: 10,
    padding: theme.spacing(1, 3, 0, 3),
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
        display: 'none'
    },
    msOverflowStyle: 'none' /* IE and Edge */,
    scrollbarWidth: 'none' /* Firefox */
}))

export const GradientOverlay = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 1,
    opacity: theme.palette.mode === 'dark' ? 0.8 : 0.5
}))

export const PinkBall = styled(Box)(({ theme }) => ({
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

export const OrangeBall = styled(Box)(({ theme }) => ({
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

export const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: '12px',
    background: theme.palette.mode === 'dark' ? 'rgba(50, 55, 60, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' ? 'rgba(128, 128, 128, 0.2)' : 'rgba(14, 165, 233, 0.15)'
}))

export default {
    GradientDialog,
    GradientDialogTitle,
    GradientDialogContent,
    GradientOverlay,
    PinkBall,
    OrangeBall,
    StyledPaper
}
