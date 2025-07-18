import { INodeParams, INodeCredential } from '../src/Interface'

class HTTPBearerTokenCredential implements INodeCredential {
    label: string
    name: string
    version: number
    icon: string
    inputs: INodeParams[]

    constructor() {
        this.label = 'HTTP Bearer Token'
        this.name = 'httpBearerToken'
        this.version = 1.0
        this.icon = 'key.png'
        this.inputs = [
            {
                label: 'Token',
                name: 'token',
                type: 'password'
            }
        ]
    }
}

module.exports = { credClass: HTTPBearerTokenCredential }
