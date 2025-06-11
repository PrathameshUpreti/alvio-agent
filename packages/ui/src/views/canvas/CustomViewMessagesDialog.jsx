import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

// material-ui
import { Box, Typography, Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import { StyledButton } from '@/ui-component/button/StyledButton'

// custom components
import GradientDialogWrapper from './GradientDialogWrapper'
import { StyledPaper } from './DialogStyles'

// Main component
const CustomViewMessagesDialog = ({ show, dialogProps, onCancel }) => {
    const theme = useTheme()
    const dispatch = useDispatch()

    return (
        <GradientDialogWrapper show={show} title={dialogProps?.title || 'View Messages'} onClose={onCancel} maxWidth='lg'>
            <StyledPaper elevation={3} sx={{ p: 2, mb: 2, borderRadius: '12px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
                    <Typography variant='body1' sx={{ mb: 2 }}>
                        Messages for this chatflow will appear here with our custom styling.
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto', pt: 2 }}>
                        <Button onClick={onCancel} sx={{ mr: 1 }}>
                            Close
                        </Button>
                        <StyledButton variant='contained'>Export</StyledButton>
                    </Box>
                </Box>
            </StyledPaper>
        </GradientDialogWrapper>
    )
}

CustomViewMessagesDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func
}

export default CustomViewMessagesDialog
