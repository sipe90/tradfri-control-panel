
import * as R from 'ramda'
import { normalize } from 'normalizr'

import schemas from 'schemas'

import { LOAD_GATEWAYS_SUCCESS } from 'actions/gateways'

const initialState = {}

const normalizeGateways = R.flip(normalize)(schemas.gateways)

const mapGateways = R.pipe(
    normalizeGateways,
    R.path(['entities', 'gateways'])
)

const reducer = (previousState = initialState, { type, payload }) => 
    R.cond([
        [R.equals(LOAD_GATEWAYS_SUCCESS), () => ({
            ...mapGateways(payload)
        })],
        [R.T, R.always(previousState)]
    ])(type)

export default reducer
