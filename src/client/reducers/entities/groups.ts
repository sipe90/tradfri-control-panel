import * as R from 'ramda'

import { LOAD_GROUPS_SUCCESS } from '@/actions/groups'
import schemas from '@/schemas'
import { INormalizeResult } from '@/types'
import { ActionReducers, createReducer, normalizer } from '@/utils'
import { Dictionary, IGroup } from 'shared/types'

export type GroupEntitiesState = Dictionary<IGroup>

const initialState = {}

const normalizeGroups = normalizer(schemas.groups)

const mapLights = R.pipe<IGroup[], INormalizeResult, Dictionary<IGroup> | undefined>(
    normalizeGroups,
    R.path(['entities', 'groups']),
)

const reducers: ActionReducers<GroupEntitiesState> = [
    [LOAD_GROUPS_SUCCESS, (_state, { payload }) => ({
        ...mapLights(payload as IGroup[]),
    })],
]

export default createReducer(reducers, initialState)
