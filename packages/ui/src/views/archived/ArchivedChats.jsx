import { useState } from 'react'
import { useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'
import { Box, Typography, Dialog, DialogContent, IconButton, InputBase, Divider } from '@mui/material'
import PropTypes from 'prop-types'

// icons
import { IconX, IconSearch } from '@tabler/icons-react'

const ArchivedDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '14px',
        overflow: 'hidden',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        background: theme.palette.background.paper,
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)'
    }
}))

const GradientHeader = styled(Box)(({ theme }) => ({
    width: '100%',
    padding: '28px 32px 16px 32px',
    background: 'linear-gradient(135deg, #4f8cff 0%, #7b2ff2 50%, #f357a8 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14
}))

const SearchInputWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.mode === 'dark' ? 'rgba(50, 50, 50, 0.3)' : 'rgba(200, 200, 200, 0.2)',
    borderRadius: 8,
    padding: '6px 12px',
    margin: '20px 32px 0 32px'
}))

const StyledSearchInput = styled(InputBase)(({ theme }) => ({
    flex: 1,
    fontSize: '1rem',
    color: theme.palette.mode === 'dark' ? '#fff' : '#222',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    marginLeft: 8
}))

const ScrollableContent = styled(DialogContent)(({ theme }) => ({
    padding: 0,
    overflowY: 'auto',
    minHeight: 200,
    maxHeight: '60vh',
    // Custom scrollbar
    '&::-webkit-scrollbar': {
        width: 8
    },
    '&::-webkit-scrollbar-thumb': {
        background: theme.palette.mode === 'dark' ? '#444' : '#ccc',
        borderRadius: 4
    },
    '&::-webkit-scrollbar-track': {
        background: 'transparent'
    }
}))

const ArchivedChats = ({ open, onClose }) => {
    const customization = useSelector((state) => state.customization)
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
    }

    return (
        <ArchivedDialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <GradientHeader>
                <Typography variant='h4' sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                    Archived Chats
                </Typography>
                <IconButton onClick={onClose} size='small' sx={{ color: '#fff' }}>
                    <IconX size={22} />
                </IconButton>
            </GradientHeader>
            <SearchInputWrapper>
                <IconSearch size={20} color={customization.isDarkMode ? '#aaa' : '#666'} />
                <StyledSearchInput placeholder='Search Chats' value={searchTerm} onChange={handleSearch} />
            </SearchInputWrapper>
            <ScrollableContent>
                <Divider
                    sx={{
                        my: 2,
                        mx: 4,
                        borderColor: customization.isDarkMode ? 'rgba(128, 128, 128, 0.2)' : 'rgba(200, 200, 200, 0.8)'
                    }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '180px',
                        py: 4
                    }}
                >
                    <Typography variant='body1' color='text.secondary' sx={{ fontWeight: 500, opacity: 0.7 }}>
                        You have no archived conversations.
                    </Typography>
                </Box>
            </ScrollableContent>
        </ArchivedDialog>
    )
}

ArchivedChats.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}

export default ArchivedChats
