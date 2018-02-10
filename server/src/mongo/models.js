const mongoose = require('mongoose')
const config = require('config')

const { Schema, SchemaTypes: { Mixed, ObjectId} } = mongoose
const { gateways } = config.get('database.collections')

const tradfriGatewaySchema = new Schema({
    _type: { type: String, default: 'tradfri'},
    hostname: String,
    auth: {
        identity: String,
        psk: String
    }
})

module.exports = {
    TradfriGateway: mongoose.model('TradfriGateway', tradfriGatewaySchema, gateways)
}
