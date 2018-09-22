import * as R from 'ramda'
import { normalize } from 'normalizr'

import schemas from 'schemas'

import { LOAD_GROUPS_SUCCESS } from 'actions/groups'

const initialState = {}

const normalizeGroups = R.flip(normalize)(schemas.groups)

const mapLights = R.pipe(
    normalizeGroups,
    R.path(['entities', 'groups'])
)

const reducer = (previousState = initialState, { type, payload }) =>
    R.cond([
        [R.equals(LOAD_GROUPS_SUCCESS), () => ({
            ...mapLights(payload)
        })],
        [R.T, R.always(previousState)]
    ])(type)

export default reducer
