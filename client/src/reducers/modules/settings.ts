import {
    LOAD_CIRCADIAN_SETTINGS_FAILURE, LOAD_CIRCADIAN_SETTINGS_REQUEST, LOAD_CIRCADIAN_SETTINGS_SUCCESS
} from '@/actions/settings'
import { ActionReducers, createReducer } from '@/utils'

export interface SettingsModuleState {
    circadianSettingsLoading: boolean
}

const initialState = {
    circadianSettingsLoading: false,
}

const reducers: ActionReducers<SettingsModuleState> = [
    [LOAD_CIRCADIAN_SETTINGS_REQUEST, (state) => ({
        ...state,
        circadianSettingsLoading: true
    })],
    [LOAD_CIRCADIAN_SETTINGS_SUCCESS, (state) => ({
        ...state,
        circadianSettingsLoading: false,
    })],
    [LOAD_CIRCADIAN_SETTINGS_FAILURE, (state) => ({
        ...state,
        circadianSettingsLoading: false,
    })],
]

export default createReducer(reducers, initialState)
