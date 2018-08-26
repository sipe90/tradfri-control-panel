const db = require('db')
const logger = require('logger')
const { fetchGateway } = require('service/gateway-service')
const { connectToGateway } = require('service/gateway-connection-manager')

const logError = (logMsg) => (err) => {
    logger.error(logMsg, err)
    return Promise.reject(err)
}

module.exports = async (env) => {
    try {
        logger.info('Initializing application')

        await db.init(env).catch(logError('Failed to connect to SQLite database.'))

        logger.info('Successfully connected to SQLite database')

        const gateway = await fetchGateway()

        if (!gateway) {
            logger.info('No gateway found from database')
            return true
        }

        logger.info('Found gateway from database')

        await connectToGateway(gateway).catch(logError('Failed to connect to Gateway'))

        logger.info('Finished connecting to gateway')

        return true
    } catch (err) {
        logger.error('Initialization failed')
        logger.error(err)
        return false
    }
}
