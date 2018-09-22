import { message } from 'antd'

import { fetchGateway } from 'actions/gateway'

import { START_TIMER, STOP_TIMER } from 'redux-timers'

export const LOAD_GROUPS_REQUEST = 'LOAD_GROUPS_REQUEST'
export const LOAD_GROUPS_SUCCESS = 'LOAD_GROUPS_SUCCESS'
export const LOAD_GROUPS_FAILURE = 'LOAD_GROUPS_FAILURE'

export const UPDATE_GROUP_REQUEST = 'UPDATE_GROUP_REQUEST'
export const UPDATE_GROUP_SUCCESS = 'UPDATE_GROUP_SUCCESS'
export const UPDATE_GROUP_FAILURE = 'UPDATE_GROUP_FAILURE'

const loadGroupsRequest = () => ({
    type: LOAD_GROUPS_REQUEST
})

const loadGroupsSuccess = (groups) => ({
    type: LOAD_GROUPS_SUCCESS,
    payload: groups
})

const loadGroupsFailure = (error) => ({
    type: LOAD_GROUPS_FAILURE,
    payload: error
})

const updateGroupRequest = () => ({
    type: UPDATE_GROUP_REQUEST
})

const updateGroupSuccess = () => ({
    type: UPDATE_GROUP_SUCCESS
})

const updateGroupFailure = (error) => ({
    type: UPDATE_GROUP_FAILURE,
    payload: error
})

const handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return response
}

export const startGroupPolling = () => (dispatch) =>
    dispatch({
        type: START_TIMER,
        payload: {
            timerName: 'pollGroups',
            dispatchFunc: fetchGroups(),
            timerInterval: 30000
        }
    })


export const stopGroupPolling = () => (dispatch) =>
    dispatch({
        type: STOP_TIMER,
        payload: {
            timerName: 'pollGroups'
        }
    })

export const fetchGroups = () => (dispatch) =>
    dispatch(fetchGateway())
        .then(() => dispatch(loadGroupsRequest()))
        .then(() => fetch('/api/groups'))
        .then(handleErrors)
        .then(res => res.json())
        .then(json => dispatch(loadGroupsSuccess(json)))
        .catch(error => {
            message.error(`Failed to fetch groups: ${error.message}`)
            dispatch(loadGroupsFailure(error))
            dispatch(stopGroupPolling())
        })

export const updateGroup = (group) => (dispatch) => {

    dispatch(updateGroupRequest())

    return fetch(`/api/groups/${group.id}`,
        { method: 'POST', body: JSON.stringify(group), headers: { 'content-type': 'application/json' } })
        .then(handleErrors)
        .then(() => dispatch(updateGroupSuccess()))
        .catch(error => {
            message.error(`Failed to update group: ${error.message}`)
            dispatch(updateGroupFailure(error))
        })
}
