import { message } from 'antd'
import * as R from 'ramda'

import { ThunkResult } from '@/types'
import { fetchGetJson, fetchPostJson } from '@/utils'
import { ActionCreator } from 'redux'
import { Dictionary, IGroup, IGroupUpdateRequest, Omit } from 'shared/types'

export const LOAD_GROUPS_REQUEST = 'LOAD_GROUPS_REQUEST'
export const LOAD_GROUPS_SUCCESS = 'LOAD_GROUPS_SUCCESS'
export const LOAD_GROUPS_FAILURE = 'LOAD_GROUPS_FAILURE'

export const UPDATE_GROUP_REQUEST = 'UPDATE_GROUP_REQUEST'
export const UPDATE_GROUP_SUCCESS = 'UPDATE_GROUP_SUCCESS'
export const UPDATE_GROUP_FAILURE = 'UPDATE_GROUP_FAILURE'

const loadGroupsRequest = () => ({
    type: LOAD_GROUPS_REQUEST
})

const loadGroupsSuccess = (groups: Dictionary<IGroup>) => ({
    type: LOAD_GROUPS_SUCCESS,
    payload: groups
})

const loadGroupsFailure = (error: Error) => ({
    type: LOAD_GROUPS_FAILURE,
    payload: error
})

const updateGroupRequest = () => ({
    type: UPDATE_GROUP_REQUEST
})

const updateGroupSuccess = () => ({
    type: UPDATE_GROUP_SUCCESS
})

const updateGroupFailure = (error: Error) => ({
    type: UPDATE_GROUP_FAILURE,
    payload: error
})

export const fetchGroups: ActionCreator<ThunkResult> = () => async (dispatch) => {
    try {
        await dispatch(loadGroupsRequest())
        const res = await fetchGetJson<Dictionary<IGroup>>('/api/groups')

        if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

        dispatch(loadGroupsSuccess(res.json))
    } catch (error) {
        message.error(`Failed to fetch groups: ${error.message}`)
        dispatch(loadGroupsFailure(error))
    }
}

export const updateGroup: ActionCreator<ThunkResult> = (group: IGroupUpdateRequest) => async (dispatch) => {
    try {
        const payload: Omit<IGroupUpdateRequest, 'id'> = {
            on: group.on,
            brightness: group.brightness
        }

        dispatch(updateGroupRequest())
        const res = await fetchPostJson<void>(`/api/groups/${group.id}`, payload)

        if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

        dispatch(updateGroupSuccess())
    } catch (error) {
        message.error(`Failed to update group: ${error.message}`)
        dispatch(updateGroupFailure(error))
    }
}
