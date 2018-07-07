const mongo = require('mongo')
const logger = require('logger')
const gatewayService = require('service/gateway-service')

const logError = (logMsg) => (err) => {
    logger.error(logMsg, err)
    return Promise.reject(err)
}

module.exports = async () => {
    try {
        await mongo.connect().catch(logError('Failed to connect to MongoDB.'))

        logger.info('Successfully connected to MongoDB')

        await gatewayService.connectToGateways().catch(logError('Failed to connect to Gateways.'))

        logger.info('Finished connecting to gateways')

        return true
    } catch (err) {
        return false
    }
}
