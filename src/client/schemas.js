import { schema } from 'normalizr'

const gateway = new schema.Entity('gateway')
const lights = new schema.Entity('lights')
const sensors = new schema.Entity('sensors')

export default {
    gateway: gateway,
    lights: [lights],
    sensors: [sensors]
}
