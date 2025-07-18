import { INodeParams, INodeCredential } from '../src/Interface'

class GoogleMakerSuite implements INodeCredential {
    label: string
    name: string
    version: number
    description: string
    inputs: INodeParams[]
    icon: string

    constructor() {
        this.label = 'Google MakerSuite'
        this.name = 'googleMakerSuite'
        this.version = 1.0
        this.icon = 'key.png'
        this.description =
            'Use the <a target="_blank" href="https://makersuite.google.com/app/apikey">Google MakerSuite API credential site</a> to get this key.'
        this.inputs = [
            {
                label: 'MakerSuite API Key',
                name: 'googleMakerSuiteKey',
                type: 'password'
            }
        ]
    }
}

module.exports = { credClass: GoogleMakerSuite }
