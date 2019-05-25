import * as R from 'ramda'

import { LOAD_GROUPS_SUCCESS } from '@/actions/groups'
import { ActionReducers, createReducer } from '@/utils'
import { Dictionary, IGroup } from 'shared/types'

export type GroupEntitiesState = Dictionary<IGroup>

const initialState = {}

const mapLights = R.indexBy<IGroup>(R.pipe(R.prop('id'), R.toString))

const reducers: ActionReducers<GroupEntitiesState> = [
    [LOAD_GROUPS_SUCCESS, (_state, { payload }) => mapLights(payload)],
]

export default createReducer(reducers, initialState)
