import { schema } from 'normalizr'

const gateway = new schema.Entity('gateway')
const groups = new schema.Entity('groups')
const lights = new schema.Entity('lights')
const sensors = new schema.Entity('sensors')

export default {
    gateway: gateway,
    groups: [groups],
    lights: [lights],
    sensors: [sensors]
}
