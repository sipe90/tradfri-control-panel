const mongo = require('mongo')
const logger = require('logger')
const gatewayService = require('service/gateway-service')


module.exports = async () => {
    try {
        await mongo.connect().catch((err) => error('Failed to connect to MongoDB.', err))

        logger.info('Successfully connected to MongoDB')

        await gatewayService.connectToGateways().catch((err) => error('Failed to connect to Gateways.', err))

        logger.info('Finished connecting to gateways')

        return true
    } catch (err) {
        return false
    }
}

const error = (logMsg, err) => {
    logger.error(logMsg, err)
    return Promise.reject(err)
}

