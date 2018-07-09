import { schema } from 'normalizr'

const lights = new schema.Entity('lights')

const gateways = new schema.Entity('gateways', {
    lights: [lights]
})

export default {
    gateways: [gateways]
}
