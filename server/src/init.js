const mongo = require('mongo')
const logger = require('logger')
const { fetchGateways } = require('service/gateway-service')
const { connectToGateways } = require('service/gateway-connection-manager') 

const logError = (logMsg) => (err) => {
    logger.error(logMsg, err)
    return Promise.reject(err)
}

module.exports = async () => {
    try {
        await mongo.connect().catch(logError('Failed to connect to MongoDB.'))

        logger.info('Successfully connected to MongoDB')

        const gatewayDocs = await fetchGateways()

        logger.info(`Found ${gatewayDocs.length} gateways from database`)

        await connectToGateways(gatewayDocs).catch(logError('Failed to connect to Gateways.'))

        logger.info('Finished connecting to gateways')

        return true
    } catch (err) {
        return false
    }
}
