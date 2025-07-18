import { styled } from '@mui/material/styles'
import { Fab } from '@mui/material'

export const StyledFab = styled(Fab)(({ theme, color = 'primary' }) => {
    // Only allow palette keys that exist, fallback to primary
    const allowedColors = ['primary', 'secondary', 'error', 'warning', 'success', 'info', 'orange', 'teal', 'dark']
    let paletteKey = allowedColors.includes(color) ? color : 'primary'
    // Special case for 'default', use a neutral/grey background
    if (color === 'default') {
        return {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            '&:hover': {
                backgroundColor: theme.palette.grey[200],
                backgroundImage: `linear-gradient(rgb(0 0 0/6%) 0 0)`
            }
        }
    }
    return {
        color: 'white',
        backgroundColor: theme.palette[paletteKey].main,
        '&:hover': {
            backgroundColor: theme.palette[paletteKey].main,
            backgroundImage: `linear-gradient(rgb(0 0 0/10%) 0 0)`
        }
    }
})
