import PropTypes from 'prop-types'
import { Backdrop, CircularProgress } from '@mui/material'

export const BackdropLoader = ({ open }) => {
    return (
        <div>
            <Backdrop
                sx={{
                    color: (theme) => theme.palette.text.primary,
                    backgroundColor: (theme) => theme.palette.background.paper,
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={open}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
        </div>
    )
}

BackdropLoader.propTypes = {
    open: PropTypes.bool
}
