import { useState } from 'react'
import { useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'
import { Box, Typography, Dialog, DialogContent, IconButton, InputBase, Divider } from '@mui/material'

// icons
import { IconX, IconSearch } from '@tabler/icons-react'

const ArchivedDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '6px',
        overflow: 'hidden',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#ffffff'
    }
}))

const SearchInput = styled(InputBase)(({ theme }) => ({
    flex: 1,
    fontSize: '0.875rem',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    backgroundColor: 'transparent'
}))

const ArchivedChats = ({ open, onClose }) => {
    const customization = useSelector((state) => state.customization)
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
    }

    return (
        <ArchivedDialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogContent sx={{ padding: 3, overflowY: 'auto' }}>
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            px: 2.5,
                            pt: 2,
                            pb: 0.5
                        }}
                    >
                        <Typography variant='h4' sx={{ fontWeight: 500 }}>
                            Archived Chats
                        </Typography>
                        <IconButton onClick={onClose} size='small'>
                            <IconX size={20} />
                        </IconButton>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            px: 2.5,
                            pb: 2
                        }}
                    >
                        <Box sx={{ display: 'flex', width: '100%', mt: 1, mb: 1 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: 1,
                                    alignItems: 'center',
                                    backgroundColor: customization.isDarkMode ? 'rgba(50, 50, 50, 0.2)' : 'rgba(200, 200, 200, 0.2)',
                                    borderRadius: '8px',
                                    px: 1
                                }}
                            >
                                <IconSearch size={18} color={customization.isDarkMode ? '#aaa' : '#666'} />
                                <SearchInput placeholder='Search Chats' value={searchTerm} onChange={handleSearch} />
                            </Box>
                        </Box>

                        <Divider
                            sx={{
                                my: 1,
                                borderColor: customization.isDarkMode ? 'rgba(128, 128, 128, 0.2)' : 'rgba(200, 200, 200, 0.8)'
                            }}
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '200px',
                                py: 4
                            }}
                        >
                            <Typography variant='body2' color='textSecondary'>
                                You have no archived conversations.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </ArchivedDialog>
    )
}

export default ArchivedChats
