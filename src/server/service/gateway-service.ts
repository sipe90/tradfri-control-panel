import { TradfriErrorCodes } from 'node-tradfri-client'

import { normalizeGateway } from '#/data/tradfri'
import * as db from '#/db/gateway'
import { ValidationError } from '#/error'
import TradfriGateway from '#/gateway/TradfriGateway'
import logger from '#/logger'
import { connectToGateway, getConnection } from '#/service/gateway-connection-manager'
import { ICreateGatewayRequest, IGenerateIdentityRequest, ITestConnectionRequest } from 'shared/types'

export const fetchGateway = async () =>
    db.selectGateway()

export const createTradfriGateway = async ({ name, hostname, identity, psk }: ICreateGatewayRequest) => {
    if (!name) {
        throw new ValidationError('name', 'Name is required')
    }
    if (!hostname) {
        throw new ValidationError('hostname', 'Hostname is required')
    }
    if (!identity) {
        throw new ValidationError( 'identity', 'Identity is required')
    }
    if (!psk) {
        throw new ValidationError('psk', 'Pre-shared key is required')
    }
    logger.info(`Creating a new gateway name: ${name}, hostname: ${hostname}, identity: ${identity}, psk: ${psk}`)
    const gateway = new TradfriGateway(hostname)
    await gateway.connect(identity, psk)
    await db.insertGateway({ name, hostname, identity, psk })
    logger.info('Successfully saved gateway to database')
    await connectToGateway({ hostname, identity, psk })
}

export const getGateway = async () => {
    const gateway = await fetchGateway()

    if (!gateway) {
        return null
    }

    const gatewayConnection = getConnection()

    if (!gatewayConnection) {
        return null
    }

    return normalizeGateway({
            ...gateway,
            connected: gatewayConnection.isConnected()
        },
        gatewayConnection.getLights(),
        gatewayConnection.getSensors(),
        gatewayConnection.getGroups()
    )
}

export const discoverGateway = async () => TradfriGateway.discover()

export const generateIdentity = async ({ hostname, securityCode }: IGenerateIdentityRequest) => {
    if (!hostname) {
        throw new ValidationError('hostname', 'Hostname is required')
    }
    if (!securityCode) {
        throw new ValidationError('securityCode', 'Security code is required')
    }
    const gateway = new TradfriGateway(hostname)

    try {
        return await gateway.authenticate(securityCode)
    } catch (err) {
        if (err.code === TradfriErrorCodes.AuthenticationFailed) {
            throw new ValidationError('securityCode', err.message)
        }
        throw new Error(err.message)
    }
}

export const testConnect = async ({ hostname, identity, psk }: ITestConnectionRequest) => {
    if (!hostname) {
        throw new ValidationError('hostname', 'Hostname is required')
    }
    if (!identity) {
        throw new ValidationError('identity', 'Identity is required')
    }
    if (!psk) {
        throw new ValidationError('psk', 'Pre-shared key is required')
    }
    const gateway = new TradfriGateway(hostname)

    try {
        await gateway.connect(identity, psk, false)
        gateway.disconnect()

        return {
            success: true,
            error: null
        }
    } catch (err) {
        return {
            success: false,
            error: err.message as string
        }
    }
}
