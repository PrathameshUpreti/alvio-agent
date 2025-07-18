import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { List, ListItemButton, Dialog, DialogContent, DialogTitle, Box, OutlinedInput, InputAdornment, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { IconSearch, IconX } from '@tabler/icons-react'

// const
import { baseURL } from '@/store/constant'
import { HIDE_CANVAS_DIALOG, SHOW_CANVAS_DIALOG } from '@/store/actions'
import keySVG from '@/assets/images/key.svg'

const CredentialListDialog = ({ show, dialogProps, onCancel, onCredentialSelected = () => {} }) => {
    const portalElement = document.getElementById('portal')
    const dispatch = useDispatch()
    const theme = useTheme()
    const [searchValue, setSearchValue] = useState('')
    const [componentsCredentials, setComponentsCredentials] = useState([])

    const filterSearch = (value) => {
        setSearchValue(value)
        setTimeout(() => {
            if (value) {
                const searchData = dialogProps.componentsCredentials.filter((crd) => crd.name.toLowerCase().includes(value.toLowerCase()))
                setComponentsCredentials(searchData)
            } else if (value === '') {
                setComponentsCredentials(dialogProps.componentsCredentials)
            }
            // scrollTop()
        }, 500)
    }

    useEffect(() => {
        if (dialogProps.componentsCredentials) {
            setComponentsCredentials(dialogProps.componentsCredentials)
        }
    }, [dialogProps])

    useEffect(() => {
        if (show) dispatch({ type: SHOW_CANVAS_DIALOG })
        else dispatch({ type: HIDE_CANVAS_DIALOG })
        return () => dispatch({ type: HIDE_CANVAS_DIALOG })
    }, [show, dispatch])

    const component = show ? (
        <Dialog
            fullWidth
            maxWidth='md'
            open={show}
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    boxShadow: 24,
                    background: (theme) => theme.palette.background.paper,
                    p: 0
                }
            }}
        >
            <DialogTitle sx={{ fontSize: '1.15rem', fontWeight: 700, pb: 0, pt: 3, px: 4 }} id='alert-dialog-title'>
                {dialogProps.title}
            </DialogTitle>
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxHeight: '75vh',
                    position: 'relative',
                    px: 4,
                    pb: 3,
                    pt: 2,
                    // Custom scrollbar
                    '&::-webkit-scrollbar': {
                        width: 8
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: (theme) => (theme.palette.mode === 'dark' ? '#444' : '#ccc'),
                        borderRadius: 4
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent'
                    }
                }}
            >
                <Box
                    sx={{
                        backgroundColor: 'transparent',
                        pt: 0,
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        mb: 2
                    }}
                >
                    <OutlinedInput
                        sx={{
                            width: '100%',
                            pr: 2,
                            pl: 2,
                            borderRadius: 2,
                            fontSize: 15,
                            background: (theme) => (theme.palette.mode === 'dark' ? '#232323' : '#fafbfc')
                        }}
                        id='input-search-credential'
                        value={searchValue}
                        onChange={(e) => filterSearch(e.target.value)}
                        placeholder='Search credential'
                        startAdornment={
                            <InputAdornment position='start'>
                                <IconSearch stroke={1.5} size='1rem' color={theme.palette.grey[500]} />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment
                                position='end'
                                sx={{
                                    cursor: 'pointer',
                                    color: theme.palette.grey[500],
                                    '&:hover': {
                                        color: theme.palette.grey[900]
                                    }
                                }}
                                title='Clear Search'
                            >
                                <IconX
                                    stroke={1.5}
                                    size='1rem'
                                    onClick={() => filterSearch('')}
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                />
                            </InputAdornment>
                        }
                        aria-describedby='search-helper-text'
                        inputProps={{
                            'aria-label': 'weight'
                        }}
                    />
                </Box>
                <List
                    sx={{
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 2,
                        py: 0,
                        zIndex: 9,
                        borderRadius: '10px',
                        [theme.breakpoints.down('md')]: {
                            maxWidth: 370
                        }
                    }}
                >
                    {[...componentsCredentials].map((componentCredential) => (
                        <ListItemButton
                            alignItems='center'
                            key={componentCredential.name}
                            onClick={() => typeof onCredentialSelected === 'function' && onCredentialSelected(componentCredential)}
                            sx={{
                                border: 1,
                                borderColor: theme.palette.mode === 'dark' ? '#333' : theme.palette.grey[300],
                                borderRadius: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'start',
                                textAlign: 'left',
                                gap: 2,
                                p: 2.5,
                                background: (theme) => (theme.palette.mode === 'dark' ? '#181818' : '#fff'),
                                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
                                transition: 'box-shadow 0.2s, border-color 0.2s',
                                '&:hover': {
                                    boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
                                    borderColor: theme.palette.primary.main
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 1px 4px 0 rgba(0,0,0,0.06)'
                                }}
                            >
                                <img
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        padding: 7,
                                        borderRadius: '50%',
                                        objectFit: 'contain'
                                    }}
                                    alt={componentCredential.name}
                                    src={`${baseURL}/api/v1/components-credentials-icon/${componentCredential.name}`}
                                    onError={(e) => {
                                        e.target.onerror = null
                                        e.target.style.padding = '5px'
                                        e.target.src = keySVG
                                    }}
                                />
                            </Box>
                            <Typography fontWeight={600} fontSize={15}>
                                {componentCredential.label}
                            </Typography>
                        </ListItemButton>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

CredentialListDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onCredentialSelected: PropTypes.func
}

export default CredentialListDialog
