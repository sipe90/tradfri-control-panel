const db = require('db')
const logger = require('logger')
const { fetchGateways } = require('service/gateway-service')
const { connectToGateways } = require('service/gateway-connection-manager') 

const logError = (logMsg) => (err) => {
    logger.error(logMsg, err)
    return Promise.reject(err)
}

module.exports = async (env) => {
    try {
        logger.info('Initializing application')

        await db.init(env).catch(logError('Failed to connect to SQLite database.'))

        logger.info('Successfully connected to SQLite database')

        const gatewayRows = await fetchGateways()

        logger.info(`Found ${gatewayRows.length} gateways from database`)

        await connectToGateways(gatewayRows).catch(logError('Failed to connect to Gateways.'))

        logger.info('Finished connecting to gateways')

        return true
    } catch (err) {
        logger.error('Initialization failed')
        logger.error(err)
        return false
    }
}
