import { useSelector } from 'react-redux'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

// ==============================|| ALVIO LOGO ||============================== //

const LogoImage = styled('img')({
    height: '40px',
    width: 'auto'
})

const Logo = () => {
    const customization = useSelector((state) => state.customization)

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LogoImage 
                src="/mainLogo.png" 
                alt="ALVIO Logo"
                sx={{
                    mr: 1.5
                }}
            />
        </Box>
    )
}

export default Logo
