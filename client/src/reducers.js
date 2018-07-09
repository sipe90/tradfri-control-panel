
import * as R from 'ramda'
import { normalize } from 'normalizr'

import schemas from 'schemas'

import { 
    LOAD_LIGHTS_REQUEST, LOAD_LIGHTS_SUCCESS, LOAD_LIGHTS_FAILURE,
    LIGHT_STATE_CHANGED, LIGHT_NAME_EDIT_CHANGED 
} from 'actions/lights'

const initialState = {
    entities: {
        gateways: {},
        lights: {}
    },
    modules: {
        lights: {
            dataLoading: false,
            nameEdit: {}
        }
    }
}

const normalizeGateways = R.flip(normalize)(schemas.gateways)
const gatewaysWithLights = R.filter((gateway) => gateway.lights.length)

const mapEntities = R.pipe(
    gatewaysWithLights,
    normalizeGateways,
    R.pick(['entities'])
)

const updateLight = (previousState, light) => ({
    entities: {
        ...previousState.entities,
        lights: { 
            ...previousState.lights, 
            [light.id]: {
                ...previousState.lightsById[light.id],
                ...light 
            } 
        }
    }
})

const updateNameEdit = (previousState, { lightId, name }) => ({
    modules: {
        ...previousState.modules,
        lights: {
            ...previousState.modules.lights,
            nameEdit: {
                ...previousState.modules.lights.nameEdit,
                [lightId] : name
            }
        }
    }
})

const updateDataLoading = (previousState, loading) => ({
    modules: {
        ...previousState.modules,
        lights: {
            ...previousState.modules.lights,
            dataLoading: loading
        }
    }
})

const reducer = (previousState = initialState, { type, payload }) => 
    R.cond([
        [R.equals(LOAD_LIGHTS_REQUEST), () => ({ 
            ...previousState,
            ...updateDataLoading(previousState, true)
        })],
        [R.equals(LOAD_LIGHTS_SUCCESS), () => ({ 
            ...previousState, 
            ...mapEntities(payload),
            ...updateDataLoading(previousState, false),
        })],
        [R.equals(LOAD_LIGHTS_FAILURE), () => ({
            ...previousState,
            ...updateDataLoading(previousState, false)
        })],
        [R.equals(LIGHT_STATE_CHANGED), () => ({
            ...previousState,
            ...updateLight(previousState, payload)
        })],
        [R.equals(LIGHT_NAME_EDIT_CHANGED), () => ({ 
            ...previousState, 
            ...updateNameEdit(previousState, payload) 
        })],
        [R.T, R.always(previousState)]
    ])(type)

export default reducer
