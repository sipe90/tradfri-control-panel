import { AsyncThunkResult } from '@/types'
import { fetchDeleteJson, fetchGetJson, fetchPostJson } from '@/utils'
import { message} from 'antd'
import * as R from 'ramda'
import { ICircadianSettings, IUpdateCircadianSettingsRequest } from 'shared/types'

export const LOAD_CIRCADIAN_SETTINGS_REQUEST = 'LOAD_CIRCADIAN_SETTINGS_REQUEST'
export const LOAD_CIRCADIAN_SETTINGS_SUCCESS = 'LOAD_CIRCADIAN_SETTINGS_SUCCESS'
export const LOAD_CIRCADIAN_SETTINGS_FAILURE = 'LOAD_CIRCADIAN_SETTINGS_FAILURE'

export const SAVE_CIRCADIAN_SETTINGS_REQUEST = 'SAVE_CIRCADIAN_SETTINGS_REQUEST'
export const SAVE_CIRCADIAN_SETTINGS_SUCCESS = 'SAVE_CIRCADIAN_SETTINGS_SUCCESS'
export const SAVE_CIRCADIAN_SETTINGS_FAILURE = 'SAVE_CIRCADIAN_SETTINGS_FAILURE'

export const ADD_CIRCADIAN_SETTINGS_GROUP_REQUEST = 'ADD_CIRCADIAN_SETTINGS_GROUP_REQUEST'
export const ADD_CIRCADIAN_SETTINGS_GROUP_SUCCESS = 'ADD_CIRCADIAN_SETTINGS_GROUP_SUCCESS'
export const ADD_CIRCADIAN_SETTINGS_GROUP_FAILURE = 'ADD_CIRCADIAN_SETTINGS_GROUP_FAILURE'

export const REMOVE_CIRCADIAN_SETTINGS_GROUP_REQUEST = 'REMOVE_CIRCADIAN_SETTINGS_GROUP_REQUEST'
export const REMOVE_CIRCADIAN_SETTINGS_GROUP_SUCCESS = 'REMOVE_CIRCADIAN_SETTINGS_GROUP_SUCCESS'
export const REMOVE_CIRCADIAN_SETTINGS_GROUP_FAILURE = 'REMOVE_CIRCADIAN_SETTINGS_GROUP_FAILURE'

const loadCircadionSettingsRequest = () => ({
    type: LOAD_CIRCADIAN_SETTINGS_REQUEST
})

const loadCircadionSettingsSuccess = (settings: ICircadianSettings | null) => ({
    payload: settings,
    type: LOAD_CIRCADIAN_SETTINGS_SUCCESS
})

const loadCircadionSettingsFailure = (error: Error) => ({
    payload: error,
    type: LOAD_CIRCADIAN_SETTINGS_FAILURE
})

const saveCircadionSettingsRequest = () => ({
    type: SAVE_CIRCADIAN_SETTINGS_REQUEST
})

const saveCircadionSettingsSuccess = () => ({
    type: SAVE_CIRCADIAN_SETTINGS_SUCCESS
})

const saveCircadionSettingsFailure = (error: Error) => ({
    payload: error,
    type: SAVE_CIRCADIAN_SETTINGS_FAILURE
})

const addCircadianSettingsGroupRequest = () => ({
    type: ADD_CIRCADIAN_SETTINGS_GROUP_REQUEST
})

const addCircadianSettingsGroupSuccess = () => ({
    type: ADD_CIRCADIAN_SETTINGS_GROUP_SUCCESS
})

const addCircadianSettingsGroupFailure = (error: Error) => ({
    payload: error,
    type: ADD_CIRCADIAN_SETTINGS_GROUP_FAILURE
})

const removeCircadianSettingsGroupRequest = () => ({
    type: REMOVE_CIRCADIAN_SETTINGS_GROUP_REQUEST
})

const removeCircadianSettingsGroupSuccess = () => ({
    type: REMOVE_CIRCADIAN_SETTINGS_GROUP_SUCCESS
})

const removeCircadianSettingsGroupFailure = (error: Error) => ({
    payload: error,
    type: REMOVE_CIRCADIAN_SETTINGS_GROUP_FAILURE
})

export const fetchCircadianSettings = (): AsyncThunkResult => async (dispatch) => {
    try {
        dispatch(loadCircadionSettingsRequest())
        const res = await fetchGetJson<ICircadianSettings>('/api/settings/circadian')

        if (res.status === 404) {
            dispatch(loadCircadionSettingsSuccess(null))
            return
        }

        if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

        dispatch(loadCircadionSettingsSuccess(res.json))
    } catch (error) {
        message.error(`Failed to load circadian settings: ${error.message}`)
        dispatch(loadCircadionSettingsFailure(error))
    }
}

export const saveCircadianSettings = (settings: IUpdateCircadianSettingsRequest): AsyncThunkResult =>
    async (dispatch) => {
        try {
            dispatch(saveCircadionSettingsRequest())
            const res = await fetchPostJson('/api/settings/circadian', settings)

            if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

            dispatch(saveCircadionSettingsSuccess())
        } catch (error) {
            message.error(`Failed to save circadian settings: ${error.message}`)
            dispatch(saveCircadionSettingsFailure(error))
        }
}

export const addCircadianSettingsGroup = (groupId: string): AsyncThunkResult =>
    async (dispatch) => {
        try {
            dispatch(addCircadianSettingsGroupRequest())
            const res = await fetchPostJson(`/api/settings/circadian/groups?groupId=${groupId}`)

            if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

            dispatch(addCircadianSettingsGroupSuccess())
        } catch (error) {
            message.error(`Failed to add group to circadian settings: ${error.message}`)
            dispatch(addCircadianSettingsGroupFailure(error))
        }
        dispatch(fetchCircadianSettings())
}

export const removeCircadianSettingsGroup = (groupId: string): AsyncThunkResult =>
    async (dispatch) => {
        try {
            dispatch(removeCircadianSettingsGroupRequest())
            const res = await fetchDeleteJson(`/api/settings/circadian/groups?groupId=${groupId}`)

            if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

            dispatch(removeCircadianSettingsGroupSuccess())
        } catch (error) {
            message.error(`Failed to remove group from circadian settings: ${error.message}`)
            dispatch(removeCircadianSettingsGroupFailure(error))
        }
        dispatch(fetchCircadianSettings())
}
