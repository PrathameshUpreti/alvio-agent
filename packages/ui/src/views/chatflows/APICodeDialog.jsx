import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import { Tabs, Tab, Dialog, DialogContent, DialogTitle, Box, Typography, Stack, Card, IconButton, styled } from '@mui/material'
import { CopyBlock, atomOneDark } from 'react-code-blocks'
import { useTheme } from '@mui/material/styles'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

// Project import
import { Dropdown } from '@/ui-component/dropdown/Dropdown'
import ShareChatbot from './ShareChatbot'
import EmbedChat from './EmbedChat'

// Const
import { baseURL } from '@/store/constant'
import { SET_CHATFLOW } from '@/store/actions'

// Images
import pythonSVG from '@/assets/images/python.svg'
import javascriptSVG from '@/assets/images/javascript.svg'
import cURLSVG from '@/assets/images/cURL.svg'
import EmbedSVG from '@/assets/images/embed.svg'
import ShareChatbotSVG from '@/assets/images/sharing.png'
import settingsSVG from '@/assets/images/settings.svg'
import { IconVariable, IconExclamationCircle } from '@tabler/icons-react'

// API
import apiKeyApi from '@/api/apikey'
import chatflowsApi from '@/api/chatflows'
import configApi from '@/api/config'
import variablesApi from '@/api/variables'

// Hooks
import useApi from '@/hooks/useApi'
import { CheckboxInput } from '@/ui-component/checkbox/Checkbox'
import { TableViewOnly } from '@/ui-component/table/Table'
import { useRef } from 'react'

// Helpers
import { unshiftFiles, getConfigExamplesForJS, getConfigExamplesForPython, getConfigExamplesForCurl } from '@/utils/genericHelper'

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

const GlassyDialogContent = styled(DialogContent)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: 18,
    boxShadow: theme.shadows[24],
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(3)
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

const APICodeDialog = ({ show, dialogProps, onCancel }) => {
    const portalElement = document.getElementById('portal')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const theme = useTheme()
    const chatflow = useSelector((state) => state.canvas.chatflow)
    const apiConfig = chatflow?.apiConfig ? JSON.parse(chatflow.apiConfig) : {}
    const overrideConfigStatus = apiConfig?.overrideConfig?.status !== undefined ? apiConfig.overrideConfig.status : false

    const codes = ['Embed', 'Python', 'JavaScript', 'cURL', 'Share Chatbot']
    const [value, setValue] = useState(0)
    const [keyOptions, setKeyOptions] = useState([])
    const [apiKeys, setAPIKeys] = useState([])
    const [chatflowApiKeyId, setChatflowApiKeyId] = useState('')
    const [selectedApiKey, setSelectedApiKey] = useState({})
    const [checkboxVal, setCheckbox] = useState(false)
    const [nodeConfig, setNodeConfig] = useState({})
    const [nodeConfigExpanded, setNodeConfigExpanded] = useState({})
    const [nodeOverrides, setNodeOverrides] = useState(apiConfig?.overrideConfig?.nodes ?? null)
    const [variableOverrides, setVariableOverrides] = useState(apiConfig?.overrideConfig?.variables ?? [])
    const [copySuccess, setCopySuccess] = useState(false)
    const codeRef = useRef(null)

    const getAllAPIKeysApi = useApi(apiKeyApi.getAllAPIKeys)
    const updateChatflowApi = useApi(chatflowsApi.updateChatflow)
    const getIsChatflowStreamingApi = useApi(chatflowsApi.getIsChatflowStreaming)
    const getConfigApi = useApi(configApi.getConfig)
    const getAllVariablesApi = useApi(variablesApi.getAllVariables)

    const onCheckBoxChanged = (newVal) => {
        setCheckbox(newVal)
        if (newVal) {
            getConfigApi.request(dialogProps.chatflowid)
            getAllVariablesApi.request()
        }
    }

    const onApiKeySelected = (keyValue) => {
        if (keyValue === 'addnewkey') {
            navigate('/apikey')
            return
        }
        setChatflowApiKeyId(keyValue)
        setSelectedApiKey(apiKeys.find((key) => key.id === keyValue))
        const updateBody = {
            apikeyid: keyValue
        }
        updateChatflowApi.request(dialogProps.chatflowid, updateBody)
    }

    const groupByNodeLabel = (nodes) => {
        const result = {}
        const newNodeOverrides = {}
        const seenNodes = new Set()

        nodes.forEach((item) => {
            const { node, nodeId, label, name, type } = item
            seenNodes.add(node)

            if (!result[node]) {
                result[node] = {
                    nodeIds: [],
                    params: []
                }
            }

            if (!newNodeOverrides[node]) {
                // If overrideConfigStatus is true, copy existing config for this node
                newNodeOverrides[node] = overrideConfigStatus ? [...(nodeOverrides[node] || [])] : []
            }

            if (!result[node].nodeIds.includes(nodeId)) result[node].nodeIds.push(nodeId)

            const param = { label, name, type }

            if (!result[node].params.some((existingParam) => JSON.stringify(existingParam) === JSON.stringify(param))) {
                result[node].params.push(param)
                const paramExists = newNodeOverrides[node].some(
                    (existingParam) => existingParam.label === label && existingParam.name === name && existingParam.type === type
                )
                if (!paramExists) {
                    newNodeOverrides[node].push({ ...param, enabled: false })
                }
            }
        })

        // Sort the nodeIds array
        for (const node in result) {
            result[node].nodeIds.sort()
        }
        setNodeConfig(result)

        if (!overrideConfigStatus) {
            setNodeOverrides(newNodeOverrides)
        } else {
            const updatedNodeOverrides = { ...nodeOverrides }

            Object.keys(updatedNodeOverrides).forEach((node) => {
                if (!seenNodes.has(node)) {
                    delete updatedNodeOverrides[node]
                }
            })

            seenNodes.forEach((node) => {
                if (!updatedNodeOverrides[node]) {
                    updatedNodeOverrides[node] = newNodeOverrides[node]
                }
            })

            setNodeOverrides(updatedNodeOverrides)
        }
    }

    const groupByVariableLabel = (variables) => {
        const newVariables = []
        const seenVariables = new Set()

        variables.forEach((item) => {
            const { id, name, type } = item
            seenVariables.add(id)

            const param = { id, name, type }

            // If overrideConfigStatus is true, look for existing variable config
            // Otherwise, create new default config
            if (overrideConfigStatus) {
                const existingVariable = variableOverrides?.find((existingParam) => existingParam.id === id)
                if (existingVariable) {
                    if (!newVariables.some((variable) => variable.id === id)) {
                        newVariables.push({ ...existingVariable })
                    }
                } else {
                    if (!newVariables.some((variable) => variable.id === id)) {
                        newVariables.push({ ...param, enabled: false })
                    }
                }
            } else {
                // When no override config exists, create default values
                if (!newVariables.some((variable) => variable.id === id)) {
                    newVariables.push({ ...param, enabled: false })
                }
            }
        })

        // If overrideConfigStatus is true, clean up any variables that no longer exist
        if (overrideConfigStatus && variableOverrides) {
            variableOverrides.forEach((existingVariable) => {
                if (!seenVariables.has(existingVariable.id)) {
                    const index = newVariables.findIndex((newVariable) => newVariable.id === existingVariable.id)
                    if (index !== -1) {
                        newVariables.splice(index, 1)
                    }
                }
            })
        }

        setVariableOverrides(newVariables)
    }

    const handleAccordionChange = (nodeLabel) => (event, isExpanded) => {
        const accordianNodes = { ...nodeConfigExpanded }
        accordianNodes[nodeLabel] = isExpanded
        setNodeConfigExpanded(accordianNodes)
    }

    useEffect(() => {
        if (updateChatflowApi.data) {
            dispatch({ type: SET_CHATFLOW, chatflow: updateChatflowApi.data })
        }
    }, [updateChatflowApi.data, dispatch])

    useEffect(() => {
        if (getConfigApi.data) {
            groupByNodeLabel(getConfigApi.data)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getConfigApi.data])

    useEffect(() => {
        if (getAllVariablesApi.data) {
            groupByVariableLabel(getAllVariablesApi.data)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getAllVariablesApi.data])

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const getCode = (codeLang) => {
        if (codeLang === 'Python') {
            return `import requests

API_URL = "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}"

def query(payload):
    response = requests.post(API_URL, json=payload)
    return response.json()
    
output = query({
    "question": "Hey, how are you?",
})
`
        } else if (codeLang === 'JavaScript') {
            return `async function query(data) {
    const response = await fetch(
        "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}

query({"question": "Hey, how are you?"}).then((response) => {
    console.log(response);
});
`
        } else if (codeLang === 'cURL') {
            return `curl ${baseURL}/api/v1/prediction/${dialogProps.chatflowid} \\
     -X POST \\
     -d '{"question": "Hey, how are you?"}' \\
     -H "Content-Type: application/json"`
        }
        return ''
    }

    const getCodeWithAuthorization = (codeLang) => {
        if (codeLang === 'Python') {
            return `import requests

API_URL = "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}"
headers = {"Authorization": "Bearer ${selectedApiKey?.apiKey}"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()
    
output = query({
    "question": "Hey, how are you?",
})
`
        } else if (codeLang === 'JavaScript') {
            return `async function query(data) {
    const response = await fetch(
        "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}",
        {
            headers: {
                Authorization: "Bearer ${selectedApiKey?.apiKey}",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}

query({"question": "Hey, how are you?"}).then((response) => {
    console.log(response);
});
`
        } else if (codeLang === 'cURL') {
            return `curl ${baseURL}/api/v1/prediction/${dialogProps.chatflowid} \\
     -X POST \\
     -d '{"question": "Hey, how are you?"}' \\
     -H "Content-Type: application/json" \\
     -H "Authorization: Bearer ${selectedApiKey?.apiKey}"`
        }
        return ''
    }

    const getLang = (codeLang) => {
        if (codeLang === 'Python') {
            return 'python'
        } else if (codeLang === 'JavaScript') {
            return 'javascript'
        } else if (codeLang === 'cURL') {
            return 'bash'
        }
        return 'python'
    }

    const getSVG = (codeLang) => {
        if (codeLang === 'Python') {
            return pythonSVG
        } else if (codeLang === 'JavaScript') {
            return javascriptSVG
        } else if (codeLang === 'Embed') {
            return EmbedSVG
        } else if (codeLang === 'cURL') {
            return cURLSVG
        } else if (codeLang === 'Share Chatbot') {
            return ShareChatbotSVG
        } else if (codeLang === 'Configuration') {
            return settingsSVG
        }
        return pythonSVG
    }

    // ----------------------------CONFIG FORM DATA --------------------------//

    const getConfigCodeWithFormData = (codeLang, configData) => {
        if (codeLang === 'Python') {
            configData = unshiftFiles(configData)
            let fileType = configData[0].type
            if (fileType.includes(',')) fileType = fileType.split(',')[0]
            return `import requests

API_URL = "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}"

# use form data to upload files
form_data = {
    "files": ${`('example${fileType}', open('example${fileType}', 'rb'))`}
}
body_data = {${getConfigExamplesForPython(configData, 'formData')}}

def query(form_data):
    response = requests.post(API_URL, files=form_data, data=body_data)
    return response.json()

output = query(form_data)
`
        } else if (codeLang === 'JavaScript') {
            return `// use FormData to upload files
let formData = new FormData();
${getConfigExamplesForJS(configData, 'formData')}
async function query(formData) {
    const response = await fetch(
        "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}",
        {
            method: "POST",
            body: formData
        }
    );
    const result = await response.json();
    return result;
}

query(formData).then((response) => {
    console.log(response);
});
`
        } else if (codeLang === 'cURL') {
            return `curl ${baseURL}/api/v1/prediction/${dialogProps.chatflowid} \\
     -X POST \\${getConfigExamplesForCurl(configData, 'formData')} \\
     -H "Content-Type: multipart/form-data"`
        }
        return ''
    }

    // ----------------------------CONFIG FORM DATA with AUTH--------------------------//

    const getConfigCodeWithFormDataWithAuth = (codeLang, configData) => {
        if (codeLang === 'Python') {
            configData = unshiftFiles(configData)
            let fileType = configData[0].type
            if (fileType.includes(',')) fileType = fileType.split(',')[0]
            return `import requests

API_URL = "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}"
headers = {"Authorization": "Bearer ${selectedApiKey?.apiKey}"}

# use form data to upload files
form_data = {
    "files": ${`('example${fileType}', open('example${fileType}', 'rb'))`}
}
body_data = {${getConfigExamplesForPython(configData, 'formData')}}

def query(form_data):
    response = requests.post(API_URL, headers=headers, files=form_data, data=body_data)
    return response.json()

output = query(form_data)
`
        } else if (codeLang === 'JavaScript') {
            return `// use FormData to upload files
let formData = new FormData();
${getConfigExamplesForJS(configData, 'formData')}
async function query(formData) {
    const response = await fetch(
        "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}",
        {
            headers: { Authorization: "Bearer ${selectedApiKey?.apiKey}" },
            method: "POST",
            body: formData
        }
    );
    const result = await response.json();
    return result;
}

query(formData).then((response) => {
    console.log(response);
});
`
        } else if (codeLang === 'cURL') {
            return `curl ${baseURL}/api/v1/prediction/${dialogProps.chatflowid} \\
     -X POST \\${getConfigExamplesForCurl(configData, 'formData')} \\
     -H "Content-Type: multipart/form-data" \\
     -H "Authorization: Bearer ${selectedApiKey?.apiKey}"`
        }
        return ''
    }

    // ----------------------------CONFIG JSON--------------------------//

    const getConfigCode = (codeLang, configData) => {
        if (codeLang === 'Python') {
            return `import requests

API_URL = "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}"

def query(payload):
    response = requests.post(API_URL, json=payload)
    return response.json()

output = query({
    "question": "Hey, how are you?",
    "overrideConfig": {${getConfigExamplesForPython(configData, 'json')}
    }
})
`
        } else if (codeLang === 'JavaScript') {
            return `async function query(data) {
    const response = await fetch(
        "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}

query({
  "question": "Hey, how are you?",
  "overrideConfig": {${getConfigExamplesForJS(configData, 'json')}
  }
}).then((response) => {
    console.log(response);
});
`
        } else if (codeLang === 'cURL') {
            return `curl ${baseURL}/api/v1/prediction/${dialogProps.chatflowid} \\
     -X POST \\
     -d '{"question": "Hey, how are you?", "overrideConfig": {${getConfigExamplesForCurl(configData, 'json')}}' \\
     -H "Content-Type: application/json"`
        }
        return ''
    }

    // ----------------------------CONFIG JSON with AUTH--------------------------//

    const getConfigCodeWithAuthorization = (codeLang, configData) => {
        if (codeLang === 'Python') {
            return `import requests

API_URL = "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}"
headers = {"Authorization": "Bearer ${selectedApiKey?.apiKey}"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

output = query({
    "question": "Hey, how are you?",
    "overrideConfig": {${getConfigExamplesForPython(configData, 'json')}
    }
})
`
        } else if (codeLang === 'JavaScript') {
            return `async function query(data) {
    const response = await fetch(
        "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}",
        {
            headers: {
                Authorization: "Bearer ${selectedApiKey?.apiKey}",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}

query({
  "question": "Hey, how are you?",
  "overrideConfig": {${getConfigExamplesForJS(configData, 'json')}
  }
}).then((response) => {
    console.log(response);
});
`
        } else if (codeLang === 'cURL') {
            return `curl ${baseURL}/api/v1/prediction/${dialogProps.chatflowid} \\
     -X POST \\
     -d '{"question": "Hey, how are you?", "overrideConfig": {${getConfigExamplesForCurl(configData, 'json')}}' \\
     -H "Content-Type: application/json" \\
     -H "Authorization: Bearer ${selectedApiKey?.apiKey}"`
        }
        return ''
    }

    const getMultiConfigCodeWithFormData = (codeLang) => {
        if (codeLang === 'Python') {
            return `# Specify multiple values for a config parameter by specifying the node id
body_data = {
    "openAIApiKey": {
        "chatOpenAI_0": "sk-my-openai-1st-key",
        "openAIEmbeddings_0": "sk-my-openai-2nd-key"
    }
}`
        } else if (codeLang === 'JavaScript') {
            return `// Specify multiple values for a config parameter by specifying the node id
formData.append("openAIApiKey[chatOpenAI_0]", "sk-my-openai-1st-key")
formData.append("openAIApiKey[openAIEmbeddings_0]", "sk-my-openai-2nd-key")`
        } else if (codeLang === 'cURL') {
            return `-F "openAIApiKey[chatOpenAI_0]=sk-my-openai-1st-key" \\
-F "openAIApiKey[openAIEmbeddings_0]=sk-my-openai-2nd-key" \\`
        }
    }

    const getMultiConfigCode = () => {
        return `{
    "overrideConfig": {
        "openAIApiKey": {
            "chatOpenAI_0": "sk-my-openai-1st-key",
            "openAIEmbeddings_0": "sk-my-openai-2nd-key"
        }
    }
}`
    }

    useEffect(() => {
        if (getAllAPIKeysApi.data) {
            const options = [
                {
                    label: 'No Authorization',
                    name: ''
                }
            ]
            for (const key of getAllAPIKeysApi.data) {
                options.push({
                    label: key.keyName,
                    name: key.id
                })
            }
            options.push({
                label: '- Add New Key -',
                name: 'addnewkey'
            })
            setKeyOptions(options)
            setAPIKeys(getAllAPIKeysApi.data)

            if (dialogProps.chatflowApiKeyId) {
                setChatflowApiKeyId(dialogProps.chatflowApiKeyId)
                setSelectedApiKey(getAllAPIKeysApi.data.find((key) => key.id === dialogProps.chatflowApiKeyId))
            }
        }
    }, [dialogProps, getAllAPIKeysApi.data])

    useEffect(() => {
        if (show) {
            getAllAPIKeysApi.request()
            getIsChatflowStreamingApi.request(dialogProps.chatflowid)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show])

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 1200)
    }

    const component = show ? (
        <Dialog
            fullWidth
            maxWidth='md'
            open={show}
            onClose={onCancel}
            aria-labelledby='api-code-dialog-title'
            aria-describedby='api-code-dialog-description'
            PaperProps={{
                sx: {
                    background: (theme) => theme.palette.background.paper,
                    borderRadius: 4,
                    boxShadow: 24
                }
            }}
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                {dialogProps.title}
            </DialogTitle>
            <GlassyDialogContent>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flex: 80 }}>
                        <PillTabs value={value} onChange={handleChange} aria-label='tabs'>
                            {codes.map((codeLang, index) => (
                                <PillTab
                                    icon={
                                        <img style={{ objectFit: 'cover', height: 18, width: 'auto' }} src={getSVG(codeLang)} alt='code' />
                                    }
                                    iconPosition='start'
                                    key={index}
                                    label={codeLang}
                                    {...a11yProps(index)}
                                />
                            ))}
                        </PillTabs>
                    </Box>
                    <Box sx={{ flex: 20, minWidth: 180 }}>
                        <Dropdown
                            name='SelectKey'
                            disableClearable={true}
                            options={keyOptions}
                            onSelect={onApiKeySelected}
                            value={dialogProps.chatflowApiKeyId ?? chatflowApiKeyId ?? 'Choose an API key'}
                        />
                    </Box>
                </Box>
                <Box sx={{ mt: 2 }} />
                {codes.map((codeLang, index) => (
                    <TabPanel key={index} value={value} index={index}>
                        {(codeLang === 'Embed' || codeLang === 'Share Chatbot') && chatflowApiKeyId && (
                            <>
                                <p>You cannot use API key while embedding/sharing chatbot.</p>
                                <p>
                                    Please select <b>&quot;No Authorization&quot;</b> from the dropdown at the top right corner.
                                </p>
                            </>
                        )}
                        {codeLang === 'Embed' && !chatflowApiKeyId && <EmbedChat chatflowid={dialogProps.chatflowid} />}
                        {codeLang !== 'Embed' && codeLang !== 'Share Chatbot' && codeLang !== 'Configuration' && (
                            <CodeBlockContainer>
                                <CopyButton
                                    onClick={() => handleCopy(chatflowApiKeyId ? getCodeWithAuthorization(codeLang) : getCode(codeLang))}
                                    size='small'
                                >
                                    <ContentCopyIcon fontSize='small' />
                                </CopyButton>
                                <CopyBlock
                                    theme={atomOneDark}
                                    text={chatflowApiKeyId ? getCodeWithAuthorization(codeLang) : getCode(codeLang)}
                                    language={getLang(codeLang)}
                                    showLineNumbers={false}
                                    wrapLines
                                />
                            </CodeBlockContainer>
                        )}
                        <CheckboxInput label='Show Override Config' value={checkboxVal} onChange={onCheckBoxChanged} />
                        {checkboxVal && getConfigApi.data && getConfigApi.data.length > 0 && (
                            <Card sx={{ borderColor: theme.palette.primary[200] + 75, p: 2, mt: 2 }} variant='outlined'>
                                <Stack sx={{ mt: 1, mb: 2, ml: 1, alignItems: 'center' }} direction='row' spacing={2}>
                                    <IconExclamationCircle size={30} color='rgb(116,66,16)' />
                                    <Typography variant='h4'>Override Config</Typography>
                                </Stack>
                                <TableViewOnly
                                    rows={nodeOverrides[nodeLabel]}
                                    columns={nodeOverrides[nodeLabel].length > 0 ? Object.keys(nodeOverrides[nodeLabel][0]) : []}
                                />
                            </Card>
                        )}
                        {checkboxVal && variableOverrides && variableOverrides.length > 0 && (
                            <Card sx={{ borderColor: theme.palette.primary[200] + 75, p: 2, mt: 2 }} variant='outlined'>
                                <Stack sx={{ mt: 1, mb: 2, ml: 1, alignItems: 'center' }} direction='row' spacing={2}>
                                    <IconVariable />
                                    <Typography variant='h4'>Variables</Typography>
                                </Stack>
                                <TableViewOnly rows={variableOverrides} columns={['name', 'type', 'enabled']} />
                            </Card>
                        )}
                        {codeLang !== 'Embed' && codeLang !== 'Share Chatbot' && codeLang !== 'Configuration' && (
                            <CodeBlockContainer>
                                <CopyButton
                                    onClick={() =>
                                        handleCopy(
                                            chatflowApiKeyId
                                                ? dialogProps.isFormDataRequired
                                                    ? getConfigCodeWithFormDataWithAuth(codeLang, getConfigApi.data)
                                                    : getConfigCodeWithAuthorization(codeLang, getConfigApi.data)
                                                : dialogProps.isFormDataRequired
                                                ? getConfigCodeWithFormData(codeLang, getConfigApi.data)
                                                : getConfigCode(codeLang, getConfigApi.data)
                                        )
                                    }
                                    size='small'
                                >
                                    <ContentCopyIcon fontSize='small' />
                                </CopyButton>
                                <CopyBlock
                                    theme={atomOneDark}
                                    text={
                                        chatflowApiKeyId
                                            ? dialogProps.isFormDataRequired
                                                ? getConfigCodeWithFormDataWithAuth(codeLang, getConfigApi.data)
                                                : getConfigCodeWithAuthorization(codeLang, getConfigApi.data)
                                            : dialogProps.isFormDataRequired
                                            ? getConfigCodeWithFormData(codeLang, getConfigApi.data)
                                            : getConfigCode(codeLang, getConfigApi.data)
                                    }
                                    language={getLang(codeLang)}
                                    showLineNumbers={false}
                                    wrapLines
                                />
                            </CodeBlockContainer>
                        )}
                        {getIsChatflowStreamingApi.data?.isStreaming && (
                            <p>
                                Read&nbsp;
                                <a rel='noreferrer' target='_blank' href='https://docs.flowiseai.com/using-flowise/streaming'>
                                    here
                                </a>
                                &nbsp;on how to stream response back to application
                            </p>
                        )}
                        {codeLang === 'Share Chatbot' && !chatflowApiKeyId && (
                            <ShareChatbot isSessionMemory={dialogProps.isSessionMemory} isAgentCanvas={dialogProps.isAgentCanvas} />
                        )}
                    </TabPanel>
                ))}
            </GlassyDialogContent>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

APICodeDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func
}

export default APICodeDialog
