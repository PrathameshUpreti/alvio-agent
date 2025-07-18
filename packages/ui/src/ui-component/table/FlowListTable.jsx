import { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { styled } from '@mui/material/styles'
import {
    Box,
    Chip,
    Paper,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell'
import FlowListMenu from '../button/FlowListMenu'
import { Link } from 'react-router-dom'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',

    [`&.${tableCellClasses.head}`]: {
        color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.grey[900],
        fontWeight: 600
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        height: 64
    }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    },
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
    }
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    position: 'relative',
    borderRadius: '16px !important',
    overflow: 'hidden',
    border: 'none !important',
    boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.08)',
    '& .MuiTable-root': {
        position: 'relative',
        zIndex: 1,
        backgroundColor: theme.palette.background.paper
    },
    '& .MuiTableHead-root': {
        position: 'relative',
        '&::before': {
            content: 'none'
        }
    }
}))

const GradientBackground = styled(Box)(({ theme }) => ({
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    opacity: theme.palette.mode === 'dark' ? 0.9 : 0.7,
    '& .top-right-gradient': {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '450px',
        height: '400px',
        background: 'linear-gradient(to bottom left, #ff2daf, transparent)',
        borderRadius: '9999px',
        filter: theme.palette.mode === 'dark' ? 'blur(24px)' : 'blur(40px)',
        transform: 'translate(80px, -80px)'
    },
    '& .bottom-left-gradient': {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '450px',
        height: '400px',
        background: 'linear-gradient(to top right, #ff6a00, transparent)',
        borderRadius: '9999px',
        filter: theme.palette.mode === 'dark' ? 'blur(24px)' : 'blur(40px)',
        transform: 'translate(-80px, 80px)'
    }
}))

const getLocalStorageKeyName = (name, isAgentCanvas) => {
    return (isAgentCanvas ? 'agentcanvas' : 'chatflowcanvas') + '_' + name
}

export const FlowListTable = ({ data, images = {}, icons = {}, isLoading, filterFunction, updateFlowsApi, setError, isAgentCanvas }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const localStorageKeyOrder = getLocalStorageKeyName('order', isAgentCanvas)
    const localStorageKeyOrderBy = getLocalStorageKeyName('orderBy', isAgentCanvas)

    const [order, setOrder] = useState(localStorage.getItem(localStorageKeyOrder) || 'desc')
    const [orderBy, setOrderBy] = useState(localStorage.getItem(localStorageKeyOrderBy) || 'updatedDate')

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        const newOrder = isAsc ? 'desc' : 'asc'
        setOrder(newOrder)
        setOrderBy(property)
        localStorage.setItem(localStorageKeyOrder, newOrder)
        localStorage.setItem(localStorageKeyOrderBy, property)
    }

    const onFlowClick = (row) => {
        if (!isAgentCanvas) {
            return `/canvas/${row.id}`
        } else {
            return localStorage.getItem('agentFlowVersion') === 'v2' ? `/v2/agentcanvas/${row.id}` : `/agentcanvas/${row.id}`
        }
    }

    const sortedData = data
        ? [...data].sort((a, b) => {
              if (orderBy === 'name') {
                  return order === 'asc' ? (a.name || '').localeCompare(b.name || '') : (b.name || '').localeCompare(a.name || '')
              } else if (orderBy === 'updatedDate') {
                  return order === 'asc'
                      ? new Date(a.updatedDate) - new Date(b.updatedDate)
                      : new Date(b.updatedDate) - new Date(a.updatedDate)
              }
              return 0
          })
        : []

    return (
        <>
            <StyledTableContainer component={Paper}>
                <GradientBackground>
                    <div className='top-right-gradient' />
                    <div className='bottom-left-gradient' />
                </GradientBackground>
                <Table sx={{ minWidth: 650 }} size='small' aria-label='a dense table'>
                    <TableHead
                        sx={{
                            backgroundColor: customization.isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.02)',
                            height: 56,
                            position: 'relative',
                            zIndex: 2
                        }}
                    >
                        <TableRow>
                            <StyledTableCell component='th' scope='row' style={{ width: '20%' }} key='0'>
                                <TableSortLabel active={orderBy === 'name'} direction={order} onClick={() => handleRequestSort('name')}>
                                    Name
                                </TableSortLabel>
                            </StyledTableCell>
                            <StyledTableCell style={{ width: '25%' }} key='1'>
                                Category
                            </StyledTableCell>
                            <StyledTableCell style={{ width: '30%' }} key='2'>
                                Nodes
                            </StyledTableCell>
                            <StyledTableCell style={{ width: '15%' }} key='3'>
                                <TableSortLabel
                                    active={orderBy === 'updatedDate'}
                                    direction={order}
                                    onClick={() => handleRequestSort('updatedDate')}
                                >
                                    Last Modified Date
                                </TableSortLabel>
                            </StyledTableCell>
                            <StyledTableCell style={{ width: '10%' }} key='4'>
                                Actions
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <>
                                <StyledTableRow>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Skeleton variant='text' />
                                    </StyledTableCell>
                                </StyledTableRow>
                            </>
                        ) : (
                            <>
                                {sortedData.filter(filterFunction).map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell key='0'>
                                            <Tooltip title={row.templateName || row.name}>
                                                <Typography
                                                    sx={{
                                                        display: '-webkit-box',
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        textOverflow: 'ellipsis',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <Link to={onFlowClick(row)} style={{ color: '#2196f3', textDecoration: 'none' }}>
                                                        {row.templateName || row.name}
                                                    </Link>
                                                </Typography>
                                            </Tooltip>
                                        </StyledTableCell>
                                        <StyledTableCell key='1'>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    flexWrap: 'wrap',
                                                    marginTop: 5
                                                }}
                                            >
                                                &nbsp;
                                                {row.category &&
                                                    row.category.split(';').map((tag, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={tag}
                                                            style={{
                                                                marginRight: 5,
                                                                marginBottom: 5,
                                                                background:
                                                                    theme.palette.mode === 'dark'
                                                                        ? 'rgba(141, 54, 249, 0.15)'
                                                                        : 'rgba(141, 54, 249, 0.08)',
                                                                color: theme.palette.mode === 'dark' ? '#d4b6ff' : '#8D36F9',
                                                                border: 'none'
                                                            }}
                                                        />
                                                    ))}
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell key='2'>
                                            {(images[row.id] || icons[row.id]) && (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'start',
                                                        gap: 1
                                                    }}
                                                >
                                                    {[
                                                        ...(images[row.id] || []).map((img) => ({ type: 'image', src: img })),
                                                        ...(icons[row.id] || []).map((ic) => ({
                                                            type: 'icon',
                                                            icon: ic.icon,
                                                            color: ic.color
                                                        }))
                                                    ]
                                                        .slice(0, 5)
                                                        .map((item, index) =>
                                                            item.type === 'image' ? (
                                                                <Box
                                                                    key={item.src}
                                                                    sx={{
                                                                        width: 30,
                                                                        height: 30,
                                                                        borderRadius: '50%',
                                                                        backgroundColor: customization.isDarkMode
                                                                            ? 'rgba(255, 255, 255, 0.1)'
                                                                            : 'rgba(0, 0, 0, 0.05)',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                                    }}
                                                                >
                                                                    <img
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            padding: 5,
                                                                            objectFit: 'contain'
                                                                        }}
                                                                        alt=''
                                                                        src={item.src}
                                                                    />
                                                                </Box>
                                                            ) : (
                                                                <div
                                                                    key={index}
                                                                    style={{
                                                                        width: 30,
                                                                        height: 30,
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        backgroundColor: customization.isDarkMode
                                                                            ? 'rgba(255, 255, 255, 0.1)'
                                                                            : 'rgba(0, 0, 0, 0.05)',
                                                                        borderRadius: '50%',
                                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                                    }}
                                                                >
                                                                    <item.icon size={25} color={item.color} />
                                                                </div>
                                                            )
                                                        )}
                                                    {(images[row.id]?.length || 0) + (icons[row.id]?.length || 0) > 5 && (
                                                        <Typography
                                                            sx={{
                                                                alignItems: 'center',
                                                                display: 'flex',
                                                                fontSize: '.9rem',
                                                                fontWeight: 200,
                                                                color:
                                                                    theme.palette.mode === 'dark'
                                                                        ? 'rgba(255, 255, 255, 0.7)'
                                                                        : 'rgba(0, 0, 0, 0.6)'
                                                            }}
                                                        >
                                                            + {(images[row.id]?.length || 0) + (icons[row.id]?.length || 0) - 5} More
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell key='3'>
                                            <Typography
                                                sx={{
                                                    color:
                                                        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                {moment(row.updatedDate).format('MMMM Do, YYYY HH:mm:ss')}
                                            </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell key='4'>
                                            <Stack
                                                direction={{ xs: 'column', sm: 'row' }}
                                                spacing={1}
                                                justifyContent='center'
                                                alignItems='center'
                                            >
                                                <FlowListMenu
                                                    isAgentCanvas={isAgentCanvas}
                                                    chatflow={row}
                                                    setError={setError}
                                                    updateFlowsApi={updateFlowsApi}
                                                />
                                            </Stack>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </StyledTableContainer>
        </>
    )
}

FlowListTable.propTypes = {
    data: PropTypes.array,
    images: PropTypes.object,
    icons: PropTypes.object,
    isLoading: PropTypes.bool,
    filterFunction: PropTypes.func,
    updateFlowsApi: PropTypes.object,
    setError: PropTypes.func,
    isAgentCanvas: PropTypes.bool
}
