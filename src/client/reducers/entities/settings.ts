import { LOAD_CIRCADIAN_SETTINGS_SUCCESS} from '@/actions/settings'
import { ActionReducers, createReducer } from '@/utils'
import { ICircadianSettings } from 'shared/types'

export interface ISettingsEntitiesState {
    circadian: ICircadianSettings
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
