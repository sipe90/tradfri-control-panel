import * as R from 'ramda'
import { Reducer } from 'redux'

import { LOAD_GROUPS_SUCCESS } from '@/actions/groups'
import schemas from '@/schemas'
import { INormalizeResult } from '@/types'
import { createReducer, normalizer } from '@/utils'
import { Dictionary, IGroup } from 'shared/types'

type GroupEntitiesState = Dictionary<IGroup>

const initialState = {}

const normalizeGroups = normalizer(schemas.groups)

const mapLights = R.pipe<IGroup[], INormalizeResult, Dictionary<IGroup> | undefined>(
    normalizeGroups,
    R.path(['entities', 'groups']),
)

const reducer = createReducer<GroupEntitiesState>([
    [LOAD_GROUPS_SUCCESS, (_state, { payload }) => ({
        ...mapLights(payload as IGroup[]),
    })],
])

const groupEntitiesReducer: Reducer<GroupEntitiesState> = (state = initialState, action) => reducer(state, action)

export default groupEntitiesReducer
