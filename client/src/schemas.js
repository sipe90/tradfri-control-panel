import { schema } from 'normalizr'

const gateways = new schema.Entity('gateways')
const lights = new schema.Entity('lights')
const sensors = new schema.Entity('sensors')

export default {
    gateways: [gateways],
    lights: [lights],
    sensors: [sensors]
}
