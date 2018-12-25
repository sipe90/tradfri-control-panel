import * as R from 'ramda'

import schemas from '@/schemas'

import { LOAD_GROUPS_SUCCESS } from '@/actions/groups'
import { Reducer } from 'redux'
import { Dictionary, Group } from 'shared/types'
import { normalizer, createReducer } from '@/utils'
import { NormalizeResult } from '@/types'

type GroupEntitiesState = Dictionary<Group>

const initialState = {}

const normalizeGroups = normalizer(schemas.groups)

const mapLights = R.pipe<Group[], NormalizeResult, Dictionary<Group> | undefined>(
    normalizeGroups,
    R.path(['entities', 'groups'])
)

const reducer = createReducer<GroupEntitiesState>([
    [LOAD_GROUPS_SUCCESS, (_state, { payload }) => ({
        ...mapLights(payload as Group[])
    })]
])

const groupEntitiesReducer: Reducer<GroupEntitiesState> = (state = initialState, action) => reducer(state, action)
   
export default groupEntitiesReducer
