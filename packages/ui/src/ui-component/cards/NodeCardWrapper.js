// material-ui
import { styled } from '@mui/material/styles'

// project imports
import MainCard from './MainCard'

const NodeCardWrapper = styled(MainCard)(({ theme }) => ({
    background: theme.palette.card.main,
    color: theme.darkTextPrimary,
    border: `1px solid ${theme.customization?.isDarkMode ? theme.palette.grey[900] + 25 : theme.palette.primary[200] + 75}`,
    width: '300px',
    height: 'auto',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: `0 4px 8px rgba(0, 0, 0, 0.1)`,
    transition: 'all 0.2s ease',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 6px 12px rgba(0, 0, 0, 0.15)`,
        transform: 'translateY(-2px)'
    }
}))

export default NodeCardWrapper
