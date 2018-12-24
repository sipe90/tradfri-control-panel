import { message } from 'antd'

import { fetchGateway } from 'actions/gateway'

import { START_TIMER, STOP_TIMER } from 'redux-timers'
import { GroupUpdateRequest, Omit, Dictionary, Group } from 'shared/types';
import { ActionCreator } from 'redux';
import { ThunkResult } from 'types';

export const LOAD_GROUPS_REQUEST = 'LOAD_GROUPS_REQUEST'
export const LOAD_GROUPS_SUCCESS = 'LOAD_GROUPS_SUCCESS'
export const LOAD_GROUPS_FAILURE = 'LOAD_GROUPS_FAILURE'

export const UPDATE_GROUP_REQUEST = 'UPDATE_GROUP_REQUEST'
export const UPDATE_GROUP_SUCCESS = 'UPDATE_GROUP_SUCCESS'
export const UPDATE_GROUP_FAILURE = 'UPDATE_GROUP_FAILURE'

const loadGroupsRequest = () => ({
    type: LOAD_GROUPS_REQUEST
})

const loadGroupsSuccess = (groups: Dictionary<Group>) => ({
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

export const startGroupPolling: ActionCreator<ThunkResult> = () => (dispatch) =>
    dispatch({
        type: START_TIMER,
        payload: {
            timerName: 'pollGroups',
            dispatchFunc: fetchGroups(),
            timerInterval: 30000
        }
    })


export const stopGroupPolling: ActionCreator<ThunkResult> = () => (dispatch) =>
    dispatch({
        type: STOP_TIMER,
        payload: {
            timerName: 'pollGroups'
        }
    })

export const fetchGroups: ActionCreator<ThunkResult> = () => async (dispatch) => {
    try {
        await dispatch(fetchGateway())
        await dispatch(loadGroupsRequest())
        const res = await fetch('/api/groups')
        const json = await res.json()
        dispatch(loadGroupsSuccess(json))
    } catch (error) {
        message.error(`Failed to fetch groups: ${error.message}`)
        dispatch(loadGroupsFailure(error))
        dispatch(stopGroupPolling())
    }
}

export const updateGroup: ActionCreator<ThunkResult> = (group: GroupUpdateRequest) => async (dispatch) => {
    try {
        const payload: Omit<GroupUpdateRequest, 'id'> = {
            on: group.on,
            brightness: group.brightness
        }

        dispatch(updateGroupRequest())
        await fetch(`/api/groups/${group.id}`, 
            { method: 'POST', body: JSON.stringify(payload), headers: { 'content-type': 'application/json' } })
        dispatch(updateGroupSuccess())
    } catch (error) {
        message.error(`Failed to update group: ${error.message}`)
        dispatch(updateGroupFailure(error))
    }
}
