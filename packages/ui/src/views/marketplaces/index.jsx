import * as React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// Import futuristic styles
import './futuristic-styles.css'

// material-ui
import {
    Box,
    ToggleButton,
    InputLabel,
    FormControl,
    Select,
    OutlinedInput,
    Checkbox,
    ListItemText,
    Skeleton,
    FormControlLabel,
    ToggleButtonGroup,
    MenuItem,
    Button,
    Tabs,
    Tab,
    Typography,
    Paper
} from '@mui/material'
import { useTheme, styled } from '@mui/material/styles'
import { IconLayoutGrid, IconList, IconX, IconPlus } from '@tabler/icons-react'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import ItemCard from '@/ui-component/cards/ItemCard'
import ToolDialog from '@/views/tools/ToolDialog'
import { MarketplaceTable } from '@/ui-component/table/MarketplaceTable'
import ErrorBoundary from '@/ErrorBoundary'
import { closeSnackbar as closeSnackbarAction, enqueueSnackbar as enqueueSnackbarAction } from '@/store/actions'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'

// API
import marketplacesApi from '@/api/marketplaces'

// Hooks
import useApi from '@/hooks/useApi'
import useConfirm from '@/hooks/useConfirm'

// const
import { baseURL, AGENTFLOW_ICONS } from '@/store/constant'
import { gridSpacing } from '@/store/constant'
import useNotifier from '@/utils/useNotifier'

const badges = ['POPULAR', 'NEW']
const types = ['Chatflow', 'Agentflow', 'AgentflowV2', 'Tool']
const framework = ['Langchain', 'LlamaIndex']
const MenuProps = {
    PaperProps: {
        sx: {
            width: 160,
            background: (theme) => theme.palette.background.paper,
            border: '1px solid',
            borderColor: (theme) => theme.palette.divider
        }
    }
}

// Custom styled components for futuristic design
const FuturisticContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background:
        theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0a0a0b 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0a0a0b 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 25%, #f1f3f6 50%, #ffffff 75%, #f8f9fa 100%)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
            radial-gradient(circle at 20% 20%, rgba(255, 143, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(171, 2, 201, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(138, 1, 161, 0.05) 0%, transparent 50%)
        `,
        zIndex: 1,
        pointerEvents: 'none'
    }
}))

const GlassmorphismCard = styled(MainCard)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? 'rgba(138, 1, 161, 0.1)' : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 143, 0, 0.2)',
    borderRadius: '20px',
    boxShadow:
        theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 143, 0, 0.1)'
            : '0 8px 32px rgba(138, 1, 161, 0.1), inset 0 1px 0 rgba(255, 143, 0, 0.2)',
    position: 'relative',
    zIndex: 2,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow:
            theme.palette.mode === 'dark'
                ? '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 143, 0, 0.2)'
                : '0 20px 40px rgba(138, 1, 161, 0.2), inset 0 1px 0 rgba(255, 143, 0, 0.3)'
    }
}))

const NeonHeader = styled(Typography)(({ theme }) => ({
    background: 'linear-gradient(45deg, #ff8f00 30%, #ffd700 70%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 800,
    fontSize: '3rem',
    textAlign: 'center',
    marginBottom: '1rem',
    position: 'relative',
    textShadow: theme.palette.mode === 'dark' ? '0 0 20px rgba(255, 143, 0, 0.5)' : 'none',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100px',
        height: '3px',
        background: 'linear-gradient(90deg, #ff8f00, #ffd700, #ab02c9)',
        borderRadius: '2px'
    }
}))

const FuturisticButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #ff8f00 30%, #ab02c9 90%)',
    border: 'none',
    borderRadius: '25px',
    color: 'white',
    fontWeight: 600,
    padding: '12px 24px',
    textTransform: 'none',
    boxShadow: '0 4px 15px rgba(255, 143, 0, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
        transition: 'left 0.5s'
    },
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(255, 143, 0, 0.4)',
        '&::before': {
            left: '100%'
        }
    }
}))

const FuturisticSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 143, 0, 0.3)',
        borderRadius: '15px',
        transition: 'all 0.3s ease'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ff8f00',
        boxShadow: '0 0 10px rgba(255, 143, 0, 0.2)'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ab02c9',
        boxShadow: '0 0 15px rgba(171, 2, 201, 0.3)'
    },
    '& .MuiSelect-select': {
        background: theme.palette.mode === 'dark' ? 'rgba(138, 1, 161, 0.1)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)'
    }
}))

const AnimatedToggleButton = styled(ToggleButton)(({ theme }) => ({
    border: '1px solid rgba(255, 143, 0, 0.3)',
    borderRadius: '12px',
    background: theme.palette.mode === 'dark' ? 'rgba(138, 1, 161, 0.1)' : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        background: 'rgba(255, 143, 0, 0.1)',
        borderColor: '#ff8f00',
        transform: 'scale(1.05)'
    },
    '&.Mui-selected': {
        background: 'linear-gradient(45deg, #ff8f00 30%, #ab02c9 90%)',
        color: 'white',
        borderColor: 'transparent',
        '&:hover': {
            background: 'linear-gradient(45deg, #ff8f00 30%, #ab02c9 90%)'
        }
    }
}))

const GlowingTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTabs-indicator': {
        background: 'linear-gradient(90deg, #ff8f00, #ffd700)',
        height: '3px',
        borderRadius: '2px',
        boxShadow: '0 0 10px rgba(255, 143, 0, 0.5)'
    },
    '& .MuiTab-root': {
        fontWeight: 600,
        fontSize: '1.1rem',
        textTransform: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
            color: '#ff8f00',
            textShadow: '0 0 8px rgba(255, 143, 0, 0.5)'
        },
        '&.Mui-selected': {
            color: '#ff8f00',
            textShadow: '0 0 8px rgba(255, 143, 0, 0.5)'
        }
    }
}))

const FloatingUsecaseChip = styled(FormControlLabel)(({ theme, disabled }) => ({
    margin: '4px',
    '& .MuiFormControlLabel-label': {
        background: disabled
            ? 'rgba(128, 128, 128, 0.2)'
            : 'linear-gradient(45deg, rgba(255, 143, 0, 0.1) 30%, rgba(171, 2, 201, 0.1) 90%)',
        backdropFilter: 'blur(10px)',
        border: disabled ? '1px solid rgba(128, 128, 128, 0.3)' : '1px solid rgba(255, 143, 0, 0.3)',
        borderRadius: '20px',
        padding: '8px 16px',
        fontSize: '0.9rem',
        fontWeight: 500,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        '&:hover': {
            background: disabled
                ? 'rgba(128, 128, 128, 0.2)'
                : 'linear-gradient(45deg, rgba(255, 143, 0, 0.2) 30%, rgba(171, 2, 201, 0.2) 90%)',
            borderColor: disabled ? 'rgba(128, 128, 128, 0.3)' : '#ff8f00',
            transform: disabled ? 'none' : 'translateY(-2px)',
            boxShadow: disabled ? 'none' : '0 4px 15px rgba(255, 143, 0, 0.2)'
        }
    },
    '& .MuiCheckbox-root': {
        display: 'none'
    }
}))

const PulsingIcon = styled(Box)(({ theme }) => ({
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    '@keyframes pulse': {
        '0%, 100%': {
            opacity: 1
        },
        '50%': {
            opacity: 0.5
        }
    }
}))

// Add new styled components for advanced UI
const AdvancedHero = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    padding: theme.spacing(3, 0, 2, 0),
    borderBottom: `2px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(2)
}))

const HeroTitleRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5)
}))

const HeroDivider = styled(Box)(({ theme }) => ({
    width: 80,
    height: 4,
    borderRadius: 2,
    background: 'linear-gradient(90deg, #ff8f00, #ffd700, #ab02c9)',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
}))

const GlassyToolbar = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    background: theme.palette.mode === 'dark' ? 'rgba(138, 1, 161, 0.12)' : 'rgba(255,255,255,0.85)',
    borderRadius: 32,
    boxShadow: theme.palette.mode === 'dark' ? '0 2px 12px rgba(171,2,201,0.08)' : '0 2px 12px rgba(255,143,0,0.08)',
    padding: theme.spacing(2, 3),
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap'
}))

const EmojiEmptyState = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '30vh',
    width: '100%',
    padding: theme.spacing(6, 2),
    background: 'none',
    opacity: 0.8
}))

// Add new styled components for simple UI
const SimpleHero = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    padding: theme.spacing(3, 0, 2, 0),
    borderBottom: 'none', // Remove border
    marginBottom: theme.spacing(2)
}))

const SimpleToolbar = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    background: theme.palette.background.paper,
    borderRadius: 16,
    boxShadow: 'none',
    padding: theme.spacing(2, 3),
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
    border: 'none' // Remove border
}))

const SimpleCard = styled(Paper)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: 12,
    boxShadow: theme.shadows[1],
    border: 'none', // Remove border
    padding: theme.spacing(2)
}))

const SimpleTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    color: theme.palette.text.primary,
    '&.Mui-selected': {
        color: theme.palette.primary.main
    }
}))

const SimpleTabs = styled(Tabs)(({ theme }) => ({
    minHeight: 36,
    '& .MuiTabs-indicator': {
        background: theme.palette.primary.main,
        height: 3,
        borderRadius: 2
    }
}))

const SimpleChip = styled(Box)(({ theme }) => ({
    display: 'inline-block',
    background: theme.palette.background.paper,
    border: 'none', // Remove border
    borderRadius: 16,
    padding: '6px 16px',
    fontSize: '0.95rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
    margin: theme.spacing(0.5, 0.5, 0.5, 0)
}))

const SimpleEmptyState = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '30vh',
    width: '100%',
    padding: theme.spacing(6, 2),
    color: theme.palette.text.secondary,
    opacity: 0.8
}))

// Add new styled components for magazine/editorial style
const EditorialHero = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
    padding: theme.spacing(4, 0, 2, 0),
    position: 'relative'
}))

// Update styled components for better light theme contrast
const HeroAccentBar = styled(Box)(({ theme }) => ({
    width: 8,
    height: 72,
    borderRadius: 8,
    background:
        theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, #ff8f00 0%, #ab02c9 100%)'
            : 'linear-gradient(180deg, #ff9800 0%, #8d36f9 100%)',
    marginRight: theme.spacing(2),
    flexShrink: 0
}))

const EditorialHeadline = styled(Typography)(({ theme }) => ({
    fontWeight: 900,
    fontSize: '2.5rem',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: theme.palette.primary.main,
    lineHeight: 1.1
}))

const EditorialSubtitle = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    fontSize: '1.1rem',
    color: theme.palette.text.secondary,
    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f7f7fa',
    borderRadius: 8,
    padding: theme.spacing(1.5, 2),
    marginTop: theme.spacing(1)
}))

const FloatingFilterPanel = styled(Box)(({ theme }) => ({
    position: 'relative',
    top: -32,
    left: 0,
    width: '100%',
    background: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
    borderRadius: 24,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2, 3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    zIndex: 2,
    border: theme.palette.mode === 'dark' ? 'none' : '1px solid #ececec'
}))

const BlockyTabButton = styled(Button)(({ theme, $active }) => ({
    borderRadius: 16,
    fontWeight: 700,
    fontSize: '1.1rem',
    padding: theme.spacing(1.2, 3),
    marginRight: theme.spacing(2),
    background: $active
        ? theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, #ff8f00 60%, #ab02c9 100%)'
            : 'linear-gradient(90deg, #ff9800 60%, #8d36f9 100%)'
        : theme.palette.mode === 'dark'
        ? theme.palette.background.paper
        : '#fff',
    color: $active ? '#fff' : theme.palette.text.primary,
    boxShadow: $active ? theme.shadows[2] : theme.palette.mode === 'dark' ? 'none' : theme.shadows[1],
    border: $active ? 'none' : theme.palette.mode === 'dark' ? 'none' : '1px solid #ececec',
    transition: 'all 0.2s',
    '&:hover': {
        background: $active
            ? theme.palette.mode === 'dark'
                ? 'linear-gradient(90deg, #ff8f00 60%, #ab02c9 100%)'
                : 'linear-gradient(90deg, #ff9800 60%, #8d36f9 100%)'
            : theme.palette.mode === 'dark'
            ? 'rgba(255,143,0,0.08)'
            : '#f7f7fa'
    }
}))

const TagCloud = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1.5),
    margin: theme.spacing(2, 0, 2, 0)
}))

const TagCloudChip = styled(Box)(({ theme }) => ({
    display: 'inline-block',
    borderRadius: 20,
    padding: '8px 20px',
    fontWeight: 600,
    fontSize: `${Math.random() * 0.3 + 1}rem`,
    color: theme.palette.primary.main,
    background:
        theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, #fffbe6 60%, #ffe0f7 100%)'
            : 'linear-gradient(90deg, #fff3e0 60%, #ede7f6 100%)',
    boxShadow: theme.palette.mode === 'dark' ? theme.shadows[1] : theme.shadows[0],
    border: theme.palette.mode === 'dark' ? 'none' : '1px solid #ececec',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, background 0.2s',
    '&:hover': {
        boxShadow: theme.shadows[4],
        background:
            theme.palette.mode === 'dark'
                ? 'linear-gradient(90deg, #ffecb3 60%, #f3e5f5 100%)'
                : 'linear-gradient(90deg, #ffe0b2 60%, #d1c4e9 100%)'
    }
}))

const MasonryGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: theme.spacing(3),
    marginTop: theme.spacing(2)
}))

const EditorialCard = styled(Paper)(({ theme }) => ({
    borderRadius: 20,
    boxShadow: theme.palette.mode === 'dark' ? theme.shadows[3] : theme.shadows[1],
    background: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
    position: 'relative',
    overflow: 'visible',
    minHeight: 180 + Math.random() * 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(3),
    transition: 'box-shadow 0.2s, transform 0.2s',
    border: theme.palette.mode === 'dark' ? 'none' : '1px solid #ececec',
    '&:hover': {
        boxShadow: theme.shadows[6],
        transform: 'translateY(-6px) scale(1.03)'
    }
}))

const CardAccentBar = styled(Box)(({ theme }) => ({
    position: 'absolute',
    left: 0,
    top: 0,
    width: 6,
    height: '100%',
    borderRadius: 8,
    background:
        theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, #ff8f00 0%, #ab02c9 100%)'
            : 'linear-gradient(180deg, #ff9800 0%, #8d36f9 100%)'
}))

const FloatingAction = styled(Button)(({ theme }) => ({
    position: 'absolute',
    bottom: 18,
    right: 18,
    borderRadius: 20,
    background:
        theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, #ff8f00 60%, #ab02c9 100%)'
            : 'linear-gradient(90deg, #ff9800 60%, #8d36f9 100%)',
    color: '#fff',
    fontWeight: 700,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(1, 2),
    zIndex: 2,
    '&:hover': {
        background:
            theme.palette.mode === 'dark'
                ? 'linear-gradient(90deg, #ab02c9 60%, #ff8f00 100%)'
                : 'linear-gradient(90deg, #8d36f9 60%, #ff9800 100%)'
    }
}))

const PlayfulEmptyState = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '30vh',
    width: '100%',
    padding: theme.spacing(6, 2),
    color: theme.palette.primary.main,
    fontWeight: 700,
    fontSize: '2rem',
    opacity: 0.9
}))

// Add styled empty state for Marketplace
const EngagingEmptyState = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '30vh',
    width: '100%',
    padding: theme.spacing(6, 2),
    color: theme.palette.text.secondary,
    opacity: 0.9
}))
const PulseEmoji = styled('span')`
    display: inline-block;
    font-size: 3rem;
    animation: pulse 1.5s infinite;
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0.7;
        }
        50% {
            transform: scale(1.12);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0.7;
        }
    }
`

// Split layout styled-components (from Agentflows)
const SplitLayout = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    minHeight: 'calc(100vh - 56px)',
    marginTop: 0,
    background:
        theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, #181A1B 60%, #232627 100%)'
            : 'linear-gradient(90deg, #f7f7fa 60%, #fff 100%)',
    borderRadius: '8px',
    boxShadow: 'none',
    overflow: 'visible',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        minHeight: 'auto'
    }
}))

const LeftPanel = styled(Box)(({ theme }) => ({
    width: 300,
    minWidth: 220,
    maxWidth: 340,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRight: `1px solid ${theme.palette.divider}`,
    background: theme.palette.mode === 'dark' ? '#181A1B' : '#f7f7fa',
    [theme.breakpoints.down('md')]: {
        width: '100%',
        maxWidth: '100%',
        borderRight: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        alignItems: 'center',
        padding: theme.spacing(1)
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        borderRight: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        alignItems: 'stretch',
        padding: theme.spacing(1)
    }
}))

const RightPanel = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(1)
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        padding: theme.spacing(1)
    }
}))

const TopFiltersCard = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: 16,
    boxShadow: theme.shadows[1],
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
        gap: theme.spacing(1)
    }
}))

const ViewToggleButton = styled(ToggleButton)(({ theme, selected }) => ({
    borderRadius: '20px',
    marginBottom: 4,
    background: selected ? theme.palette.primary.main + '22' : 'none',
    boxShadow: selected ? `0 0 8px 2px ${theme.palette.primary.main}44` : 'none',
    color: selected ? theme.palette.primary.main : theme.palette.text.primary,
    fontWeight: selected ? 700 : 500,
    transition: 'all 0.2s',
    '&:hover': {
        background: theme.palette.primary.main + '11'
    }
}))

// ==============================|| Futuristic Marketplace ||============================== //

const Marketplace = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useNotifier()

    const theme = useTheme()

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [images, setImages] = useState({})
    const [icons, setIcons] = useState({})
    const [usecases, setUsecases] = useState([])
    const [eligibleUsecases, setEligibleUsecases] = useState([])
    const [selectedUsecases, setSelectedUsecases] = useState([])

    const [showToolDialog, setShowToolDialog] = useState(false)
    const [toolDialogProps, setToolDialogProps] = useState({})

    const getAllTemplatesMarketplacesApi = useApi(marketplacesApi.getAllTemplatesFromMarketplaces)

    const [view, setView] = React.useState(localStorage.getItem('mpDisplayStyle') || 'card')
    const [search, setSearch] = useState('')
    const [badgeFilter, setBadgeFilter] = useState([])
    const [typeFilter, setTypeFilter] = useState([])
    const [frameworkFilter, setFrameworkFilter] = useState([])

    const getAllCustomTemplatesApi = useApi(marketplacesApi.getAllCustomTemplates)
    const [activeTabValue, setActiveTabValue] = useState(0)
    const [templateImages, setTemplateImages] = useState({})
    const [templateIcons, setTemplateIcons] = useState({})
    const [templateUsecases, setTemplateUsecases] = useState([])
    const [eligibleTemplateUsecases, setEligibleTemplateUsecases] = useState([])
    const [selectedTemplateUsecases, setSelectedTemplateUsecases] = useState([])
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))
    const { confirm } = useConfirm()

    const getSelectStyles = (borderColor, isDarkMode) => ({
        '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: 15,
            borderColor: borderColor,
            transition: 'all 0.3s ease'
        },
        '& .MuiSvgIcon-root': {
            color: isDarkMode ? '#fff' : 'inherit'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ff8f00',
            boxShadow: '0 0 10px rgba(255, 143, 0, 0.2)'
        }
    })

    const handleTabChange = (event, newValue) => {
        if (newValue === 1 && !getAllCustomTemplatesApi.data) {
            getAllCustomTemplatesApi.request()
        }
        setActiveTabValue(newValue)
    }

    const clearAllUsecases = () => {
        if (activeTabValue === 0) setSelectedUsecases([])
        else setSelectedTemplateUsecases([])
    }

    const handleBadgeFilterChange = (event) => {
        const {
            target: { value }
        } = event
        setBadgeFilter(typeof value === 'string' ? value.split(',') : value)
        const data = activeTabValue === 0 ? getAllTemplatesMarketplacesApi.data : getAllCustomTemplatesApi.data
        getEligibleUsecases(data, {
            typeFilter,
            badgeFilter: typeof value === 'string' ? value.split(',') : value,
            frameworkFilter,
            search
        })
    }

    const handleTypeFilterChange = (event) => {
        const {
            target: { value }
        } = event
        setTypeFilter(typeof value === 'string' ? value.split(',') : value)
        const data = activeTabValue === 0 ? getAllTemplatesMarketplacesApi.data : getAllCustomTemplatesApi.data
        getEligibleUsecases(data, {
            typeFilter: typeof value === 'string' ? value.split(',') : value,
            badgeFilter,
            frameworkFilter,
            search
        })
    }

    const handleFrameworkFilterChange = (event) => {
        const {
            target: { value }
        } = event
        setFrameworkFilter(typeof value === 'string' ? value.split(',') : value)
        const data = activeTabValue === 0 ? getAllTemplatesMarketplacesApi.data : getAllCustomTemplatesApi.data
        getEligibleUsecases(data, {
            typeFilter,
            badgeFilter,
            frameworkFilter: typeof value === 'string' ? value.split(',') : value,
            search
        })
    }

    const handleViewChange = (event, nextView) => {
        if (nextView === null) return
        localStorage.setItem('mpDisplayStyle', nextView)
        setView(nextView)
    }

    const onSearchChange = (event) => {
        setSearch(event.target.value)
        const data = activeTabValue === 0 ? getAllTemplatesMarketplacesApi.data : getAllCustomTemplatesApi.data
        getEligibleUsecases(data, { typeFilter, badgeFilter, frameworkFilter, search: event.target.value })
    }

    const onDeleteCustomTemplate = async (template) => {
        const confirmPayload = {
            title: `Delete`,
            description: `Delete Custom Template ${template.name}?`,
            confirmButtonName: 'Delete',
            cancelButtonName: 'Cancel'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            try {
                const deleteResp = await marketplacesApi.deleteCustomTemplate(template.id)
                if (deleteResp.data) {
                    enqueueSnackbar({
                        message: 'Custom Template deleted successfully!',
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success',
                            action: (key) => (
                                <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                    <IconX />
                                </Button>
                            )
                        }
                    })
                    getAllCustomTemplatesApi.request()
                }
            } catch (error) {
                enqueueSnackbar({
                    message: `Failed to delete custom template: ${
                        typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                    }`,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
            }
        }
    }

    function filterFlows(data) {
        return (
            (data.categories ? data.categories.join(',') : '').toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            data.templateName.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            (data.description && data.description.toLowerCase().indexOf(search.toLowerCase()) > -1)
        )
    }

    function filterByBadge(data) {
        return badgeFilter.length > 0 ? badgeFilter.includes(data.badge) : true
    }

    function filterByType(data) {
        return typeFilter.length > 0 ? typeFilter.includes(data.type) : true
    }

    function filterByFramework(data) {
        return frameworkFilter.length > 0 ? (data.framework || []).some((item) => frameworkFilter.includes(item)) : true
    }

    function filterByUsecases(data) {
        if (activeTabValue === 0)
            return selectedUsecases.length > 0 ? (data.usecases || []).some((item) => selectedUsecases.includes(item)) : true
        else
            return selectedTemplateUsecases.length > 0
                ? (data.usecases || []).some((item) => selectedTemplateUsecases.includes(item))
                : true
    }

    const getEligibleUsecases = (data, filter) => {
        if (!data) return

        let filteredData = data
        if (filter.badgeFilter.length > 0) filteredData = filteredData.filter((data) => filter.badgeFilter.includes(data.badge))
        if (filter.typeFilter.length > 0) filteredData = filteredData.filter((data) => filter.typeFilter.includes(data.type))
        if (filter.frameworkFilter.length > 0)
            filteredData = filteredData.filter((data) => (data.framework || []).some((item) => filter.frameworkFilter.includes(item)))
        if (filter.search) {
            filteredData = filteredData.filter(
                (data) =>
                    (data.categories ? data.categories.join(',') : '').toLowerCase().indexOf(filter.search.toLowerCase()) > -1 ||
                    data.templateName.toLowerCase().indexOf(filter.search.toLowerCase()) > -1 ||
                    (data.description && data.description.toLowerCase().indexOf(filter.search.toLowerCase()) > -1)
            )
        }

        const usecases = []
        for (let i = 0; i < filteredData.length; i += 1) {
            if (filteredData[i].flowData) {
                usecases.push(...filteredData[i].usecases)
            }
        }
        if (activeTabValue === 0) setEligibleUsecases(Array.from(new Set(usecases)).sort())
        else setEligibleTemplateUsecases(Array.from(new Set(usecases)).sort())
    }

    const onUseTemplate = (selectedTool) => {
        const dialogProp = {
            title: 'Add New Tool',
            type: 'IMPORT',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Add',
            data: selectedTool
        }
        setToolDialogProps(dialogProp)
        setShowToolDialog(true)
    }

    const goToTool = (selectedTool) => {
        const dialogProp = {
            title: selectedTool.templateName,
            type: 'TEMPLATE',
            data: selectedTool
        }
        setToolDialogProps(dialogProp)
        setShowToolDialog(true)
    }

    const goToCanvas = (selectedChatflow) => {
        if (selectedChatflow.type === 'AgentflowV2') {
            navigate(`/v2/marketplace/${selectedChatflow.id}`, { state: selectedChatflow })
        } else {
            navigate(`/marketplace/${selectedChatflow.id}`, { state: selectedChatflow })
        }
    }

    const addNew = () => {
        // Adjust this navigation as needed for your app's template creation route
        navigate('/marketplace/create')
    }

    // Add handler for clicking a popular tag
    const handlePopularTagClick = (tag) => {
        if (activeTabValue === 0) {
            if (selectedUsecases.length === 1 && selectedUsecases[0] === tag) {
                setSelectedUsecases([])
            } else {
                setSelectedUsecases([tag])
            }
        } else {
            if (selectedTemplateUsecases.length === 1 && selectedTemplateUsecases[0] === tag) {
                setSelectedTemplateUsecases([])
            } else {
                setSelectedTemplateUsecases([tag])
            }
        }
    }

    useEffect(() => {
        getAllTemplatesMarketplacesApi.request()
    }, [])

    useEffect(() => {
        setLoading(getAllTemplatesMarketplacesApi.loading)
    }, [getAllTemplatesMarketplacesApi.loading])

    useEffect(() => {
        if (getAllTemplatesMarketplacesApi.data) {
            try {
                const flows = getAllTemplatesMarketplacesApi.data
                const usecases = []
                const images = {}
                const icons = {}
                for (let i = 0; i < flows.length; i += 1) {
                    if (flows[i].flowData) {
                        const flowDataStr = flows[i].flowData
                        const flowData = JSON.parse(flowDataStr)
                        usecases.push(...flows[i].usecases)
                        const nodes = flowData.nodes || []
                        images[flows[i].id] = []
                        icons[flows[i].id] = []
                        for (let j = 0; j < nodes.length; j += 1) {
                            const foundIcon = AGENTFLOW_ICONS.find((icon) => icon.name === nodes[j].data.name)
                            if (foundIcon) {
                                icons[flows[i].id].push(foundIcon)
                            } else {
                                const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                                if (!images[flows[i].id].includes(imageSrc)) {
                                    images[flows[i].id].push(imageSrc)
                                }
                            }
                        }
                    }
                }
                setImages(images)
                setIcons(icons)
                setUsecases(Array.from(new Set(usecases)).sort())
                setEligibleUsecases(Array.from(new Set(usecases)).sort())
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllTemplatesMarketplacesApi.data])

    useEffect(() => {
        if (getAllTemplatesMarketplacesApi.error) {
            setError(getAllTemplatesMarketplacesApi.error)
        }
    }, [getAllTemplatesMarketplacesApi.error])

    useEffect(() => {
        setLoading(getAllCustomTemplatesApi.loading)
    }, [getAllCustomTemplatesApi.loading])

    useEffect(() => {
        if (getAllCustomTemplatesApi.data) {
            try {
                const flows = getAllCustomTemplatesApi.data
                const usecases = []
                const tImages = {}
                const tIcons = {}
                for (let i = 0; i < flows.length; i += 1) {
                    if (flows[i].flowData) {
                        const flowDataStr = flows[i].flowData
                        const flowData = JSON.parse(flowDataStr)
                        usecases.push(...flows[i].usecases)
                        if (flows[i].framework) {
                            flows[i].framework = [flows[i].framework] || []
                        }
                        const nodes = flowData.nodes || []
                        tImages[flows[i].id] = []
                        tIcons[flows[i].id] = []
                        for (let j = 0; j < nodes.length; j += 1) {
                            const foundIcon = AGENTFLOW_ICONS.find((icon) => icon.name === nodes[j].data.name)
                            if (foundIcon) {
                                tIcons[flows[i].id].push(foundIcon)
                            } else {
                                const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                                if (!tImages[flows[i].id].includes(imageSrc)) {
                                    tImages[flows[i].id].push(imageSrc)
                                }
                            }
                        }
                    }
                }
                setTemplateImages(tImages)
                setTemplateIcons(tIcons)
                setTemplateUsecases(Array.from(new Set(usecases)).sort())
                setEligibleTemplateUsecases(Array.from(new Set(usecases)).sort())
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllCustomTemplatesApi.data])

    useEffect(() => {
        if (getAllCustomTemplatesApi.error) {
            setError(getAllCustomTemplatesApi.error)
        }
    }, [getAllCustomTemplatesApi.error])

    return (
        <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, p: { xs: 1, md: 3 } }}>
            <Box sx={{ maxWidth: 1400, mx: 'auto', mt: 3 }}>
                {error ? (
                    <ErrorBoundary error={error} />
                ) : (
                    <SplitLayout>
                        <LeftPanel>
                            <Typography
                                variant='h4'
                                sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}
                            >
                                AI Marketplace
                            </Typography>
                            <Typography
                                variant='subtitle1'
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 400,
                                    mb: 2,
                                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                                }}
                            >
                                Discover cutting-edge AI workflows and unleash your creativity
                            </Typography>
                            <TopFiltersCard>
                                <FormControl fullWidth size='small' sx={{ mb: 2 }}>
                                    <InputLabel id='filter-badge-label' sx={{ color: '#ff8f00' }} shrink>
                                        Tag
                                    </InputLabel>
                                    <FuturisticSelect
                                        labelId='filter-badge-label'
                                        id='filter-badge-checkbox'
                                        multiple
                                        value={badgeFilter}
                                        onChange={handleBadgeFilterChange}
                                        input={<OutlinedInput label='Tag' />}
                                        renderValue={(selected) => selected.join(', ')}
                                        sx={{ minWidth: 120 }}
                                    >
                                        {badges.map((name) => (
                                            <MenuItem key={name} value={name}>
                                                <Checkbox checked={badgeFilter.indexOf(name) > -1} sx={{ color: '#ff8f00' }} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </FuturisticSelect>
                                </FormControl>
                                <FormControl fullWidth size='small' sx={{ mb: 2 }}>
                                    <InputLabel id='type-badge-label' sx={{ color: '#ff8f00' }} shrink>
                                        Type
                                    </InputLabel>
                                    <FuturisticSelect
                                        labelId='type-badge-label'
                                        id='type-badge-checkbox'
                                        multiple
                                        value={typeFilter}
                                        onChange={handleTypeFilterChange}
                                        input={<OutlinedInput label='Type' />}
                                        renderValue={(selected) => selected.join(', ')}
                                        sx={{ minWidth: 120 }}
                                    >
                                        {types.map((name) => (
                                            <MenuItem key={name} value={name}>
                                                <Checkbox checked={typeFilter.indexOf(name) > -1} sx={{ color: '#ff8f00' }} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </FuturisticSelect>
                                </FormControl>
                                <FormControl fullWidth size='small' sx={{ mb: 2 }}>
                                    <InputLabel id='type-fw-label' sx={{ color: '#ff8f00' }} shrink>
                                        Framework
                                    </InputLabel>
                                    <FuturisticSelect
                                        labelId='type-fw-label'
                                        id='type-fw-checkbox'
                                        multiple
                                        value={frameworkFilter}
                                        onChange={handleFrameworkFilterChange}
                                        input={<OutlinedInput label='Framework' />}
                                        renderValue={(selected) => selected.join(', ')}
                                        sx={{ minWidth: 120 }}
                                    >
                                        {framework.map((name) => (
                                            <MenuItem key={name} value={name}>
                                                <Checkbox checked={frameworkFilter.indexOf(name) > -1} sx={{ color: '#ff8f00' }} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </FuturisticSelect>
                                </FormControl>
                                <OutlinedInput
                                    fullWidth
                                    size='small'
                                    placeholder='Search Name/Description/Node'
                                    value={search}
                                    onChange={onSearchChange}
                                    sx={{ borderRadius: 8, background: theme.palette.background.default, fontSize: 16, mb: 2 }}
                                />
                                <ToggleButtonGroup
                                    sx={{ borderRadius: '8px', height: '100%', mt: 1 }}
                                    value={view}
                                    color='primary'
                                    exclusive
                                    onChange={handleViewChange}
                                >
                                    <ViewToggleButton value='card' selected={view === 'card'} title='Card View'>
                                        <IconLayoutGrid />
                                    </ViewToggleButton>
                                    <ViewToggleButton value='list' selected={view === 'list'} title='List View'>
                                        <IconList />
                                    </ViewToggleButton>
                                </ToggleButtonGroup>
                            </TopFiltersCard>
                            {/* Tag Cloud */}
                            <Box sx={{ mt: 2 }}>
                                <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1 }}>
                                    Popular Tags
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {usecases.map((usecase, index) => {
                                        const isSelected =
                                            activeTabValue === 0
                                                ? selectedUsecases.includes(usecase)
                                                : selectedTemplateUsecases.includes(usecase)
                                        return (
                                            <Box
                                                key={index}
                                                onClick={() => handlePopularTagClick(usecase)}
                                                sx={{
                                                    px: 2,
                                                    py: 0.5,
                                                    borderRadius: 12,
                                                    background: isSelected
                                                        ? theme.palette.mode === 'dark'
                                                            ? theme.palette.primary.dark
                                                            : theme.palette.primary.light
                                                        : theme.palette.background.paper,
                                                    color: isSelected
                                                        ? theme.palette.getContrastText(theme.palette.primary.main)
                                                        : theme.palette.text.secondary,
                                                    fontWeight: 600,
                                                    fontSize: 14,
                                                    cursor: 'pointer',
                                                    border: isSelected
                                                        ? `2px solid ${theme.palette.primary.main}`
                                                        : `1px solid ${theme.palette.divider}`,
                                                    boxShadow: isSelected ? theme.shadows[2] : 'none',
                                                    transition: 'all 0.18s',
                                                    userSelect: 'none',
                                                    '&:hover': {
                                                        background: isSelected
                                                            ? theme.palette.mode === 'dark'
                                                                ? theme.palette.primary.main
                                                                : theme.palette.primary.dark
                                                            : theme.palette.action.hover,
                                                        color: isSelected
                                                            ? theme.palette.getContrastText(theme.palette.primary.main)
                                                            : theme.palette.text.primary
                                                    }
                                                }}
                                            >
                                                {usecase}
                                            </Box>
                                        )
                                    })}
                                </Box>
                            </Box>
                        </LeftPanel>
                        <RightPanel>
                            {/* Blocky Tabs */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Button
                                    variant={activeTabValue === 0 ? 'contained' : 'outlined'}
                                    color='primary'
                                    onClick={() => handleTabChange(null, 0)}
                                    startIcon={<IconLayoutGrid />}
                                >
                                    Community Templates
                                </Button>
                                <Button
                                    variant={activeTabValue === 1 ? 'contained' : 'outlined'}
                                    color='primary'
                                    onClick={() => handleTabChange(null, 1)}
                                    startIcon={<IconList />}
                                >
                                    My Templates
                                </Button>
                            </Box>
                            {/* Masonry Cards or Table */}
                            {!view || view === 'card' ? (
                                <>
                                    {isLoading ? (
                                        <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                            {[...Array(6)].map((_, index) => (
                                                <Skeleton key={index} variant='rounded' height={180} />
                                            ))}
                                        </Box>
                                    ) : (
                                        <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                            {getAllTemplatesMarketplacesApi.data
                                                ?.filter(filterByBadge)
                                                .filter(filterByType)
                                                .filter(filterFlows)
                                                .filter(filterByFramework)
                                                .filter(filterByUsecases)
                                                .map((data, index) => (
                                                    <ItemCard key={index} data={data} onClick={() => goToCanvas(data)} />
                                                ))}
                                        </Box>
                                    )}
                                </>
                            ) : (
                                <MarketplaceTable
                                    data={getAllTemplatesMarketplacesApi.data}
                                    filterFunction={filterFlows}
                                    filterByType={filterByType}
                                    filterByBadge={filterByBadge}
                                    filterByFramework={filterByFramework}
                                    filterByUsecases={filterByUsecases}
                                    goToTool={goToTool}
                                    goToCanvas={goToCanvas}
                                    isLoading={isLoading}
                                    setError={setError}
                                />
                            )}
                            {/* Playful Empty State */}
                            {!isLoading && (!getAllTemplatesMarketplacesApi.data || getAllTemplatesMarketplacesApi.data.length === 0) && (
                                <EngagingEmptyState>
                                    <PulseEmoji>🤖</PulseEmoji>
                                    <Typography variant='h5' sx={{ fontWeight: 700, mb: 1, mt: 2 }}>
                                        You are just one click away from creating your first agent!
                                    </Typography>
                                    <Typography variant='body2' sx={{ color: 'text.secondary', mb: 3 }}>
                                        Marketplace lets you discover and share powerful AI workflows. Get started now!
                                    </Typography>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        onClick={addNew}
                                        startIcon={<IconPlus />}
                                        sx={{ borderRadius: 2, height: 44, fontWeight: 700 }}
                                    >
                                        Create Marketplace Template
                                    </Button>
                                </EngagingEmptyState>
                            )}
                        </RightPanel>
                    </SplitLayout>
                )}
                <ToolDialog show={showToolDialog} toolDialogProps={toolDialogProps} onClose={() => setShowToolDialog(false)}></ToolDialog>
                <ConfirmDialog />
            </Box>
        </Box>
    )
}

export default Marketplace
