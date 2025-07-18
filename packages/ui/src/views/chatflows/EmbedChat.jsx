import { useState } from 'react'
import PropTypes from 'prop-types'

import { Tabs, Tab, Box } from '@mui/material'
import { CopyBlock, atomOneDark } from 'react-code-blocks'

// Project import
import { CheckboxInput } from '@/ui-component/checkbox/Checkbox'

// Const
import { baseURL } from '@/store/constant'

// 1. Import styled from @mui/material/styles and ContentCopy icon
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useRef } from 'react'

function TabPanel(props) {
    const { children, value, index, ...other } = props
    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`attachment-tabpanel-${index}`}
            aria-labelledby={`attachment-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
}

function a11yProps(index) {
    return {
        id: `attachment-tab-${index}`,
        'aria-controls': `attachment-tabpanel-${index}`
    }
}

const embedPopupHtmlCode = (chatflowid) => {
    return `<script type="module">
    import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js"
    Chatbot.init({
        chatflowid: "${chatflowid}",
        apiHost: "${baseURL}",
    })
</script>`
}

const embedPopupReactCode = (chatflowid) => {
    return `import { BubbleChat } from 'flowise-embed-react'

const App = () => {
    return (
        <BubbleChat
            chatflowid="${chatflowid}"
            apiHost="${baseURL}"
        />
    );
};`
}

const embedFullpageHtmlCode = (chatflowid) => {
    return `<flowise-fullchatbot></flowise-fullchatbot>
<script type="module">
    import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js"
    Chatbot.initFull({
        chatflowid: "${chatflowid}",
        apiHost: "${baseURL}",
    })
</script>`
}

const embedFullpageReactCode = (chatflowid) => {
    return `import { FullPageChat } from "flowise-embed-react"

const App = () => {
    return (
        <FullPageChat
            chatflowid="${chatflowid}"
            apiHost="${baseURL}"
        />
    );
};`
}

export const defaultThemeConfig = {
    button: {
        backgroundColor: '#3B81F6',
        right: 20,
        bottom: 20,
        size: 48,
        dragAndDrop: true,
        iconColor: 'white',
        customIconSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
        autoWindowOpen: {
            autoOpen: true,
            openDelay: 2,
            autoOpenOnMobile: false
        }
    },
    tooltip: {
        showTooltip: true,
        tooltipMessage: 'Hi There 👋!',
        tooltipBackgroundColor: 'black',
        tooltipTextColor: 'white',
        tooltipFontSize: 16
    },
    disclaimer: {
        title: 'Disclaimer',
        message: 'By using this chatbot, you agree to the <a target="_blank" href="https://flowiseai.com/terms">Terms & Condition</a>',
        textColor: 'black',
        buttonColor: '#3b82f6',
        buttonText: 'Start Chatting',
        buttonTextColor: 'white',
        blurredBackgroundColor: 'rgba(0, 0, 0, 0.4)',
        backgroundColor: 'white'
    },
    customCSS: ``,
    chatWindow: {
        showTitle: true,
        showAgentMessages: true,
        title: 'Flowise Bot',
        titleAvatarSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
        welcomeMessage: 'Hello! This is custom welcome message',
        errorMessage: 'This is a custom error message',
        backgroundColor: '#ffffff',
        backgroundImage: 'enter image path or link',
        height: 700,
        width: 400,
        fontSize: 16,
        starterPrompts: ['What is a bot?', 'Who are you?'],
        starterPromptFontSize: 15,
        clearChatOnReload: false,
        sourceDocsTitle: 'Sources:',
        renderHTML: true,
        botMessage: {
            backgroundColor: '#f7f8ff',
            textColor: '#303235',
            showAvatar: true,
            avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png'
        },
        userMessage: {
            backgroundColor: '#3B81F6',
            textColor: '#ffffff',
            showAvatar: true,
            avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png'
        },
        textInput: {
            placeholder: 'Type your question',
            backgroundColor: '#ffffff',
            textColor: '#303235',
            sendButtonColor: '#3B81F6',
            maxChars: 50,
            maxCharsWarningMessage: 'You exceeded the characters limit. Please input less than 50 characters.',
            autoFocus: true,
            sendMessageSound: true,
            sendSoundLocation: 'send_message.mp3',
            receiveMessageSound: true,
            receiveSoundLocation: 'receive_message.mp3'
        },
        feedback: {
            color: '#303235'
        },
        dateTimeToggle: {
            date: true,
            time: true
        },
        footer: {
            textColor: '#303235',
            text: 'Powered by',
            company: 'Flowise',
            companyLink: 'https://flowiseai.com'
        }
    }
}

const customStringify = (obj) => {
    let stringified = JSON.stringify(obj, null, 4)
        .replace(/"([^"]+)":/g, '$1:')
        .replace(/: "([^"]+)"/g, (match, value) => (value.includes('<') ? `: "${value}"` : `: '${value}'`))
        .replace(/: "(true|false|\d+)"/g, ': $1')
        .replace(/customCSS: ""/g, 'customCSS: ``')
    return stringified
        .split('\n')
        .map((line, index) => {
            if (index === 0) return line
            return ' '.repeat(8) + line
        })
        .join('\n')
}

const embedPopupHtmlCodeCustomization = (chatflowid) => {
    return `<script type="module">
    import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js"
    Chatbot.init({
        chatflowid: "${chatflowid}",
        apiHost: "${baseURL}",
        chatflowConfig: {
            /* Chatflow Config */
        },
        observersConfig: {
            /* Observers Config */
        },
        theme: ${customStringify(defaultThemeConfig)}
    })
</script>`
}

const embedPopupReactCodeCustomization = (chatflowid) => {
    return `import { BubbleChat } from 'flowise-embed-react'

const App = () => {
    return (
        <BubbleChat
            chatflowid="${chatflowid}"
            apiHost="${baseURL}"
            chatflowConfig={{
                /* Chatflow Config */
            }}
            observersConfig={{
                /* Observers Config */
            }}
            theme={{${customStringify(defaultThemeConfig)
                .substring(1)
                .split('\n')
                .map((line) => ' '.repeat(4) + line)
                .join('\n')}
        />
    )
}`
}

const getFullPageThemeConfig = () => {
    return {
        ...defaultThemeConfig,
        chatWindow: {
            ...defaultThemeConfig.chatWindow,
            height: '100%',
            width: '100%'
        }
    }
}

const embedFullpageHtmlCodeCustomization = (chatflowid) => {
    return `<flowise-fullchatbot></flowise-fullchatbot>
<script type="module">
    import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js"
    Chatbot.initFull({
        chatflowid: "${chatflowid}",
        apiHost: "${baseURL}",
        chatflowConfig: {
            /* Chatflow Config */
        },
        observersConfig: {
            /* Observers Config */
        },
        theme: ${customStringify(getFullPageThemeConfig())}
    })
</script>`
}

const embedFullpageReactCodeCustomization = (chatflowid) => {
    return `import { FullPageChat } from 'flowise-embed-react'

const App = () => {
    return (
        <FullPageChat
            chatflowid="${chatflowid}"
            apiHost="${baseURL}"
            chatflowConfig={{
                /* Chatflow Config */
            }}
            observersConfig={{
                /* Observers Config */
            }}
            theme={{${customStringify(getFullPageThemeConfig())
                .substring(1)
                .split('\n')
                .map((line) => ' '.repeat(4) + line)
                .join('\n')}
        />
    )
}`
}

const EmbedChat = ({ chatflowid }) => {
    const codes = ['Popup Html', 'Fullpage Html', 'Popup React', 'Fullpage React']
    const [value, setValue] = useState(0)
    const [embedChatCheckboxVal, setEmbedChatCheckbox] = useState(false)
    const [copySuccess, setCopySuccess] = useState(false)
    const codeRef = useRef(null)

    const onCheckBoxEmbedChatChanged = (newVal) => {
        setEmbedChatCheckbox(newVal)
    }

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 1200)
    }

    const getCode = (codeLang) => {
        switch (codeLang) {
            case 'Popup Html':
                return embedPopupHtmlCode(chatflowid)
            case 'Fullpage Html':
                return embedFullpageHtmlCode(chatflowid)
            case 'Popup React':
                return embedPopupReactCode(chatflowid)
            case 'Fullpage React':
                return embedFullpageReactCode(chatflowid)
            default:
                return ''
        }
    }

    const getCodeCustomization = (codeLang) => {
        switch (codeLang) {
            case 'Popup Html':
                return embedPopupHtmlCodeCustomization(chatflowid)
            case 'Fullpage Html':
                return embedFullpageHtmlCodeCustomization(chatflowid)
            case 'Popup React':
                return embedPopupReactCodeCustomization(chatflowid)
            case 'Fullpage React':
                return embedFullpageReactCodeCustomization(chatflowid)
            default:
                return embedPopupHtmlCodeCustomization(chatflowid)
        }
    }

    // 3. Add copy-to-clipboard logic
    // 2. Add styled containers
    const GlassyContainer = styled('div')(({ theme }) => ({
        background: theme.palette.background.paper,
        borderRadius: 18,
        boxShadow: theme.shadows[24],
        border: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(3),
        marginTop: theme.spacing(2)
    }))
    const PillTabs = styled(Tabs)(({ theme }) => ({
        borderRadius: 999,
        minHeight: 40,
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        '& .MuiTabs-indicator': {
            height: 4,
            borderRadius: 2,
            background: theme.palette.primary.main
        }
    }))
    const PillTab = styled(Tab)(({ theme }) => ({
        borderRadius: 999,
        minHeight: 36,
        minWidth: 90,
        fontWeight: 600,
        color: theme.palette.text.secondary,
        '&.Mui-selected': {
            color: theme.palette.primary.main,
            background: theme.palette.action.selected
        },
        transition: 'background 0.2s, color 0.2s'
    }))
    const CodeBlockContainer = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: 12,
        background: theme.palette.mode === 'dark' ? '#23272f' : '#f5f7fa',
        border: `1px solid ${theme.palette.divider}`,
        margin: '16px 0',
        boxShadow: theme.shadows[1],
        overflow: 'auto'
    }))
    const CopyButton = styled(IconButton)(({ theme }) => ({
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 2,
        background: theme.palette.background.paper,
        borderRadius: 8,
        boxShadow: theme.shadows[2],
        '&:hover': {
            background: theme.palette.primary.light
        }
    }))

    return (
        <GlassyContainer>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
                <Box sx={{ flex: 80 }}>
                    <PillTabs value={value} onChange={handleChange} aria-label='tabs'>
                        {codes.map((codeLang, index) => (
                            <PillTab key={index} label={codeLang} {...a11yProps(index)} />
                        ))}
                    </PillTabs>
                </Box>
            </Box>
            <Box sx={{ mt: 2 }} />
            {codes.map((codeLang, index) => (
                <TabPanel key={index} value={value} index={index}>
                    {(value === 0 || value === 1) && (
                        <Box sx={{ color: 'text.secondary', mb: 1, fontSize: 15 }}>
                            Paste this anywhere in the <code>{`<body>`}</code> tag of your html file.
                            <p>
                                You can also specify a&nbsp;
                                <a
                                    rel='noreferrer'
                                    target='_blank'
                                    href='https://www.npmjs.com/package/flowise-embed?activeTab=versions'
                                    style={{ color: '#3B81F6', textDecoration: 'underline' }}
                                >
                                    version
                                </a>
                                :&nbsp;<code>{`https://cdn.jsdelivr.net/npm/flowise-embed@<version>/dist/web.js`}</code>
                            </p>
                        </Box>
                    )}
                    <CodeBlockContainer>
                        <CopyButton onClick={() => handleCopy(getCode(codeLang))} size='small'>
                            <ContentCopyIcon fontSize='small' />
                        </CopyButton>
                        <CopyBlock theme={atomOneDark} text={getCode(codeLang)} language='javascript' showLineNumbers={false} wrapLines />
                    </CodeBlockContainer>
                    <CheckboxInput label='Show Embed Chat Config' value={embedChatCheckboxVal} onChange={onCheckBoxEmbedChatChanged} />
                    {embedChatCheckboxVal && (
                        <CodeBlockContainer>
                            <CopyButton onClick={() => handleCopy(getCodeCustomization(codeLang))} size='small'>
                                <ContentCopyIcon fontSize='small' />
                            </CopyButton>
                            <CopyBlock
                                theme={atomOneDark}
                                text={getCodeCustomization(codeLang)}
                                language='javascript'
                                showLineNumbers={false}
                                wrapLines
                            />
                        </CodeBlockContainer>
                    )}
                </TabPanel>
            ))}
        </GlassyContainer>
    )
}

EmbedChat.propTypes = {
    chatflowid: PropTypes.string
}

export default EmbedChat
