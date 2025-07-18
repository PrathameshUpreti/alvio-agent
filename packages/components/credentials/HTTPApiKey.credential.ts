import { INodeParams, INodeCredential } from '../src/Interface'

class HTTPApiKeyCredential implements INodeCredential {
    label: string
    name: string
    version: number
    icon: string
    inputs: INodeParams[]

    constructor() {
        this.label = 'HTTP Api Key'
        this.name = 'httpApiKey'
        this.version = 1.0
        this.icon = 'key.png'
        this.inputs = [
            {
                label: 'Key',
                name: 'key',
                type: 'string'
            },
            {
                label: 'Value',
                name: 'value',
                type: 'password'
            }
        ]
    }
}

module.exports = { credClass: HTTPApiKeyCredential }
