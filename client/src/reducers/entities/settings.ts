import { LOAD_CIRCADIAN_SETTINGS_SUCCESS } from '@/actions/settings'
import { ActionReducers, createReducer } from '@/utils'
import { CircadianSettings } from '@tradfri-control-panel/shared'

export interface ISettingsEntitiesState {
    circadian: CircadianSettings
}

const initialState: ISettingsEntitiesState = {
    circadian: {
        latitude: '',
        longitude: '',
        groupIds: []
    }
}

const reducers: ActionReducers<ISettingsEntitiesState> = [
    [LOAD_CIRCADIAN_SETTINGS_SUCCESS, (state, { payload }) => ({
        ...state,
        circadian: payload || state.circadian
    })],
]

export default createReducer(reducers, initialState)
