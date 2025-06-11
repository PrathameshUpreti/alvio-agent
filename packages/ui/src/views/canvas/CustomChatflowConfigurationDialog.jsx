import PropTypes from 'prop-types'
import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { tabsClasses } from '@mui/material/Tabs'
import { styled } from '@mui/material/styles'

// Project imports
import GradientDialogWrapper from './GradientDialogWrapper'
import { StyledPaper } from './DialogStyles'

// Components
import SpeechToText from '@/ui-component/extended/SpeechToText'
import Security from '@/ui-component/extended/Security'
import ChatFeedback from '@/ui-component/extended/ChatFeedback'
import AnalyseFlow from '@/ui-component/extended/AnalyseFlow'
import StarterPrompts from '@/ui-component/extended/StarterPrompts'
import Leads from '@/ui-component/extended/Leads'
import FollowUpPrompts from '@/ui-component/extended/FollowUpPrompts'
import FileUpload from '@/ui-component/extended/FileUpload'
import PostProcessing from '@/ui-component/extended/PostProcessing'

const CHATFLOW_CONFIGURATION_TABS = [
    {
        label: 'Security',
        id: 'security'
    },
    {
        label: 'Starter Prompts',
        id: 'conversationStarters'
    },
    {
        label: 'Follow-up Prompts',
        id: 'followUpPrompts'
    },
    {
        label: 'Speech to Text',
        id: 'speechToText'
    },
    {
        label: 'Chat Feedback',
        id: 'chatFeedback'
    },
    {
        label: 'Analyse Chatflow',
        id: 'analyseChatflow'
    },
    {
        label: 'Leads',
        id: 'leads'
    },
    {
        label: 'File Upload',
        id: 'fileUpload'
    },
    {
        label: 'Post Processing',
        id: 'postProcessing',
        hideInAgentFlow: true
    }
]

// Styled tab panel
const TabPanel = (props) => {
    const { children, value, index, ...other } = props
    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`chatflow-config-tabpanel-${index}`}
            aria-labelledby={`chatflow-config-tab-${index}`}
            style={{ width: '100%', paddingTop: '1rem' }}
            {...other}
        >
            {value === index && (
                <StyledPaper elevation={3} sx={{ p: 2, borderRadius: '12px' }}>
                    {children}
                </StyledPaper>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
}

// Styled tabs
const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.primary.main,
        height: 3,
        borderRadius: '3px'
    },
    '& .MuiTab-root': {
        minHeight: '40px',
        height: '40px',
        borderRadius: '8px 8px 0 0',
        fontWeight: 500,
        color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[600],
        '&.Mui-selected': {
            color: theme.palette.primary.main,
            fontWeight: 600
        }
    }
}))

// Generate tab props
function a11yProps(index) {
    return {
        id: `chatflow-config-tab-${index}`,
        'aria-controls': `chatflow-config-tabpanel-${index}`
    }
}

const CustomChatflowConfigurationDialog = ({ show, isAgentCanvas, dialogProps, onCancel }) => {
    const [tabValue, setTabValue] = useState(0)

    const filteredTabs = CHATFLOW_CONFIGURATION_TABS.filter((tab) => !isAgentCanvas || !tab.hideInAgentFlow)

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    return (
        <GradientDialogWrapper show={show} title={dialogProps.title} onClose={onCancel} maxWidth='lg'>
            <Box sx={{ width: '100%' }}>
                <StyledTabs
                    sx={{
                        position: 'relative',
                        minHeight: '40px',
                        height: '40px',
                        [`& .${tabsClasses.scrollButtons}`]: {
                            '&.Mui-disabled': { opacity: 0.3 }
                        }
                    }}
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label='chatflow configuration tabs'
                    variant='scrollable'
                    scrollButtons='auto'
                >
                    {filteredTabs.map((item, index) => (
                        <Tab key={index} label={item.label} {...a11yProps(index)} />
                    ))}
                </StyledTabs>
            </Box>

            {filteredTabs.map((item, index) => (
                <TabPanel key={index} value={tabValue} index={index}>
                    {item.id === 'security' && <Security dialogProps={dialogProps} />}
                    {item.id === 'conversationStarters' ? <StarterPrompts dialogProps={dialogProps} /> : null}
                    {item.id === 'followUpPrompts' ? <FollowUpPrompts dialogProps={dialogProps} /> : null}
                    {item.id === 'speechToText' ? <SpeechToText dialogProps={dialogProps} /> : null}
                    {item.id === 'chatFeedback' ? <ChatFeedback dialogProps={dialogProps} /> : null}
                    {item.id === 'analyseChatflow' ? <AnalyseFlow dialogProps={dialogProps} /> : null}
                    {item.id === 'leads' ? <Leads dialogProps={dialogProps} /> : null}
                    {item.id === 'fileUpload' ? <FileUpload dialogProps={dialogProps} /> : null}
                    {item.id === 'postProcessing' ? <PostProcessing dialogProps={dialogProps} /> : null}
                </TabPanel>
            ))}
        </GradientDialogWrapper>
    )
}

CustomChatflowConfigurationDialog.propTypes = {
    show: PropTypes.bool,
    isAgentCanvas: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func
}

export default CustomChatflowConfigurationDialog
