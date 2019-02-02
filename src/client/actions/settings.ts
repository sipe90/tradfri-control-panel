import { AsyncThunkResult } from '@/types'
import { fetchGetJson, fetchPostJson } from '@/utils'
import { message} from 'antd'
import * as R from 'ramda'
import { ICircadianSettings, IUpdateCircadianSettingsRequest } from 'shared/types'

export const LOAD_CIRCADIAN_SETTINGS_REQUEST = 'LOAD_CIRCADIAN_SETTINGS_REQUEST'
export const LOAD_CIRCADIAN_SETTINGS_SUCCESS = 'LOAD_CIRCADIAN_SETTINGS_SUCCESS'
export const LOAD_CIRCADIAN_SETTINGS_FAILURE = 'LOAD_CIRCADIAN_SETTINGS_FAILURE'

export const SAVE_CIRCADIAN_SETTINGS_REQUEST = 'SAVE_CIRCADIAN_SETTINGS_REQUEST'
export const SAVE_CIRCADIAN_SETTINGS_SUCCESS = 'SAVE_CIRCADIAN_SETTINGS_SUCCESS'
export const SAVE_CIRCADIAN_SETTINGS_FAILURE = 'SAVE_CIRCADIAN_SETTINGS_FAILURE'

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
