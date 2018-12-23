import { schema } from 'normalizr'

const { Entity } = schema;

const gateway = new Entity('gateway')
const groups = new Entity('groups')
const lights = new Entity('lights')
const sensors = new Entity('sensors')

export default {
    gateway: gateway,
    groups: [groups],
    lights: [lights],
    sensors: [sensors]
}
