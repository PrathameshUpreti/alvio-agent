import { INodeParams, INodeCredential } from '../src/Interface'

class HttpBasicAuthCredential implements INodeCredential {
    label: string
    name: string
    version: number
    icon: string
    inputs: INodeParams[]

    constructor() {
        this.label = 'HTTP Basic Auth'
        this.name = 'httpBasicAuth'
        this.version = 1.0
        this.icon = 'key.png'
        this.inputs = [
            {
                label: 'Basic Auth Username',
                name: 'basicAuthUsername',
                type: 'string'
            },
            {
                label: 'Basic Auth Password',
                name: 'basicAuthPassword',
                type: 'password'
            }
        ]
    }
}

module.exports = { credClass: HttpBasicAuthCredential }
