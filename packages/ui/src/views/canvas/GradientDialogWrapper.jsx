import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'

// Material-UI
import { Box } from '@mui/material'

// Custom styles
import {
    ModernDialog as GradientDialog,
    ModernDialogTitle as GradientDialogTitle,
    ModernDialogContent as GradientDialogContent,
    ModernOverlay as GradientOverlay,
    ModernPinkBall as PinkBall,
    ModernOrangeBall as OrangeBall
} from './DialogStyles'

/**
 * A wrapper component that applies gradient styling to dialogs
 */
const GradientDialogWrapper = ({ show, title, children, onClose, maxWidth = 'md', fullWidth = true }) => {
    const portalElement = document.getElementById('portal')

    const component = show ? (
        <GradientDialog open={show} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth} aria-labelledby='gradient-dialog-title'>
            {/* Gradient background effect */}
            <GradientOverlay>
                <PinkBall />
                <OrangeBall />
            </GradientOverlay>

            {/* Dialog title with relative positioning for z-index */}
            <GradientDialogTitle id='gradient-dialog-title'>{title}</GradientDialogTitle>

            {/* Dialog content with hidden scrollbar */}
            <GradientDialogContent>
                <Box sx={{ position: 'relative', zIndex: 10 }}>{children}</Box>
            </GradientDialogContent>
        </GradientDialog>
    ) : null

    return createPortal(component, portalElement)
}

GradientDialogWrapper.propTypes = {
    show: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
    maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    fullWidth: PropTypes.bool
}

export default GradientDialogWrapper
