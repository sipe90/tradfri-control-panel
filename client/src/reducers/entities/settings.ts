import { LOAD_CIRCADIAN_SETTINGS_SUCCESS } from '#/actions/settings'
import { ActionReducers, createReducer } from '#/utils'
import { CircadianSettings } from 'shared'

export interface SettingsEntitiesState {
    circadian: CircadianSettings
}

const initialState: SettingsEntitiesState = {
    circadian: {
        latitude: '',
        longitude: '',
        groupIds: []
    }
}

const reducers: ActionReducers<SettingsEntitiesState> = [
    [LOAD_CIRCADIAN_SETTINGS_SUCCESS, (state, { payload }) => ({
        ...state,
        circadian: payload || state.circadian
    })],
]

export default createReducer(reducers, initialState)
