#!/usr/bin/env ts-node

import 'module-alias/register'

import TradfriGateway from '#/gateway/TradfriGateway'

// tslint:disable:no-console

const argv = process.argv.slice(2)

if (!argv.length) {
    printUsageAndExit()
}

const action = argv[0]

switch (action) {
    case 'authenticate':
        authenticate(argv.slice(1))
        break
    case 'discover':
        discover()
        break
    default:
        printUsageAndExit()
}

function printUsageAndExit(act?: string) {
    switch (act) {
        case 'authenticate':
            console.log('Usage: tradfri authenticate HOSTNAME SECURITY_CODE')
            break
        default:
            console.log('Usage: tradfri ACTION [ARGS...]')
    }
    process.exit(1)
}

async function authenticate(args: string[]) {
    if (args.length !== 2) {
        printUsageAndExit('authenticate')
    }

    const [hostname, securityCode] = args

    const gateway = new TradfriGateway(hostname, false)

    try {
        const {
            identity,
            psk
        } = await gateway.authenticate(securityCode)

        console.log(`Identity: ${identity}`)
        console.log(`PSK: ${psk}`)

        process.exit()
    } catch (err) {
        console.error(`Trådfri authentication failed: ${err.message}`)

        process.exit(1)
    }
}

async function discover() {

    console.log('Looking for Trådfri gateways in the network...')

    try {
        const discoverResult = await TradfriGateway.discover()

        if (discoverResult) {
            console.log(JSON.stringify(discoverResult, null, 2))
        } else {
            console.log('No Trådfri gateways found')
        }
    } catch (err) {
        console.log(`Error occurred while trying to discover gateway: ${err}`)
    }

    process.exit()
}

// tslint:enable:no-console
